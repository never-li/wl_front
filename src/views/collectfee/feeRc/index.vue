<template>
  <div class="app-container">
    <!--<home v-show="BUS.path === 'home'" :BUS="BUS" ref="home"></home>-->
    <div v-show="BUS.path === 'home'">
      <!--form-->
      <el-row class="form-wrap">
        <el-form :inline="true" size="small" label-width="80px">
          <el-form-item label="单据日期">
            <date-range :is-edit="true" v-model="listQuery.dateArr"></date-range>
          </el-form-item>
          <el-form-item label="客户">
            <customer-select v-model="listQuery.custId"></customer-select>
          </el-form-item>
          <el-form-item label="付款单位">
            <customer-select v-model="listQuery.payType"></customer-select>
          </el-form-item>
          <el-form-item label="状态">
            <list-status-radio v-model="listQuery.listStatus" @change="handleRadioChange"></list-status-radio>
          </el-form-item>
          <el-form-item label="是否收款">
            <el-radio-group v-model="listQuery.isFee" @change="handleRadioChange">
              <el-radio v-for="item in feeStatusList"
                        :label="item.value"
                        :key="item.value">
                {{item.label}}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <br>
          <el-form-item label="货物编号">
            <el-input v-model="listQuery.handCode" style="width: 238px"></el-input>
          </el-form-item>
          <el-form-item label="单据编号">
            <el-input v-model="listQuery.blno" class="input-w-168"></el-input>
          </el-form-item>
          <el-form-item label="结算方式">
            <pay-mode-select v-model="listQuery.payMode"></pay-mode-select>
          </el-form-item>
          <el-form-item label="费用类型">
            <list-fee-type-select :feeType="feeTypeObj" :returnItem="true"></list-fee-type-select>
          </el-form-item>
          <el-form-item label="统计标志">
            <el-radio-group v-model="listQuery.countFlag" @change="handleRadioChange">
              <el-radio v-for="item in countStatusList"
                        :label="item.value"
                        :key="item.value">
                {{item.label}}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="" class="search_label">
            <el-button type="primary" @click="search" icon="el-icon-search" >查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>

      <!--btn-group-->
      <el-row class="btn-group-container">
        <el-button type="primary"   @click="BUS.changeView({path: 'views', action: 'add'})" icon="el-icon-plus" >新增</el-button>
        <el-button type="primary" @click="BUS.changeView({path: 'views', action: 'update'})" :disabled="BUS.selectRow==null || BUS.selectRow.status == 1" icon="el-icon-edit-outline">修改
        </el-button>
        <el-button type="danger" @click="del" :disabled="BUS.selectRow==null || BUS.selectRow.status == 1" icon="el-icon-delete">删除</el-button>
        <el-button type="primary"  icon="el-icon-view"  @click="audit" :disabled="BUS.selectRow==null">{{auditMsg}}</el-button>
        <el-button type="primary"  icon="el-icon-goods"  @click="makeCollection" :disabled="BUS.selectRow==null || BUS.selectRow.status == 0">{{collectionMsg}}</el-button>
        <el-button type="primary" :disabled="BUS.selectRow == null?true:(BUS.selectRow.status!=1)" @click="printBill" icon="el-icon-printer">打印</el-button>
        <el-button type="primary" @click="batchPrint" icon="el-icon-printer">打印全部</el-button>
      </el-row>

      <!--table-->
      <el-table :data="homeList"
                v-loading="listLoading"
                @row-click="rowClick"
                @cell-dblclick="rowDbclick"
                border highlight-current-row stripe height="545"
                header-cell-class-name="table-header-bg text-center" row-class-name="pointer text-center tab-ellipsis"
      >
        <el-table-column label="序号" type="index" width="50">
        </el-table-column>
        <el-table-column sortable label="单据编号" prop="blno" min-width="150"></el-table-column>
        <el-table-column sortable label="客户" prop="cuName" min-width="180"></el-table-column>
        <el-table-column sortable label="付款单位" prop="payTypeName" min-width="180"></el-table-column>
        <el-table-column sortable :label="'总重量['+ tableHeader.weight+']'" prop="weightSum" min-width="150"></el-table-column>
        <el-table-column sortable :label="'总金额['+ tableHeader.amount+']'" prop="amountSum" min-width="150"></el-table-column>
        <el-table-column sortable label="费用类型" prop="feeName" min-width="110"></el-table-column>
        <el-table-column sortable label="结算方式" prop="payMode" min-width="110"></el-table-column>
        <el-table-column sortable label="状态" min-width="240">
          <template slot-scope="scope">
            <span :class="{'color-light-blue': scope.row.status > 0}">{{scope.row.stateLabel}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable label="付款状态" min-width="100" prop="isFee">
          <template slot-scope="scope">
            <span v-if="scope.row.isFee===0">未收款</span>
            <span v-else style="color: red;">已收款</span>
          </template>
        </el-table-column>
        <el-table-column sortable label="收款人" min-width="100" prop="payee">
          <template slot-scope="scope">
            <span v-if="scope.row.isFee===2">{{scope.row.payee}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable label="单据日期" prop="bldate" min-width="140"></el-table-column>
        <el-table-column sortable label="制单人" prop="creatorName" min-width="120"></el-table-column>
        <el-table-column sortable label="备注" prop="remark"></el-table-column>
        <el-table-column sortable label="不统计报表"min-width="120" v-if="false">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.countFlag===1" readonly></el-checkbox>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <div class="mt-10" style="width:95%;text-align:right">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="listQuery.pageNo"
                       :page-sizes="[20,100,1000, 5000]" :page-size="listQuery.pageSize"
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
    <views v-show="BUS.path === 'views'" :BUS="BUS" ref="views"></views>
  </div>
</template>

<script>
  // import home from './home' // 主页
  import views from './views'
  import { mapGetters } from 'vuex'
  import dateRange from '@/components/dateRange'
  import customerSelect from '@/components/customerSelect'
  import listStatusRadio from '@/components/listStatusRadio'
  import storeSelect from '@/components/storeSelect'
  import listFeeTypeSelect from '@/components/ListFeeTypeSelect'
  import payModeSelect from '@/components/payModeSelect'
  import * as api from '@/api/collectfee/feeRc/feeRc'
  import * as common from '@/utils'
  export default {
    name: 'feeRc',
    components: {
      // home,
      views,
      dateRange,
      customerSelect,
      listStatusRadio,
      storeSelect,
      listFeeTypeSelect,
      payModeSelect
    }, computed: {
      ...mapGetters(['feetypeList']),
      tableHeader() {
        const temp = {}
        temp.weight = this.homeList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weightSum)
        }, 0).toFixed(3)
        temp.amount = this.homeList.reduce((pre, cur) => {
          return pre + parseFloat(cur.amountSum)
        }, 0).toFixed(2)
        return temp
      },
      auditMsg: function() {
        if (this.BUS.selectRow && this.BUS.selectRow.status === 1) {
          return '反审核'
        } else {
          return '审核'
        }
      },
      collectionMsg: function() {
        if (this.BUS.selectRow && this.BUS.selectRow.isFee === 2) {
          return '取消收款'
        } else {
          return '收款'
        }
      }
    },
    activated() {
      if (JSON.stringify(this.$route.query) !== '{}') {
        if (this.$route.query.id) {
          this.$refs['home'].getList(this.$route.query.id)
        } else {
          if (this.$route.query.formData) {
            this.BUS.selectRow = this.$route.query.formData
          }
          this.BUS.path = this.$route.query.path
          this.BUS.action = this.$route.query.action
          this.BUS.originPath = this.$route.query.originPath
          this.$refs['views'].loadData()
        }
      }
    },
    mounted() {
      this.getList('')
      const _this = this
      document.onkeydown = function(e) { // shift事件
        const _key = window.event.keyCode
        if (_key === 13) {
          _this.search()
        }
      }
    },
    data() {
      return {
        BUS: { // 共享数据
          path: 'home',
          action: '',
          originPath: '',
          showSelectGoods: false, // 货物选择显示
          selectRow: null, // 选择行
          changeView: function(params) {
            Object.assign(this, params)
          }
        },
        feeTypeObj: {},
        print: {
          visible: false,
          billId: '',
          billType: -1
        },
        total: 0,
        listLoading: false,
        listQuery: {
          pageNo: 1,
          pageSize: 20,
          dateArr: [common.leastWeekDate()[0], common.leastWeekDate()[1]],
          custId: '',
          payType: '',
          listStatus: '',
          handCode: '',
          blno: '',
          payMode: '',
          feeName: '',
          id: '',
          countFlag: '',
          isFee: ''
        },
        homeList: [],
        countStatusList: [
          { value: '', label: '全部' },
          { value: 0, label: '是' },
          { value: 1, label: '否' }
        ],
        feeStatusList: [
          { value: '', label: '全部' },
          { value: 2, label: '是' },
          { value: 0, label: '否' }
        ]
      }
    },
    methods: {
      handleRadioChange(val) {
        this.search()
      },
      getList(id) {
        this.BUS.selectRow = null
        if (this.listQuery.dateArr.length > 0) {
          this.listQuery.fromDate = this.listQuery.dateArr[0]
          this.listQuery.toDate = this.listQuery.dateArr[1]
        }
        if (id) {
          this.listQuery.id = id
        }
        this.listLoading = true
        this.listQuery = Object.assign(this.listQuery, this.feeTypeObj)
        api.list(this.listQuery).then((response) => {
          this.homeList = response.list
          this.total = response.dataSize
          this.listLoading = false
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
        if (!this.BUS.selectRow) {
          this.$message('请选择要删除的数据')
          return
        }
        const that = this
        this.$confirm('确认删除该行？', '温馨提示', { type: 'warning' }).then(() => {
          api.del(this.BUS.selectRow.id).then(() => {
            this.getList()
            that.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          }).catch(error => {
            if (error) console.error(error)
          })
        })
      },
      // 审核
      audit() {
        if (!this.BUS.selectRow) {
          this.$message('请选择要审核的数据')
          return
        }
        if (this.BUS.selectRow.status === 0) {
          api.audit(this.BUS.selectRow.id).then(() => {
            this.getList()
          }).catch(error => {
            if (error) console.error(error)
          })
        } else if (this.BUS.selectRow.status === 1) {
          api.unaudit(this.BUS.selectRow.id).then(() => {
            this.getList()
          }).catch(error => {
            if (error) console.error(error)
          })
        }
      },
      makeCollection() {
        if (!this.BUS.selectRow) {
          this.$message('请选择要操作的数据')
          return
        }
        const that = this
        // debugger
        if (this.BUS.selectRow.isFee === 0) {
          api.makeCollections({ id: this.BUS.selectRow.id, type: 1 }).then(() => {
            that.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          }).catch(error => {
            if (error) console.error(error)
          })
        } else if (this.BUS.selectRow.status === 1) {
          api.makeCollections({ id: this.BUS.selectRow.id, type: 2 }).then(() => {
            that.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          }).catch(error => {
            if (error) console.error(error)
          })
        }
      },
      // ===表格
      rowClick(row, event, column) {
        this.BUS.selectRow = row
      },
      rowDbclick() {
        this.BUS.changeView({ path: 'views', action: 'view' })
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.pageNo = val
        this.getList()
      },
      batchPrint() {
        const tmp = { ids: [] }
        for (const idx in this.homeList) {
          if (this.homeList[idx].status < 1) {
            this.$message.error('单据：' + this.homeList[idx].blno + ' 未审核')
            return
          }
          this.homeList[idx].printNum += 1
          tmp.ids.push(this.homeList[idx].id)
        }

        api.batchPrint(tmp).then(response => {
          const reportlets = []
          const printUrl = response.billPrintList[0].url.split('?')[0]
          response.billPrintList.forEach((item) => {
            const reportlet = item.url.split('=')[1]
            reportlets.push({ 'reportlet': reportlet, 'billId': item.billId })
          })
          // 将参数值组成的数组转化为字符串
          const rp = JSON.stringify(reportlets)
          this.print.visible = true
          setTimeout(function() {
            common.doBatchPrint('printFrame', printUrl, rp)
          }, 100)
        }
        ).catch(error => {
          if (error) console.error(error)
        })
      },
      printBill: function() {
        if (!this.BUS.selectRow || !this.BUS.selectRow.id) return
        const param = {
          id: this.BUS.selectRow.id
        }
        api.print(param).then(response => {
          this.print.visible = true
          this.print.url = response.billPrintList[0].url
          this.print.billId = response.billPrintList[0].billId
          this.print.billType = response.billPrintList[0].billType
          console.log(response)
        }
        ).then(() => {
          setTimeout(this.toPrint, 100)
        }
        )
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

<style scoped>

</style>
