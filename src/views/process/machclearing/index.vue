<template>
  <div class="app-container">
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
          <el-form-item label="客户">
            <customer-select v-model="formParam.custId"></customer-select>
          </el-form-item>
          <el-form-item label="付款单位">
            <customer-select v-model="formParam.payType"></customer-select>
          </el-form-item>
          <el-form-item label="状态">
            <list-status-radio v-model="formParam.listStatus" @change="handleRadioChange"></list-status-radio>
          </el-form-item>
          <br>
          <el-form-item label="单据编号">
            <el-input v-model="formParam.blno" class="input-w-238"></el-input>
          </el-form-item>
          <el-form-item label="货物编号">
            <el-input v-model="formParam.handCode" class="input-w-168"></el-input>
          </el-form-item>
          <el-form-item label="结算方式">
            <pay-mode-select v-model="formParam.payMode"></pay-mode-select>
          </el-form-item>
          <el-form-item label="" class="search_label">
            <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
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
        <!--<el-button type="primary" @click="add" icon= "el-icon-plus">新增</el-button>-->
        <el-button type="primary" :disabled='buttonControl == -9 ||buttonControl == 1' @click="update" icon="el-icon-edit-outline">修改
        </el-button>
        <el-button type="primary" :disabled='buttonControl ==-9 ||buttonControl == 1' v-on:click="del" icon= "el-icon-delete">删除</el-button>
        <el-button type="primary" v-if='buttonControl !== 1' :disabled='buttonControl ==-9||buttonControl == 1'
                   v-on:click='audit' class="el-icon-view">审核
        </el-button>
        <el-button type="primary" v-if='buttonControl == 1' v-on:click='unaudit'>反审核</el-button>
        <el-button type="primary" :disabled='buttonControl <= 0' @click="printBill()" icon= "el-icon-printer">打印</el-button>
        <el-button type="primary" @click='printAllBill()' icon= "el-icon-printer">全部打印</el-button>
      </el-row>

      <el-table :data="homeList"
                border highlight-current-row
                stripe height="545"
                @row-click="rowClick"
                @cell-dblclick="rowDbclick"
                v-loading="listLoading"
                header-cell-class-name="table-header-bg text-center"
                row-class-name="pointer text-center tab-ellipsis" >
        <el-table-column sortable type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column sortable property="blno" label="单据编号" min-width="150">
        </el-table-column>
        <el-table-column sortable property="cuName" label="客户" min-width="200">
        </el-table-column>
        <el-table-column sortable property="payCuName" label="付款单位" >
        </el-table-column>
        <el-table-column sortable property="weightSum" :label="'总重量['+ tableHeader.weightSum+']'" min-width="120">
        </el-table-column>
        <el-table-column sortable property="amountSum" :label="'总金额['+ tableHeader.amountSum+']'" min-width="120">
        </el-table-column>
        <el-table-column sortable property="payMode" label="结算方式" min-width="120" prop="stateLabel">
        </el-table-column>
        <el-table-column sortable label="状态" min-width="250">
          <template slot-scope="scope">
            <span :class="{'color-light-blue': scope.row.status > 0}">{{scope.row.stateLabel}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable label="收款状态" min-width="120" prop="isFee">
          <template slot-scope="scope">
            <span v-bind:class="{'color-red':scope.row.isFee === 2}">{{scope.row.isFee === 2?"已收费":"未收费" }}</span>
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
                         :current-page="formParam.pageNo" :page-sizes="[20,100,1000, 5000]" :page-size="formParam.pageSize"
                         layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>

    <div v-if="pageState === 'views'">
      <dt-view ref='transferGoodsViews'
             :detailData='selectRow'
             @hideViews="hideViews"
             :action="action"
             @changeAction="changeAction"
      ></dt-view>
    </div>

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
  import customerSelect from '@/components/customerSelect'
  import payModeSelect from '@/components/payModeSelect'
  import * as api from '@/api/process/machclearing/machclearing'
  import * as common from '@/utils'
  import dateRange from '@/components/dateRange'
  import listStatusRadio from '@/components/listStatusRadio'
  import DtView from '@/views/process/machclearing/dtView'

export default {
    name: 'machClearing',
    components: {
      DtView,
      customerSelect,
      payModeSelect,
      // views,
      dateRange,
      listStatusRadio
    },
    activated() {
      if (JSON.stringify(this.$route.query) !== '{}') {
        if (this.$route.query.id) {
          this.getList(this.$route.query.id)
        }
        if (this.$route.query.orderId && this.$route.query.custId) {
          if (this.$route.query.isAdd) {
            this.selectRow = { orderId: this.$route.query.orderId, custId: this.$route.query.custId }
            this.add()
            // this.$refs.transferGoodsViews.loadAddData(this.selectRow)
          } else {
            this.hideViews()
            this.getList('', this.$route.query.orderId)
          }
        }
      }
    },
    data() {
      return {
        print: {
          visible: false,
          billPrintList: []
        },
        pageState: 'home', // 控制显示 视图
        action: '',
        total: 0,
        dateArr: [common.leastWeekDate()[0], common.leastWeekDate()[1]],
        formParam: {
          fromDate: '',
          toDate: '',
          cuFullName: '', // 客户
          listStatus: '0', // 状态
          handCode: '', // 货物编号
          blno: '', // 单据编号
          pageNo: 1,
          pageSize: 20
        },
        buttonControl: -9,
        homeList: [],
        selectRow: {}, // 当前选择table 的row
        listLoading: false
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
      getList(id, orderId) {
        this.listLoading = true
        if (id) {
          this.formParam.id = id
        } else {
          this.formParam.fromDate = this.dateArr[0]
          this.formParam.toDate = this.dateArr[1]
        }
        if (orderId) {
          this.formParam.orderId = orderId
        }
        api
          .list(this.formParam)
          .then(response => {
            this.homeList = response.list
            this.total = response.dataSize

            this.buttonControl = -9 // 按钮控制
            this.listLoading = false
          })
          .catch(error => {
            if (error) console.error(error)
            this.listLoading = false
          })
      },
      add() {
        // this.selectRow = { orderId: '201807201736033190000264QRVVMY2H', custId: '00510C4DE50CC38330619C1F9BD77634' }
        this.action = 'add'
        this.pageState = 'views'
      },
      update() {
        this.action = 'update'
        this.pageState = 'views'
      },
      // ===table
      detail() {
        console.log(this.selectRow)
        this.action = 'view'
        this.pageState = 'views'
      },
      rowClick(row, event, column) {
        this.selectRow = row
        this.buttonControl = row.status // 控制 按钮显示
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
        console.log(this.selectRow)
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
      audit(checkPrint) { // 审核
        const that = this
        const param = {
          id: this.selectRow.id
        }
        this.$confirm(`确认审核单号${this.selectRow.blno}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.audit(param).then(() => {
            // 打印
            if (checkPrint === true) {
              this.printBill()
            }
            that.getList()
            this.pageState = 'home'
          }).catch(error => {
            if (error) console.error(error)
          })
        }).catch(() => {
        })
      },
      unaudit() {
        const that = this
        const param = {
          id: this.selectRow.id
        }
        this.$confirm(`确认反审核单号${this.selectRow.blno}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            api.unaudit(param)
              .then(() => {
                that.getList()
                this.pageState = 'home'
              })
              .catch(error => {
                if (error) console.error(error)
              })
          })
          .catch(() => {
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
      hideViews() {
        this.action = ''
        this.pageState = 'home'
        this.selectRow = {}
        this.buttonControl = -9 // 按钮控制
      },
      printBill: function() {
        this.print.billPrintList = []
        if (!this.selectRow || !this.selectRow.id) return
        const param = {
          id: this.selectRow.id
        }
        api.print(param).then(response => {
          this.print.visible = true
          this.print.billPrintList = response.billPrintList
        }
        ).then(() => {
          setTimeout(this.toPrint, 100)
        }
        )
      },
      toPrint() {
        common.doPrint('printFrame', this.print.billPrintList[0].url, this.print.billPrintList[0].billId)
        this.print.billPrintList.splice(0, 1)
      },
      handleClose() {
        if (this.print.billPrintList && this.print.billPrintList.length > 0) {
          this.print.visible = true
          this.toPrint()
        } else {
          this.print.visible = false
        }
      }
    },
    computed: {
      tableHeader() {
        const temp = {}
        temp.weightSum = this.homeList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weightSum)
        }, 0).toFixed(3)
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
</style>
