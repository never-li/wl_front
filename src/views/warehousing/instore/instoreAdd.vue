<template>
  <div class='instoreAdd'>

    <el-row class='el-row-header'>
      <el-button type='primary' icon="el-icon-close" v-if="buttonDisplay==='addDisplay'||buttonDisplay==='editDisplay'" v-on:click='cancel()'>取消</el-button>
      <el-button type='primary' icon="el-icon-back" v-if="buttonDisplay==='seeUnAudit'||buttonDisplay==='seeAudit'||buttonDisplay==='seeAuditGd' ||acceptFormData.status === -9" v-on:click='cancel()'>返回</el-button>
      <el-button type='primary' icon="el-icon-check" v-if="buttonDisplay==='addDisplay'" v-on:click='addSave()'>保存</el-button>
      <el-button type='primary' icon="el-icon-check" v-if="buttonDisplay==='editDisplay'" v-on:click='editSave()'>保存</el-button>
      <el-button type='primary' icon="el-icon-check" v-if="buttonDisplay==='seeAuditGd'" v-on:click='updateforaudit()'>保存</el-button>
      <el-button type='primary' icon="el-icon-edit" v-if="buttonDisplay==='seeUnAudit'" v-on:click='seeEdit()'>修改</el-button>
      <el-button type='primary' icon="el-icon-view" v-if="buttonDisplay==='seeAudit'" v-on:click='unaudit'>反审核</el-button>
      <el-button type='primary' icon="el-icon-printer" v-if="buttonDisplay==='seeAudit'" v-on:click='printBill'>打印</el-button>
      <template v-if="buttonDisplay==='seeUnAudit' || buttonDisplay==='addDisplay' || buttonDisplay==='editDisplay'">
        <el-button type='primary' icon="el-icon-view" v-on:click='audit'>审核</el-button>
        <el-checkbox style='margin-left:15px;' v-model='checkPrint'>审核打印</el-checkbox>
      </template>
    </el-row>

    <div class="form-wrap">
      <el-form :inline="true"
               size="small" label-width="80px"
               :model="formData"
               ref="ruleForm"
               :disabled="!formIsEdit">
        <el-form-item label="单据编号:">
          <el-input v-model="formData.blno" class="input-w-168"  disabled></el-input>
        </el-form-item>
        <el-form-item label="客户:" prop="custId">
          <customer-select v-model="formData.custId"></customer-select>
        </el-form-item>
        <el-form-item label="入库仓库:" prop="storeId">
          <store-select v-model="formData.storeId"></store-select>
        </el-form-item>
        <el-form-item label="单据日期:" prop="bldate">
          <el-date-picker
            v-model="formData.bldate"
            type="datetime"
            class="input-w-168"
            value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <br>
        <el-form-item label="车牌号:">
          <el-input v-model="formData.vehicleNo" class="input-w-168" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="收货人:">
          <el-select filterable clearable v-model="formData.receiveName">
            <el-option v-for="item in receivers" :value="item.userName0" :label="item.userName0" :key="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="装卸工:">
          <el-select filterable clearable v-model="formData.mbHandorArr" class="el-select-style"  multiple>
            <el-option v-for="item in handors" :value="item" :label="item" :key="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="吊机工:">
          <el-select filterable clearable v-model="formData.mbCraner">
            <el-option v-for="item in craners" :value="item" :label="item" :key="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <br>
        <el-form-item label="备注:">
          <el-input type="textarea" v-model="formData.remark" class="input-w-694" maxlength="255"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="制单人:">
          <span>[{{formData.creatorName}} {{formData.createTime}}]</span>
        </el-form-item>
        <el-form-item label="修改人:">
          <span>[{{formData.editorName}} {{formData.editTime}}]</span>
        </el-form-item>
        <el-form-item label="审核人:">
          <span>[{{formData.checkerName}} {{formData.checkTime}}]</span>
        </el-form-item>
<!--        <el-form-item label="作业状态:">
          <span>{{formData.mbStatusName}}</span>
        </el-form-item>-->
      </el-form>
    </div>


    <div class="btn-group-container"  v-if="buttonDisplay=='seeAudit'">
      <el-button v-on:click='changeCondition()' icon="el-icon-edit-outline"  type='primary'>改单</el-button>
    </div>

    <!-- <common-table class='common-table' v-show="enterMethod=='index'" ref='commonTable' :displayItems='displayItems' :tableData2='dtList' :isEdit='state' :model="condition"></common-table>

    <common-table class='common-table' v-show="enterMethod=='editDetailed'" ref='commonTableT' :displayItems='displayItems' :tableData2='dtList' :isEdit='commonTableState' :model="commontTableCondition"></common-table>

    <common-table class='common-table' v-show="enterMethod=='auditDetailed'" ref='commonTableTH' :displayItems='displayItems' :tableData2='auditDetailedDtList' :isEdit='commonTableState' :model="commontTableCondition"></common-table> -->

    <special-table :tableData='dtList' ref='commonTable' :isEdit='itemIsEdit' :model="tableCondition" @delDetail="delDt"></special-table>
  </div>
</template>

<script>
  import {
    add,
    dtlist,
    update,
    dtlistforaudit,
    updateforaudit
  } from '@/api/warehousing/instore/instore'
  import { mapGetters } from 'vuex'
  import specialTable from './specialTable'
  import customerSelect from '@/components/customerSelect'
  import storeSelect from '@/components/storeSelect'
  import * as common from '@/utils'

  export default {
    name: 'instoreAdd',
    props: {
      state: String,
      condition: String,
      acceptFormData: Object
    },
    components: {
      customerSelect,
      storeSelect,
      specialTable
    },
    data() {
      return {
        checkPrint: false,
        commonTableState: String, // 传给子组件的 state
        commontTableCondition: String,
        formIsEdit: Boolean,
        formData: {
          bldate: '', // 制单时间
          custId: '', // 客户id
          cuFullName: '', // 客户名称
          storeId: '', // 仓库id
          vehicleNo: '', // 车号
          receiveName: '', // 收货人
          mbHandor: '', // 装卸工
          mbHandorArr: [], // 装卸工数组
          mbCreaner: '', // 吊机工
          remark: '', // 备注
          dtList: [], // 明细数据集合
          dtDelList: [] // 要删除的数据
        },
        dtList: [], // 表格明细
        auditDetailedDtList: [], // 表格明细
        buttonDisplay: '', // 按钮显示
        enterMethod: 'index',
        itemIsEdit: false,
        tableCondition: ''
      }
    },
    computed: {
      ...mapGetters([
        'storeList',
        'receivers',
        'craners',
        'handors',
        'typeList',
        'feeconfigList',
        'factoryList',
        'systemparmMap'
      ])
    },
    methods: {
      addSave(func, isAudit) { // 新增保存
        if (this.validateForm()) {
          // console.log(1)
          this.formData.mbHandor = this.formData.mbHandorArr.join(',')
          add(this.formData, isAudit)
            .then(response => {
              if (typeof func === 'function') {
                func(response.obj.id)
              } else {
                this.$emit('changeView')
              }
            })
            .catch(error => {
              if (error) console.error(error)
            })
        }
      },
      editSave(func, isAudit) { // 修改保存
        if (this.validateForm()) {
          const that = this
          this.formData.dtList = this.$refs.commonTable.usedTableData
          // if (this.enterMethod === 'editDetailed') {
          //   this.formData.dtList = this.$refs.commonTableT.tableData
          // }
          // if (this.enterMethod === 'auditDetailed') {
          //   this.formData.dtList = this.$refs.commonTableTH.tableData
          // }
          this.formData.mbHandor = this.formData.mbHandorArr.join(',')
          update(this.formData, isAudit)
            .then(response => {
              if (typeof func === 'function') {
                func(response.obj.id)
              } else {
                that.$emit('changeView')
              }
            })
            .catch(error => {
              if (error) console.error(error)
            })
        }
      },
      delDt(row) {
        // console.log(this.formData)
        if (!this.formData.dtDelList) {
          this.formData.dtDelList = []
        }
        this.formData.dtDelList.push(row)
      },
      validateForm() {
        let valid = false
        if (!this.formData.custId) {
          this.$message.error('客户不能为空')
          return valid
        }
        if (!this.formData.storeId) {
          this.$message.error('入库仓库不能为空')
          return valid
        }
        if (!this.formData.bldate) {
          this.$message.error('单据日期不能为空')
          return valid
        }
        this.formData.dtList = this.$refs.commonTable.usedTableData
        if (!this.formData.dtList || this.formData.dtList.length <= 0) {
          this.$message.error('明细不能为空')
          return valid
        }
        // 验证表格的必填项
        valid = this.formData.dtList.every((item, index) => {
          if (!item.handCode) {
            this.$message.error(`表格第${index + 1}行，货物编号不能为空`)
            return false
          } else if (!item.typeId) {
            this.$message.error(`表格第${index + 1}行，品名不能为空`)
            return false
          } else if (!item.specName) {
            this.$message.error(`表格第${index + 1}行，规格不能为空`)
            return false
          } else if (!item.parea) {
            this.$message.error(`表格第${index + 1}行，产地不能为空`)
            return false
          } else if (!item.weight2) {
            this.$message.error(`表格第${index + 1}行，抄码净重不能为空`)
            return false
          } else if (!item.num) {
            this.$message.error(`表格第${index + 1}行，数量不能为空`)
            return false
          } else if (!item.feeCfgId) {
            this.$message.error(`表格第${index + 1}行，收费类别不能为空`)
            return false
          }
          return true
        })
        return valid
      },
      updateforaudit() { //   已审核改单保存
        const that = this
        this.formData.dtList = this.$refs.commonTable.usedTableData
        updateforaudit(this.formData)
          .then(response => {
            that.$emit('changeView')
          })
          .catch(error => {
            if (error) console.error(error)
          })
      },
      cancel() {
        if (this.tableCondition === 'yshgd') { // 改单返回
          this.buttonDisplay = 'seeAudit'
          this.tableCondition = 'normal'
          this.itemIsEdit = false
          this.loadData(this.acceptFormData)
        } else {
          this.$emit('changeView', { path: 'home' })
        }
      },
      seeEdit() {
        this.formIsEdit = true
        this.buttonDisplay = 'editDisplay'
        this.enterMethod = 'editDetailed'

        this.itemIsEdit = true
      },
      audit() { // 审核
        const that = this
        if (that.buttonDisplay === 'addDisplay') {
          that.addSave(function(blid) {
            // 打印
            if (that.checkPrint === true) {
              that.$parent.printBill(blid)
            }
            that.$parent.getList()
            that.$parent.goHome()
          }, true)
        } else if (that.buttonDisplay === 'editDisplay') {
          that.editSave(function(blid) {
            // 打印
            if (that.checkPrint === true) {
              that.$parent.printBill(blid)
            }
            that.$parent.getList()
            that.$parent.goHome()
          }, true)
        } else {
          that.$parent.audit(that.checkPrint)
        }
      },
      unaudit() { // 反审核
        this.$parent.unaudit()
      },
      changeCondition() {
        const that = this

        this.buttonDisplay = 'seeAuditGd'
        this.enterMethod = 'auditDetailed'

        this.itemIsEdit = true
        this.tableCondition = 'yshgd' // 已审核改单 状态

        // this.loadData(this.acceptFormData)
        const param = {
          blid: this.formData.id
        }
        that.dtList = []
        dtlistforaudit(param).then(response => {
          that.dtList = response.listInStoreDts // 获取table 明细
        })
          .catch(error => {
            if (error) console.error(error)
          })
      },
      printBill() {
        // 打印
        this.$parent.printBill(this.formData.id)
      },
      loadData(data) {
        this.formData = Object.assign({}, this.formData, data)
        if (this.formData.mbHandor) {
          this.$set(this.formData, 'mbHandorArr', this.formData.mbHandor.split(','))
        }
        if (this.formData.checkStockList && this.formData.checkStockList.length > 0) {
          this.dtList = this.formData.checkStockList
          this.formIsEdit = true
          this.itemIsEdit = true
          this.buttonDisplay = 'addDisplay'
        } else {
          const param = {
            blid: this.formData.id
          }
          this.dtList = []
          dtlist(param)
            .then(response => {
              this.dtList = response.listInStoreDts // 获取table 明细
              // console.log(this.dtList)
            })
            .catch(error => {
              if (error) console.error(error)
            })
        }
      }
    },
    created() {
      if (this.systemparmMap.SYSTEMSET && this.systemparmMap.SYSTEMSET.AUDIT_WITH_PRINT) {
        this.checkPrint = this.systemparmMap.SYSTEMSET.AUDIT_WITH_PRINT === '1'
      }
      if (this.state === 'add' || this.state === 'check2InStore') {
        this.buttonDisplay = 'addDisplay'
        this.formData = {
          bldate: common.getNowFormatMinTime()
        }
      } else if (this.state === 'edit') {
        this.buttonDisplay = 'editDisplay'
      } else if (this.state === 'see' && this.acceptFormData.status === 0) {
        this.buttonDisplay = 'seeUnAudit'
      } else if (this.state === 'see' && this.acceptFormData.status === 1) {
        this.buttonDisplay = 'seeAudit'
      }

      if (this.state === 'add' || this.state === 'edit' || this.state === 'check2InStore') {
        this.formIsEdit = true
      } else {
        this.formIsEdit = false
      }

      // this.commonTableState = 'edit'
      // this.commontTableCondition = 'yshgd'
      if (this.state === 'edit' || this.state === 'see') {
        this.loadData(this.acceptFormData)
      } else if (this.state === 'check2InStore') {
        this.formData = this.acceptFormData
        if (this.formData.mbHandor) {
          this.$set(this.formData, 'mbHandorArr', this.formData.mbHandor.split(','))
        }
        this.dtList = this.acceptFormData.checkStockList
      }
    },
    beforeMount() {
      const that = this
      if (that.state === 'add' || this.state === 'check2InStore') {
        that.itemIsEdit = true
      } else if (that.state === 'edit') {
        that.itemIsEdit = true
      } else if (that.state === 'see') {
        that.itemIsEdit = false
      } else {
        that.itemIsEdit = false
      }
    },
    mounted() {
      // this.displayItems[1].options = this.typeList
      // this.displayItems[4].options = this.factoryList
      // this.displayItems[11].options = this.feeconfigList

      this.tableCondition = this.condition
    }

  }
</script>
<style lang='scss'>
  .instoreAdd {
    /*.el-input__inner {*/
      /*width: 200px !important;*/
      /*height: 32px !important;*/
      /*line-height: 32px !important;*/
    /*}*/

    .el-row-header {
      width: 100%;
      padding: 10px 15px;
      background: rgba(255, 255, 255, 0.7);
      margin-bottom: 15px;
    }
    .itemsClass {
      float: left;
      width: 80px;
      font-size: 14px;
      color: #606266;
      line-height: 40px;
      font-weight: 700;
      text-align: center;
    }
    .itemsClass2 {
      display: inline-block;
      width: 100%;
      font-size: 14px;
      color: #606266;
      line-height: 40px;
      font-weight: 700;
      // text-align: center;
    }
    .el-row {
      margin-bottom: 10px;
    }
    // .common-table:before {
    //     content: '';
    //     display: block;
    //     width: 100%;
    //     height: 60px;
    //     background: rgb(242, 242, 242);
    //     margin-bottom: 10px;
    // }
  }
</style>


