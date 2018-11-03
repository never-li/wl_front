<template>
  <div class="app-container">
    <div v-show="pageState==='home'" ref='instoreIndex'>
      <!--表单内容-->
      <el-row class="form-wrap">
        <el-form :inline="true" size="small" label-width="80px">
          <el-form-item label="单据日期">
            <date-range :is-edit="true" v-model="dateArr"></date-range>
          </el-form-item>
          <el-form-item label="客户">
            <customer-select v-model="selectList" :customer= 'formParam'  class="input-w-168"></customer-select>

            <!-- <el-select v-model="formParam.cuFullName" clearable filterable placeholder="请选择" :filter-method='filterMethod' >
              <el-option v-for="(option,indext) in filterDisplayItems(customerList)" :key="indext" :label="option.cuName" :value="option.id">
              </el-option>
            </el-select> -->

          </el-form-item>
          <el-form-item label="单据编号">
            <el-input v-model="formParam.blno"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <list-status-radio v-model="formParam.listStatus" @change="handleRadioChange"></list-status-radio>
          </el-form-item>
          <br>
          <el-form-item label="货物编号">
            <el-input v-model="formParam.handCode" class="input-w-238"></el-input>
          </el-form-item>
          <el-form-item label="仓库">
            <el-select filterable clearable v-model="formParam.storeId">
              <el-option v-for="item in storeList" :value="item.id" :label="item.storeName" :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车牌号">
            <el-input v-model="formParam.vehicleNo"></el-input>
          </el-form-item>
          <el-form-item label="" class="search_label">
            <el-button type="primary" icon="el-icon-search"  @click="search">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>

      <el-row class="el-row-middle">
        <el-button type="primary" icon="el-icon-plus" @click="displayAdd('add','normal')">新增</el-button>
        <el-button type="primary" icon="el-icon-edit" :disabled='buttonControl == -9 ||buttonControl == 1' @click="displayEdit('edit','normal')">修改</el-button>
        <el-button type="danger" icon="el-icon-delete" :disabled='buttonControl ==-9 ||buttonControl == 1' @click="del()">删除</el-button>
        <el-button type="primary" icon="el-icon-view" v-if='buttonControl !== 1' :disabled='buttonControl ==-9||buttonControl == 1'  @click='audit'>审核</el-button>
        <el-button type="primary" icon="el-icon-view" v-if='buttonControl == 1' @click='unaudit'>反审核</el-button>
        <el-button type="primary" icon="el-icon-printer" :disabled='buttonControl <= 0' @click="printBill()">打印</el-button>
        <el-button type="primary" icon="el-icon-printer" @click='printAllBill()'>全部打印</el-button>
      </el-row>

      <el-table ref="singleTable"
                :data="tableData"
                stripe
                border
                height="545"
                highlight-current-row
                header-cell-class-name="table-header-bg text-center"
                row-class-name="pointer text-center"
                @row-click="rowClick"
                @cell-dblclick="rowDbclick" style="width: 100%;margin-bottom:15px;">
        <el-table-column sortable type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column sortable prop="blno" label="单据编号" min-width="150">
        </el-table-column>
        <el-table-column sortable label="客户" min-width="200">
          <template slot-scope="scope">
            {{scope.row.custId?scope.row.cuName:scope.row.mbCustName}}
          </template>
        </el-table-column>
        <el-table-column sortable prop="weightSum" :label="'总重量['+tableHeader.weightSum+']'" min-width="120">
        </el-table-column>
        <el-table-column sortable prop="numSum" :label="'总数量['+tableHeader.numSum+']'" min-width="120">
        </el-table-column>
        <el-table-column sortable prop="storeName" label="仓库" min-width="120">
        </el-table-column>
        <el-table-column sortable prop="vehicleNo" label="车牌号" min-width="120">
        </el-table-column>
        <el-table-column sortable label="状态" min-width="250">
          <template slot-scope="scope">
            <span v-if="scope.row.status > 0" style="color: #008de7;">{{scope.row.stateLabel}}</span>
            <span v-else>{{scope.row.stateLabel}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable prop="bldate" label="单据日期" min-width="140">
        </el-table-column>
        <el-table-column sortable prop="creatorName" label="制单人" min-width="120">
        </el-table-column>
      </el-table>

      <div class="block">
        <div class="pagination-container">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="formParam.pageNo" :page-sizes="[20,100,500,1000]" :page-size="formParam.pageSize"
                         layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <div v-if="pageState!='home'">
      <instore-add :state='childViewState' :condition='childViewCondition' :acceptFormData='checkedRow'
                   @changeView="change" ref="instoreAdd"></instore-add>
    </div>
    <!--<iframe name="printFrame" src="http://127.0.0.1:8088/bill/printbill.jsp"></iframe>-->
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
  import { mapGetters } from 'vuex'
  import { list, del, audit, unaudit, print, batchPrint } from '@/api/warehousing/instore/instore'
  import customerSelect from '@/components/ListCustomerSelect'
  import instoreAdd from './instoreAdd'
  import listStatusRadio from '@/components/listStatusRadio'
  import * as common from '@/utils'
  import dateRange from '@/components/dateRange'
  export default {
    name: 'instore',
    components: {
      customerSelect,
      instoreAdd,
      listStatusRadio,
      dateRange
    },
    computed: {
      ...mapGetters(['storeList', 'customerList']),
      tableHeader: function() {
        const temp = {}
        temp.weightSum = this.tableData.reduce((pre, cur) => {
          return pre + parseFloat(cur.weightSum ? cur.weightSum : 0)
        }, 0).toFixed(3)
        temp.numSum = this.tableData.reduce((pre, cur) => {
          return pre + parseFloat(cur.numSum ? cur.numSum : 0)
        }, 0)
        return temp
      }
    },
    activated() {
      if (JSON.stringify(this.$route.query) !== '{}') {
        if (this.$route.query.id) {
          this.getList(this.$route.query.id)
        }
        if (this.$route.query.path) {
          this.pageState = this.$route.query.path
          this.getList(this.$route.query.id)
        } else {
          // pageState: 'check2InStore',//盘点多盘生成进仓的pageState
          this.pageState = this.$route.query.pageState
          this.childViewState = this.$route.query.childViewState
          this.childViewCondition = this.$route.query.childViewCondition
          this.checkedRow = this.$route.query.formData
          this.originPath = this.$route.query.originPath
          if (this.$refs['instoreAdd']) {
            this.$refs['instoreAdd'].loadData(this.checkedRow)
          }
        }
      }
    },
    data() {
      return {
        selectList: [],
        print: {
          visible: false,
          billId: '',
          billType: -1
        },
        pageState: 'home', // 控制显示 视图
        childViewState: '', // 传给子组件的参数
        childViewCondition: '', // 传给子组件的参数
        checkedRow: {}, // 当前选择table 的row
        isEdit: true,
        total: 0,
        dateArr: [common.leastWeekDate()[0], common.leastWeekDate()[1]],
        formParam: {
          fromDate: '2018-06-14',
          toDate: '2018-06-14',
          cuFullName: '',
          blno: '',
          listStatus: '0',
          handCode: '',
          storeName: '',
          vehicleNo: '',
          pageNo: 1,
          pageSize: 20
        },
        tableData: [],
        buttonControl: -9,
        queryText: '',
        originPath: '' // 调整来源路径，比如盘点生成进仓
      }
    },
    watch: {},
    created() {
      this.search()
      const _this = this
      document.onkeydown = function(e) { // shift事件
        const _key = window.event.keyCode
        if (_key === 13) {
          _this.search()
        }
      }
    },
    methods: {
      handleRadioChange(val) {
        this.search()
      },
      setCurrent(row) {
        this.$refs.singleTable.setCurrentRow(row)
      },
      handleCurrentChange(val) {
        this.formParam.pageNo = val
        this.getList()
      },
      handleSizeChange(val) {
        this.formParam.pageSize = val
        this.getList()
      },
      changeTab(url, state, condition) {
        this.$router.push({
          path: url,
          query: { state: state, condition: condition }
        })
      },
      displayAdd(state, condition) {
        this.childViewState = state
        this.childViewCondition = condition
        this.pageState = state
      },
      displayEdit(state, condition) {
        this.childViewState = state
        this.childViewCondition = condition
        this.pageState = state
      },
      rowClick(row, event, column) {
        this.checkedRow = row
        this.buttonControl = row.status // 控制 按钮显示
        console.log(this.checkedRow)
      },
      rowDbclick(row, event) {
        // this.$router.push({
        //   path: '/warehousing/instoreAdd',
        //   query: { state: 'see', condition: 'normal' }
        // })
        this.checkedRow = row
        this.childViewState = 'see'
        this.childViewCondition = 'normal'
        this.pageState = 'see'
      },
      getList(id) {
        if (id) {
          this.formParam.id = id
        }
        list(this.formParam)
          .then(response => {
            this.tableData = response.listInStores
            this.total = response.dataSize
            // console.log(response.list)
            this.formParam.id = ''
            this.buttonControl = -9 // 按钮控制
          })
          .catch(error => {
            if (error) console.error(error)
          })
      },
      search() {
        this.formParam.pageNo = 1
        this.formParam.fromDate = this.dateArr[0]
        this.formParam.toDate = this.dateArr[1]
        this.getList()
      },
      change(params) {
        this.goHome()
        this.getList()
      },
      goHome() {
        if (this.originPath) {
          this.$router.push({ path: this.originPath, query: { path: 'check' }})
          this.originPath = ''
        }
        this.pageState = 'home'
      },
      del() {
        const that = this
        const param = {
          id: this.checkedRow.id
        }
        // if (!this.selectRow) {
        //   this.$message.warning('请选择要删除的数据')
        //   return
        // }
        this.$confirm('确认是否删除选中信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            del(param)
              .then(() => {
                that.getList()
              })
              .catch(error => {
                if (error) console.error(error)
              })
          })
          .catch(() => {
          })
      },
      audit(checkPrint, blid) {
        // 审核
        const that = this
        const param = {
          id: blid || this.checkedRow.id
        }
        audit(param)
          .then(() => {
            // 打印
            if (checkPrint === true) {
              this.printBill(param.id)
            }
            that.getList()
            // this.pageState = 'home'
            this.goHome()
          })
          .catch(error => {
            if (error) console.error(error)
          })
      },
      unaudit() {
        const that = this
        const param = {
          id: this.checkedRow.id
        }
        unaudit(param)
          .then(() => {
            that.getList()
            // this.pageState = 'home'
            this.goHome()
          })
          .catch(error => {
            if (error) console.error(error)
          })
      },
      filterMethod(query) {
        this.queryText = query // 获取下拉 select 输入的值
        console.log(query)
      },
      filterDisplayItems(options) {
        //  过滤下拉选项过多
        let filterItems = []
        if (this.queryText.length > 0) {
          for (
            let index = 0;
            index < options.length && filterItems.length < 15;
            index++
          ) {
            const item = options[index]
            if (item.cuName.indexOf(this.queryText) !== -1) {
              filterItems.push(item)
            }
          }
        } else {
          filterItems = options.slice(0, 15)
        }
        return filterItems

        // filterItems = options.slice(0, 15)
        // return filterItems
      },
      printBill: function(blid) {
        const id = blid || (this.checkedRow ? this.checkedRow.id : null)
        if (!id) {
          return
        }
        const param = {
          id: id
        }
        print(param).then(response => {
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
        if (!this.tableData || this.tableData.size === 0) return
        console.log('printAllBill')
        console.log(this.tableData)
        const ids = []
        for (const idx in this.tableData) {
          if (this.tableData[idx].status < 1) {
            this.$message.error('单据：' + this.tableData[idx].blno + ' 未审核')
            return
          }
          this.tableData[idx].printNum += 1
          ids.push(this.tableData[idx].id)
        }
        batchPrint({ ids: ids }).then(respone => {
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
        console.log('close')
        this.print.visible = false
      }
    }
  }
</script>
<style lang="scss">
  .el-range-editor--small.el-input__inner {
    width: 200px;
  }
  .el-input__icon{
    &.el-range__close-icon{
      display: none;
    }
  }
</style>


