<template>
  <div>
    <el-row class="form-wrap">
      <el-form :inline="true" size="small" label-width="80px" :disabled="action === 'view'">
        <el-form-item label="单据编号">
          <el-input v-model="formData.blno" class="input-w-168" readonly></el-input>
        </el-form-item>
        <el-form-item label="转出仓库">
          <store-select v-model="formData.fromStoreId" :disabled="dtList.length > 0"></store-select>
        </el-form-item>
        <el-form-item label="单据日期">
          <el-date-picker v-model='formData.bldate' class="input-w-168"
                          value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm"
                          type="datetime" placeholder='选择日期'>
          </el-date-picker>
        </el-form-item>
        <br>
        <el-form-item label="客户">
          <customer-select v-model="formData.custId" :disabled="dtList.length > 0"></customer-select>
        </el-form-item>
        <el-form-item label="转入仓库">
          <store-select v-model="formData.toStoreId"></store-select>
        </el-form-item>
        <br>
        <el-form-item label="备注">
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
        <el-form-item label="作业状态">
          <span class='itemsClass2'>{{formData.mbStatusName}}</span>
        </el-form-item>
      </el-form>
    </el-row>
  </div>
</template>

<script>
  import storeSelect from '@/components/storeSelect'
  import customerSelect from '@/components/customerSelect'

  export default {
    name: 'common-form',
    components: {
      storeSelect, customerSelect
    },
    props: {
      action: String,
      formData: Object,
      dtList: Array
    }
  }
</script>

<style>

</style>
