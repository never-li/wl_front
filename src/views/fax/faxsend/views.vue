<template>

    <div>
      <!--头部按钮组-->
      <div class="btn-group-container">
          <el-button type="primary" @click="jump('home')" icon="el-icon-back">返回</el-button>
          <el-button type="primary" @click="resend">重新发送</el-button>
      </div>
      <div class="form-wrap">
        <el-form label-position="right" :inline="true" label-width="80px" size="small">
          <el-row>
            <el-form-item label="传真号">
              <el-input v-model="currentRow.cuTel" readonly="readonly" size="mini" class="input-w-168"></el-input>
            </el-form-item>
            <el-form-item label="发送时间">
              <el-input v-model="currentRow.endTime" readonly="readonly" size="mini" class="input-w-168"></el-input>
            </el-form-item>
            <el-form-item label="客户">
              <el-input v-model="currentRow.cuName" readonly="readonly" size="mini" class="input-w-168"></el-input>
            </el-form-item>
            <el-form-item label="业务类型">
              <el-input v-model="currentRow.blName" readonly="readonly" size="mini" class="input-w-168"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="状态" >
            {{currentRow.sendStatus}}
            </el-form-item>
            <el-form-item label="处理人" >
              {{'['+currentRow.userName+' '+currentRow.createTime+']'}}
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <el-tabs v-model="tabName" type="border-card" >
        <el-tab-pane label="传真图片" name="first">
          <div class="images" style="height:500px;background-image:none"
               v-viewer="{inline: true, button: false,title:false, navbar: false,rotatable: false ,scalable: false,}">
            <img v-for="src in picList" :src="src.picPath" :key="src.picPath" height="200" width="200">
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

</template>

<script>
  import { getBillFaxList } from '@/api/fax/faxreceive/faxreceive'
  import 'viewerjs/dist/viewer.css'
  import Viewer from 'v-viewer'
  import Vue from 'vue'

  Vue.use(Viewer)

  export default {
    name: 'views',
    props: {
      action: String,
      currentRow: Object,
      picList: Array
    },
    components: {

    },
    created() {
      this.faxTypeList = this.$parent.faxTypeList.filter((item) => { return item.label !== '' })
      this.billTypeList = this.$parent.billTypeList
      this.faxType = this.currentRow.faxType
      this.remark = this.currentRow.remark
      this.queryListById(this.currentRow.id)
    },
    data() {
      return {
        listLoading: false,
        showSelectGoods: false, // 货物选择显示
        list: [],
        tabName: 'first',
        formData: {},
        faxTypeList: [],
        billTypeList: [],
        billType: [],
        remark: '',
        faxType: ''
      }
    },
    methods: {
      jump(action) {
        this.$emit('jump', action)
      },
      deal() {
        this.$parent.formParam.remark = this.remark
        this.$parent.formParam.faxType = this.faxType
        this.$parent.deal()
        this.jump('home')
      },
      undeal() {
        this.$parent.undeal()
        this.jump('home')
      },
      queryListById(id) {
        this.listLoading = true
        getBillFaxList({ faxId: id }).then(response => {
          this.list = response.billFaxs
          this.listLoading = false
        })
      },
      handleDblClick(row) {
        const data = {
          path: this.$parent.getPathByBillType(row.billType),
          query: {
            id: row.billId
          }
        }
        this.$router.push(data)
      },
      resend() {
        this.$parent.resend()
        this.jump('home')
      }
    }
  }
</script>

<style scoped>

</style>
