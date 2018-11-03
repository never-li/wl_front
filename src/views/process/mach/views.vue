<template>
  <div>
    <div v-show="pageState === 'normal'">
      <div class="btn-group-container">
        <!--新增、修改-->
        <div v-if="action === 'add' || action === 'update'">
          <el-button type="primary" @click="$emit('hideViews')" icon="el-icon-close">取消</el-button>
          <el-button type="primary" @click="save('hide')" icon= "el-icon-check" >保存</el-button>
          <el-button type="primary" @click="save('audit')">审核</el-button>
          <el-checkbox class="ml-15" v-model="checkPrint">审核打印</el-checkbox>
        </div>

        <!--详情-->
        <div v-if="action === 'view'">
          <el-button type="primary" @click="$emit('hideViews')" icon="el-icon-back">返回</el-button>
          <el-button type="primary" v-if="formData.status === 0" @click="modify('update')" icon="el-icon-edit-outline" >修改</el-button>
          <el-button type="primary" v-if="formData.status === 0" @click="audit">审核</el-button>
          <el-checkbox class="ml-15" v-if="formData.status === 0" v-model="checkPrint">审核打印</el-checkbox>
          <el-button type="primary" v-if="formData.status === 1" @click="audit">反审核</el-button>
          <el-button type="primary" v-if="formData.status === 1" @click="close">确认</el-button>
          <el-button type="primary" v-if="formData.status === 2" @click="close">反确认</el-button>
          <el-button type="primary" v-if="formData.status === 1 || formData.status === 2" @click="printBill" icon= "el-icon-printer">打印</el-button>
          <el-button type="primary" v-if="formData.status === 1 || formData.status === 2" @click="machClearing">结算({{clearingNum}}/{{clearingNumSum}})</el-button>
          <!-- <el-button type="primary" v-if="formData.status === 1">选货打印</el-button> -->
        </div>
      </div>
      <el-container>
        <el-main>

        <!--form-->
      <div class="form-wrap">
        <el-form :inline="true" size="mini" label-width="110px" :model="formData" ref="form" :rules="rules"
                  :disabled="action === 'view'">
          <el-form-item label="单据编号">
            <el-input v-model="formData.blno" disabled class="input-w-168"></el-input>
          </el-form-item>
          <el-form-item label="单据日期" prop="bldate">
            <el-date-picker
              v-model="formData.bldate"
              type="datetime"
              class="w-184"
              value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="预计提货时间" prop="estimatedTime">
            <el-date-picker
              v-model="formData.estimatedTime"
              type="datetime"
              class="w-184"
              value-format="yyyy-MM-dd" format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
            <el-select v-model="formData.timeSection">
                <el-option value="上午" label="上午"></el-option>
                <el-option value="下午" label="下午"></el-option>
                <el-option value="晚上" label="晚上"></el-option>
            </el-select>
          </el-form-item>
          <br>
          <el-form-item label="客户" prop="custId">
            <customer-select v-model="formData.custId" :disabled="formData.resList && formData.resList.length > 0"></customer-select>
          </el-form-item>
          <el-form-item label="客户联系" prop="receiveIdCard">
            <el-input v-model="formData.receiveIdCard" class="w-184"></el-input>
          </el-form-item>
          <el-form-item label="重卷">
            <el-checkbox v-model="formData.repack" false-label="0" true-label="1"></el-checkbox>
          </el-form-item>
          <br>
          <el-form-item label="备注">
            <el-tabs v-model="remarkTabName" type="border-card" @tab-click="remarkTabClick" style="width:955px;">
              <el-tab-pane label="分条备注" name="first">
                <el-input type="textarea" :autosize="{ minRows:4}" v-model="formData.slitRemark"></el-input>
              </el-tab-pane>
              <el-tab-pane label="平直备注" name="second">
                <el-input type="textarea" :autosize="{ minRows:4}" v-model="formData.cutRemark"></el-input>
              </el-tab-pane>
            </el-tabs>
            <el-button type="primary" size="mini" v-if="action !== 'view'" @click="openRemarkDialog">快捷输入</el-button>
          </el-form-item>
          <br>
          <el-form-item label="制单人">
            <span>[{{formData.userName}} {{formData.createTime}}]</span>
          </el-form-item>
          <el-form-item label="修改人">
            <span>[{{formData.editorName}} {{formData.editTime}}]</span>
          </el-form-item>
          <el-form-item label="审核人">
            <span>[{{formData.checkerName}} {{formData.checkTime}}]</span>
          </el-form-item>
          <el-form-item label="作业状态">
            <span>未完成</span>
          </el-form-item>
          <el-form-item label="总金额">
            {{formData.amountSum}}
          </el-form-item>
        </el-form>
      </div>

      <!--tab-->
      <el-tabs v-model="tabName" type="border-card">
        <el-tab-pane label="加工要求" name="first">
          <mach-order-detail :formData="formData" @showSelectGoods="showSelectGoods" :action="action"
            ref="machOrderDetail"></mach-order-detail>
        </el-tab-pane>
        <el-tab-pane label="成品明细" name="second" v-if="action!='add' && action!='update'">
          <pd-detail :formData="formData" ref="pdDetail"></pd-detail>
        </el-tab-pane>
        <el-tab-pane label="木架" name="third">
          <used-batten :formData="formData" :action="action" ref="usedBatten"></used-batten>
        </el-tab-pane>
        <el-tab-pane label="附加费" name="fourth">
          <sub-join-fee :formData="formData" :action="action" ref="usedBatten"></sub-join-fee>
        </el-tab-pane>
      </el-tabs>
        <el-dialog :visible.sync="remarkTempDialog" width="70%">
          <el-table
            :data="remarkTempList"
            ref="remarkTempTable"
            row-key="id"
            @selection-change="remarkTempSelectionChange"
            @header-click="tableHeaderClick"
            :header-cell-class-name="setHeaderClass"
            border highlight-current-row
            @row-click="remarkTempHandleRowClick"
            row-class-name="pointer text-center"
            max-height="500"
          >
            <el-table-column sortable type="selection" width="50"></el-table-column>
            <el-table-column label="+" width="50" fixed>
              <template slot-scope="scope">
                <i class="el-icon-delete" @click="deleteRemarkTemp(scope.$index,scope.row)" v-if="scope.row.id"></i>
                <i class="el-icon-edit" @click="addRemarkTemp(scope.$index,scope.row)" v-else></i>
              </template>
            </el-table-column>
            <el-table-column sortable label="备注">
              <template slot-scope="scope">
                <el-input v-model="scope.row.remark" v-if="!scope.row.id"></el-input>
                <span v-else>{{scope.row.remark}}</span>
              </template>
            </el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button @click="remarkTempDialog = false">取 消</el-button>
            <el-button type="primary" @click="addRemark">确 定</el-button>
          </div>
        </el-dialog>
          <!--tab-->


        </el-main>
      </el-container>
    </div>

    <!--挑选货物时-->
    <div v-if="pageState === 'selectGoods'">
      <select-goods-page @addGoods="addGoods" @hideSelectGoods="hideSelectGoods" :formData="formData"></select-goods-page>
    </div>

    <mach-order-print v-if="print.visible" :formData="formData" @handleClose="handleClose"></mach-order-print>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import * as api from '@/api/process/mach/index'

  /* components */
  import selectGoodsPage from './selectGoods'
  import machOrderDetail from './machOrderDetail'
  import usedBatten from './usedBatten'
  import subJoinFee from './subJoinFee'
  import pdDetail from './pdDetail'
  import machOrderPrint from './machOrderPrint'

  /* tools */
  import { dateFormat, findPathByModuleCode } from '@/utils'

  /* form */
  import storeSelect from '@/components/storeSelect'
  import customerSelect from '@/components/customerSelect'
  import payModeSelect from '@/components/payModeSelect'

  export default {
    name: 'views',
    props: {
      detailData: Object,
      action: String
    },
    components: {
      selectGoodsPage, machOrderDetail, storeSelect, customerSelect,
      payModeSelect, usedBatten, subJoinFee, pdDetail,
      machOrderPrint
    },
    computed: {
      ...mapGetters(['systemparmMap']),
      clearingNum: function() {
        var num = 0
        if (this.formData.resList) {
          for (const res of this.formData.resList) {
            if (res.clearingId) {
              num++
            }
          }
        }
        return num
      },
      clearingNumSum: function() {
        if (this.formData.resList) {
          return this.formData.resList.length
        } else {
          return 0
        }
      }
    },
    destroyed() {
      this.unLock()
    },
    created() {
      if (this.systemparmMap.SYSTEMSET && this.systemparmMap.SYSTEMSET.AUDIT_WITH_PRINT) {
        this.checkPrint = this.systemparmMap.SYSTEMSET.AUDIT_WITH_PRINT === '1'
      }
      this.loadData(this.detailData)
    },
    data() {
      return {
        checkPrint: false,
        remarkTabName: 'first',
        tabName: 'first',
        formData: {
          id: '',
          blno: '',
          bldate: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'), // 单据日期
          estimatedTime: dateFormat(new Date(), 'yyyy-MM-dd'), // 预计提货时间
          timeSection: '上午',
          custId: '', // 客户
          custLinkDes: '', // 客户联系
          repack: 0, // 重卷
          slitRemark: '', // 分条备注
          cutRemark: '', // 平直备注
          slitStatus: 0, // 分条加工状态
          cutStatus: 0, // 平直加工状态
          slitMachTypeId: '', // 分条机类型ID
          cutMachTypeId: '', // 平直机类型ID
          multiMachTypeId: '', // 一体机类型ID
          machTypeId: '',
          isMulti: 0, // 0为非一体机加工 1为一体机加工
          resType: 1, // 资源类型：1原料，2成品
          resList: [], // 用料明细及分条加工明细列表
          resDelList: [], // 要删除的用料id数组
          cutList: [], // 平板（包括混合平直）开料明细列表
          usedBattenDtList: [], // 木架使用录入列表
          usedBattenDtDelList: [], // 要删除的木架id数组
          subJoinFeeList: [], // 附加费列表
          subJoinFeeDelList: [], // 要删除对附加费id数组
          faxReceiveId: '', // 传真关联ID
          faxType: '' // 传真类型
        },
        defaultData: {
          id: '',
          blno: '',
          bldate: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'), // 单据日期
          estimatedTime: dateFormat(new Date(), 'yyyy-MM-dd'), // 预计提货时间
          timeSection: '上午',
          custId: '', // 客户
          custLinkDes: '', // 客户联系
          repack: 0, // 重卷
          slitRemark: '', // 分条备注
          cutRemark: '', // 平直备注
          slitStatus: 0, // 分条加工状态
          cutStatus: 0, // 平直加工状态
          slitMachTypeId: '', // 分条机类型ID
          cutMachTypeId: '', // 平直机类型ID
          multiMachTypeId: '', // 一体机类型ID
          machTypeId: '',
          isMulti: 0, // 0为非一体机加工 1为一体机加工
          resType: 1, // 资源类型：1原料，2成品
          resList: [], // 用料明细及分条加工明细列表
          resDelList: [], // 要删除的用料id数组
          cutList: [], // 平板（包括混合平直）开料明细列表
          usedBattenDtList: [], // 木架使用录入列表
          usedBattenDtDelList: [], // 要删除的木架id数组
          subJoinFeeList: [], // 附加费列表
          subJoinFeeDelList: [], // 要删除对附加费id数组
          faxReceiveId: '', // 传真关联ID
          faxType: '' // 传真类型
        },
        pageState: 'normal',
        rules: {
          custId: [{ required: true, message: '客户不能为空', trigger: 'blur' }],
          bldate: [{ required: true, message: '单据日期不能为空', trigger: 'blur' }]
        },
        remarkTempDialog: false,
        remarkTempList: [],
        remarkType: 1, // 1代表分条 2代表平直
        remarkTempSelectionList: [],
        print: {
          visible: false
          // billId: '',
          // billType: -1,
          // printType: ''
        }
      }
    },
    methods: {
      loadData(data) {
        if (data.id) { // 详情或者修改 数据带入
          this.formData = data
          this.getDtList()
        } else if ((this.action === 'add' || data.action) && data.custId && data.stockList) {
          this.formData = this.defaultData // 新增操作清除数据（解决页面已经打开再跳转过来数据还在的bug）
          this.$set(this.formData, 'resList', [])
          this.$set(this.formData, 'cutList', [])
          this.$set(this.formData, 'usedBattenDtList', [])
          this.$set(this.formData, 'subJoinFeeList', [])
          this.formData.resType = data.resType
          this.formData.custId = data.custId
          this.addGoods(data.stockList)
        } else {
          this.formData.resType = data.resType
        }
        // 传真信息添加关联
        if (data && data.custId && data.faxId) {
          this.formData.custId = data.custId
          this.formData.faxReceiveId = data.faxId
          this.formData.faxType = data.faxType
        }
      },
      remarkTabClick(tab, event) {
        if (tab.name === 'first') {
          this.remarkType = 1
        } else if (tab.name === 'second') {
          this.remarkType = 2
        }
      },
      // form -- (反)审核
      audit() {
        if (!this.formData.status) { // 未审核
          api.audit({ id: this.formData.id }).then(() => {
            // 打印
            if (this.checkPrint === true) {
              this.$parent.printBill()
            }
            this.hidePage(true)
          }).catch(error => {
            if (error) console.error(error)
          })
        } else if (this.formData.status === 1) {
          api.unaudit({ id: this.formData.id }).then(() => {
            this.hidePage(true)
          }).catch(error => {
            if (error) console.error(error)
          })
        }
      },
      close() {
        if (this.formData.status === 1) { // 确认
          api.close({ id: this.formData.id }).then(() => {
            this.hidePage(true)
          }).catch(error => {
            if (error) console.error(error)
          })
        } else if (this.formData.status === 2) {
          api.unclose({ id: this.formData.id }).then(() => {
            this.hidePage(true)
          }).catch(error => {
            if (error) console.error(error)
          })
        }
      },
      modify(val) {
        this.$emit('changeAction', val)
      },
      save(auditOrHide) {
        if (!this.dateCheck()) {
          return
        }
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (!this.formData.id) {
              if (auditOrHide === 'audit') {
                api.addAndAudit(this.formData).then((res) => {
                  this.formData.id = res.machOrder.id
                  this.formData.status = res.machOrder.status
                  // 打印
                  if (this.checkPrint === true) {
                    this.$parent.printBill(this.formData)
                  }
                  this.hidePage(true)
                }).catch(error => {
                  if (error) console.error(error)
                })
              } else {
                api.add(this.formData).then((res) => {
                  this.formData.id = res.machOrder.id
                  this.hidePage(true)
                }).catch(error => {
                  if (error) console.error(error)
                })
              }
            } else {
              if (auditOrHide === 'audit') {
                api.updateAndAudit(this.formData).then((res) => {
                  this.formData.status = res.machOrder.status
                  // 打印
                  if (this.checkPrint === true) {
                    this.$parent.printBill(this.formData)
                  }
                  this.hidePage(true)
                }).catch(error => {
                  if (error) console.error(error)
                })
              } else {
                api.update(this.formData).then(() => {
                  this.hidePage(true)
                }).catch(error => {
                  if (error) console.error(error)
                })
              }
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      dateCheck() { // 数据校验
        if (!this.formData.resList || this.formData.resList.length === 0) {
          this.$message.warning('请添加加工用料明细')
          return false
        }
        for (const res of this.formData.resList) {
          var weight = 0.0
          for (const slitDt of res.slitList) {
            if (!slitDt.seq) {
              this.$message.warning('原料(' + res.handCode + ')分刀不能为空')
              return false
            }
            for (const v of res.slitList) {
              if (v.seqId !== slitDt.seqId && v.seq === slitDt.seq) {
                this.$message.warning('分刀名称不能相同')
                return false
              }
            }
            if (!parseFloat(slitDt.seqWeight)) {
              this.$message.warning('原料(' + res.handCode + ')分刀重不能为空或零')
              return false
            }
            if (!parseInt(slitDt.sectionNum)) {
              this.$message.warning('原料(' + res.handCode + ')段数不能为空或零')
              return false
            }
            if (!parseInt(slitDt.num)) {
              this.$message.warning('原料(' + res.handCode + ')条数不能为空或零')
              return false
            }
            if (!parseInt(slitDt.width)) {
              this.$message.warning('原料(' + res.handCode + ')宽度不能为空或零')
              return false
            }
            weight += parseFloat(slitDt.weight)
          }
          weight = weight.toFixed(3)
          if (res.weightFlag === 1 && parseFloat(res.weight1) !== parseFloat(weight)) {
            this.$message.warning('原料(' + res.handCode + ')加工重量与分条排刀明细重量合计不一致')
            return false
          } else if (res.weightFlag === 2 && parseFloat(res.weight2) !== parseFloat(weight)) {
            this.$message.warning('原料(' + res.handCode + ')加工重量与分条排刀明细重量合计不一致')
            return false
          }
        }
        for (const cut of this.formData.cutList) {
          for (let i = 0; i < cut.cutDtList.length; i++) {
            const cutDt = cut.cutDtList[i]
            if (!cutDt.length && (cut.cutDtList.length === 1 || i !== cut.cutDtList.length - 1)) {
              this.$message.warning('平直长度不能为空或零')
              return false
            }
          }
        }
        return true
      },
      async addGoods(selectionList) {
        const stockidsArr = []
        selectionList.map((item) => {
          stockidsArr.push(item.id)
        })
        // 确认 => 选中锁货 revert: 0 锁定 1解锁
        api.lock({
          revert: 0,
          stockIds: stockidsArr.join(',')
        })

        // 格式化selectionList
        selectionList.forEach((selectItem) => {
          const temp = {
            id: '',
            stockId: selectItem.id,
            handCode: selectItem.handCode, // 货物编号
            steelCode: selectItem.steelCode, // 钢卷号
            typeName: selectItem.typeName,
            thickness: selectItem.thickness,
            width: selectItem.width,
            parea: selectItem.parea,
            grade: selectItem.grade,
            num: (this.formData.resType === 2 ? selectItem.pdValidNum : selectItem.validNum),
            storeNum: (this.formData.resType === 2 ? selectItem.pdValidNum : selectItem.validNum),
            weightFlag: (selectItem.weightFlag ? selectItem.weightFlag : 2),
            weight1: selectItem.validWeight1, // 过磅重重
            weight2: (this.formData.resType === 2 ? selectItem.pdValidWeight : selectItem.validWeight2), // 抄码净重
            weight4: selectItem.validWeight4, // 抄码毛重
            storeWeight1: selectItem.validWeight1, // 原始过磅重重
            storeWeight2: (this.formData.resType === 2 ? selectItem.pdValidWeight : selectItem.validWeight2), // 原始抄码净重
            storeWeight4: selectItem.validWeight4, // 原始抄码毛重
            machPrice: 0, // 加工单价
            storeName: (selectItem.storeName ? selectItem.storeName : '') + ' ' + (selectItem.positionRow ? selectItem.positionRow + '行' : '') +
            (selectItem.positionColumn ? selectItem.positionColumn + '排' : ''),
            position: selectItem.position,
            maRemark: selectItem.remark,
            maShowDes: selectItem.showDes,
            slitStatus: 0, // 分条开料状态
            cutStatus: 0, // 平直开料状态
            allowUltraWide: false, // 是否允许超宽
            density: (selectItem.density ? selectItem.density : 7.85),
            slitList: [] // 分条排刀明细列表
          }
          if (this.formData.resList.length) {
            // dtList 中是否存在
            if (!this.checkRepeat(this.formData.resList, temp.stockId)) { // 不存在
              this.formData.resList.push(temp)
            }
          } else {
            this.formData.resList.push(temp)
          }
        })
      },
      checkRepeat(list, stockId) {
        let isRepeat = false
        for (let i = 0; i < list.length; i++) {
          if (list[i].stockId === stockId) {
            isRepeat = true
            break
          }
        }
        return isRepeat
      },
      // 货物解锁
      unLock() {
        if (this.formData.resList.length && !this.formData.id) {
          const stockids = []
          this.formData.resList.map((item) => {
            stockids.push(item.stockId)
          })
          api.lock({
            revert: 1,
            stockIds: stockids.join(',')
          })
          console.log('执行货物解锁')
        }
      },
      // 获取相关明细数据明细
      getDtList() {
        this.formData.resDelList = []
        this.formData.usedBattenDtDelList = []
        this.formData.subJoinFeeDelList = []
        api.dtList({
          id: this.formData.id
        }).then((resp) => {
          // this.formData.resList.splice(0, this.formData.resList.length)
          // this.formData.cutList.splice(0, this.formData.cutList.length)
          // this.formData.usedBattenDtList.splice(0, this.formData.usedBattenDtList.length)
          // this.formData.subJoinFeeList.splice(0, this.formData.subJoinFeeList.length)

          if (resp.resList) {
            this.$set(this.formData, 'resList', resp.resList)
            // this.formData.resList = this.formData.resList.concat(resp.resList)
            // 初始化分刀之间的唯一性
            for (const res of this.formData.resList) {
              var seq = ''
              var uuid = this.getUUID()
              for (const slitDt of res.slitList) {
                slitDt.mixCut = slitDt.mixCut + ''
                if (!seq) {
                  seq = slitDt.seq
                }
                if (seq === slitDt.seq) {
                  slitDt.seqId = uuid
                } else {
                  seq = slitDt.seq
                  uuid = this.getUUID()
                  slitDt.seqId = uuid
                }
              }
            }
          } else {
            this.$set(this.formData, 'resList', [])
          }
          if (resp.cutList) {
            this.$set(this.formData, 'cutList', resp.cutList)
            // this.formData.cutList = this.formData.cutList.concat(resp.cutList)
          } else {
            this.$set(this.formData, 'cutList', [])
          }
          if (resp.usedBattenDtList) {
            this.$set(this.formData, 'usedBattenDtList', resp.usedBattenDtList)
            // this.formData.usedBattenDtList = this.formData.usedBattenDtList.concat(resp.usedBattenDtList)
          } else {
            this.$set(this.formData, 'usedBattenDtList', [])
          }
          if (resp.subJoinFeeList) {
            this.$set(this.formData, 'subJoinFeeList', resp.subJoinFeeList)
            // this.formData.subJoinFeeList = this.formData.subJoinFeeList.concat(resp.subJoinFeeList)
          } else {
            this.$set(this.formData, 'subJoinFeeList', [])
          }
        }).catch(error => {
          if (error) console.error(error)
        })
      },
      tableHeaderClick(column, event) { // 点击表头
        if (column.label === '+') {
          const remarkTemp = {
            'id': '',
            'remark': ''
          }
          this.remarkTempList.push(remarkTemp)
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
      remarkTempHandleRowClick(row, event, column) {
        this.$refs.remarkTempTable.toggleRowSelection(row)
      },
      remarkTempSelectionChange(rowArr) {
        this.remarkTempSelectionList = rowArr
      },
      openRemarkDialog() {
        this.getRemarkTemp()
        this.remarkTempDialog = true
      },
      getRemarkTemp() {
        api.remarkTemplList({
          'templType': this.remarkType
        }).then((resp) => {
          this.remarkTempList = resp.list
        }).catch(error => {
          if (error) console.error(error)
        })
      },
      addRemarkTemp(index, row) {
        api.addRemarkTempl({
          'templType': this.remarkType,
          'remark': row.remark
        }).then((resp) => {
          this.getRemarkTemp()
        })
      },
      deleteRemarkTemp(index, row) {
        const id = [this.remarkTempList[index].id]
        api.deleteRemarkTempl({
          'id': id
        }).then((resp) => {
          this.remarkTempList.splice(index, 1)
        })
      },
      addRemark() {
        var remark = ''
        for (const remarkTemp of this.remarkTempSelectionList) {
          remark += (remarkTemp.remark + ' ')
        }
        if (this.remarkType === 1) {
          this.formData.slitRemark += remark
        } else if (this.remarkType === 2) {
          this.formData.cutRemark += remark
        }
        this.remarkTempDialog = false
      },
      hidePage(refresh) {
        this.$emit('hideViews', refresh)
      },
      hideSelectGoods() {
        this.pageState = 'normal'
      },
      showSelectGoods() {
        this.pageState = 'selectGoods'
      },
      getUUID() {
        var uuid = require('node-uuid')
        return uuid.v1().replace(/\-/g, '')
      },
      machClearing() {
        var isAdd = true
        if (this.clearingNum === this.clearingNumSum) {
          isAdd = false
        }
        const data = {
          path: findPathByModuleCode('machClearing'),
          query: {
            orderId: this.formData.id,
            custId: this.formData.custId,
            isAdd: isAdd
          }
        }
        this.$router.push(data)
      },
      printBill: function() {
        if (!this.formData || this.formData.status !== 1) return
        this.print.visible = true
      },
      handleClose() {
        this.print.visible = false
      }
    }
  }
</script>

<style scoped>

</style>
