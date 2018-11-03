<template>
  <div>
    <div v-show="pageState === 'normal'">
      <div class="btn-group-container">
        <!--新增、修改-->
        <div v-if="action === 'add' || action === 'update'">
          <el-button type="primary" @click="$emit('hideViews')" icon="el-icon-close">取消</el-button>
          <el-button type="primary" @click="save('hide')" icon="el-icon-check">保存</el-button>
          <el-button type="primary" @click="save('audit')" icon="el-icon-printer">审核</el-button>
          <el-checkbox class="ml-15" v-model="checkPrint">审核打印</el-checkbox>
        </div>

        <!--详情-->
        <div v-if="action === 'view'">
          <el-button type="primary" @click="$emit('hideViews')" icon="el-icon-back">返回</el-button>
          <el-button type="primary" v-if="formData.status === 0" @click="modify('update')" icon="el-icon-edit-outline">修改</el-button>
          <el-button type="primary" v-if="formData.status === 0" @click="audit">审核</el-button>
          <el-checkbox class="ml-15" v-if="formData.status === 0" v-model="checkPrint">审核打印</el-checkbox>
          <el-button type="primary" v-if="formData.status === 1" @click="audit">反审核</el-button>
          <el-button type="primary" v-if="formData.status === 1" icon="el-icon-printer">打印</el-button>
          <el-button type="primary" v-if="formData.status === 1" icon="el-icon-printer">选货打印</el-button>
        </div>

          <!--改单-->
          <div v-if="action === 'reviseBills'">
            <el-button type="primary" @click="$emit('hideViews')">取消</el-button>
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
            <customer-select v-model="formData.custId"></customer-select>
          </el-form-item>
          <el-form-item label="付款单位" prop="payType">
            <customer-select v-model="formData.payType"  @payModeChange="payModeChange"></customer-select>
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
      <!-- <common-table :table-data="dtList" :formData="formData" :action="action"
                    ref="commonTable"></common-table> -->
      <el-tabs v-model="tabName" type="border-card" @tab-click="tabClick">
        <el-tab-pane label="货物明细" name="first">
          <div class="mb-15" v-if="action==='view' && formData.status===1">
            <el-button type="primary" @click="createSub" :disabled="shipBntStatus">记录发货</el-button>
          </div>
          <common-table :table-data="dtList" :formData="formData" :action="action" @selectionishowBnt='selectionishowBnt'
                        ref="commonTable"></common-table>
        </el-tab-pane>
        <el-tab-pane label="提货详情" name="second" v-if="action==='view' && formData.status === 1">
          <el-button type="danger" @click="delSub" icon="el-icon-delete" :disabled="deleteBntStatus">删除发货</el-button>
          <detail-table :table-data="subList" ref="subTable" class="mt-15" @selectionishowBnt='deleteSelectionishowBnt'></detail-table>
        </el-tab-pane>
      </el-tabs>
    </div>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import * as api from '@/api/process/pickUpGoodsHd/index'

  /* components */
  import commonTable from './common/commonTable'
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
      commonTable, detailTable,
      storeSelect, customerSelect, payModeSelect
    },
    computed: {
      ...mapGetters(['systemparmMap'])
    },
    destroyed() {
      // this.unLock()
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
      // if (this.action === 'add' && this.detailData.custId && this.detailData.stockList) {
      //   this.formData.custId = this.detailData.custId
      //   this.addGoods(this.detailData.stockList)
      // }
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
          editor: '', // 修改人
          editTime: '', // 修改时间
          checkerName: '', // 审核人
          checkTime: '', // 审核时间
          amountSum: '',
          dtDelList: []
        },
        pageState: 'normal',
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
        shipBntStatus: true, // 发货状态
        deleteBntStatus: true // 删除状态
      }
    },
    methods: {
      tabClick(tab, event) {
        // alert(1)
      },
      // form -- (反)审核
      audit() {
        if (!this.formData.status || this.formData.status === 0) { // 未审核
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
      modify(val) {
        this.$emit('changeAction', val)
      },
      save(auditOrHide) {
        if (!this.dtList || this.dtList.length === 0) {
          this.$message.warning('请添加货物明细')
          return
        }
        console.log(this.dtList)
        this.formData.dtList = [...this.dtList]
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (!this.formData.id) {
              if (auditOrHide === 'audit') {
                api.addAndAudit(this.formData).then((res) => {
                  this.formData.id = res.id
                  this.hidePage(true)
                }).catch(error => {
                  if (error) console.error(error)
                })
              } else {
                api.add(this.formData).then((res) => {
                  this.formData.id = res.id
                  this.hidePage(true)
                }).catch(error => {
                  if (error) console.error(error)
                })
              }
            } else {
              api.update(this.formData).then(() => {
                if (auditOrHide === 'audit') {
                  this.audit()
                } else {
                  this.hidePage(true)
                }
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
      // 获取货物明细
      getDtList() {
        api.dtList({
          blid: this.formData.id,
          pageNo: 1,
          pageSize: 20
        }).then((res) => {
          this.dtList = res.outStoreDtHdList
        }).catch(error => {
          if (error) console.error(error)
        })
      },
      payModeChange(payMode) {
        this.$set(this.formData, 'payMode', payMode)
      },
      // 获取提货详情
      getSubList() {
        api.queryDispatchData({ outStoreId: this.formData.id }).then((res) => {
          this.subList = res.greenDtHdViewList
        })
      },
      // tab -- 记录发货
      createSub() {
        if (this.$refs.commonTable.selectionList.length === 0) return
        const outStoreDtIds = []
        for (const select of this.$refs.commonTable.selectionList) {
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
        }).catch(error => {
          if (error) console.error(error)
        })
      },
      // tab -- 删除发货
      delSub() {
        if (this.$refs.subTable.selectionList.length === 0) return
        this.$confirm('确认删除发货记录？', '温馨提示', {
          type: 'warning'
        }).then(() => {
          const outStoreDtIds = []
          for (const select of this.$refs.subTable.selectionList) {
            outStoreDtIds.push(select.id)
          }
          const requestData = {
            // outStoreId: this.formData.id,
            greenDtHdIds: outStoreDtIds
          }
          api.deleteDispatch(requestData).then(() => {
            this.getDtList()
            this.getSubList()
          }).catch(error => {
            if (error) console.error(error)
          })
        }).catch(() => {})
      },
      hidePage(refresh) {
        this.$emit('hideViews', refresh)
      },
      hideSelectGoods() {
        this.pageState = 'normal'
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
