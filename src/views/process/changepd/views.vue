<template>
  <div class="transferGoods-views">
    <!--    <div class="color-red">
          <div>pageState {{pageState}}</div>
          <div>action {{action}}</div>
        </div>-->
    <!--detailData {{detailData}}-->
    <!--selection {{selectionList}}-->
    <!--{{formData.dtDelList}}-->
    <div v-if="pageState === 'normal'">
      <div class="btn-group-container">
        <el-row>
          <el-button type='primary' @click='cancel' icon= "el-icon-back" v-if="action=='view'">返回</el-button>
          <el-button type='primary' @click='cancel' icon= "el-icon-close" v-else>取消</el-button>
          <el-button type='primary' v-if="action=='add'" @click='addSave' icon= "el-icon-plus">保存</el-button>
          <el-button type='primary' v-if="action=='add'" @click="addAndAudit" icon="el-icon-edit-outline">审核</el-button>
          <el-button type='primary' v-if="action=='update'" @click='editSave' icon="el-icon-edit-outline">保存</el-button>
          <el-button type='primary' v-if="action=='update'" @click="updateAndAudit" icon="el-icon-edit-outline">审核</el-button>
          <el-button type='primary' v-if="action=='reviseBills'" @click="saveGd">保存</el-button>
          <el-button type='primary' v-if="action=='view' && detailData.status === 0" @click='seeEdit' icon="el-icon-edit-outline">修改</el-button>
          <el-button type='primary' v-if="action=='view' && detailData.status === 0" @click='audit'>审核</el-button>
          <el-button type='primary' v-if="action=='view' && detailData.status === 1" @click='unaudit'>反审核</el-button>
          <el-button type='primary' v-if="action=='view' && detailData.status === 1" @click='$parent.printBill()' icon= "el-icon-printer">打印</el-button>
          <el-checkbox style='margin-left:15px;'  v-model='checkPrint' v-if="detailData.status === 0">
            审核打印
          </el-checkbox>
        </el-row>
      </div>

      <div class="form-wrap">
        <el-form :inline="true" size="small" label-width="80px" :rules="rules" ref="ruleForm" :disabled="!formIsEdit">
          <el-form-item label="单据编号:">
            <el-input v-model="formData.blno" disabled class="input-w-168"></el-input>
          </el-form-item>
          <el-form-item label="原客户:" prop="fromCustId">
            <customer-select v-model="formData.fromCustId" :disabled="dtList.length>0"></customer-select>
          </el-form-item>
          <el-form-item label="新客户:">
            <customer-select v-model="formData.toCustId"></customer-select>
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
            <customer-select v-model="formData.payType" @payModeChange="payModeChange"></customer-select>
          </el-form-item>
          <el-form-item label="付款方式:">
            <pay-mode-select v-model="formData.payMode"></pay-mode-select>
          </el-form-item>
          <br>
          <el-form-item label="备注:">
            <el-input type="textarea" v-model="formData.remark"  class="input-w-694"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="制单人:">
            <span class='itemsClass2'>[ {{formData.creatorName}} {{formData.createTime}} ]</span>
          </el-form-item>
          <el-form-item label="修改人:">
            <span class='itemsClass2 '>[ {{formData.editorName}} {{formData.editTime}} ]</span>
          </el-form-item>
          <el-form-item label="审核人:">
            <span class='itemsClass2 '>[ {{formData.checkerName}} {{formData.checkTime}} ]</span>
          </el-form-item>
          <el-form-item label="总金额:">
            <span class='itemsClass2'>{{formData.amountSum}}</span>
          </el-form-item>
        </el-form>
      </div>

      <!--<div class="btn-group-container">-->
        <!--<el-button type='primary' v-if="action=='view' && detailData.status === 1" @click="modify('reviseBills')">改单-->
        <!--</el-button>-->
        <!--<el-button type='primary' v-if="action=='reviseBills'" @click="changeGoods">换货-->
        <!--</el-button>-->
      <!--</div>-->

      <el-table :data="dtList"
                ref="table"
                row-key="fromStockId"
                @header-click="handleHeaderClick"
                @row-dblclick="handleRowDbClick"
                @row-click="handleRowClick"
                @selection-change="handleSelectionChange"
                border :header-cell-class-name="setHeaderClass"
                stripe height="545"
                :row-class-name="tableRowClassName" max-height="500"
                >

        <!--增加、修改时显示-->
        <el-table-column v-if="action === 'add' || action === 'update'" label="+" width="50" fixed>
          <template slot-scope="scope">
            <i class="el-icon-delete" @click="remove(scope.row,scope.$index)"></i>
          </template>
        </el-table-column>

        <!--是否可用 isUsed 表示不可用 控制不显示-->
        <el-table-column type="selection" width="50" :selectable="isUsed"
                         v-if="(action === 'view' || action === 'reviseBills') && formData.status === 1">
        </el-table-column>

        <!--改单时显示-->
        <el-table-column v-if="action === 'reviseBills'" label="操作" width="50">
          <template slot-scope="scope">
            <i class="el-icon-delete"
               v-if="scope.row.isUsed !== 1 && action === 'reviseBills'"
               @click="remove(scope.row,scope.$index)"></i>
          </template>
        </el-table-column>

        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column sortable label="货物编号" prop="handCodes" min-width="150" ></el-table-column>
        <el-table-column sortable label="钢卷号" prop="steelCodes" min-width="150" ></el-table-column>
        <el-table-column sortable label="包装备注" prop="remark" min-width="100"></el-table-column>
        <el-table-column sortable label="库位" prop="position" min-width="120"></el-table-column>
        <el-table-column sortable label="原料规格组成" prop="specAllMa" min-width="120"></el-table-column>
        <el-table-column sortable label="成品规格组成" prop="specAllPd" min-width="120"></el-table-column>
        <el-table-column sortable label="重量结算方式" width="120">
          <template slot-scope="scope">
            <el-select v-model="scope.row.weightFlag"
                       @change="calStoreFee(scope.row)"
                       v-if="scope.row.fromPackId==currentRow.fromPackId"
                       filterable size="mini">
              <el-option v-for="item in weightCalc"
                         :value="item.value"
                         :label="item.label"
                         :key="item.value">
              </el-option>
            </el-select>
            <span v-else>
            {{scope.row.weightFlag === 1 ? '过磅净重' :
            scope.row.weightFlag === 5 ? '理算重量':''}}
            </span>
          </template>
        </el-table-column>
        <el-table-column sortable :label="'理算重量['+ tableHeader.changeWeight5+']'" prop="weight" min-width="140">
        </el-table-column>
        <el-table-column sortable :label="'过磅净重['+ tableHeader.changeWeight1+']'" prop="weight1" min-width="140"></el-table-column>
        <el-table-column sortable :label="'包装数量['+ tableHeader.changeNum+']'" prop="num" min-width="120"></el-table-column>
        <el-table-column sortable label="仓租单价" min-width="100">
          <template slot-scope="scope">
            <number-input v-model="scope.row.storeFeePrice" decimal="10,2"
                          @change="calStoreFee(scope.row)"
                          v-if="scope.row.fromPackId==currentRow.fromPackId"
                          size="mini">
            </number-input>
            <span v-else>{{scope.row.storeFeePrice}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable label="计租天数" min-width="100">
          <template slot-scope="scope">
            <number-input v-model="scope.row.storeDay" decimal="4"
                          v-if="scope.row.fromPackId==currentRow.fromPackId"
                          @change="calStoreFee(scope.row)"
                          size="mini">
            </number-input>
            <span v-else >{{scope.row.storeDay}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable :label="'仓租金额['+ tableHeader.storeFeeAmount+']'" min-width="140">
          <template slot-scope="scope">
            <number-input v-model="scope.row.storeFeeAmount" decimal="10,2"
                          v-if="scope.row.fromPackId==currentRow.fromPackId"
                          size="mini">
            </number-input>
            <span v-else>{{scope.row.storeFeeAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable label="包装编号" prop="packNo" min-width="140"></el-table-column>
        <el-table-column sortable label="加工客户" prop="machCuName" min-width="100"></el-table-column>
      </el-table>

    </div>
    <div v-if="pageState ==='selectGoods'">
      <select-goods-page ref="selectGoods"
                         :pageState='pageState'
                         :changeGoodsNum="selectGoodsNum"
                         @hideSelectGoods="hideSelectGoods"
                         @addGoods="addGoods"
                         :formData="formData"></select-goods-page>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import numberInput from '@/components/numberInput'
  import storeSelect from '@/components/storeSelect'
  import selectGoodsPage from './selectGoods'
  import customerSelect from '@/components/customerSelect'
  // import CommonTable from './CommonTable'
  import payModeSelect from '@/components/payModeSelect'
  import * as api from '@/api/process/changepd/changepd'
  import * as commom from '@/utils'
  import { findPathByModuleCode } from '@/utils'

export default {
    props: {
      action: String,
      detailData: Object
    },
    components: {
      storeSelect,
      customerSelect,
      // CommonTable,
      selectGoodsPage,
      payModeSelect,
      numberInput
    },
    data() {
      return {
        defaultChangePrice: 0,
        checkPrint: false,
        formIsEdit: Boolean,
        oldCustomer: {},
        newCustomer: {},
        formData: {
          amountSum: 0,
          weightSum: 0,
          numSum: 0,
          fromCustId: '',
          toCustId: '',
          bldate: commom.getNowFormatMinTime(), // 制单时间
          dtList: [], // 明细数据集合
          dtDelList: [], // 删除列表
          faxReceiveId: '',
          faxType: ''
        },
        dtList: [],
        pageState: 'normal',
        rules: {
          fromCustId: [
            { required: true, message: '客户不能为空', trigger: 'blur' }
          ]
        },
        selectGoodsNum: 0,
        // === table
        weightCalc: [
          { label: '理算重量', value: 5 },
          { label: '过磅净重', value: 1 }
        ],
        selectionList: [],
        currentRow: {},
        toggleRowSelection: false, // 双击不让选中的标志
        clickTimer: null // 判断单击双击的计时器

      }
    },
    methods: {
      tableRowClassName({ row, rowIndex }) {
        for (let i = 0; i < this.selectionList.length; i++) {
          if (this.selectionList[i].id === row.id) {
            return 'table-select-bgcolor pointer text-center tab-ellipsis'
          }
        }
        return 'pointer text-center tab-ellipsis'
      },
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
                param.push(that.dtList[i].fromPackId)
              }
              that.lockGood(1, param)
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
            if (that.dtList.length > 0) {
              // 解锁锁定货物
              const param = []
              for (let i = 0; i < that.dtList.length; i++) {
                param.push(that.dtList[i].fromPackId)
              }
              that.lockGood(1, param)
            }
            this.detailData.id = response.obj.id
            if (this.checkPrint) {
              this.$parent.printBill()
            }
            that.$emit('hideViews')
            this.$parent.getList()
          })
          .catch(error => {
            if (error) console.error(error)
          })
      },
      payModeChange(payMode) {
        this.$set(this.formData, 'payMode', payMode)
      },
      editSave() {
        // 修改保存
        const that = this
        this.formData.dtList = this.dtList
        api
          .update(this.formData)
          .then(response => {
            if (that.dtList.length > 0) {
              // 解锁锁定货物
              const param = []
              for (let i = 0; i < that.dtList.length; i++) {
                param.push(that.dtList[i].fromPackId)
              }
              that.lockGood(1, param)
            }
            that.$emit('hideViews')
            this.$parent.getList()
          })
          .catch(error => {
            if (error) console.error(error)
          })
      },
      updateAndAudit() {
        // 修改保存
        const that = this
        this.formData.dtList = this.dtList
        api
          .updateAndAudit(this.formData)
          .then(response => {
            if (that.dtList.length > 0) {
              // 解锁锁定货物
              const param = []
              for (let i = 0; i < that.dtList.length; i++) {
                param.push(that.dtList[i].fromPackId)
              }
              that.lockGood(1, param)
            }
            if (this.checkPrint) {
              this.$parent.printBill()
            }
            that.$emit('hideViews')
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
            param.push(this.dtList[i].fromPackId)
          }
          this.lockGood(1, param)
        }
        this.$emit('hideViews')
      },
      seeEdit() {
        this.formIsEdit = true
        this.$emit('changeAction', 'update')
      },
      change(params) {
        console.log(params)
        this.pageState = params.path
      },
      // 添加选择的货物
      async addGoods(data) {
        const packIdsArr = []
        data.map(item => {
          packIdsArr.push(item.id)
        })
        const feeInfoParam = {
          pdPackIds: packIdsArr.join(','),
          custId: this.formData.fromCustId,
          bldate: this.formData.bldate,
          storeId: this.formData.storeId
        }
        await api.getStoreFeeDtFromPdPack(feeInfoParam).then(res => {
          res.storefeeList.forEach(matchItem => {
            data.forEach(selectItem => {
              if (selectItem.id === matchItem.packId) {
                selectItem.storeDay = matchItem.storeDay
                selectItem.storeFeePrice = matchItem.price
              }
            })
          })
        })

        // 格式化selectionList
        //   const newArr = []
        if (data && data.length > 0) {
          const packIds = []
          for (let i = 0; i < data.length; i++) {
            if (this.isExits(data[i].id)) { continue }
            const temp = {
              packNo: data[i].packNo,
              handCodes: data[i].handCodes,
              steelCodes: data[i].steelCodes,
              remark: data[i].remark,
              specAllPd: data[i].specAllPd,
              specAllMa: data[i].specAllMa,
              weightFlag: (data[i].weightFlag === 1 || data[i].weightFlag === 5) ? data[i].weightFlag : 5,
              weight1: data[i].weight1 ? data[i].weight1 : 0,
              weight: data[i].weight ? data[i].weight : 0,
              num: data[i].num ? data[i].num : 0,
              changePrice: 0,
              changeAmount: 0,
              storeFeePrice: data[i].storeFeePrice ? data[i].storeFeePrice : 0, // 仓租单价
              storeDay: data[i].storeDay ? data[i].storeDay : '', // 计租天数
              storeFeeAmount: 0,
              position: data[i].position,
              fromPackId: data[i].id,
              machCuName: data[i].machCuName
            }

            packIds.push(data[i].id)
            this.dtList.push(temp)
          }
          // 计算每一行的仓租金额
          this.dtList.forEach((item) => {
            this.calStoreFee(item)
          })
          this.formData.amountSum = this.tableHeader.storeFeeAmount
          // 锁定本次选择的货物
          this.lockGood(0, packIds)
        }
      },
      // 判断货物是否已存在dtlist里面
      isExits(id) {
        for (let i = 0; i < this.dtList.length; i++) {
          if (id === this.dtList[i].fromPackId) {
            return true
          }
        }
        return false
      },
      // btn - 换货
      changeGoods() {
        this.selectGoodsNum = this.selectionList.length
        if (this.selectGoodsNum === 0) {
          this.$alert('请选择货物', '温馨提示', { type: 'warning' })
          return
        }
        this.pageState = 'selectGoods'
        // this.change({ path: 'selectGoods' })
      },
      modify(val) {
        this.$emit('changeAction', val)
      },
      // 锁定、解锁货物 revert==0锁定
      lockGood(revert, packIds) {
        if (packIds && packIds.length > 0) {
          const requestData = {
            revert: revert,
            packIds: packIds.join(',')
          }
          api.lock(requestData).then(() => {
            // alert(revert)
          }).catch(error => {
            if (error) console.error(error)
          })
        }
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
          if (
            !this.formData.fromCustId ||
            this.formData.fromCustId === ''
          ) {
            this.$alert('货主不能为空', '提示', {
              confirmButtonText: '确定'
            })
            return
          }
          this.change({ path: 'selectGoods' })
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
          this.lockGood(1, [item.fromPackId])
        })
      },
      setHeaderClass({ row, column, rowIndex, columnIndex }) { // 设置表头类
        if (columnIndex === 0) {
          if (row[0].label === '+') {
            return 'table-header-bg text-center pointer table-add-icon'
          }
          return 'table-header-bg text-center pointer tab-ellipsis'
        } else {
          return 'table-header-bg text-center tab-ellipsis'
        }
      },
      handleRowClick(row, event, column) {
        if (this.action === 'reviseBills' || this.action === 'view') { // 改单
          clearTimeout(this.clickTimer) // 取消上次延时未执行的方法
          this.clickTimer = setTimeout(() => {
            this.$refs.table.toggleRowSelection(row)
          }, 250)
        }
      },
      handleRowDbClick(row, event, column) {
        clearTimeout(this.clickTimer)
        // 双击修改
        if (this.action === 'add' || this.action === 'reviseBills' || this.action === 'update') {
          if (column.label !== '+') {
            this.currentRow = row
          }
        } else {
          this.toGoodsFlow(row)
        }
      },
      toGoodsFlow(row) {
        this.$router.push({ path: findPathByModuleCode('stockLog'), query: { handCode: row.handCodes }})
      },
      handleSelectionChange(val) {
        this.selectionList = val
      },
      // btn - 改单保存
      saveGd() {
        this.formData.dtList = this.dtList
        api.updateforaudit(this.formData).then((res) => {
          // this.change({ path: 'home' })
          this.$parent.getList()
          this.$emit('hideViews') // 跳转回首页
        }).catch(error => {
          throw new Error(error)
        })
      },
      selectable(row) { // 是否可选
        return !row.isUsed
      },
      isUsed(row) {
        return !row.isUsed
      },
      hideSelectGoods() {
        this.pageState = 'normal'
      },
      showSelectGoods() {
        this.pageState = 'selectGoods'
      },
      calStoreFee: function(row) {
        let weight = 0
        if (row.weightFlag === 1) {
          weight = row.weight1
        } else if (row.weightFlag === 5) {
          weight = row.weight
        }
        let storeDay = row.storeDay
        if (row.storeDay === '' || row.storeDay === null) {
          storeDay = 0
        }
        // 仓租金额 = 仓租单价 x 天数
        let temp = parseFloat(row.storeFeePrice) * parseFloat(storeDay) * parseFloat(weight)
        temp = isNaN(temp) ? 0 : temp
        row.storeFeeAmount = temp.toFixed(2)
      }
    },
    computed: {
      ...mapGetters(['systemparmMap']),
      tableHeader() {
        const temp = {}
        temp.changeWeight1 = this.dtList.reduce((pre, cur) => {
          if (!isNaN(cur.weight1) && cur.weight1 !== null) {
            return pre + parseFloat(cur.weight1)
          } else {
            return pre
          }
        }, 0).toFixed(3)
        temp.changeWeight5 = this.dtList
          .reduce((pre, cur) => {
            if (!isNaN(cur.weight) && cur.weight !== null) {
              return pre + parseFloat(cur.weight)
            } else {
              return pre
            }
          }, 0).toFixed(3)
        temp.changeNum = this.dtList
          .reduce((pre, cur) => {
            if (!isNaN(cur.num) && cur.num !== null) {
              return pre + parseFloat(cur.num)
            } else {
              return pre
            }
          }, 0)
        temp.storeFeeAmount = this.dtList
          .reduce((pre, cur) => {
            if (!isNaN(cur.storeFeeAmount) && cur.storeFeeAmount !== null) {
              return pre + parseFloat(cur.storeFeeAmount)
            } else {
              return pre
            }
          }, 0).toFixed(2)
        this.formData.amountSum = temp.storeFeeAmount
        this.formData.weightSum = temp.changeWeight5
        this.formData.numSum = temp.changeNum
        return temp
      }
    },
    created() {
      if (this.systemparmMap.STORERENT && this.systemparmMap.STORERENT.MACHANGEPRICE) {
        this.defaultChangePrice = this.systemparmMap.STORERENT.MACHANGEPRICE
      }
      if (this.systemparmMap.SYSTEMSET && this.systemparmMap.SYSTEMSET.AUDIT_WITH_PRINT) {
        this.checkPrint = this.systemparmMap.SYSTEMSET.AUDIT_WITH_PRINT === '1'
      }
      if (this.action === 'add' || this.action === 'update') {
        this.formIsEdit = true
        if (this.detailData && this.detailData.custId && this.detailData.stockList) {
          this.formData.fromCustId = this.detailData.custId
          this.addGoods(this.detailData.stockList)
        }
        // 传真信息添加关联
        if (this.detailData && this.detailData.custId && this.detailData.faxId) {
          this.formData.fromCustId = this.detailData.custId
          this.formData.faxReceiveId = this.detailData.faxId
          this.formData.faxType = this.detailData.faxType
        }
      } else {
        this.formIsEdit = false
      }

      if (this.action === 'update' || this.action === 'view') {
        Object.assign(this.formData, this.detailData)
        api
          .dtlist(this.formData.id)
          .then(response => {
            response.changeDts.forEach((item) => {
            }) // 获取table 明细
            this.dtList = response.changeDts
            this.formData.amountSum = this.tableHeader.storeFeeAmount
            this.formData.weightSum = this.tableHeader.changeWeight5
            this.formData.numSum = this.tableHeader.changeNum
          })
          .catch(error => {
            if (error) console.error(error)
          })
      }
    }
  }
</script>

<style scoped>
  .transferGoods-views {
  }

  .itemsClass2 {
    display: inline-block;
    width: 200px;
    font-size: 12px;
    color: #606266;
    font-weight: 700;
  }
</style>
