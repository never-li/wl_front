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
            <customer-select v-model="listQuery.custId"></customer-select>
          </el-form-item>
          <el-form-item label="单据编号">
            <el-input v-model="listQuery.blno"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <list-status-radio v-model="listQuery.listStatus" @change="handleRadioChange"></list-status-radio>
          </el-form-item>
          <br>
          <el-form-item label="货物编号">
            <el-input v-model="listQuery.handCode" style="width: 238px"></el-input>
          </el-form-item>
          <el-form-item label="仓库">
            <el-select filterable clearable v-model="listQuery.storeId">
              <el-option v-for="item in storeList" :value="item.id" :label="item.storeName" :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车牌号">
            <el-input v-model="listQuery.vehicleNo"></el-input>
          </el-form-item>
          <el-form-item label="" class="search_label">
            <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>

      <!--按钮组-->
      <el-row class="btn-group-container">
        <el-button type="primary" @click="add" icon="el-icon-plus">新增</el-button>
        <el-button type="primary" :disabled="selectRow==null || selectRow.status > 0" @click="update" icon="el-icon-edit-outline">修改
        </el-button>
        <el-button type="danger" :disabled="selectRow==null" @click="del" icon="el-icon-delete">删除</el-button>
        <el-button type="primary" @click="audit" :disabled="selectRow==null">{{auditMsg}}</el-button>
        <el-button type="primary" @click="printBill" :disabled="selectRow==null || selectRow.status !== 1" icon="el-icon-printer">打印</el-button>
        <el-button type="primary" @click="printAllBill" icon="el-icon-printer">打印全部</el-button>

        <!--&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45; 测试按钮 &#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;-->
        <!--<el-button type="warning" @click="BUS.changeView({path: 'views',action: 'beforeAuth'})">查看-未审核-->
        <!--</el-button>-->
        <!--<el-button type="warning" @click="BUS.changeView({path: 'views',action: 'afterAuth'})">查看-已审核-->
        <!--</el-button>-->
        <!--<el-button type="warning" @click="BUS.changeView({path: 'views', action: 'addRevise'})">新增修改</el-button>-->
        <!--<el-button @click="testAPI">testAPI</el-button>-->
      </el-row>

      <!--表格-->
      <el-table :data="homeList"
                v-loading="listLoading"
                @row-click="rowClick"
                @cell-dblclick="rowDbclick"
                border highlight-current-row
                @current-change="currentChange"
                stripe height="545"
                header-cell-class-name="table-header-bg text-center" row-class-name="pointer text-center tab-ellipsis"
                >
        <el-table-column label="序号" type="index" width="50">
        </el-table-column>
        <el-table-column sortable label="单据编号" prop="blno" min-width="150"></el-table-column>
        <el-table-column sortable label="客户" prop="cuName"  min-width="200"></el-table-column>
        <el-table-column sortable :label="'总重量['+ tableHeader.weight+']'" prop="weightSum" min-width="120"></el-table-column>
        <el-table-column sortable :label="'总数量['+ tableHeader.num+']'" prop="numSum" min-width="120"></el-table-column>
        <el-table-column sortable :label="'总金额['+ tableHeader.amountSum+']'" prop="amountSum" min-width="120"></el-table-column>
        <!--<el-table-column sortable label="仓库" prop="storeName"></el-table-column>-->
        <el-table-column sortable label="车牌号" prop="vehicleNo" min-width="120"></el-table-column>
        <el-table-column sortable label="状态" prop="status" min-width="250">
          <template slot-scope="scope">
            <span v-if="scope.row.status > 0" style="color: #008de7;">{{scope.row.stateLabel}}</span>
            <span v-else>{{scope.row.stateLabel}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable label="作业状态" prop="greenStatusName">
          <template slot-scope="scope">
            <span v-if="scope.row.greenStatus === 0">未发货</span>
            <span v-else-if="scope.row.greenStatus === 1" style="color: #008de7;">部门发货</span>
            <span v-else-if="scope.row.greenStatus === 2" style="color: red;">发货完成</span>
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

      <el-dialog
        title="打印"
        :visible="print.visible"
        width="850px"
        @close="handleClose">
        <iframe name="printFrame" width="100%" height="400px"></iframe>
      </el-dialog>

    </div>

    <div v-if="pageState==='views'">
      <views :detailData="detailData" :action="action" @hideViews="hideViews" @changeAction="changeAction"></views>
    </div>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import dateRange from '@/components/dateRange'
  import customerSelect from '@/components/customerSelect'
  import listStatusRadio from '@/components/listStatusRadio'
  import * as api from '@/api/process/pickUpGoodsHd/index'
  import views from './views'
  import * as common from '@/utils'

  export default {
    name: 'pickUpGoodsHd',
    components: {
      dateRange, customerSelect, listStatusRadio, views
    },
    activated() {
      if (JSON.stringify(this.$route.query) !== '{}') {
        if (this.$route.query.id) {
          this.getList(this.$route.query.id)
        }
        if (this.$route.query.stockList) {
          this.add()
          this.detailData = {
            'custId': this.$route.query.stockList[0].custId,
            'stockList': this.$route.query.stockList
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
        temp.weight = this.homeList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weightSum)
        }, 0).toFixed(3)
        temp.num = this.homeList.reduce((pre, cur) => {
          return pre + parseFloat(cur.numSum)
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
          listStatus: 1
          // dateArr: []
        },
        homeList: [],
        selectRow: null,
        btnDisabled: true,
        detailData: {},
        print: {
          visible: false,
          billId: '',
          billType: -1
        }
      }
    },
    methods: {
      handleRadioChange(val) {
        this.search()
      },
      getList(id) {
        if (id) {
          this.listQuery.id = id
        }
        if (this.listQuery.dateArr.length > 0) {
          this.listQuery.fromDate = this.listQuery.dateArr[0]
          this.listQuery.toDate = this.listQuery.dateArr[1]
        }
        this.listLoading = true
        api.list(this.listQuery).then((response) => {
          this.homeList = response.list
          this.total = response.datasize
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
      changeAction(val) {
        this.pageState = ''
        this.action = val
        this.pageState = 'views'
      },
      hideViews(refresh) {
        this.action = ''
        this.pageState = 'home'
        if (refresh) {
          this.getList()
        }
      },
      add() {
        this.detailData = {}
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
      printBill: function() {
        if (!this.selectRow && this.selectRow.status !== 1) return
        const param = {
          id: this.selectRow.id
        }
        api.print(param).then(response => {
          this.print.visible = true
          this.print.url = response.billPrintList[0].url
          this.print.billId = response.billPrintList[0].billId
          this.print.billType = response.billPrintList[0].billType
        }
        ).then(() => {
          setTimeout(this.toPrint, 100)
        }
        )
      },
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
        api.batchprint({ ids: ids }).then(respone => {
          const billPrintList = respone.billPrintList
          const printUrl = billPrintList[0].url.split('?')[0]
          const p = []
          // 获取当前页面选中的参数值，并将值放入数组中
          billPrintList.forEach(function(bill) {
            const data = {
              reportlet: bill.url.split('?')[1].replace('reportlet=', ''),
              billid: bill.billId
            }
            p.push(data)
          })
          // 将参数值组成的数组转化为字符串
          const rp = JSON.stringify(p)
          this.print.visible = true
          setTimeout(function() {
            common.doBatchPrint('printFrame', printUrl, rp)
          }, 100)
        }).catch(error => {
          if (error) console.error(error)
        })
      },
      toPrint() {
        common.doPrint('printFrame', this.print.url, this.print.billId)
      },
      handleClose() {
        this.print.visible = false
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
