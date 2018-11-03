<template>
  <div class="app-container">
    <div v-show="action==='home'">
    <div class="form-wrap" >
      <el-form :inline="true" size="small" label-width="80px">
        <el-row>
        <el-form-item label="单据日期">
          <date-range :is-edit="true" v-model="dateArr"></date-range>
        </el-form-item>
        <el-form-item label="客户">
          <customer-select v-model="searchItem.custId"></customer-select>
        </el-form-item>
        <el-form-item label="传真号">
          <el-input v-model="searchItem.cuTel" class="input-w-168"></el-input>
        </el-form-item>
          <el-form-item label="" class="search_label">
        <el-button  type="primary" @click="search" size="mini" icon="el-icon-search">查询</el-button>
            </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="处理状态">
            <el-radio-group v-model="searchItem.isSend" @change="handleRadioChange">
              <el-radio v-for="item in isSendList" :label="item.label" :key="item.label">{{item.name}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>

      </el-form>
    </div>
    <el-row class="btn-group-container">
        <el-button  type="primary" @click="resend" >重新发送</el-button>
    </el-row>


    <el-table :data="list" element-loading-text="给我一点时间" v-loading="listLoading" border fit highlight-current-row stripe height="545"
              @current-change="handleCurrentChange" @row-dblclick="jump('views')" header-cell-class-name="table-header-bg text-center"
              style="width: 100%">
      <el-table-column sortable align="center" label="序号" type="index">
      </el-table-column>
      <el-table-column sortable align="center" label="客户" prop="cuName"></el-table-column>
      <el-table-column sortable align="center" label="传真号" prop="cuTel"></el-table-column>
      <el-table-column sortable align="center" label="业务类型" prop="blName"></el-table-column>
      <el-table-column sortable align="center" label="状态" prop="sendStatus">
        <template slot-scope="scope">
          <span v-if="scope.row.isSend == -1" style="color:indianred">发送失败</span>
          <span v-else-if="scope.row.isSend == 2" style="color:#008de7;">已发送</span>
          <span v-else >发送中</span>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" label="传真发送时间" prop="endTime"></el-table-column>
      <el-table-column sortable align="center" label="处理人" prop="userName"></el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handlePageChange"
                     :current-page="searchItem.pageNo" :page-sizes="[10,20,30, 50]" :page-size="searchItem.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    </div>

    <views v-if="action=='views'" :currentRow="currentRow" @jump="jump" :picList="picList"></views>
  </div>
</template>

<script>
  import * as api from '@/api/fax/faxsend/faxsend'
  import * as common from '@/utils'
  import dateRange from '@/components/dateRange'
  import customerSelect from '@/components/customerSelect'
  import views from './views'
  import 'viewerjs/dist/viewer.css'
  import Viewer from 'v-viewer'
  import Vue from 'vue'

  Vue.use(Viewer)

  export default {
    name: 'faxsend',
    components: {
      dateRange,
      customerSelect,
      views
    },
    data() {
      return {
        list: [],
        listLoading: false,
        dateArr: [common.leastWeekDate()[0], common.leastWeekDate()[1]],
        isSendList: [
          { 'label': '', 'name': '全部' },
          { 'label': -1, 'name': '发送失败' },
          { 'label': 1, 'name': '发送中' },
          { 'label': 2, 'name': '已发送' }
        ],
        searchItem: {
          custId: '',
          cuTel: '',
          pageSize: 10,
          pageNo: 1,
          fromEndTime: '',
          toEndTime: '',
          isSend: ''
        },
        formParam: {
          remark: '',
          faxType: 3
        },
        picList: [],
        currentRow: null,
        isSelectRow: false,
        total: 0,
        defaultData: null,
        action: 'home'
      }
    },
    mounted() {
      this.defaultData = JSON.parse(JSON.stringify(this.formParam))
      this.getList()
      const _this = this
      document.onkeydown = function(e) { // shift事件
        const _key = window.event.keyCode
        if (_key === 13) {
          _this.search()
        }
      }
    },
    methods: {
      handleRadioChange(val) {
        this.search()
      },
      jump(action) {
        if (action === 'views') {
          this.showFaxImg(this.currentRow.id, this.currentRow.pageSize)
        }
        this.action = action
      },
      showFaxImg(faxId, pageSize) {
        this.picList = []
        for (let i = 1; i <= pageSize; i++) {
          api.getImg(faxId).then(res => {
            this.picList.push({ 'picPath': window.URL.createObjectURL(res) })
          })
        }
      },
      search() {
        this.searchItem.pageNo = 1
        this.getList()
      },
      getList() {
        this.listLoading = true
        this.searchItem.fromCreateTime = this.dateArr[0]
        this.searchItem.toCreateTime = this.dateArr[1]
        api.list(this.searchItem).then(response => {
          this.list = response.faxSends
          this.total = response.dataSize
          this.listLoading = false
        })
      },
      handleCurrentChange(val) {
        this.currentRow = val
        this.isSelectRow = true
      },
      handleSizeChange(val) {
        this.searchItem.pageSize = val
        this.getList()
      },
      handlePageChange(val) {
        this.searchItem.pageNo = val
        this.getList()
      },
      resend() {
        api.resend(this.currentRow.id).then(response => {
          this.$notify({
            title: '成功',
            message: '重新发送请求提交成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      }
    }
  }
</script>

<style lang="scss">

  .el-dialog__body{
    padding:0;
  }

</style>
