<template>
  <div class="app-container">
    <div v-show="pageState==='home'">
      <!--<el-button @click="$router.push({path:'/warehousing/pickUpGoods',query:{id:'1212'}})">test</el-button>-->
      <!--表单内容-->
      <el-row class="form-wrap">
        <el-form :inline="true" size="small" label-width="80px">
          <el-form-item label="单据日期">
            <date-range :is-edit="true" v-model="listQuery.dateArr"></date-range>
          </el-form-item>
          <el-form-item label="客户">
            <customer-select v-model="listQuery.custId" class="input-w-168"></customer-select>
          </el-form-item>
          <el-form-item label="单据编号">
            <el-input v-model="listQuery.blno" class="input-w-168"></el-input>
          </el-form-item>
          <el-form-item label="货物编号">
            <el-input v-model="listQuery.handCode" class="input-w-168"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <list-status-radio v-model="listQuery.listStatus" @change="handleRadioChange"></list-status-radio>
          </el-form-item>
          <br>
          <el-form-item label="加工状态">
            <el-select filterable clearable v-model="listQuery.machStatus" placeholder="请选择" class="w-238">
              <el-option value="0" clearable label="未加工"></el-option>
              <el-option value="2" clearable label="加工中"></el-option>
              <el-option value="3" clearable label="加工完成"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排单状态">
            <el-select filterable clearable v-model="listQuery.orderStatus" placeholder="请选择">
              <el-option value="0" clearable label="未排单"></el-option>
              <el-option value="1" clearable label="部分排单"></el-option>
              <el-option value="2" clearable label="已排单"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="机台类型">
            <mach-type-select v-model="listQuery.machTypeId"></mach-type-select>
          </el-form-item>
          <el-form-item label="品名">
            <type-select v-model="listQuery.typeId"></type-select>
          </el-form-item>
          <el-form-item label="" class="search_label">
            <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>

      <!--按钮组-->
      <el-row class="btn-group-container">
        <el-button type="primary" @click="add(1)" icon= "el-icon-plus">新增原料</el-button>
        <el-button type="primary" @click="add(2)" icon= "el-icon-plus">新增成品</el-button>
        <el-button type="primary" :disabled="selectRow==null || selectRow.status > 0" @click="update" icon="el-icon-edit-outline">修改</el-button>
        <el-button type="danger" :disabled="selectRow==null || selectRow.status != 0" @click="del" icon= "el-icon-delete">删除</el-button>
        <el-button type="primary" @click="audit" :disabled="selectRow==null || selectRow.status === 2">{{auditMsg}}</el-button>
        <el-button type="primary" @click="close" :disabled="selectRow==null || selectRow.status === 0" icon= "el-icon-check">{{closeMsg}}</el-button>
        <el-button type="primary" @click="printBill" :disabled="selectRow==null || selectRow.status < 1" icon= "el-icon-printer">打印</el-button>
        <!-- <el-button type="primary" @click="printAllBill" icon= "el-icon-printer">打印全部</el-button> -->
      </el-row>

      <!--表格-->
      <el-table :data="homeList"
                v-loading="listLoading"
                @row-click="rowClick"
                @cell-dblclick="rowDbclick"
                border highlight-current-row stripe
                @current-change="currentChange"
                height="545"
                header-cell-class-name="table-header-bg text-center" row-class-name="pointer text-center tab-ellipsis"
                >
        <el-table-column label="序号" type="index" width="50">
        </el-table-column>
        <el-table-column sortable label="单据编号" prop="blno" min-width="150"></el-table-column>
        <el-table-column sortable label="客户" prop="cuName" min-width="200"></el-table-column>
        <el-table-column sortable label="加工类型" min-width="200">
          <template slot-scope="scope">
            <span>{{scope.row.slitMachName}} {{scope.row.cutMachName}} {{scope.row.multiMachName}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable :label="'总重量['+ tableHeader.totalMachWeight+']'" prop="totalMachWeight" min-width="140"></el-table-column>
        <el-table-column sortable :label="'总数量['+ tableHeader.totalNum+']'" prop="totalNum" min-width="120"></el-table-column>
        <el-table-column sortable label="用料类型" prop="resType" min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.resType === 1">原料加工</span>
            <span v-if="scope.row.resType === 2">成品加工</span>
          </template>
        </el-table-column>
        <el-table-column sortable label="结算" min-width="70">
          <template slot-scope="scope">
            <span>{{scope.row.totalClearingNum + "/" + scope.row.totalResNum}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable label="状态" prop="status" min-width="250">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1" style="color: #008de7;">{{scope.row.stateLabel}}</span>
            <span v-else-if="scope.row.status === 2" style="color: red">{{scope.row.stateLabel}}</span>
            <span v-else>{{scope.row.stateLabel}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable label="排单状态" prop="greenStatusName" min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.inOrder === 0">未排单</span>
            <span v-else-if="scope.row.inOrder > 0 && scope.row.inOrder<scope.row.totalInOrder" style="color: #008de7;">部分排单</span>
            <span v-else-if="scope.row.inOrder > 0 && scope.row.inOrder===scope.row.totalInOrder" style="color: red;">已排单</span>
          </template>
        </el-table-column>
        <el-table-column sortable label="作业状态" prop="greenStatusName" min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.mbStatus === 0 || scope.row.mbStatus === 1">未加工</span>
            <!-- <span v-else-if="scope.row.mbStatus === 1" style="color: #008de7;">排单中</span> -->
            <span v-else-if="scope.row.mbStatus === 2" style="color: #008de7;">加工中</span>
            <span v-else-if="scope.row.mbStatus === 3" style="color: red;">加工完成</span>
          </template>
        </el-table-column>
        <el-table-column sortable label="单据日期" prop="bldate" min-width="140"></el-table-column>
        <el-table-column sortable label="制单人" prop="userName" min-width="120"></el-table-column>
      </el-table>

      <!--分页-->
      <div class="mt-10" style="width:95%;text-align:right">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                      :current-page="listQuery.pageNo"
                      :page-sizes="[20,100,500,1000]" :page-size="listQuery.pageSize"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="total">
        </el-pagination>
      </div>

      <mach-order-print v-if="print.visible && selectRow" :formData="selectRow" @handleClose="handleClose"></mach-order-print>
      <!-- <el-dialog
        title="打印"
        :visible="print.visible"
        width="50%"
        @close="handleClose" v-if="selectRow">
        <div style="padding-bottom: 10px;">
          <el-button type="primary" size="mini" @click="printMachBill(1)" :disabled="selectRow.isMulti">分条加工单</el-button>
          <el-button type="primary" size="mini" @click="printMachBill(2)" :disabled="selectRow.isMulti">分转平加工单</el-button>
          <el-button type="primary" size="mini" @click="printMachBill(3)" :disabled="selectRow.isMulti">平直加工单</el-button>
          <el-button type="primary" size="mini" @click="printMachBill(4)" :disabled="!selectRow.isMulti">一体机加工单</el-button>
        </div>
        <iframe name="printFrame" width="100%" height="400px" v-if="print.printType===1"></iframe>
        <iframe name="printFrame" width="100%" height="400px" v-if="print.printType===2"></iframe>
        <iframe name="printFrame" width="100%" height="400px" v-if="print.printType===3"></iframe>
        <iframe name="printFrame" width="100%" height="400px" v-if="print.printType===4"></iframe>
      </el-dialog> -->

    </div>

    <div v-if="pageState=='views'">
      <views :detailData="detailData" :action="action" @hideViews="hideViews" @changeAction="changeAction" ref="views"></views>
    </div>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { findPathByModuleCode } from '@/utils'
  import dateRange from '@/components/dateRange'
  import customerSelect from '@/components/customerSelect'
  import listStatusRadio from '@/components/listStatusRadio'
  import * as api from '@/api/process/mach/index'
  import views from './views'
  import * as common from '@/utils'
  import machOrderPrint from './machOrderPrint'
  import machTypeSelect from '@/components/machTypeSelect'
  import typeSelect from '@/components/typeSelect'

  export default {
    name: 'machOrder',
    components: {
      dateRange, customerSelect, listStatusRadio, views, machOrderPrint, machTypeSelect, typeSelect
    },
    activated() {
      if (JSON.stringify(this.$route.query) !== '{}') {
        if (this.$route.query.id) {
          this.getList(this.$route.query.id)
        }
        if (this.$route.query.originPath) {
          this.detailData = this.$route.query.formData
          this.pageState = this.$route.query.pageState
          this.action = this.$route.query.action
          this.originPath = this.$route.query.originPath
          if (this.$refs['views']) {
            this.$refs['views'].loadData(this.detailData)
          }
        }
        if (this.$route.query.faxId) {
          this.$route.type === 'ma' ? this.add(1) : this.add(2)
          this.detailData = {
            'faxId': this.$route.query.faxId,
            'custId': this.$route.query.custId,
            'faxType': this.$route.query.faxType
          }
        }
        if (this.$route.query.stockList) {
          this.add(1)
          this.detailData = {
            'action': 'add',
            'resType': 1,
            'custId': '',
            'stockList': this.$route.query.stockList
          }
          if (this.$route.query.stockList && this.$route.query.stockList.length > 0 && this.$route.query.stockList[0].custId) {
            this.detailData.custId = this.$route.query.stockList[0].custId
          }
          if (this.$refs['views']) {
            this.$refs['views'].loadData(this.detailData)
          }
        }
      }
    },
    created() {
      this.getList()
      const _this = this
      document.onkeydown = function(e) { // shift事件
        const _key = window.event.keyCode
        if (_key === 13) {
          _this.search()
        }
      }
    },
    computed: {
      ...mapGetters(['storeList']),
      tableHeader() {
        const temp = {}
        temp.totalMachWeight = this.homeList.reduce((pre, cur) => {
          return pre + parseFloat(cur.totalMachWeight)
        }, 0).toFixed(3)
        temp.totalNum = this.homeList.reduce((pre, cur) => {
          return pre + parseFloat(cur.totalNum)
        }, 0)
        temp.amountSum = this.homeList.reduce((pre, cur) => {
          return pre + parseFloat(cur.amountSum)
        }, 0).toFixed(3)
        return temp
      },
      auditMsg: function() {
        if (this.selectRow && this.selectRow.status === 1) {
          return '反审核'
        } else {
          return '审核'
        }
      },
      closeMsg: function() {
        if (this.selectRow && this.selectRow.status === 1) {
          return '确认'
        } else {
          return '反确认'
        }
      }
    },
    data: function() {
      return {
        pageState: 'home',
        action: '',
        total: 0,
        listLoading: false,
        listQuery: {
          pageNo: 1,
          pageSize: 20,
          dateArr: [common.leastWeekDate()[0], common.leastWeekDate()[1]],
          listStatus: 3,
          machStatus: '',
          orderStatus: '',
          machTypeId: '',
          typeId: ''
          // dateArr: []
        },
        homeList: [],
        selectRow: null,
        btnDisabled: true,
        detailData: {},
        print: {
          visible: false
          // billId: '',
          // billType: -1,
          // printType: ''
        },
        originPath: ''
      }
    },
    methods: {
      handleRadioChange(val) {
        this.search()
      },
      getList(id) {
        if (id) {
          // 根据id查加工单，删除日期限制
          this.listQuery.id = id
          this.listQuery.dateArr = []
          this.listQuery.fromDate = null
          this.listQuery.toDate = null
        }
        if (this.listQuery.dateArr.length > 0) {
          this.listQuery.fromDate = this.listQuery.dateArr[0]
          this.listQuery.toDate = this.listQuery.dateArr[1]
        }
        this.listLoading = true
        api.list(this.listQuery).then((response) => {
          this.homeList = response.list
          for (const v of this.homeList) {
            v.repack = v.repack + ''
            // v.resList = []
            // v.cutList = []
            // v.resDelList = []
            // v.usedBattenDtList = []
            // v.usedBattenDtDelList = []
            // v.subJoinFeeList = []
            // v.subJoinFeeDelList = []
            if (v.multiMachTypeId) {
              v.machTypeId = v.multiMachTypeId
            } else if (v.slitMachTypeId) {
              v.machTypeId = v.slitMachTypeId
            }
          }
          this.total = response.dataSize
          this.listLoading = false
          this.listQuery.id = ''
        }).catch(error => {
          if (error) console.error(error)
          this.listLoading = false
        })
      },
      search() {
        this.listQuery.pageNo = 1
        this.getList()
      },
      // ===按钮组
      currentChange(row) {
        this.selectRow = row
      },
      // (反)审核
      audit() {
        if (!this.selectRow) {
          this.$message('请选择要审核的数据')
          return
        }
        if (this.selectRow.status === 0) { // 未审核
          api.audit({ id: this.selectRow.id }).then(() => {
            this.getList()
          }).catch(error => {
            if (error) console.error(error)
          })
        } else if (this.selectRow.status === 1) {
          api.unaudit({ id: this.selectRow.id }).then(() => {
            this.getList()
          }).catch(error => {
            if (error) console.error(error)
          })
        }
      },
      del() { // 提货删除
        if (!this.selectRow) {
          this.$message('请选择要删除的数据')
          return
        }
        this.$confirm('确定删除该行数据', '温馨提示', { type: 'warning' }).then(() => {
          api.del({ id: this.selectRow.id }).then(() => {
            // this.homeList.map((item, index, array) => {
            //   if (item.id === this.selectRow.id) {
            //     array.splice(index, 1)
            //   }
            // })
            this.getList()
          }).catch(error => {
            if (error) console.error(error)
          })
        })
      },
      close() { // 确认（反确认）
        if (!this.selectRow) {
          this.$message('请选择要审核的数据')
          return
        }
        if (this.selectRow.status === 1) { // 未审核
          api.close({ id: this.selectRow.id }).then(() => {
            this.getList()
          }).catch(error => {
            if (error) console.error(error)
          })
        } else if (this.selectRow.status === 2) {
          api.unclose({ id: this.selectRow.id }).then(() => {
            this.getList()
          }).catch(error => {
            if (error) console.error(error)
          })
        }
      },
      changeAction(val) {
        this.pageState = ''
        this.action = val
        this.pageState = 'views'
      },
      hideViews(refresh) {
        this.action = ''
        this.pageState = 'home'
        // 传真关联保存完毕后需要清空URL参数，防止重复关联插入
        if (this.$route.query.faxId) {
          this.$router.push({ path: findPathByModuleCode('machOrder') })
        }
        if (this.originPath) {
          this.$router.push({ path: this.originPath, query: { path: 'check' }})
          this.originPath = ''
        }
        if (refresh) {
          this.getList()
        }
      },
      add(resType) {
        this.detailData = { 'resType': resType }
        this.action = 'add'
        this.pageState = 'views'
      },
      update() {
        this.detailData = this.selectRow
        this.action = 'update'
        this.pageState = 'views'
      },
      detail() {
        this.detailData = this.selectRow
        this.action = 'view'
        this.pageState = 'views'
      },
      // ===表格
      rowClick(row, event, column) {
        this.selectRow = row
        this.btnDisabled = false
      },
      rowDbclick(row) {
        this.detail()
      },
      // ===分页
      handleCurrentChange(val) {
        this.listQuery.pageNo = val
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val
        this.getList()
      },
      printBill: function(item) {
        if (item && item.id && this.selectRow) {
          this.selectRow.id = item.id
          this.selectRow.status = item.status
        }
        if (!this.selectRow || this.selectRow.status < 1) return
        this.print.visible = true
      },
      // printMachBill(type) {
      //   const param = {
      //     id: this.selectRow.id,
      //     printType: type
      //   }
      //   this.print.printType = type
      //   api.print(param).then(response => {
      //     this.print.visible = true
      //     this.print.url = response.billPrintList[0].url
      //     this.print.billId = response.billPrintList[0].billId
      //     this.print.billType = response.billPrintList[0].billType
      //   }
      //   ).then(() => {
      //     setTimeout(this.toPrint, 100)
      //   })
      // },
      printAllBill: function() {
        if (!this.homeList || this.homeList.size === 0) return
        const ids = []
        for (const idx in this.homeList) {
          if (this.homeList[idx].status < 1) {
            this.$message.error('单据：' + this.homeList[idx].blno + ' 未审核')
            return
          }
          this.homeList[idx].printNum += 1
          ids.push(this.homeList[idx].id)
        }
        // api.batchprint({ ids: ids }).then(respone => {
        //   if (respone.returnCode === 0) {
        //     const billPrintList = respone.billPrintList
        //     const printUrl = billPrintList[0].url.split('?')[0]
        //     const p = []
        //     // 获取当前页面选中的参数值，并将值放入数组中
        //     billPrintList.forEach(function(bill) {
        //       const data = {
        //         reportlet: bill.url.split('?')[1].replace('reportlet=', ''),
        //         billid: bill.billId
        //       }
        //       p.push(data)
        //     })
        //     // 将参数值组成的数组转化为字符串
        //     const rp = JSON.stringify(p)
        //     this.print.visible = true
        //     setTimeout(function() {
        //       common.doBatchPrint('printFrame', printUrl, rp)
        //     }, 100)
        //   }
        // }).catch(error => {
        //   if (error) console.error(error)
        // })
      },
      // toPrint() {
      //   common.doPrint('printFrame', this.print.url, this.print.billId)
      // },
      handleClose() {
        this.print.visible = false
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
