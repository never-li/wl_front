<template>
  <div>
    <el-row class="form-wrap">
      <el-form :inline="true" size="small" label-width="80px" :disabled="BUS.action === 'view'" v-model="formData" ref="dataForm">
        <el-form-item label="单据编号">
          <el-input v-model="formData.blno" readonly class="input-w-168"></el-input>
        </el-form-item>
        <el-form-item label="客户" prop="custId">
          <span v-if="BUS.path === 'views'">
            <customer-select v-model="formData.custId"></customer-select>
          </span>
        </el-form-item>
        <el-form-item label="费用类型" prop="feeId">
          <span v-if="formData.srcBlid&&formData.feeName">
            <el-input v-model="formData.feeName" class="w-199"></el-input>
          </span>
          <span v-else>
            <fee-type-select v-model="formData.feeId"></fee-type-select>
          </span>
        </el-form-item>
        <br>
        <el-form-item label="单据日期" prop="bldate">
          <el-date-picker v-model='formData.bldate' class="input-w-168"
                          value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm"
                          type="datetime" placeholder='选择日期'>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="付款单位" prop="payType">
          <span v-if="BUS.path === 'views'">
           <customer-select v-model="formData.payType" @payModeChange="payModeChange"></customer-select>
          </span>
        </el-form-item>
        <el-form-item label="付款方式" prop="payMode">
          <pay-mode-select v-model="formData.payMode"></pay-mode-select>
        </el-form-item>
        <br>
        <el-form-item label="备注">
          <el-input type="textarea" class="input-w-694"  v-model="formData.remark" maxlength="200" placeholder="200字以内"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="制单人">
          <span>{{formData.creatorName + '[' + formData.createTime + ']'}}</span>
        </el-form-item>
        <el-form-item label="修改人">
          <span v-show="formData.editorName !== undefined">{{formData.editorName + '[' + formData.editTime + ']'}}</span>
        </el-form-item>
        <el-form-item label="审核人">
          <span>{{formData.stateLabel}}</span>
        </el-form-item>
        <el-form-item label="总金额">
          <span>{{formData.amountSum}}</span>
        </el-form-item>
      </el-form>
    </el-row>
  </div>
</template>

<script>
  import storeSelect from '@/components/storeSelect'
  import customerSelect from '@/components/customerSelect'
  import feeTypeSelect from '@/components/feeTypeSelect'
  import payModeSelect from '@/components/payModeSelect'
  export default {
    name: 'common-form',
    components: {
      storeSelect, customerSelect, feeTypeSelect, payModeSelect
    },
    props: {
      BUS: Object,
      formData: Object
    },
    methods: {
      payModeChange(payMode) {
        this.$set(this.formData, 'payMode', payMode)
      }
    }
  }
</script>

<style scoped>

</style>
