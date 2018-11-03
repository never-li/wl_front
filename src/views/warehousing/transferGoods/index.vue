<template>
  <div class="transferGoods app-container">
<!--    pageState : {{pageState}}<br>
    action : {{action}}<br>
    selectRow.id {{selectRow.id}}-->
    <div v-show="pageState==='home'">
      <!--表单内容-->
      <el-row class="form-wrap">
        <el-form :inline="true" size="small" label-width="80px">
          <el-form-item label="单据日期">
            <date-range :is-edit="true" v-model="dateArr"></date-range>
          </el-form-item>
          <el-form-item label="原客户">
            <customer-select v-model="formParam.fromCustId" class="input-w-168"></customer-select>
          </el-form-item>
          <el-form-item label="新客户">
            <customer-select v-model="formParam.toCustId"  class="input-w-168"></customer-select>
          </el-form-item>
          <el-form-item label="状态">
            <list-status-radio v-model="formParam.listStatus" @change="handleRadioChange"></list-status-radio>
          </el-form-item>
          <br>
          <el-form-item label="单据编号">
            <el-input v-model="formParam.blno" class="input-w-238"></el-input>
          </el-form-item>
          <el-form-item label="货物编号">
            <el-input v-model="formParam.handCode"  class="input-w-168"></el-input>
          </el-form-item>
          <el-form-item label="" class="search_label">
            <el-button type="primary" icon="el-icon-search"  @click="search">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>

      <el-row class="btn-group-container">
        <!-- <el-button type="primary" v-on:click="displayAdd('add','normal')">新增</el-button>
        <el-button type="primary" v-on:click="displayEdit('edit','normal')">修改</el-button>
        <el-button type="primary">删除</el-button>
        <el-button type="primary">审核</el-button>
        <el-button type="primary">反审核</el-button>
        <el-button type="primary">打印</el-button>
        <el-button type="primary">全部打印</el-button> -->

        <el-button type="primary"  icon="el-icon-plus" @click="add">新增</el-button>
        <el-button type="primary"  icon="el-icon-edit" :disabled='buttonControl == -9 ||buttonControl == 1'
                   @click="update">修改
        </el-button>
        <el-button type="danger" icon="el-icon-delete" :disabled='buttonControl ==-9 ||buttonControl == 1' v-on:click="del">删除</el-button>
        <el-button type="primary" icon="el-icon-view" v-if='buttonControl !== 1' :disabled='buttonControl ==-9||buttonControl == 1'
                   v-on:click='audit'>审核
        </el-button>
        <el-button type="primary" icon="el-icon-view" v-if='buttonControl == 1' v-on:click='unaudit()'>反审核</el-button>
        <el-button type="primary" icon="el-icon-printer" :disabled='buttonControl <= 0' @click="printBill()">打印</el-button>
        <el-button type="primary" icon="el-icon-printer" @click='printAllBill()'>全部打印</el-button>

        <el-button :disabled='buttonControl <= 0' type="primary" @click="toNext('transferGoods')" v-if="btnToNext">过户</el-button>
        <el-button :disabled='buttonControl <= 0' type="primary" @click="toNext('pickUpGoods')" v-if="btnToNext">提货</el-button>
        <el-button :disabled='buttonControl <= 0' type="primary" @click="toNext('machOrder')" v-if="btnToNext">加工</el-button>
      </el-row>

      <el-table :data="homeList"
                border highlight-current-row
                stripe
                height="545"
                @row-click="rowClick"
                @cell-dblclick="rowDbclick"
                v-loading="listLoading"
                header-cell-class-name="table-header-bg text-center"
                row-class-name="pointer text-center tab-ellipsis" style="width:100%;">
        <el-table-column sortable type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column sortable property="blno" label="单据编号" width="120">
        </el-table-column>
        <el-table-column sortable property="fromCuName" label="原客户" min-width="200">
        </el-table-column>
        <el-table-column sortable property="toCuName" label="新客户" min-width="200">
        </el-table-column>
        <el-table-column sortable property="weightSum" :label="'总重量['+ tableHeader.weightSum+']'" min-width="120">
        </el-table-column>
        <el-table-column sortable property="numSum" :label="'总数量['+ tableHeader.numSum+']'" min-width="120">
        </el-table-column>
        <el-table-column sortable property="amountSum" :label="'总金额['+ tableHeader.amountSum+']'" min-width="120">
        </el-table-column>
        <el-table-column sortable label="状态" min-width="250">
          <template slot-scope="scope">
            <span v-if="scope.row.status > 0" style="color: #008de7;">{{scope.row.stateLabel}}</span>
            <span v-else>{{scope.row.stateLabel}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable property="bldate" label="单据日期" min-width="140">
        </el-table-column>
        <el-table-column sortable property="creatorName" label="制单人" min-width="120">
        </el-table-column>
      </el-table>

      <div class="block">
        <div style="width:95%;text-align:right">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="formParam.pageNo" :page-sizes="[20,100,500,1000]" :page-size="formParam.pageSize"
                         layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>

    <div v-if="pageState === 'views'">
      <views ref='transferGoodsViews'
             :detailData='selectRow'
             @hideViews="hideViews"
             :action="action"
             @changeAction="changeAction"
      ></views>
    </div>

    <el-dialog
      title="打印"
      :visible="print.visible"
      width="850px"
      @close="handleClose">
      <iframe name="printFrame" width="100%" height="400px"></iframe>
    </el-dialog>

    <el-dialog :visible.sync="print.listVisible" width="850px">
      <el-table
        :data="print.billPrintList"
        ref="printListTable"
        row-key="id"
        @selection-change="printListTableSelectionChange"
        :header-cell-class-name="setHeaderClass"
        border highlight-current-row
        @row-click="printListTableRowClick"
        row-class-name="pointer text-center"
        max-height="500"
      >
        <el-table-column sortable type="selection" width="50"></el-table-column>
        <el-table-column sortable label="单据编号" prop="blno"></el-table-column>
        <el-table-column sortable label="客户" prop="custName"></el-table-column>
        <el-table-column sortable label="付款单位" prop="payTypeName"></el-table-column>
        <el-table-column sortable label="重量" prop="weight"></el-table-column>
        <el-table-column sortable label="金额" prop="amount"></el-table-column>
        <el-table-column sortable label="业务类型" prop="billTypeName"></el-table-column>
        <el-table-column sortable label="结算方式" prop="payMode"></el-table-column>
        <el-table-column sortable label="收款状态">
          <template slot-scope="scope">
            <span v-if="scope.row.isFee==0">未收费</span>
            <span v-else-if="scope.row.isFee==1">部分收费</span>
            <span v-else>已收费</span>
          </template>
        </el-table-column>
        <el-table-column sortable label="打印次数" prop="printNum"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="print.listVisible = false">取 消</el-button>
        <el-button type="primary" @click="batchPrint">打 印</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import customerSelect from '@/components/customerSelect'
  import views from './views'
  import * as api from '@/api/warehousing/transferGoods/transferGoods'

  import * as common from '@/utils'
  import dateRange from '@/components/dateRange'
  import listStatusRadio from '@/components/listStatusRadio'
  import { findPathByModuleCode } from '@/utils'
  import { printIncNum } from '@/api/commonbill'

export default {
    name: 'transferGoods',
    components: {
      customerSelect,
      views,
      dateRange,
      listStatusRadio
    },
    activated() {
      console.log('activated')
      if (JSON.stringify(this.$route.query) !== '{}') {
        if (this.$route.query.id) {
          this.getList(this.$route.query.id)
        }
        if (this.$route.query.stockList) {
          this.action = ''
          this.add()
          this.selectRow = {
            'custId': this.$route.query.stockList[0].custId,
            'stockList': this.$route.query.stockList
          }
          this.$refs.transferGoodsViews.loadData(this.selectRow)
        }
        if (this.$route.query.faxId) {
          this.add()
          this.selectRow = {
            'faxId': this.$route.query.faxId,
            'custId': this.$route.query.custId,
            'faxType': this.$route.query.faxType
          }
        }
      }
    },
    data() {
      return {
        print: {
          visible: false,
          listVisible: false,
          billId: '',
          billType: -1,
          billPrintList: [],
          printSelectList: []
        },
        pageState: 'home', // 控制显示 视图
        action: '',
        total: 0,
        dateArr: [common.leastWeekDate()[0], common.leastWeekDate()[1]],
        formParam: {
          // fromDate: '2018-06-14',
          // toDate: '2018-06-14',
          fromcufullname: '', // 原客户
          tocufullname: '', // 新客户
          listStatus: '0', // 状态
          handCode: '', // 货物编号
          blno: '', // 单据编号
          pageNo: 1,
          pageSize: 10
        },
        buttonControl: -9,
        homeList: [],
        selectRow: {}, // 当前选择table 的row
        listLoading: false,
        btnToNext: false // 下一步操作
      }
    },
    methods: {
      handleRadioChange(val) {
        this.search()
      },
      search() {
        this.formParam.pageNo = 1
        this.formParam.fromDate = this.dateArr[0]
        this.formParam.toDate = this.dateArr[1]
        this.getList()
      },
      getList(id) {
        this.listLoading = true
        if (id) {
          this.formParam.id = id
        }
        api
          .list(this.formParam)
          .then(response => {
            this.homeList = response.changes
            this.total = response.dataSize

            this.buttonControl = -9 // 按钮控制
            this.listLoading = false
          })
          .catch(error => {
            if (error) console.error(error)
            this.listLoading = false
          })
      },
      handleSizeChange(val) {
        this.formParam.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.formParam.pageNo = val
        this.getList()
      },
      add() {
        this.selectRow = {}
        this.action = 'add'
        this.pageState = 'views'
      },
      update() {
        this.action = 'update'
        this.pageState = 'views'
      },
      // ===table
      detail() {
        this.action = 'view'
        this.pageState = 'views'
      },
      rowClick(row, event, column) {
        this.selectRow = row
        this.buttonControl = row.status // 控制 按钮显示
        if (row.status > 0) {
          this.btnToNext = true
        }
      },
      rowDbclick(row, event) {
        this.detail()
      },
      changeAction(val) {
        this.pageState = ''
        this.action = val
        this.pageState = 'views'
      },
      del() {
        const param = {
          id: this.selectRow.id
        }
        this.$confirm('确认是否删除选中信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            api.del(param)
              .then(() => {
                this.getList()
              })
              .catch(error => {
                if (error) console.error(error)
              })
          })
          .catch(() => {
          })
      },
      audit(checkPrint, blid) { // 审核
        const id = blid || (this.selectRow ? this.selectRow.id : null)
        if (!id) {
          this.$message('请选择要审核的数据')
          return
        }
        api.audit(id).then(() => {
          if (checkPrint === true) {
            // 打印
            this.printBill(id)
          }
          this.getList()
          this.pageState = 'home'
        }).catch(error => {
          if (error) console.error(error)
        })
      },
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
      hideViews() {
        this.action = ''
        this.pageState = 'home'
        this.selectRow = {}
        this.buttonControl = -9 // 按钮控制
        if (this.$route.query.faxId) {
          this.$router.push({ path: findPathByModuleCode('transferGoods') })
        }
      },
      printBill: function(blid) {
        this.print.billPrintList = []
        const id = blid || (this.selectRow ? this.selectRow.id : null)
        if (!id) {
          return
        }
        const param = {
          id: id
        }
        api.getPrintList(param).then(response => {
          this.print.billPrintList = response.billPrintList
          if (this.print.billPrintList.length === 1) {
            this.print.printSelectList = common.copyObject(response.billPrintList)
            this.startPrint()
          } else if (this.print.billPrintList.length > 1) {
            this.print.listVisible = true
          }
        })
      },
      batchPrint() {
        const param = {
          list: this.print.printSelectList
        }
        printIncNum(param).then(response => {
          this.startPrint()
        })
      },
      startPrint() {
        const billPrint = this.print.printSelectList[0]
        this.print.printSelectList.splice(0, 1)
        this.print.visible = true
        this.$nextTick(() => { // 加载dom层后再执行打印，不然第一次回出现弹窗问题
          common.doPrint('printFrame', billPrint.url, billPrint.billId)
        })
      },
      handleClose() {
        this.print.visible = false
        if (this.print.printSelectList.length !== 0) {
          this.startPrint()
        } else {
          this.$refs.printListTable.clearSelection()
        }
      },
      // toPrint() {
      //   common.doPrint('printFrame', this.print.billPrintList[0].url, this.print.billPrintList[0].billId)
      //   this.print.billPrintList.splice(0, 1)
      // },
      printAllBill: function() {
        this.print.billPrintList = []
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
          this.$nextTick(() => { // 加载dom层后再执行打印，不然第一次回出现弹窗问题
            common.doBatchPrint('printFrame', printUrl, rp)
          })
        }).catch(error => {
          if (error) console.error(error)
        })
      },
      toNext(moduleCode) {
        const that = this
        if (this.selectRow && this.selectRow.id && this.selectRow.status > 0) {
          api.dtStocklist({ blid: this.selectRow.id })
            .then(response => {
              if (moduleCode === 'transferGoods') {
                this.action = ''
                this.add()
                this.selectRow = {
                  'custId': response.mastocks[0].custId,
                  'stockList': response.mastocks
                }
                this.$refs.transferGoodsViews.loadData(this.selectRow)
              } else {
                const data = {
                  path: findPathByModuleCode(moduleCode),
                  query: {
                    stockList: response.mastocks
                  }
                }
                that.$router.push(data)
              }
            }).catch(e => {

            })
        }
      },
      setHeaderClass({ row, column, rowIndex, columnIndex }) { // 设置表头类
        if (columnIndex === 0) {
          return 'table-header-bg text-center pointer'
        } else {
          return 'table-header-bg text-center'
        }
      },
      printListTableRowClick(row, event, column) {
        this.$refs.printListTable.toggleRowSelection(row)
      },
      printListTableSelectionChange(rowArr) {
        this.print.printSelectList = rowArr
      }
    },
    computed: {
      tableHeader() {
        const temp = {}
        temp.weightSum = this.homeList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weightSum)
        }, 0).toFixed(3)
        temp.numSum = this.homeList.reduce((pre, cur) => {
          return pre + parseFloat(cur.numSum)
        }, 0)
        temp.amountSum = this.homeList.reduce((pre, cur) => {
          return pre + parseFloat(cur.amountSum)
        }, 0).toFixed(2)
        return temp
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
  .transferGoods {
    padding: 10px;
  }

  .el-range-editor--small.el-input__inner {
    width: 238px;
  }
</style>
