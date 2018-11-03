<template>
  <div class="transferGoods-views">
    <div v-show="pageState === 'normal'">
      <div class="btn-group-container">
        <el-row>
          <el-button type='primary' icon="el-icon-close" v-if="action==='add' || action==='update'" @click='returnHome'>取消</el-button>
          <el-button type='primary' icon="el-icon-back" v-else @click='returnHome'>返回</el-button>
          <el-button type='primary' icon="el-icon-check" v-if="action==='add'" @click='addSave'>保存</el-button>
          <el-button type='primary' icon="el-icon-check" v-if="action==='update'" @click='editSave'>保存</el-button>
          <el-button type='primary' icon="el-icon-check" v-if="action==='reviseBills'" @click="saveGd">保存</el-button>
          <el-button type='primary' icon="el-icon-edit" v-if="action==='view' && detailData.status === 0" @click='seeEdit'>修改</el-button>
          <el-button type='primary' icon="el-icon-view" v-if="action==='view' && detailData.status === 1" @click='unaudit'>反审核</el-button>
          <el-button type="primary" @click="toNext('transferGoods')" v-if="action==='view' && detailData.status === 1">过户</el-button>
          <el-button type="primary" @click="toNext('pickUpGoods')" v-if="action==='view' && detailData.status === 1">提货</el-button>
          <el-button type="primary" @click="toNext('machOrder')" v-if="action==='view' && detailData.status === 1">加工</el-button>
          <el-button type='primary' icon="el-icon-printer" v-if="action==='view' && detailData.status === 1" @click='printBill'>打印</el-button>
          <template v-if="action==='add' || action==='update' || (action==='view' && detailData.status === 0)">
            <el-button type='primary' icon="el-icon-view" @click='audit'>审核</el-button>
            <el-checkbox style='margin-left:15px;' v-model='checkPrint'>审核打印</el-checkbox>
          </template>
        </el-row>
      </div>

      <div class="form-wrap">
        <el-form :inline="true" size="small" label-width="80px" :rules="rules" ref="ruleForm" :disabled="!formIsEdit">
          <el-form-item label="单据编号:">
            <el-input v-model="formData.blno" class="input-w-168"  disabled></el-input>
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
            <el-input type="textarea" v-model="formData.remark" class="input-w-694"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="制单人:">
            <span class='itemsClass2'>[{{formData.creatorName}} {{formData.createTime}}]</span>
          </el-form-item>
          <el-form-item label="修改人:">
            <span class='itemsClass2'>[{{formData.editorName}} {{formData.editTime}}]</span>
          </el-form-item>
          <el-form-item label="审核人:">
            <span class='itemsClass2'>[{{formData.checkerName}} {{formData.checkTime}}]</span>
          </el-form-item>
          <el-form-item label="总金额:">
            <span class='itemsClass2'>{{formData.amountSum}}</span>
          </el-form-item>
        </el-form>
      </div>

      <div class="btn-group-container" v-if="(action=='view' && detailData.status === 1) || action=='reviseBills'">
        <el-button type='primary' v-if="action=='view' && detailData.status === 1" @click="modify('reviseBills')" icon="el-icon-edit-outline">改单
        </el-button>
        <el-button type='primary' v-if="action=='reviseBills'" @click="changeGoods" :disabled="bntStatus" icon="el-icon-sort">换货
        </el-button>
      </div>

      <el-table :data="dtList"
                ref="table"
                row-key="fromStockId"
                @header-click="handleHeaderClick"
                @row-dblclick="handleRowDbClick"
                @row-click="handleRowClick"
                @selection-change="handleSelectionChange"
                :header-cell-class-name="setHeaderClass"
                border
                :row-class-name="tableRowClassName" max-height="500"
                >

        <!--增加、修改时显示-->
        <el-table-column  v-if="action === 'add' || action === 'update'" label="+" width="50" fixed>
          <template slot-scope="scope">
            <i class="el-icon-delete" @click="remove(scope.row,scope.$index)"></i>
          </template>
        </el-table-column>

        <!--是否可用 isUsed 表示不可用 控制不显示-->
        <!--<el-table-column sortable type="selection" width="50" :selectable="isUsed"-->
        <!--v-if="(action === 'view' || action === 'reviseBills') && formData.status === 1">-->
        <!--</el-table-column>-->

        <!--改单时显示-->
        <el-table-column sortable type="selection" width="50" :selectable='isUsed'
          v-if="(action === 'reviseBills') && formData.status === 1">
        </el-table-column>
        <el-table-column sortable v-if="action === 'reviseBills'" label="操作" width="50">
          <template slot-scope="scope">
            <i class="el-icon-delete"
               v-if="scope.row.isUsed !== 1 && action === 'reviseBills'"
               @click="remove(scope.row,scope.$index)"></i>
          </template>
        </el-table-column>

        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column sortable label="货物编号" prop="handCode" min-width="120">
          <template slot-scope="scope">
            <span :class="scope.row.isUsed ? 'table-color-red' : ''">{{scope.row.handCode}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable label="钢卷号" prop="steelCode" width="150"></el-table-column>
        <el-table-column sortable label="品名" prop="typeName"></el-table-column>
        <el-table-column sortable label="规格" prop="specName"  width="150"></el-table-column>
        <el-table-column sortable label="产地" prop="parea"></el-table-column>
        <el-table-column sortable label="材质" prop="grade"></el-table-column>
        <el-table-column sortable label="重量结算方式" width="120">
          <template slot-scope="scope">
            <el-select v-model="scope.row.weightFlag"
                       @change="function(){calChangeFee(scope.row);calStoreFee(scope.row)}"
                       v-if="scope.row.fromStockId==currentRow.fromStockId && action!=='view'"
                       filterable size="mini">
              <el-option v-for="item in weightCalc"
                         :value="item.value"
                         :label="item.label"
                         :key="item.value">
              </el-option>
            </el-select>
            <span v-else>
            {{scope.row.weightFlag === 1 ? '过磅净重' :
            scope.row.weightFlag === 2 ? '抄码净重' :
            scope.row.weightFlag === 4 ? '抄码毛重' : ''
            }}</span>
          </template>
        </el-table-column>
        <el-table-column sortable :label="'净重['+ tableHeader.changeWeight2+']'" width="120">
          <template slot-scope="scope">
            <number-input v-model="scope.row.changeWeight2" decimal="10,3"
                          @change="calChangeFee(scope.row)"
                          :min="0"
                          :max="scope.row.maxWeight2"
                          v-if="scope.row.fromStockId==currentRow.fromStockId && !scope.row.isUsed && action!=='view'" size="mini">
            </number-input>
            <span v-else
                  :class="{ active: scope.row.confirmFinish==1}">{{scope.row.changeWeight2}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable :label="'磅重['+ tableHeader.changeWeight1+']'" width="120">
          <template slot-scope="scope">
            <number-input v-model="scope.row.changeWeight1" decimal="10,3"
                          :min="0"
                          :max="scope.row.maxWeight1"
                          @change="calChangeFee(scope.row)"
                          v-if="scope.row.fromStockId==currentRow.fromStockId && !scope.row.isUsed && action!=='view'" size="mini">
            </number-input>
            <span v-else
                  :class="{ active: scope.row.confirmFinish==1}">{{scope.row.changeWeight1}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable :label="'毛重['+ tableHeader.changeWeight4+']'" width="120">
          <template slot-scope="scope">
            <number-input v-model="scope.row.changeWeight4" decimal="10,3"
                          :min="0"
                          :max="scope.row.maxWeight4"
                          @change="calChangeFee(scope.row)"
                          v-if="scope.row.fromStockId==currentRow.fromStockId && !scope.row.isUsed && action!=='view'" size="mini">
            </number-input>
            <span v-else
                  :class="{ active: scope.row.confirmFinish==1}">{{scope.row.changeWeight4}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable :label="'数量['+tableHeader.changeNum+']'" width="100">
          <template slot-scope="scope">
            <number-input v-model="scope.row.changeNum" decimal="10"
                          :min="0"
                          :max="scope.row.maxNum"
                          v-if="scope.row.fromStockId==currentRow.fromStockId && !scope.row.isUsed && action!=='view'" size="mini"
                          @input="changeNum(scope.row)">
            </number-input>
            <span v-else
                  :class="{ active: scope.row.confirmFinish==1}">{{scope.row.changeNum}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable label="转货单价" width="120">
          <template slot-scope="scope">
            <number-input v-model="scope.row.changePrice" decimal="10,2"
                          @change="calChangeFee(scope.row)"
                          v-if="scope.row.fromStockId==currentRow.fromStockId && action!=='view'" size="mini">
            </number-input>
            <span v-else
                  :class="{ active: scope.row.confirmFinish==1}">{{scope.row.changePrice}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable label="仓租单价" width="120">
          <template slot-scope="scope">
            <number-input v-model="scope.row.storeFeePrice" decimal="10,2"
                          @change="calStoreFee(scope.row)"
                          v-if="scope.row.fromStockId==currentRow.fromStockId && action!=='view'"
                          size="mini">
            </number-input>
            <span v-else
                  :class="{ active: scope.row.confirmFinish==1}">{{scope.row.storeFeePrice}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable label="计租天数" width="120">
          <template slot-scope="scope">
            <number-input v-model="scope.row.storeDay" decimal="4"
                          v-if="scope.row.fromStockId==currentRow.fromStockId && action!=='view'"
                          @change="calStoreFee(scope.row)"
                          size="mini">
            </number-input>
            <span v-else :class="{ active: scope.row.confirmFinish==1}">{{scope.row.storeDay}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable :label="'转货金额['+ tableHeader.changeAmount+']'" min-width="160">
          <template slot-scope="scope">
            <number-input v-model="scope.row.changeAmount" decimal="10,2"
                          v-if="scope.row.fromStockId==currentRow.fromStockId && action!=='view'" size="mini">
            </number-input>
            <span v-else
                  :class="{ active: scope.row.confirmFinish==1}">{{scope.row.changeAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable :label="'仓租金额['+ tableHeader.storeFeeAmount+']'" min-width="160">
          <template slot-scope="scope">
            <number-input v-model="scope.row.storeFeeAmount" decimal="10,2"
                          v-if="scope.row.fromStockId==currentRow.fromStockId && action!=='view'"
                          size="mini">
            </number-input>
            <span v-else
                  :class="{ active: scope.row.confirmFinish==1}">{{scope.row.storeFeeAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable label="仓库" min-width="100"  >
          <template slot-scope="scope">
          <span>{{scope.row.storeName + " " + (scope.row.positionRow?scope.row.positionRow + "行":"")
                      + (scope.row.positionColumn?scope.row.positionColumn + "排":"")}}</span>
        </template>
        </el-table-column>
        <el-table-column sortable label="卷面名称" prop="initCuName" min-width="150"></el-table-column>
        <el-table-column sortable label="单位" prop="unit" width="120"></el-table-column>
        <el-table-column sortable label="外观描述" prop="showDes" min-width="120"></el-table-column>
        <el-table-column sortable label="备注" prop="remark"></el-table-column>
      </el-table>

      <!--<Common-table ref='commonTable' :dtList='dtList' @changeView="change" :formData="formData"-->
      <!--:isEdit='itemIsEdit' :model="action"></Common-table>-->
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
  import * as api from '@/api/warehousing/transferGoods/transferGoods'
  import * as common from '@/utils'
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
        formData: {
          bldate: common.getNowFormatMinTime(), // 制单时间
          dtList: [], // 明细数据集合
          dtDelList: [], // 删除列表
          fromCustId: '',
          toCustId: '',
          payMode: '',
          payType: '',
          faxReceiveId: '',
          faxType: '',
          exchangeBntStatus: true // 换货按扭状态
        },
        defaultData: {
          bldate: common.getNowFormatMinTime(), // 制单时间
          dtList: [], // 明细数据集合
          dtDelList: [], // 删除列表
          fromCustId: '',
          toCustId: '',
          payMode: '',
          payType: '',
          faxReceiveId: '',
          faxType: '',
          exchangeBntStatus: true // 换货按扭状态
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
          { label: '抄码净重', value: 2 },
          { label: '抄码毛重', value: 4 },
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
        const that = this
        if (that.action === 'reviseBills') {
          for (let i = 0; i < this.selectionList.length; i++) {
            if (this.selectionList[i].id === row.id) {
              return 'table-select-bgcolor pointer text-center tab-ellipsis'
            }
          }
        }
        return 'pointer text-center tab-ellipsis'
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
      addSave(func, isAudit) {
        this.formData.dtList = this.dtList
        api
          .add(this.formData, isAudit)
          .then(response => {
            if (typeof func === 'function') {
              func(response.obj.id)
            } else {
              this.$parent.getList()
              this.returnHome()
            }
          })
          .catch(error => {
            if (error) console.error(error)
          })
      },
      editSave(func, isAudit) {
        // 修改保存
        this.formData.dtList = this.dtList
        api
          .update(this.formData, isAudit)
          .then(response => {
            if (typeof func === 'function') {
              func(response.obj.id)
            } else {
              this.$parent.getList()
              this.returnHome()
            }
          })
          .catch(error => {
            if (error) console.error(error)
          })
      },
      returnHome() {
        if (this.action === 'reviseBills') {
          this.$emit('changeAction', 'view')
          this.getDtList()
        } else {
          if (this.dtList.length > 0) {
            // 解锁锁定货物
            const param = []
            for (let i = 0; i < this.dtList.length; i++) {
              param.push(this.dtList[i].fromStockId)
            }
            this.lockGood(1, param)
          }
          this.$emit('hideViews')
        }
      },
      seeEdit() {
        this.formIsEdit = true
        this.$emit('changeAction', 'update')
      },
      change(params) {
        this.pageState = params.path
      },
      // 添加选择的货物
      async addGoods(data) {
        // outWeight2：净重
        // outWeight1：磅重
        // outWeight4: 毛重
        // price : 出仓单价 <=== api.outPrice
        // storeFeePrice ：仓租单价 <=== api.feeInfo
        // amount ： 出仓金额
        // storeFeeAmount： 仓租金额
        // outNum：出仓数量

        // ======> 查仓租单价以及计租天数
        const stockidsArr = []
        data.map(item => {
          stockidsArr.push(item.id)
        })
        // const feeInfoParam = {
        //   stockids: stockidsArr.join(','),
        //   custId: this.formData.fromCustId,
        //   bldate: this.formData.bldate,
        //   storeId: this.formData.storeId
        // }
        // await api.mastorefeeinfo(feeInfoParam).then(res => {
        //   res.storefeeList.forEach(matchItem => {
        //     data.forEach(selectItem => {
        //       if (selectItem.id === matchItem.stockid) {
        //         selectItem.storeDay = matchItem.storeday
        //         selectItem.storeFeePrice = matchItem.price
        //       }
        //     })
        //   })
        // })

        // 格式化selectionList
        //   const newArr = []
        if (data && data.length > 0) {
          const stockIds = []

          for (let i = 0; i < data.length; i++) {
            const temp = {
              handCode: data[i].handCode,
              steelCode: data[i].steelCode,
              typeName: data[i].typeName,
              specName: data[i].specName,
              parea: data[i].parea,
              grade: data[i].grade,
              weightFlag: 2, // 默认抄码净重
              changeWeight1: data[i].validWeight1 ? data[i].validWeight1 : 0,
              changeWeight2: data[i].validWeight2 ? data[i].validWeight2 : 0,
              changeWeight4: data[i].validWeight4 ? data[i].validWeight4 : 0,
              changeNum: data[i].validNum ? data[i].validNum : 0,
              maxWeight1: data[i].validWeight1 ? data[i].validWeight1 : 0,
              maxWeight2: data[i].validWeight2 ? data[i].validWeight2 : 0,
              maxWeight4: data[i].validWeight4 ? data[i].validWeight4 : 0,
              maxNum: data[i].num ? data[i].validNum : 0,
              changePrice: this.defaultChangePrice,
              storeFeePrice: data[i].dayPrice ? data[i].dayPrice : 0, // 仓租单价
              storeDay: data[i].storeDay ? data[i].storeDay : 0, // 计租天数
              changeAmount: 0,
              storeFeeAmount: 0,
              storeName: data[i].storeName,
              initCuName: data[i].initCuName,
              unit: data[i].unit,
              showDes: data[i].showDes,
              remark: data[i].remark,
              fromStockId: data[i].id,
              positionColumn: data[i].positionColumn,
              positionRow: data[i].positionRow
            }
            this.calChangeFee(temp)
            this.calStoreFee(temp)
            if (this.dtList.length) {
              // dtList 中是否存在
              if (!this.checkRepeat(this.dtList, temp.fromStockId)) { // 不存在
                stockIds.push(data[i].id)
                this.dtList.push(temp)
              }
            } else {
              stockIds.push(data[i].id)
              this.dtList.push(temp)
            }
          }
          // this.dtList = [...new Set(newArr)]
          // console.log(data)

          // 锁定本次选择的货物
          this.lockGood(0, stockIds)
        }
      },
      checkRepeat(list, fromStockId) {
        let isRepeat = false
        for (let i = 0; i < list.length; i++) {
          if (list[i].fromStockId === fromStockId) {
            isRepeat = true
            break
          }
        }
        return isRepeat
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
      // btn - 改单
      // changeCondition() {
      //   //   const that = this
      //   this.buttonDisplay = 'seeAuditGd'
      //   // this.action = 'yshgd'
      //
      //   this.formData = this.detailData
      //   const param = {
      //     blid: this.formData.id
      //   }
      //   // api.dtlistforaudit(param).then(response => {
      //   //   this.dtList = response.changeDts // 获取table 明细
      //   //   // console.log(response)
      //   // })
      //   //   .catch(error => {
      //   //     if (error) console.error(error)
      //   //   })
      //   api
      //     .dtlist(param)
      //     .then(response => {
      //       this.dtList = response.changeDts // 获取table 明细
      //       // console.log(this.dtList)
      //     })
      //     .catch(error => {
      //       if (error) console.error(error)
      //     })
      // },
      modify(val) {
        this.$emit('changeAction', val)
      },
      // 锁定、解锁货物 revert==0锁定
      lockGood(revert, stockIds) {
        if (stockIds && stockIds.length > 0) {
          const requestData = {
            revert: revert,
            stockIds: stockIds.join(',')
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
        const that = this
        if (that.action === 'add') {
          that.addSave(function(blid) {
            // 打印
            if (that.checkPrint === true) {
              that.$parent.printBill(blid)
            }
            that.$parent.getList()
            that.returnHome()
          }, true)
        } else if (that.action === 'update') {
          that.editSave(function(blid) {
            // 打印
            if (that.checkPrint === true) {
              that.$parent.printBill(blid)
            }
            that.$parent.getList()
            that.returnHome()
          }, true)
        } else {
          that.$parent.audit(that.checkPrint)
        }
      },
      // btn - 反审核
      unaudit() {
        this.$parent.unaudit()
      },
      toNext(moduleCode) {
        const that = this
        if (this.formData && this.formData.id && this.formData.status > 0) {
          api.dtStocklist({ blid: this.formData.id })
            .then(response => {
              if (moduleCode === 'transferGoods') {
                this.$parent.action = 'add'
                this.formData = {
                  'custId': response.mastocks && response.mastocks.length > 0 ? response.mastocks[0].custId : '',
                  'stockList': response.mastocks && response.mastocks.length > 0 ? response.mastocks : ''
                }
                this.loadData(this.formData)
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
          this.lockGood(1, [item.fromStockId])
        }).catch(() => {
        })
      },
      handleRowClick(row, event, column) {
        if ((this.action === 'view' || this.action === 'reviseBills') && this.formData.status === 1 && !row.isUsed) {
          clearTimeout(this.clickTimer) // 取消上次延时未执行的方法
          this.clickTimer = setTimeout(() => {
            this.$refs.table.toggleRowSelection(row)
          }, 250)
        }
        // if (this.action === 'reviseBills') { // 改单
        //   clearTimeout(this.clickTimer) // 取消上次延时未执行的方法
        //   this.clickTimer = setTimeout(() => {
        //     this.$refs.table.toggleRowSelection(row)
        //   }, 250)
        // }
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
      handleSelectionChange(val) {
        this.selectionList = val
      },
      toGoodsFlow(row) {
        this.$router.push({ path: findPathByModuleCode('stockLog'), query: { handCode: row.handCode }})
      },
      // table - 重量结算方式
      selectChange(val, index) {
        this.dtList[index].weightFlag = val
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
      calChangeFee: function(row) {
        let weight = 0
        if (row.weightFlag == null || row.weightFlag === 2) {
          weight = row.changeWeight2
          row.weightFlag = 2
        } else if (row.weightFlag === 1) {
          weight = row.changeWeight1
        } else if (row.weightFlag === 4) {
          weight = row.changeWeight4
        }
        // 转货金额 = 结算重量 x转货单价
        const temp = parseFloat(row.changePrice) * parseFloat(weight)
        row.changeAmount = temp.toFixed(3)
        // 重算仓租费
        this.calStoreFee(row)
      },
      calStoreFee: function(row) {
        // 仓租金额 = 结算重量 x 仓租单价 x 天数
        let weight = 0
        if (row.weightFlag == null || row.weightFlag === 2) {
          weight = row.changeWeight2
          row.weightFlag = 2
        } else if (row.weightFlag === 1) {
          weight = row.changeWeight1
        } else if (row.weightFlag === 4) {
          weight = row.changeWeight4
        }
        const temp2 = parseFloat(weight) * parseFloat(row.storeFeePrice) * parseFloat(row.storeDay)
        row.storeFeeAmount = temp2.toFixed(3)
      },
      payModeChange(payMode) {
        // console.log(payMode)
        this.$set(this.formData, 'payMode', payMode)
      },
      printBill() {
        // 打印
        this.$parent.printBill(this.formData.id)
      },
      changeNum(row) {
        if (row.changeNum) {
          row.changeWeight1 = Number(row.maxWeight1 / row.maxNum * row.changeNum).toFixed(3)
          row.changeWeight2 = Number(row.maxWeight2 / row.maxNum * row.changeNum).toFixed(3)
          row.changeWeight4 = Number(row.maxWeight4 / row.maxNum * row.changeNum).toFixed(3)
        }
      },
      loadData(detailData) {
        this.formIsEdit = true
        this.formData = this.defaultData
        this.dtList = []
        console.log(detailData)
        if (detailData && detailData.custId && detailData.stockList) {
          this.formData.fromCustId = detailData.custId
          this.addGoods(detailData.stockList)
        }
        // 传真信息添加关联
        if (detailData && detailData.custId && detailData.faxId) {
          this.formData.fromCustId = detailData.custId
          this.formData.faxReceiveId = detailData.faxId
          this.formData.faxType = detailData.faxType
        }
      },
      getDtList() {
        const param = {
          blid: this.formData.id
        }
        api
          .dtlist(param)
          .then(response => {
            response.changeDts.forEach((item) => {
            }) // 获取table 明细
            this.dtList = response.changeDts
          })
          .catch(error => {
            if (error) console.error(error)
          })
      }
    },
    computed: {
      ...mapGetters(['systemparmMap']),
      bntStatus() {
        if (this.selectionList.length) {
          this.exchangeBntStatus = false
        } else {
          this.exchangeBntStatus = true
        }
        return this.exchangeBntStatus
      },
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
        temp.changeAmount = this.dtList
          .reduce((pre, cur) => {
            return pre + parseFloat(cur.changeAmount)
          }, 0)
          .toFixed(2)
        temp.storeFeeAmount = this.dtList
          .reduce((pre, cur) => {
            return pre + parseFloat(cur.storeFeeAmount)
          }, 0)
          .toFixed(2)
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
        this.loadData(this.detailData)
      } else {
        this.formIsEdit = false
      }

      if (this.action === 'update' || this.action === 'view') {
        Object.assign(this.formData, this.detailData)
        this.getDtList()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../styles/variables';

  .transferGoods-views {
    .itemsClass2 {
      display: inline-block;
      width: 200px;
      font-size: 12px;
      color: #606266;
      font-weight: 700;
    }
  }

  /*.el-table--enable-row-hover .el-table__body tr:hover>td{*/
    /*background: #000;*/
  /*}*/
</style>
