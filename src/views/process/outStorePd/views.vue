<template>
  <div>
    <div v-show="pageState === 'normal'">
      <div class="btn-group-container">
        <!--新增、修改-->
        <div v-if="action === 'add' || action === 'update'">
          <el-button type="primary" @click="$emit('hideViews')" icon= "el-icon-close">取消</el-button>
          <el-button type="primary" @click="save('hide')" icon= "el-icon-check" >保存</el-button>
          <el-button type="primary" @click="save('audit')" icon= "el-icon-printer">审核</el-button>
          <el-checkbox class="ml-15" v-model="checkPrint" icon= "el-icon-printer">审核打印</el-checkbox>
        </div>

        <!--详情-->
        <div v-if="action === 'view'">
          <el-button type="primary" @click="$emit('hideViews')" icon= "el-icon-back">返回</el-button>
          <el-button type="primary" v-if="formData.status === 0" @click="modify('update')" icon="el-icon-edit-outline">修改</el-button>
          <el-button type="primary" v-if="formData.status === 0" @click="audit">审核</el-button>
          <el-checkbox class="ml-15" v-if="formData.status === 0" v-model="checkPrint">审核打印</el-checkbox>
          <el-button type="primary" v-if="formData.status === 1 " @click="audit">反审核</el-button>
          <el-button type="primary" v-if="formData.status === 1" @click="hidePage('print')" icon= "el-icon-printer">打印</el-button>
          <el-button type="primary" v-if="formData.status === 1" @click="printSelect" icon= "el-icon-printer">选货打印</el-button>
        </div>

          <!--改单-->
          <div v-if="action === 'reviseBills'">
            <el-button type="primary" @click="canReviseBills">取消</el-button>
            <el-button type="primary" @click="saveGd">保存</el-button>
            <el-checkbox v-model="checkPrint" class="ml-15">保存打印</el-checkbox>
          </div>
      </div>

        <!--form-->
      <div class="form-wrap">
        <el-form :inline="true" size="small" label-width="80px" :model="formData" ref="form" :rules="rules"
                  :disabled="action === 'view' || action === 'reviseBills'">
          <el-form-item label="单据编号">
            <el-input v-model="formData.blno" disabled class="input-w-168"></el-input>
          </el-form-item>
          <el-form-item label="客户" prop="custId">
            <customer-select v-model="formData.custId" :disabled="dtList.length > 0"></customer-select>
          </el-form-item>
          <el-form-item label="付款单位" prop="payType">
            <customer-select v-model="formData.payType" @payModeChange="payModeChange"></customer-select>
          </el-form-item>
          <el-form-item label="付款方式" prop="payMode">
            <pay-mode-select v-model="formData.payMode"></pay-mode-select>
          </el-form-item>
          <br>
          <el-form-item label="单据日期" prop="bldate">
            <el-date-picker
              v-model="formData.bldate"
              type="datetime"
              class="input-w-168"
              value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="车牌号" prop="vehicleNo">
            <el-input v-model="formData.vehicleNo" class="input-w-168"></el-input>
          </el-form-item>
          <el-form-item label="提货人">
            <el-input v-model="formData.receiveName" class="input-w-168"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="receiveTel">
            <el-input v-model="formData.receiveTel" class="input-w-168"></el-input>
          </el-form-item>
          <el-form-item label="身份证" prop="receiveIdCard">
            <el-input v-model="formData.receiveIdCard" class="input-w-168"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="formData.remark" class="input-w-694">
            </el-input>
          </el-form-item>
          <br>
          <el-form-item label="制单人">
            <span class="fz-12">[{{formData.userName}} {{formData.createTime}}]</span>
          </el-form-item>
          <el-form-item label="修改人">
            <span>[{{formData.editorName}} {{formData.editTime}}]</span>
          </el-form-item>
          <el-form-item label="审核人">
            <span class="fz-12">[{{formData.checkerName}} {{formData.checkTime}}]</span>
          </el-form-item>
          <el-form-item label="作业状态">
            <span  class="fz-12" v-if="detailData.greenStatus === 0">未发货</span>
            <span  class="fz-12" v-else-if="detailData.greenStatus === 1" style="color: #008de7;">部分发货</span>
            <span  class="fz-12" v-else-if="detailData.greenStatus === 2" style="color: red;">发货完成</span>
          </el-form-item>
          <el-form-item label="总金额">
            {{formData.amountSum}}
          </el-form-item>
        </el-form>
      </div>

      <div class="btn-group-container" v-if="action==='reviseBills' && formData.status===1">
        <el-button type="primary" @click="changeDt" :disabled="shipBntStatus">换货</el-button>
      </div>

      <!--tab-->
      <el-tabs v-model="tabName" type="border-card" @tab-click="tabClick">
        <el-tab-pane label="货物明细" name="first">
          <div class="mb-15" v-if="action==='view' && formData.status===1">
            <el-button type="primary" @click="createSub" icon= "el-icon-document" :disabled="shipBntStatus">记录发货</el-button>
            <el-button type="primary" @click="modify('reviseBills')" icon="el-icon-edit-outline">改单</el-button>
          </div>
          <common-table :table-data="dtList" :formData="formData" @showSelectGoods="showSelectGoods" :action="action" @selectionishowBnt='selectionishowBnt'
                        ref="commonTable"></common-table>
        </el-tab-pane>
        <el-tab-pane label="提货详情" name="second" v-if="action==='view' && formData.status === 1">
          <el-button type="danger" @click="delSub" icon= "el-icon-delete" :disabled="deleteBntStatus">删除发货</el-button>
          <!-- <el-button type="primary" @click="modify('reviseBills')">改单</el-button> -->
          <detail-table :table-data="subList" ref="subTable" class="mt-15" @selectionishowBnt='deleteSelectionishowBnt'></detail-table>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!--挑选货物时-->
    <div v-if="pageState === 'selectGoods'">
      <select-goods-page @addGoods="addGoods" @hideSelectGoods="hideSelectGoods" :formData="formData" :changeDtList="changeDtList"></select-goods-page>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import * as api from '@/api/process/outStorePd/'

  /* components */
  import commonTable from './common/commonTable'
  import selectGoodsPage from './selectGoods'
  import detailTable from './common/detailTable'

  /* tools */
  import { dateFormat } from '@/utils'
  import { validatePhone, validateID } from '@/utils/validate'

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
      commonTable, selectGoodsPage, detailTable,
      storeSelect, customerSelect, payModeSelect
    },
    computed: {
      ...mapGetters(['systemparmMap'])
    },
    destroyed() {
      this.unLock()
    },
    created() {
      if (this.systemparmMap.SYSTEMSET && this.systemparmMap.SYSTEMSET.AUDIT_WITH_PRINT) {
        this.checkPrint = this.systemparmMap.SYSTEMSET.AUDIT_WITH_PRINT === '1'
      }
      if (this.detailData.id) { // 详情或者修改 数据带入
        this.formData = this.detailData
        this.formData.dtDelList = []
        this.getDtList()
        this.getSubList()
      }
      if (this.action === 'add' && this.detailData.custId && this.detailData.stockList) {
        this.formData.custId = this.detailData.custId
        this.addGoods(this.detailData.stockList)
      }
      // 传真信息添加关联
      if (this.detailData && this.detailData.custId && this.detailData.faxId) {
        this.formData.custId = this.detailData.custId
        this.formData.faxReceiveId = this.detailData.faxId
        this.formData.faxType = this.detailData.faxType
      }
    },
    data() {
      return {
        checkPrint: false,
        tabName: 'first',
        formData: {
          id: '',
          blno: '',
          custId: '',
          payType: '', // 付款单位
          payMode: '', // 付款方式
          bldate: dateFormat(new Date(), 'yyyy-MM-dd hh:mm'),
          vehicleNo: '',
          receiveName: '', // 提货人
          receiveTel: '',
          receiveIdCard: '',
          remark: '',
          creatorName: '', // 制单人
          createTime: '', // 制单时间
          editorName: '', // 修改人
          editTime: '', // 修改时间
          checkerName: '', // 审核人
          checkTime: '', // 审核时间
          amountSum: 0.00,
          dtDelList: [],
          faxReceiveId: '',
          faxType: ''
        },
        pageState: 'normal',
        canDispatch: true,
        dtList: [],
        subList: [],
        rules: {
          custId: [{ required: true, message: '客户不能为空', trigger: 'blur' }],
          // payType: [{ required: true, message: '付款单位不能为空', trigger: 'blur' }],
          // payMode: [{ required: true, message: '付款方式不能为空', trigger: 'blur' }],
          bldate: [{ required: true, message: '单据日期不能为空', trigger: 'blur' }],
          vehicleNo: [{ required: true, message: '车牌号不能为空', trigger: 'blur' }],
          receiveTel: [{ validator: validatePhone, trigger: 'blur' }],
          receiveIdCard: [{ validator: validateID, trigger: 'blur' }]
        },
        changeDtList: [], // 临时存储需要换货的明细数据
        shipBntStatus: true, // 发货状态
        deleteBntStatus: true // 删除状态
      }
    },
    methods: {
      canReviseBills() {
        const packIdsArr = []
        this.dtList.forEach(item => {
          packIdsArr.push(item.id)
        })
        api.lock({
          revert: 1,
          packIds: packIdsArr.join(',')
        })
        this.formData.dtDelList = []
        this.changeDtList = []
        this.getDtList()
        this.$emit('changeAction', 'view')
      },
      tabClick(tab, event) {
        // alert(1)
      },
      // form -- (反)审核
      audit() {
        if (!this.formData.status || this.formData.status === 0) { // 未审核
          api.audit({ id: this.formData.id }).then(() => {
            if (this.checkPrint) {
              this.$parent.printBill(this.formData.id)
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
      modify(val) {
        this.$emit('changeAction', val)
      },
      save(auditOrHide) {
        if (!this.dtList || this.dtList.length === 0) {
          this.$message.warning('请添加货物明细')
          return
        }
        if (auditOrHide === 'audit') {
          this.formData.isAudit = true
        } else {
          this.formData.isAudit = false
        }
        this.formData.dtList = [...this.dtList]
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (!this.formData.id) {
              api.add(this.formData).then((res) => {
                // 打印
                if (this.checkPrint && auditOrHide === 'audit') {
                  this.$parent.printBill(res.obj.id)
                }
                setTimeout(() => {
                  this.hidePage(true)
                }, 2000)
              }).catch(error => {
                if (error) console.error(error)
              })
            } else {
              api.update(this.formData).then(() => {
                // 打印
                if (this.checkPrint && auditOrHide === 'audit') {
                  this.$parent.printBill(this.formData.id)
                }
                setTimeout(() => {
                  this.hidePage(true)
                }, 2000)
              }).catch(error => {
                if (error) console.error(error)
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      saveGd() {
        this.formData.dtList = [...this.dtList]
        api.updateForAudit(this.formData).then((res) => {
          this.hidePage(true)
        }).catch(error => {
          if (error) console.error(error)
        })
      },
      async addGoods(selectionList) {
        if (this.changeDtList && this.changeDtList.length > 0) {
          for (let i = 0; i < this.changeDtList.length; i++) {
            for (let j = 0; j < this.dtList.length; j++) {
              if (this.changeDtList[i].id === this.dtList[j].id) {
                this.formData.dtDelList.push(this.dtList[j])
                this.dtList.splice(j, 1)
                break
              }
            }
          }
          this.changeDtList = []
        }

        const packIdsArr = []
        selectionList.map((item) => {
          packIdsArr.push(item.id)
        })
        // 确认 => 选中锁货 revert: 0 锁定 1解锁
        api.lock({
          revert: 0,
          packIds: packIdsArr.join(',')
        })
        // ======> 查仓租单价以及计租天数
        const feeInfoParam = {
          pdPackIds: packIdsArr.join(','),
          custId: this.formData.custId,
          bldate: this.formData.bldate,
          storeId: this.formData.storeId
        }
        await api.feeInfo(feeInfoParam).then((res) => {
          res.storefeeList.forEach((matchItem) => {
            selectionList.forEach((selectItem) => {
              if (selectItem.id === matchItem.packId) {
                selectItem.storeDay = matchItem.storeDay
                selectItem.storeFeePrice = matchItem.price
              }
            })
          })
        })

        // 格式化selectionList
        selectionList.forEach((selectItem) => {
          const temp = {
            id: '',
            packNo: selectItem.packNo,
            packId: selectItem.id,
            handCodes: selectItem.handCodes,
            steelCodes: selectItem.steelCodes,
            position: selectItem.position,
            specAllPd: selectItem.specAllPd,
            specAllMa: selectItem.specAllMa,
            remark: selectItem.remark,
            weightFlag: parseInt(this.systemparmMap.SYSTEMSET.WEIGHT_FLAG),
            outWeight: selectItem.weight,
            outWeight1: selectItem.weight1,
            outNum: selectItem.num,
            storeFeePrice: selectItem.storeFeePrice, // 仓租单价
            storeDay: selectItem.storeDay,
            storeFeeAmount: 0,
            machCuName: selectItem.machCuName
          }
          if (this.dtList.length) {
            // dtList 中是否存在
            if (!this.checkRepeat(this.dtList, temp.packId)) { // 不存在
              this.dtList.push(temp)
            }
          } else {
            this.dtList.push(temp)
          }
        })
        console.log(this.dtList)
      },
      checkRepeat(list, packId) {
        let isRepeat = false
        for (let i = 0; i < list.length; i++) {
          if (list[i].packId === packId) {
            isRepeat = true
            break
          }
        }
        return isRepeat
      },
      // 货物解锁
      unLock() {
        if (this.dtList.length) {
          const packIds = []
          this.dtList.map((item) => {
            packIds.push(item.packId)
          })
          api.lock({
            revert: 1,
            packIds: packIds.join(',')
          })
          console.log('执行货物解锁')
        }
      },
      // 获取货物明细
      getDtList() {
        api.dtList({
          blid: this.formData.id,
          pageNo: 1,
          pageSize: 20
        }).then((res) => {
          this.dtList = res.outStoreDtPdList
        }).catch(error => {
          if (error) console.error(error)
        })
      },
      // 获取提货详情
      getSubList() {
        api.queryDispatchData({ outStoreId: this.formData.id }).then((res) => {
          this.subList = res.greenPdViewList
        })
      },
      // 换货
      changeDt() {
        if (this.$refs.commonTable.selectionList.length === 0) {
          this.$message.warning('请选择需要换货的货物')
          return
        }
        this.changeDtList = []
        for (const select of this.$refs.commonTable.selectionList) {
          this.changeDtList.push(select)
        }
        this.showSelectGoods()
      },
      // tab -- 记录发货
      createSub() {
        if (this.$refs.commonTable.selectionList.length === 0) return
        const outStoreDtIds = []
        for (const select of this.$refs.commonTable.selectionList) {
          if (select.greenDtPdId) {
            this.$message.error('货物编码为‘' + select.handCodes + '’的货物已经发货，不能重复发货')
            return
          }
          outStoreDtIds.push(select.id)
        }
        const requestData = {
          outStoreId: this.formData.id,
          outStoreDtIds: outStoreDtIds
        }
        // 记录发货
        api.dispatch(requestData).then(response => {
          this.getDtList()
          this.getSubList()
          this.tabName = 'second'
          this.$refs.commonTable.listLoading = false
          this.$parent.getList()
        }).catch(error => {
          this.$refs.commonTable.listLoading = false
          if (error) console.error(error)
        })
      },
      // tab -- 删除发货
      delSub() {
        if (this.$refs.subTable.selectionList.length === 0) return
        this.$refs.subTable.listLoading = true
        const outStoreDtIds = []
        for (const select of this.$refs.subTable.selectionList) {
          outStoreDtIds.push(select.id)
        }
        const requestData = {
          // outStoreId: this.formData.id,
          greenDtPdIds: outStoreDtIds
        }
        api.deldispatch(requestData).then(() => {
          this.getDtList()
          this.getSubList()
          this.$refs.subTable.listLoading = false
          this.$parent.getList()
        }).catch(error => {
          this.$refs.subTable.listLoading = false
          if (error) console.error(error)
        })
      },
      hidePage(refresh) {
        this.$emit('hideViews', refresh)
      },
      printSelect() {
        if (this.$refs.commonTable.selectionList.length > 0) {
          let ids = ''
          this.$refs.commonTable.selectionList.forEach((item) => {
            ids += item.id + '\'\,\''
          })
          ids = ids.substring(0, ids.length - 3)
          this.$emit('printSelect', ids)
        }
      },
      hideSelectGoods() {
        this.pageState = 'normal'
      },
      showSelectGoods() {
        this.pageState = 'selectGoods'
      },
      payModeChange(payMode) {
        this.$set(this.formData, 'payMode', payMode)
      },
      // 记录发货状态
      selectionishowBnt(val) {
        this.shipBntStatus = val
      },
      deleteSelectionishowBnt(val) {
        this.deleteBntStatus = val
      }
    }
  }
</script>

<style scoped>

</style>
