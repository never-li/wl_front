<template>
    <div class="addTab" v-show="isShow">
      <el-row style="background: #f5f5f5;height:80px;padding:20px;">
        <span v-if="action !== 'views'">
            <el-button class="filter-item" type="primary"   @click="submitForm">保存</el-button>
            <el-button class="filter-item" type="primary"  @click="$emit('hideTab')">取消</el-button>
        </span>
        <span v-else >
               <el-button class="filter-item" type="primary"  @click="$parent.action='update'">修改</el-button>
            <el-button class="filter-item" type="primary"  @click="$emit('hideTab')">返回</el-button>
        </span>
      </el-row>
      <el-form :inline="true" ref="dataForm" :model="formParam" :rules="rules" :disabled="action === 'views'">

        <div style="width:85%;margin:20px auto;">
          <el-row>
            <el-col :span="6"><el-form-item label="客户编码"><el-input  v-model="formParam.custNumber" readonly ></el-input></el-form-item></el-col>
            <el-col :span="6"><el-form-item label="客户全称" prop="cuFullName"><el-input   v-model="formParam.cuFullName" maxlength="64"></el-input></el-form-item></el-col>
            <el-col :span="6"><el-form-item label="客户简称" prop="cuName"><el-input  v-model="formParam.cuName" maxlength="50"></el-input></el-form-item></el-col>
            <el-col :span="6"><el-form-item label="结算方式" prop="payMode"><pay-select v-model="formParam.payMode" class="w-184"></pay-select></el-form-item></el-col>
          </el-row>
          <el-row>
            <el-col :span="6"><el-form-item label="业务联系人" prop="cuLinkman"><el-input  v-model="formParam.cuLinkman" maxlength="50"></el-input></el-form-item></el-col>
            <el-col :span="6"><el-form-item label="业务联系人手机" prop="cuMobile"><el-input  v-model="formParam.cuMobile" maxlength="50"></el-input></el-form-item></el-col>
            <el-col :span="6"><el-form-item label="客户类型"><el-select v-model="formParam.cuType" class="w-184">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value=item.value></el-option></el-select></el-form-item></el-col>
            <el-col :span="6"><el-form-item label="是否有效"><el-checkbox v-model="checkedValid"></el-checkbox></el-form-item></el-col>
          </el-row>
          <el-row>
            <el-col :span="6"><el-form-item label="优惠折扣"><el-input  v-model="formParam.discount"></el-input></el-form-item></el-col>
            <el-col :span="6"><el-form-item label="客户性质"><el-select v-model="formParam.property" class="w-184">
              <el-option v-for="item in propertyOptions" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select></el-form-item></el-col>
            <el-col :span="6"><el-form-item label="业务联系人电话"><el-input  v-model="formParam.cuTel"></el-input></el-form-item></el-col>
            <el-col :span="6"><el-form-item label="业务联系人传真"><el-input v-model="formParam.cuFax"></el-input></el-form-item></el-col>
          </el-row>
          <el-row>
                <el-col :span="6"><el-form-item label="财务联系人"><el-input  v-model="formParam.financeLinkman"></el-input></el-form-item></el-col>
                <el-col :span="6"><el-form-item label="财务联系人手机"><el-input  v-model="formParam.financeMobile"></el-input></el-form-item></el-col>
                <el-col :span="6"><el-form-item label="财务联系人电话"><el-input  v-model="formParam.financeTel"></el-input></el-form-item></el-col>
                <el-col :span="6"><el-form-item label="财务联系人传真"><el-input v-model="formParam.financeFax"></el-input></el-form-item></el-col>
          </el-row>
          <el-row>
            <el-col :span="6"><el-form-item label="开户行"><el-input  v-model="formParam.bankName"></el-input></el-form-item></el-col>
            <el-col :span="6"><el-form-item label="纳税人识别号"><el-input  v-model="formParam.taxRegisterNo"></el-input></el-form-item></el-col>
            <el-col :span="6"><el-form-item label="业务办理要求"><el-input  v-model="formParam.operDemand"></el-input></el-form-item></el-col>
            <el-col :span="6"><el-form-item label="备注"><el-input v-model="formParam.remark"></el-input></el-form-item></el-col>
          </el-row>
          <el-row>
            <el-col :span="6"><el-form-item label="统一社会信贷账号"><el-input  v-model="formParam.busiLicence"></el-input></el-form-item></el-col>
            <el-col :span="6"><el-form-item label="账号"><el-input  v-model="formParam.bankAccount"></el-input></el-form-item></el-col>
            <el-col :span="6"><el-form-item label="允许自助办单"><el-checkbox v-model="checkedSelf"></el-checkbox></el-form-item></el-col>
            <el-col :span="6"><el-form-item label="最低库存（吨）"><el-input v-model="formParam.minStock"></el-input></el-form-item></el-col>
          </el-row>
          <el-row>
            <el-col :span="6"><el-form-item label="创建人"><el-input  v-model="formParam.creater" readonly></el-input></el-form-item></el-col>
            <el-col :span="6"><el-form-item label="创建时间"><el-input  v-model="formParam.createTime" readonly></el-input></el-form-item></el-col>
            <el-col :span="6"><el-form-item label="修改人"><el-input  v-model="formParam.editor" readonly></el-input></el-form-item></el-col>
            <el-col :span="6"><el-form-item label="修改时间"><el-input v-model="formParam.editTime" readonly></el-input></el-form-item></el-col>
          </el-row>
        </div>
      </el-form>

    </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { addCustomer, updateCustomer } from '@/api/basedata/customer'
  import waves from '@/directive/waves/index' // 水波纹指令
  import paySelect from '@/components/payModeSelect'
  export default {
    props: {
      isShow: Boolean,
      action: String,
      currentRow: Object,
      type: 0 // 0为新增操作，1为修改操作
    },
    name: 'freeConfig',
    directives: {
      waves
    },
    components: {
      paySelect
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    data() {
      return {
        typeOptions: [{
          value: 1,
          label: '客户'
        }, {
          value: 2,
          label: '供应商'
        }, {
          value: 3,
          label: '客户+供应商'
        }, {
          value: 4,
          label: '托盘商'
        }],
        options: [{
          value: '月结',
          label: '月结客户'
        }, {
          value: '现金',
          label: '现金客户'
        }],
        propertyOptions: [{
          value: 0,
          label: '企业'
        }, {
          value: 1,
          label: '自然人'
        }],
        checkedValid: true,
        checkedSelf: false,
        formParam: {
          companyId: '',
          cuAddress: '',
          cuEmail: '',
          cuFax: '',
          cuFullName: '',
          cuLinkman: '',
          cuMobile: '',
          cuName: '',
          cuPostcode: '',
          cuTel: '',
          cuType: 1,
          isValid: 1,
          memberId: '',
          remark: '',
          userId: '',
          groupType: '',
          area: '',
          minStock: '0',
          discount: '',
          id: '',
          loginId: '',
          password: '',
          parentId: '',
          operDemand: '',
          sqPhone: '',
          createTime: '',
          editTime: '',
          custNumber: '',
          busiLicence: '',
          taxRegisterNo: '',
          bankName: '',
          bankAccount: '',
          invoiceType: '',
          financeLinkman: '',
          financeMobile: '',
          financeTel: '',
          financeFax: '',
          payMode: '现金',
          masterId: '',
          validCode: '',
          isUp: 0,
          otpTokenSn: '',
          otpBindingTime: '',
          property: 0,
          isSelfService: 0,
          editor: ''
        },
        rules: {
          cuFullName: [{ required: true, message: '请输入客户全称', trigger: 'blur' }],
          cuName: [{ required: true, message: '请输入客户简称', trigger: 'blur' }],
          cuLinkman: [{ required: true, message: '请输入业务联系人', trigger: 'blur' }],
          cuMobile: [{ required: true, message: '请输入业务联系人电话', trigger: 'blur' }],
          payMode: [{ required: true, message: '请选择结算方式', trigger: 'blur' }]
        },
        defaultData: null
      }
    },
    mounted() {
      this.defaultData = JSON.parse(JSON.stringify(this.formParam))
    },
    methods: {
      submitForm() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.type ? this.update() : this.add()
          } else {
            console.log('error submit!!')
            return false
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '提交异常'
          })
        })
      },
      add() {
        if (this.formParam.minStock === '') {
          this.formParam.minStock = '0'
        }
        addCustomer(this.formParam).then(response => {
          this.$notify({
            title: '成功',
            message: '新增成功',
            type: 'success',
            duration: 2000
          })
          Object.assign(this.formParam, this.defaultData)
          this.$emit('hideTab')
          this.$parent.getList()
        })
      },
      update() {
        if (this.formParam.minStock === '') {
          this.formParam.minStock = '0'
        }
        updateCustomer(this.formParam).then(response => {
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
          this.formParam = Object.assign(this.formParam, this.defaultData)
          this.$emit('hideTab')
          this.$parent.getList()
        })
      },
      getNowFormatDate() {
        var date = new Date()
        var seperator1 = '-'
        var seperator2 = ':'
        var month = date.getMonth() + 1
        var strDate = date.getDate()
        if (month >= 1 && month <= 9) {
          month = '0' + month
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = '0' + strDate
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + ' ' + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds()
        return currentdate
      }
    },
    watch: {
      checkedValid: function(val) {
        this.formParam.isValid = val ? 1 : 0
      },
      checkedSelf: function(val) {
        this.formParam.isSelfService = val ? 1 : 0
      },
      isShow: function(val) {
        this.$refs.dataForm.clearValidate()
        if (this.type === 1) {
          Object.assign(this.formParam, this.currentRow)
          // 设置复选框为当前实际状态
          this.checkedValid = this.formParam.isValid === 1
          this.checkedSelf = this.formParam.isSelfService === 1
        } else {
          Object.assign(this.formParam, this.defaultData)
          // 设置复选框为默认状态
          this.checkedValid = true
          this.checkedSelf = false
          this.formParam.creater = this.userInfo.name
          this.formParam.createTime = this.getNowFormatDate()
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .addTab{position: absolute;width:100%;height:720px;background: white;z-index: 10;  left: 0;}
  .el-col{text-align: right;}
  .el-option{z-index:20;}
</style>
