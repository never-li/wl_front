<template>
  <div class="app-container calendar-list-container">
    <add-tab :isShow="dialogVisible" :currentRow="currentRow" :type="doType" :action="action" @hideTab="hideTab" ></add-tab>
    <div class="filter-container form-wrap">
      <el-form :inline="true" >

        <el-row>
          <el-form-item label="客户全称">
            <el-input  v-model="queryCondition.cuFullName"></el-input>
          </el-form-item>
          <el-form-item label="客户简称">
            <el-input  v-model="queryCondition.cuName"></el-input>
          </el-form-item>
          <el-form-item label="结算方式">
            <pay-select v-model="queryCondition.payMode" ></pay-select>
          </el-form-item>
          <el-form-item label="是否有效">
            <el-checkbox  v-model="queryCondition.isValid" @change="handleRadioChange" :true-label=1 :false-label=0></el-checkbox>
          </el-form-item>
          <el-form-item label="" class="search_label">
            <el-button type="primary" icon="el-icon-search"  @click="query">查询</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <el-row class="el-row-middle">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus"
                  @click="handleAdd">新增
        </el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                  :disabled="!isSelectRow" @click="handleUpdate">修改
        </el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-delete"
                  :disabled="!isSelectRow" @click="handleDelete">删除
        </el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-download" :loading="downloadLoading"
                  @click="handleDownload">导出
        </el-button>
    </el-row>

    <el-table :data="list" element-loading-text="给我一点时间" v-loading="listLoading" border fit highlight-current-row stripe height="545"
               header-cell-class-name="table-header-bg text-center"
              @current-change="handleCurrentChange" @row-dblclick="handleDoubleClick"

              style="width: 100%">
      <el-table-column sortable align="center" label="序号" type="index">
      </el-table-column>
      <el-table-column sortable align="center" label="客户全称" prop="cuFullName" min-width="200"></el-table-column>
      <el-table-column sortable align="center" label="客户简称" prop="cuName"></el-table-column>
      <el-table-column sortable align="center" label="结算方式" prop="payMode"></el-table-column>
      <el-table-column sortable align="center" label="业务联系人" prop="cuLinkman"></el-table-column>
      <el-table-column sortable align="center" label="业务人联系人手机" prop="cuMobile" min-width="120"></el-table-column>
      <el-table-column sortable align="center" label="业务人联系人电话" prop="cuTel" min-width="120"></el-table-column>
      <el-table-column sortable align="center" label="有效">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.isValid === 1" readonly></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" label="创建人" prop="creater"  ></el-table-column>
      <el-table-column sortable align="center" label="创建时间" prop="createTime" min-width="120" ></el-table-column>
      <el-table-column sortable align="center" label="修改人" prop="editor" ></el-table-column>
      <el-table-column sortable align="center" label="修改时间" prop="editTime" min-width="120" ></el-table-column>

    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handlePageChange"
                     :current-page="queryCondition.pageNo" :page-sizes="[10,20,30, 50]" :page-size="queryCondition.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>



</template>
<script>
  import { queryList, deleteCustomer } from '@/api/basedata/customer'
  import waves from '@/directive/waves/index' // 水波纹指令
  import addTab from '@/views/basedata/customer/add'
  import paySelect from '@/components/payModeSelect'
  export default {
    name: 'customer',
    directives: {
      waves
    },
    components: {
      addTab,
      paySelect
    },
    data() {
      return {
        action: '',
        isSelectRow: false,
        queryCondition: {
          pageNo: 1,
          pageSize: 10,
          cuFullName: '',
          cuName: '',
          payMode: '',
          isValid: 1
        },
        list: null,
        total: null,
        listLoading: true,
        dialogVisible: false,
        currentRow: null,
        dialogTitle: '',
        doType: 0,
        downloadLoading: false
      }
    },
    mounted() {
      this.getList()
      const _this = this
      document.onkeydown = function(e) { // shift事件
        const _key = window.event.keyCode
        if (_key === 13) {
          _this.query()
        }
      }
    },
    methods: {
      handleRadioChange(val) {
        this.query()
      },
      hideTab() {
        this.dialogVisible = false
      },
      query() {
        this.queryCondition = Object.assign(this.queryCondition, { pageNo: 1, pageSize: 10 })
        this.getList()
      },
      getList() {
        this.listLoading = true
        queryList(this.queryCondition).then(response => {
          this.list = response.customers
          this.total = response.dataSize
          this.listLoading = false
          this.isSelectRow = false
        })
      },
      handleAdd() {
        this.action = 'add'
        this.doType = 0
        this.dialogVisible = true
      },
      handleUpdate() {
        this.action = 'update'
        this.doType = 1
        this.dialogVisible = true
      },
      handleCurrentChange(val) {
        this.currentRow = val
        this.isSelectRow = true
      },
      handleDelete() {
        var id = this.currentRow.id
        this.$confirm('此操作将会删除相关数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const temp = {
            'id': id
          }
          deleteCustomer(temp).then(response => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      handleSizeChange(val) {
        this.queryCondition.pageSize = val
        this.getList()
      },
      handlePageChange(val) {
        this.queryCondition.pageNo = val
        this.getList()
      },
      handleDownload() {
        this.downloadLoading = true
        this.list.forEach(function(item, index) {
          item.index = index + 1
          item.validDes = item.isValid === 1 ? '是' : '否'
        })
        require.ensure([], () => {
          const { export_json_to_excel } = require('@/vendor/Export2Excel')
          const tHeader = ['序号', '客户全称', '客户简称', '结算方式', '业务联系人', '业务人联系人手机', '业务人联系人电话', '有效', '创建人', '创建时间', '修改人', '修改时间']
          const filterVal = ['index', 'cuFullName', 'cuName', 'payMode', 'cuLinkman', 'cuMobile', 'cuTel', 'validDes', 'creater', 'createTime', 'editor', 'editTime']
          const list = this.list
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '客户资料')
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      handleDoubleClick(val) {
        this.action = 'views'
        this.doType = 1
        this.dialogVisible = true
      }
    }
  }
</script>
<style lang="scss" scoped>
.addTab{position: absolute;width:100%;height:100%;background: white;z-index: 9999;}
</style>
