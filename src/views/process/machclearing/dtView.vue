<template>
  <div class="transferGoods-views">
    <!--    <div class="color-red">
          <div>pageState {{pageState}}</div>
          <div>action {{action}}</div>
        </div>-->
    <!--detailData {{detailData}}-->
    <!--selection {{selectionList}}-->
    <!--{{formData.dtDelList}}-->
    <div>
      <div class="btn-group-container">
        <el-row>
          <el-button type='primary' v-if="action==='view' || action ==='updatePrice'" @click='cancel' icon= "el-icon-back">返回</el-button>
          <el-button type='primary' v-else-if="action!=='view'" @click='cancel' icon= "el-icon-close">取消</el-button>

          <el-button type='primary' v-if="action==='add'" @click='addSave' icon= "el-icon-check">保存</el-button>
          <el-button type='primary' v-if="action==='update' || action ==='updatePrice'" @click='editSave' icon= "el-icon-check">保存</el-button>
          <el-button type='primary' v-if="action==='add'" @click='addAndAudit' class="el-icon-view">审核</el-button>
          <el-button type='primary' v-if="action==='update'" @click='editAndAudit' class="el-icon-view">审核</el-button>
          <el-button type='primary' v-if="action==='view' && detailData.status === 0" @click='seeEdit' icon="el-icon-edit-outline">修改</el-button>
          <el-button type='primary' v-if="action==='view' && detailData.status === 0" @click='audit' class="el-icon-view">审核</el-button>
          <el-button type='primary' v-if="action==='view' && detailData.status === 1" @click='unaudit'>反审核</el-button>
          <el-button type='primary' v-if="action==='view' && detailData.status === 1" icon= "el-icon-printer" @click="$parent.printBill()">打印</el-button>
          <el-checkbox style='margin-left:15px;' v-if="detailData.status === 0" v-model='checkPrint'>
            审核打印
          </el-checkbox>
        </el-row>
      </div>

      <div class="form-wrap">
        <el-form :inline="true" size="small" label-width="80px" :rules="rules" ref="ruleForm" :disabled="!formIsEdit">
          <el-form-item label="单据编号:">
            <el-input v-model="formData.blno" disabled class="input-w-168"></el-input>
          </el-form-item>
          <el-form-item label="客户:" prop="custId">
            <customer-select v-model="formData.custId" :disabled="true"></customer-select>
          </el-form-item>
          <el-form-item label="折扣:">
            <number-input v-model="formData.discount" class="input-w-168" decimal="2,2" :min="0" :max="1" :disabled="!formIsEdit"></number-input>
          </el-form-item>
          <br>
          <el-form-item label="单据日期:">
            <el-date-picker
              v-model="formData.bldate"
              type="datetime"
              class="input-w-168"
              value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="付款单位:">
            <customer-select v-model="formData.payType"></customer-select>
          </el-form-item>
          <el-form-item label="付款方式:">
            <pay-mode-select v-model="formData.payMode"></pay-mode-select>
          </el-form-item>
          <br>
          <el-form-item label="备注:">
            <el-input type="textarea" v-model="formData.remark" class="input-w-694"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="制单人:">
            <span class='itemsClass2'>[{{formData.creatorName}} {{formData.createTime}}]</span>
          </el-form-item>
          <el-form-item label="修改人:">
            <span class='itemsClass2'>[{{formData.editor}} {{formData.editTime}}]</span>
          </el-form-item>
          <el-form-item label="审核人:">
            <span class='itemsClass2'>[{{formData.checkerName}} {{formData.checkTime}}]</span>
          </el-form-item>
          <el-form-item label="总金额:">
            <span class='itemsClass2'>{{formData.amountSum}}</span>
          </el-form-item>
        </el-form>
      </div>

      <el-row :gutter="10" class="sub-action-bar">
        <el-col :span=2 class="fz-14">结算类型：</el-col>
        <el-col :span=5 >
          <el-radio-group v-model="formData.clearingType" @change="reCalcDtList()" v-bind:disabled="!formIsEdit || action !== 'add'">
            <el-radio :label="1">按料</el-radio>
            <el-radio :label="2">按分条、平直</el-radio>
            <el-radio :label="3">按规格</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span=3 >
          <el-button size="mini" @click="dialogSubjoinFeeVisible = true">木架与加工费情况</el-button>
        </el-col>
        <el-col :span=3 :push=11 v-if="formIsEdit && action === 'add'">
          <el-button size="mini" @click="showStocks()">删除不结算料</el-button>
        </el-col>
        <el-col :span=3 :push=11 v-if="!formIsEdit && action === 'view' && formData.status ===1 && formData.isFee ===0">
          <el-button size="mini" @click="modify('updatePrice')">修改单价</el-button>
        </el-col>
      </el-row>
      <el-table :data="dtList"
                :summary-method="getSummaries"
                show-summary
                ref="table"
                row-key="id"
                stripe height="400"
                @header-click="handleHeaderClick"
                border header-cell-class-name="table-header-bg text-center"
                :header-cell-class-name="setHeaderClass"
                >

        <!--增加、修改时显示-->
        <el-table-column v-if="action === 'add' || action === 'update' || action === 'updatePrice'" label="+" width="50" fixed>
          <template slot-scope="scope">
            <i class="el-icon-delete" v-if="(formIsEdit && scope.row.resId ==='') || (action === 'updatePrice' && !scope.row.id)" @click="remove(scope.row,scope.$index)"></i>
          </template>
        </el-table-column>
        <el-table-column sortable label="货物编号" prop="handCode" min-width="150" ></el-table-column>
        <el-table-column sortable label="钢卷号" prop="steelCode" min-width="150" ></el-table-column>
        <el-table-column sortable label="品名" prop="typeName" min-width="150" ></el-table-column>
        <el-table-column sortable label="规格" prop="specName"></el-table-column>
        <el-table-column sortable label="产地" prop="parea"></el-table-column>
        <el-table-column sortable label="材质" prop="grade"></el-table-column>
        <el-table-column sortable label="类型" prop="machType"></el-table-column>
        <el-table-column sortable label="开料规格" min-width="150" >
          <template slot-scope="scope">
            <el-input v-model="scope.row.machSpecDes" v-if="(formIsEdit && scope.row.resId ==='') || (action === 'updatePrice' && !scope.row.id) " size="mini"></el-input>
            <span v-else >{{scope.row.machSpecDes}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable label="重量" prop="machWeight">
          <template slot-scope="scope">
            <el-input v-model="scope.row.machWeight" v-if="formIsEdit || action === 'updatePrice'" size="mini" @input="calcAmount(scope.row)" v-bind:class="{'color-red':scope.row.resId && scope.row.machWeight != scope.row.originMachWeight}"></el-input>
            <span v-else v-bind:class="{'color-red':scope.row.resId && scope.row.machWeight != scope.row.originMachWeight}">{{scope.row.machWeight}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable label="单价" prop="price">
          <template slot-scope="scope">
            <el-input v-model="scope.row.price" v-if="formIsEdit || action === 'updatePrice'" size="mini" @input="calcAmount(scope.row)"></el-input>
            <span v-else >{{scope.row.price}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable label="金额" prop="amount">
          <template slot-scope="scope">
            <el-input v-model="scope.row.amount" v-if="formIsEdit || action === 'updatePrice'" size="mini"></el-input>
            <span v-else >{{scope.row.amount}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable label="备注" prop="remark">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark" v-if="formIsEdit || action === 'updatePrice'" size="mini"></el-input>
            <span v-else >{{scope.row.remark}}</span>
          </template>
        </el-table-column>
      </el-table>

    </div>

    <el-dialog title="选择不结算料" :visible.sync="dialogClearingStocksVisible" width="60%" @close="handleStockDialogClose">
      <el-table :data="clearingStocks"
                tooltip-effect="dark"
                ref="unFeeStockTable"
                style="width: 100%"
                @selection-change="handleSelectionChange" stripe
                header-cell-class-name="table-header-bg text-center"
      >
        <el-table-column sortable type="selection" width="50"></el-table-column>
        <el-table-column sortable property="handCode" label="货物编号" width="100"></el-table-column>
        <el-table-column sortable property="steelCode" label="钢卷号" width="100"></el-table-column>
        <el-table-column sortable property="typeName" label="品名" width="100"></el-table-column>
        <el-table-column sortable property="thickness" label="厚度" width="100"></el-table-column>
        <el-table-column sortable property="width" label="宽度" width="100"></el-table-column>
        <el-table-column sortable property="parea" label="产地"></el-table-column>
        <el-table-column sortable property="grade" label="材质" width="100"></el-table-column>
        <el-table-column sortable property="weight2" label="净重" width="100"></el-table-column>
        <el-table-column sortable property="weight4" label="磅重" width="100"></el-table-column>
        <el-table-column sortable property="storeName" label="仓库" width="100"></el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="" :visible.sync="dialogSubjoinFeeVisible" width="60%">
      <el-row>木架使用明细</el-row>
      <el-row>
        <el-table :data="usedBattenList" stripe
        header-cell-class-name="table-header-bg text-center"
        >
          <el-table-column sortable type="index" label="序号" width="50"></el-table-column>
          <el-table-column sortable property="shelfSpec" label="规格"></el-table-column>
          <el-table-column sortable property="shelfType" label="类型"></el-table-column>
          <el-table-column sortable property="num" label="数量"></el-table-column>
          <el-table-column sortable property="remark" label="备注"></el-table-column>
        </el-table>
      </el-row>
      <el-row>附加费收费情况</el-row>
      <el-row>
        <el-table :data="attachFeeList" stripe
        header-cell-class-name="table-header-bg text-center"
        >
          <el-table-column sortable property="blno" label="结算单号" min-width="130"></el-table-column>
          <el-table-column sortable property="feeName" label="附加费类型" min-width="120"></el-table-column>
          <el-table-column sortable property="payMode" label="结算方式" min-width="100"></el-table-column>
          <el-table-column sortable property="machWeight" label="开单重量" min-width="100"></el-table-column>
          <el-table-column sortable property="price" label="单价" min-width="100"></el-table-column>
          <el-table-column sortable property="amount" label="金额" min-width="100"></el-table-column>
          <el-table-column sortable property="remark" label="备注" min-width="150"></el-table-column>
          <el-table-column sortable property="userName" label="制单人" min-width="100"></el-table-column>
        </el-table>
      </el-row>
    </el-dialog>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import numberInput from '@/components/numberInput'
  // import storeSelect from '@/components/storeSelect'
  // import selectGoodsPage from './selectGoods'
  import customerSelect from '@/components/customerSelect'
  // import CommonTable from './CommonTable'
  import payModeSelect from '@/components/payModeSelect'
  import * as api from '@/api/process/machclearing/machclearing'
  import * as commom from '@/utils'

  export default {
    props: {
      action: String,
      detailData: Object
    },
    components: {
      // storeSelect,
      customerSelect,
      // CommonTable,
      // selectGoodsPage,
      payModeSelect,
      numberInput
    },
    data() {
      return {
        defaultChangePrice: 0,
        checkPrint: false,
        formIsEdit: Boolean,
        formData: {
          bldate: commom.getNowFormatMinTime(), // 制单时间
          discount: 1,
          dtList: [], // 明细数据集合
          dtDelList: [], // 删除列表
          clearingType: 1
        },
        defaultData: {
          bldate: commom.getNowFormatMinTime(), // 制单时间
          discount: 1,
          dtList: [], // 明细数据集合
          dtDelList: [], // 删除列表
          clearingType: 1
        },
        dtList: [], // 明细
        newAttachFeeList: [], // 新增附加费
        attachFeeList: [], // 附加费明细
        usedBattenList: [], // 木架使用明细
        rules: {
        },
        selectGoodsNum: 0,
        // === table
        weightCalc: [
          { label: '抄码净重', value: 2 },
          { label: '抄码毛重', value: 4 },
          { label: '抄码磅重', value: 1 }
        ],
        unFeeStockList: [],
        currentRow: {},
        clearingStocks: [], // 结算料
        toggleRowSelection: false, // 双击不让选中的标志
        clickTimer: null, // 判断单击双击的计时器
        dialogSubjoinFeeVisible: false, // 木架附加费弹出框
        dialogClearingStocksVisible: false // 删除不结算料弹出框
      }
    },
    methods: {
      addSave() {
        const that = this
        this.formData.dtList = this.dtList
        api
          .add(this.formData)
          .then(response => {
            that.$emit('hideViews')
            if (that.dtList.length > 0) {
              // 解锁锁定货物
              const param = []
              for (let i = 0; i < that.dtList.length; i++) {
                param.push(that.dtList[i].fromStockId)
              }
            }
            this.$parent.getList()
          })
          .catch(error => {
            if (error) console.error(error)
          })
      },
      addAndAudit() {
        const that = this
        this.formData.dtList = this.dtList
        api
          .addAndAudit(this.formData)
          .then(response => {
            that.$emit('hideViews')
            if (that.dtList.length > 0) {
              // 解锁锁定货物
              const param = []
              for (let i = 0; i < that.dtList.length; i++) {
                param.push(that.dtList[i].fromStockId)
              }
            }
            this.$parent.getList()
          })
          .catch(error => {
            if (error) console.error(error)
          })
      },
      editAndAudit() {
        // 修改保存
        const that = this
        this.formData.dtList = this.dtList
        const promis = api.updateAndAudit(this.formData)
        promis.then(response => {
          that.$emit('hideViews')
          if (that.dtList.length > 0) {
            // 解锁锁定货物
            const param = []
            for (let i = 0; i < that.dtList.length; i++) {
              param.push(that.dtList[i].fromStockId)
            }
          }
          this.$parent.getList()
        })
          .catch(error => {
            if (error) console.error(error)
          })
      },
      editSave() {
        // 修改保存
        const that = this
        this.formData.dtList = this.dtList
        let promis
        if (this.action === 'updatePrice') {
          promis = api.updatePrice(this.formData)
        } else {
          promis = api.update(this.formData)
        }
        promis.then(response => {
          that.$emit('hideViews')
          if (that.dtList.length > 0) {
            // 解锁锁定货物
            const param = []
            for (let i = 0; i < that.dtList.length; i++) {
              param.push(that.dtList[i].fromStockId)
            }
          }
          this.$parent.getList()
        })
          .catch(error => {
            if (error) console.error(error)
          })
      },
      cancel() {
        if (this.dtList.length > 0) {
          // 解锁锁定货物
          const param = []
          for (let i = 0; i < this.dtList.length; i++) {
            param.push(this.dtList[i].fromStockId)
          }
        }
        this.$emit('hideViews')
      },
      seeEdit() {
        this.formIsEdit = true
        this.$emit('changeAction', 'update')
      },
      // btn - 换货
      // changeGoods() {
      //   this.selectGoodsNum = this.selectionList.length
      //   if (this.selectGoodsNum === 0) {
      //     this.$alert('请选择货物', '温馨提示', { type: 'warning' })
      //     return
      //   }
      //   this.pageState = 'selectGoods'
      //   // this.change({ path: 'selectGoods' })
      // },
      modify(val) {
        this.$emit('changeAction', val)
      },
      // btn - 审核
      audit() {
        this.$parent.audit(this.checkPrint)
      },
      // btn - 反审核
      unaudit() {
        this.$parent.unaudit()
      },
      // === table
      handleHeaderClick(column, event) {
        if (column.label === '+') {
          this.dtList.push({ resId: '' })
        }
      },
      setHeaderClass({ row, column, rowIndex, columnIndex }) { // 设置表头类
        if (columnIndex === 0) {
          if (row[0].label === '+') {
            return 'table-header-bg text-center pointer table-add-icon'
          }
          return 'table-header-bg text-center pointer'
        } else {
          return 'table-header-bg text-center'
        }
      },
      remove(item, index) {
        // 删除行
        this.$confirm('确认删除该行？', '温馨提示', {
          type: 'warning'
        }).then(() => {
          this.dtList.splice(index, 1)
          // console.log(item)
          this.formData.dtDelList.push(item)
        })
      },
      getSummaries(param) { // 计算明细 总金额
        const { columns, data } = param
        const sums = []
        let amountSum = 0
        let amountIndex = 0
        columns.forEach((column, index) => {
          // console.log(column.property)
          if (column.property !== 'amount') {
            return
          }
          amountIndex = index
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            amountSum = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            sums[index] = '合计：' + amountSum.toFixed(2)
          } else {
            sums[index] = 'N/A'
          }
        })
        sums[amountIndex + 1] = '折扣：' + (amountSum * Number(this.formData.discount)).toFixed(2)
        return sums
      },
      handleSelectionChange(val) {
        this.unFeeStockList = val
      },
      handleStockDialogClose() {
        this.reCalcDtList()
      },
      // table - 重量结算方式
      // selectChange(val, index) {
      //   this.dtList[index].weightFlag = val
      // },
      selectable(row) { // 是否可选
        return !row.isUsed
      },
      isUsed(row) {
        return !row.isUsed
      },
      // hideSelectGoods() {
      //   this.pageState = 'normal'
      // },
      // showSelectGoods() {
      //   this.pageState = 'selectGoods'
      // },
      reCalcDtList: function() {
        const data = {
          refresh: 1,
          orderId: this.formData.orderId,
          clearingType: this.formData.clearingType,
          excludeResIds: this.unFeeStockList.map((stock) => stock.id)
        }
        api.dtlist(data)
          .then(response => {
            this.dtList = response.clearingDtList.map((dt) => {
              if (dt.originMachWeight == null && dt.resId != null) {
                // this.$set(dt, 'originMachWeight', dt.machWeight)
                dt.originMachWeight = dt.machWeight
              }
              return dt
            })
            this.newAttachFeeList = response.subjoinfeelist.map(dt => {
              return {
                resId: '',
                subjoinfeeId: dt.id,
                machSpecDes: dt.feeTypeName,
                amount: dt.amount,
                price: dt.price,
                machWeight: dt.num,
                remark: dt.remark
              }
            })
            this.dtList = this.dtList.concat(this.newAttachFeeList)
          }).catch((e) => { console.log(e) })
      },
      calcAmount(row) { // 计算金额
        if (row.machWeight && row.price) {
          row.amount = (parseFloat(row.machWeight) * parseFloat(row.price)).toFixed(2)
        }
      },
      showStocks: function() {
        // 选中排除数据
        if (this.unFeeStockList && this.clearingStocks) {
          this.unFeeStockList.forEach(item => {
            this.clearingStocks.forEach(row => {
              if (item.id === row.id) {
                this.$refs.unFeeStockTable.toggleRowSelection(item, true)
              }
            })
          })
        }
        this.dialogClearingStocksVisible = true
      },
      loadAddData(addData) {
        this.clearData()
        Object.assign(this.formData, addData)
        this.reCalcDtList()

        // 初始化结算料列表
        const data = {
          orderId: this.formData.orderId
        }
        api.unfeereslist(data)
          .then(response => {
            this.clearingStocks = response.resList
          }).catch((e) => {})
      },
      clearData() {
        this.formData = this.defaultData
        this.dtList = [] // 明细
        this.newAttachFeeList = [] // 新增附加费
        this.attachFeeList = [] // 附加费明细
        this.usedBattenList = [] // 木架使用明细
        this.formIsEdit = true
      }
    },
    computed: {
      ...mapGetters(['systemparmMap']),
      tableHeader() {
        const temp = {}
        temp.changeWeight2 = this.dtList
          .reduce((pre, cur) => {
            return pre + parseFloat(cur.changeWeight2)
          }, 0).toFixed(3)
        temp.changeWeight1 = this.dtList.reduce((pre, cur) => {
          return pre + parseFloat(cur.changeWeight1)
        }, 0).toFixed(3)
        temp.changeWeight4 = this.dtList
          .reduce((pre, cur) => {
            return pre + parseFloat(cur.changeWeight4)
          }, 0).toFixed(3)
        temp.changeNum = this.dtList
          .reduce((pre, cur) => {
            return pre + parseFloat(cur.changeNum)
          }, 0)
        return temp
      }
    },
    created() {
      //   if (this.systemparmMap.STORERENT && this.systemparmMap.STORERENT.MACHANGEPRICE) {
      //     this.defaultChangePrice = this.systemparmMap.STORERENT.MACHANGEPRICE
      //   }
      //   if (this.systemparmMap.SYSTEMSET && this.systemparmMap.SYSTEMSET.AUDIT_WITH_PRINT) {
      //     this.checkPrint = this.systemparmMap.SYSTEMSET.AUDIT_WITH_PRINT === '1'
      //   }

      Object.assign(this.formData, this.formData, this.detailData)
      if (this.action === 'add' || this.action === 'update') {
        this.formIsEdit = true
      } else { // 查看
        this.formIsEdit = false
      }

      if (this.action === 'add' && this.formData.orderId) { // 新增
        this.loadAddData(this.formData)
      } else if (this.detailData.id) {
        api.dtlist({ blid: this.detailData.id, refresh: 0 })
          .then(response => {
            this.dtList = response.clearingDtList
          }).catch(e => {
          })
      }

      // 初始化木架使用情况
      api.queryUsedBattenDt({ orderId: this.formData.orderId })
        .then(response => {
          this.usedBattenList = response.usedBattenDts
          // console.log(response)
        }).catch(e => {})

      // 初始化附加费情况
      api.queryAttachFee({ orderId: this.formData.orderId, blId: this.formData.id })
        .then(response => {
          this.attachFeeList = response.feeList
          // console.log(response)
        }).catch(e => {})
      //
      //   if (this.action === 'update' || this.action === 'view') {
      //     Object.assign(this.formData, this.detailData)
      //     const param = {
      //       blid: this.formData.id
      //     }
      //     api
      //       .dtlist(param)
      //       .then(response => {
      //         response.changeDts.forEach((item) => {
      //         }) // 获取table 明细
      //         this.dtList = response.changeDts
      //       })
      //       .catch(error => {
      //         if (error) console.error(error)
      //       })
      //   }
    }
  }
</script>

<style lang="scss" scoped>
  .transferGoods-views {
  }

  .itemsClass2 {
    display: inline-block;
    width: 200px;
    font-size: 12px;
    color: #606266;
    font-weight: 700;
  }

  .sub-action-bar {
    height: 35px;
    line-height: 35px;
    /*button{*/
    /*padding: 0;*/
    /*}*/
  }
</style>
<style lang="scss" >
  .color-red input.el-input__inner{
    color:red !important;
  }
</style>
