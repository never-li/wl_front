<template>

    <div>
      <!--头部按钮组-->
      <div class="btn-group-container">
          <el-button type="primary" @click="jump('home')" icon="el-icon-close">取消</el-button>
          <el-button type="primary" v-if="currentRow.isDo == 0" @click="deal" icon="el-icon-check">确认处理</el-button>
          <el-button type="primary" v-if="currentRow.isDo == 1" @click="undeal" icon="el-icon-back">撤销处理</el-button>
          <el-button type="primary" @click="printImg" icon="el-icon-printer">打印</el-button>
      </div>
      <div class="form-wrap">
        <el-form label-position="right" :inline="true" label-width="80px" size="small">
          <el-row>
            <el-form-item label="传真号">
              <el-input v-model="currentRow.cuTel" readonly="readonly" size="mini" class="input-w-168"></el-input>
            </el-form-item>
            <el-form-item label="接收时间">
              <el-input v-model="currentRow.endTime" readonly="readonly" size="mini" class="input-w-168"></el-input>
            </el-form-item>
            <el-form-item label="客户">
              <el-input v-model="currentRow.cuName" readonly="readonly" size="mini" class="input-w-168"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="业务类型">
              <el-radio-group v-model="faxType" :disabled="currentRow==null||currentRow.isDo==1">
                <el-radio v-for="item in faxTypeList" :label="item.label" :key="item.label">{{item.name}}</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="办单处理" >
              <el-checkbox-group v-model="billType" :disabled="currentRow==null||currentRow.isDo==1">
                <el-checkbox v-for="item in billTypeList" :label="item.label" :key="item.label" >{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="备注" >
              <el-input size="mini" type="textarea" v-model="remark" style="width:600px;" :disabled="currentRow==null||currentRow.isDo==1"></el-input>
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
        <el-tab-pane label="业务单据" name="second">
          <el-table :data="list" element-loading-text="给我一点时间" v-loading="listLoading"
                    header-cell-class-name="table-header-bg text-center" @row-dblclick="handleDblClick"
                    border fit highlight-current-row style="width: 100%">
            <el-table-column sortable align="center" label="序号" type="index"></el-table-column>
            <el-table-column sortable align="center" label="单据类型" prop="blName"></el-table-column>
            <el-table-column sortable align="center" label="单据编号" prop="billNo"></el-table-column>
            <el-table-column sortable align="center" label="客户" prop="cuName"></el-table-column>
            <el-table-column sortable align="center" label="单据日期" prop="bldate" ></el-table-column>
            <el-table-column sortable align="center" label="处理人" prop="creatorName"></el-table-column>
          </el-table>
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
      printImg() {
        this.$parent.printImg()
      }
    }
  }
</script>

<style scoped>

</style>
