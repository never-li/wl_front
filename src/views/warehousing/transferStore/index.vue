<template>
  <div class="app-container">
    <div v-show="pageState === 'home'">
      <!--form-->
      <el-row class="form-wrap">
        <el-form :inline="true" size="small" label-width="80px">
          <el-form-item label="单据日期">
            <date-range :is-edit="true" v-model="listQuery.dateArr"></date-range>
          </el-form-item>
          <el-form-item label="客户">
            <!-- <customer-select v-model="listQuery.custId"></customer-select> -->
            <customer-select v-model="selectList" :customer= 'listQuery'  class="input-w-168" @keyup.enter.native="search"></customer-select>
          </el-form-item>
          <el-form-item label="单据编号">
            <el-input v-model="listQuery.blno" class="input-w-168"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <list-status-radio v-model="listQuery.listStatus" @change="handleRadioChange"></list-status-radio>
          </el-form-item>
          <br>
          <el-form-item label="货物编号">
            <el-input v-model="listQuery.handCode" class="input-w-238"></el-input>
          </el-form-item>
          <el-form-item label="转出仓库">
            <store-select v-model="listQuery.fromStoreId"></store-select>
          </el-form-item>
          <el-form-item label="转入仓库">
            <store-select v-model="listQuery.toStoreId"></store-select>
          </el-form-item>
          <el-form-item label="" class="search_label">
            <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          </el-form-item>

        </el-form>
      </el-row>

      <!--btn-group-->
      <el-row class="btn-group-container">
        <el-button type="primary" icon="el-icon-plus" @click="showAdd">新增</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="showUpdate" :disabled="selectRow==null || selectRow.status!==0">修改</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="del" :disabled="selectRow==null || selectRow.status!==0">删除</el-button>
        <el-button type="primary" icon="el-icon-view" v-if="this.selectRow && this.selectRow.status ===1" @click="unaudit()">反审核</el-button>
        <el-button type="primary" icon="el-icon-view" v-else @click="audit" :disabled="selectRow==null">审核</el-button>
        <el-button type="primary" icon="el-icon-printer" @click="printBill()" :disabled="selectRow==null || selectRow.status !== 1">打印</el-button>
        <el-button type="primary" icon="el-icon-printer" @click="printAllBill">打印全部</el-button>
      </el-row>

      <!--table-->
      <el-table :data="homeList"
                v-loading="listLoading"
                @row-click="rowClick"
                @cell-dblclick="rowDbclick"
                border stripe highlight-current-row
                height="545"
                header-cell-class-name="table-header-bg text-center" row-class-name="pointer text-center"
                >
        <el-table-column label="序号" type="index" width="50">
        </el-table-column>
        <el-table-column sortable label="单据编号" prop="blno"  min-width="150"></el-table-column>
        <el-table-column sortable label="客户" prop="cuName" min-width="200"></el-table-column>
        <el-table-column sortable :label="'总重量['+ tableHeader.weight+']'" prop="weightSum" min-width="120"></el-table-column>
        <el-table-column sortable :label="'总数量['+ tableHeader.num+']'" prop="numSum" min-width="120"></el-table-column>
        <el-table-column sortable label="转出仓库" prop="fromStoreName" min-width="120"></el-table-column>
        <el-table-column sortable label="转入仓库" prop="toStoreName" min-width="120"></el-table-column>
        <el-table-column sortable label="状态" min-width="250">
          <template slot-scope="scope">
            <span v-if="scope.row.status > 0" style="color: #008de7;">{{scope.row.stateLabel}}</span>
            <span v-else>{{scope.row.stateLabel}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable label="作业状态">
          <template slot-scope="scope">
            <span>{{scope.row.mbStatusName}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable label="单据日期" prop="bldate" min-width="140"></el-table-column>
        <el-table-column sortable label="制单人" prop="creatorName" min-width="120"></el-table-column>
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
    </div>

    <views v-if="pageState === 'views'" :action="action" :selectRow="selectRow" @hideView="hideView"></views>

    <el-dialog
      title="打印"
      :visible="print.visible"
      width="850px"
      @close="handleClose">
      <iframe name="printFrame" width="100%" height="400px"></iframe>
    </el-dialog>
  </div>
</template>

<script>
  import views from './views'
  import dateRange from '@/components/dateRange'
  import customerSelect from '@/components/ListCustomerSelect'
  import listStatusRadio from '@/components/listStatusRadio'
  import storeSelect from '@/components/storeSelect'
  import * as api from '@/api/warehousing/transferStore/transferStore'
  import * as common from '@/utils'

  export default {
    name: 'transferStore',
    components: {
      dateRange,
      customerSelect,
      listStatusRadio,
      storeSelect,
      views
    },
    activated() {
      if (JSON.stringify(this.$route.query) !== '{}') {
        if (this.$route.query.id) {
          this.getList(this.$route.query.id)
        }
        if (this.$route.query.stockList) {
          this.showAdd()
          this.selectRow = {
            'custId': this.$route.query.stockList[0].custId,
            'stockList': this.$route.query.stockList
          }
        }
      }
    },
    computed: {
      tableHeader() {
        const temp = {}
        temp.weight = this.homeList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weightSum)
        }, 0).toFixed(3)
        temp.num = this.homeList.reduce((pre, cur) => {
          return pre + parseFloat(cur.numSum)
        }, 0)
        return temp
      }
    },
    data() {
      return {
        selectList: [],
        pageState: 'home', // 页面显示状态
        action: '',
        selectRow: null, // 选择行
        total: 0,
        listLoading: false,
        listQuery: {
          pageNo: 1,
          pageSize: 20,
          dateArr: [common.leastWeekDate()[0], common.leastWeekDate()[1]]
        },
        homeList: [],
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
        this.selectRow = null
        if (this.listQuery.dateArr.length > 0) {
          this.listQuery.fromDate = this.listQuery.dateArr[0]
          this.listQuery.toDate = this.listQuery.dateArr[1]
        }
        this.listLoading = true
        api.list(this.listQuery).then((response) => {
          this.homeList = response.changeSts
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
      // 删除
      del() {
        if (!this.selectRow) {
          this.$message('请选择要删除的数据')
          return
        }
        api.del(this.selectRow.id).then(() => {
          this.getList()
        }).catch(error => {
          if (error) console.error(error)
        })
      },
      // 审核
      audit(checkPrint, blid) {
        const id = blid || (this.selectRow ? this.selectRow.id : null)
        if (!id) {
          this.$message('请选择要审核的数据')
          return
        }
        api.audit(id).then(() => {
          // 打印
          if (checkPrint === true) {
            this.printBill(id)
          }
          this.getList()
          this.pageState = 'home'
        }).catch(error => {
          if (error) console.error(error)
        })
      },
      // 反审核
      unaudit(blid) {
        const id = blid || (this.selectRow ? this.selectRow.id : null)
        if (!id) {
          this.$message('请选择要反审核的数据')
          return
        }
        api.unaudit(id).then(() => {
          this.getList()
          this.pageState = 'home'
        }).catch(error => {
          if (error) console.error(error)
        })
      },
      // ===表格
      rowClick(row, event, column) {
        this.selectRow = row
      },
      rowDbclick() {
        this.pageState = 'views'
        this.action = 'view'
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.pageNo = val
        this.getList()
      },
      printBill: function(blid) {
        const id = blid || (this.selectRow ? this.selectRow.id : null)
        if (!id) {
          return
        }
        const param = {
          id: id
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
      },
      showAdd() {
        this.pageState = 'views'
        this.action = 'add'
      },
      showUpdate() {
        this.pageState = 'views'
        this.action = 'update'
      },
      hideView() {
        this.pageState = 'home'
        this.action = ''
      }
    },
    created() {
      this.search()
      const _this = this
      document.onkeydown = function(e) { // shift事件
        const _key = window.event.keyCode
        if (_key === 13) {
          _this.search()
        }
      }
    }
  }
</script>

<style scoped>

</style>
