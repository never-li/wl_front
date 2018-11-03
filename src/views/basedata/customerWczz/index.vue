<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container form-wrap">
      <el-form :inline="true" label-width="80px" size="small">
        <el-row>
          <el-form-item label="开通日期">
            <date-range :is-edit="true" v-model="queryCondition.dateArr"></date-range>
          </el-form-item>
          <el-form-item label="客户全称">
            <el-input v-model="queryCondition.cuFullName" class="input-w-168"></el-input>
          </el-form-item>
          <el-form-item label="自助平台账号"  label-width="100px">
            <el-input v-model="queryCondition.account"  class="input-w-168"></el-input>
          </el-form-item>

        </el-row>
        <el-row>
          <el-form-item label="开通状态">
            <el-select v-model="queryCondition.isOpenUp" class="w-238">
              <el-option label="全部" value=""></el-option>
              <el-option label="已开通" value="1"></el-option>
              <el-option label="未开通" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="启用状态">
            <el-select v-model="queryCondition.isValid"  class="input-w-168">
              <el-option label="全部" value=""></el-option>
              <el-option label="启用" value="1"></el-option>
              <el-option label="停用" value="0"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item class="search_label">
            <el-button type="primary" v-waves icon="el-icon-search" @click="query">查询</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <el-row class="el-row-middle">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" :disabled="!isSelectRow || !addBtnShow" @click="handleAdd">账号分配</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" :disabled="!isSelectRow || !resetBtnShow" @click="handleResetPassword">重置密码</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" :disabled="!isSelectRow || !isValidBtnShow" @click="handleValid">{{validMsg}}</el-button>
    </el-row>

    <el-table :data="list" element-loading-text="给我一点时间" v-loading="listLoading" border fit highlight-current-row stripe height="545"
              @current-change="handleCurrentChange"
              header-cell-class-name="table-header-bg text-center"
              style="width: 100%">
      <el-table-column sortable align="center" label="序号" type="index">
      </el-table-column>
      <el-table-column sortable align="center" label="客户" prop="cuFullName" min-width="200"></el-table-column>
      <el-table-column sortable align="center" label="自助平台账号" prop="account"></el-table-column>
      <el-table-column sortable align="center" label="开通状态">
        <template slot-scope="scope">
          <span v-if="scope.row.account !==null && scope.row.account !==''" style="color: #e792ba;">已开通</span>
          <span v-else>未开通</span>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" label="业务联系人" prop="cuLinkman"></el-table-column>
      <el-table-column sortable align="center" label="业务人联系人手机" prop="cuMobile" min-width="120"></el-table-column>
      <el-table-column sortable align="center" label="启用状态">
        <template slot-scope="scope">
          <span v-if="scope.row.isValid===1" style="color: #e792ba;">启用</span>
          <span v-if="scope.row.isValid===0">停用</span>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" label="创建人" prop="creatorName"></el-table-column>
      <el-table-column sortable align="center" label="开通时间" prop="createTime" min-width="120"></el-table-column>
      <el-table-column sortable align="center" label="修改人" prop="editorName"></el-table-column>
      <el-table-column sortable align="center" label="修改时间" prop="editTime" min-width="120"></el-table-column>

    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handlePageChange"
                     :current-page="queryCondition.pageNo" :page-sizes="[10,20,30, 50]"
                     :page-size="queryCondition.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog title="账号分配" :visible.sync="dialogVisible" width="30%">
      <el-form label-position="right" :inline="true" ref="dataForm" :model="formData" :rules="rule"
               label-width="130px">
        <el-row>
            <el-form-item label="公司名称">
              <span>{{formData.cuFullName}}</span>
            </el-form-item>
        </el-row>
        <el-row>
            <el-form-item label="登录账号" prop="account">
              <el-input v-model="formData.account" class="w-238"></el-input>
            </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="登录密码" prop="password">
            <el-input type="password" v-model="formData.password" class="w-238"></el-input>
          </el-form-item>
        </el-row>

      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitForm">确 定</el-button>
  </span>
    </el-dialog>

  </div>


</template>
<script>
  import * as api from '@/api/basedata/customerWczz'
  import waves from '@/directive/waves/index' // 水波纹指令
  // import addTab from '@/views/basedata/customer/add'
  import dateRange from '@/components/dateRange'

  export default {
    name: 'customerWczz',
    directives: {
      waves
    },
    components: {
      dateRange
    },
    data() {
      return {
        isSelectRow: false,
        addBtnShow: false,
        resetBtnShow: false,
        isValidBtnShow: false,
        queryCondition: {
          pageNo: 1,
          pageSize: 10,
          cuFullName: '',
          account: '',
          payMode: '',
          isValid: '',
          isOpenUp: '',
          dateArr: []
        },
        list: null,
        total: null,
        listLoading: true,
        dialogVisible: false,
        currentRow: null,
        validMsg: '启用',
        formData: {},
        rule: {
          account: [{ required: true, message: '请输入登录账号', trigger: 'blur' }],
          password: [{ required: true, message: '请输入登录密码', trigger: 'blur' }]
        }
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
      query() {
        this.queryCondition = Object.assign(this.queryCondition, { pageNo: 1, pageSize: 10 })
        this.getList()
      },
      getList() {
        if (this.queryCondition.dateArr.length > 0) {
          this.queryCondition.fromDate = this.queryCondition.dateArr[0]
          this.queryCondition.toDate = this.queryCondition.dateArr[1]
        }
        this.listLoading = true
        api.list(this.queryCondition).then(response => {
          this.list = response.list
          this.total = response.dataSize
          this.listLoading = false
          this.isSelectRow = false
        })
      },
      handleAdd() {
        this.dialogVisible = true
      },
      submitForm() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            api.addAccount(this.formData).then(response => {
              this.getList()
              this.dialogVisible = false
              this.$notify({
                title: '成功',
                message: '分配成功',
                type: 'success',
                duration: 2000
              })
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      handleResetPassword() {
        if (!this.currentRow) {
          this.$message({
            type: 'error',
            message: '请先选择要重置密码的客户'
          })
          return false
        }
        this.$confirm('确定将【' + this.currentRow.cuFullName + '】自助账号的密码重置为"123456"?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          api.resetPassword(this.currentRow).then(response => {
            this.$notify({
              title: '成功',
              message: '重置成功',
              type: 'success',
              duration: 2000
            })
            this.listLoading = false
          }).catch(() => {
            this.listLoading = false
          })
        })
      },
      handleCurrentChange(val) {
        this.currentRow = val
        Object.assign(this.formData, this.currentRow)
        this.isSelectRow = true
        if (this.currentRow.account !== null && this.currentRow.account !== '') {
          this.addBtnShow = false
          this.resetBtnShow = true
          this.isValidBtnShow = true
          if (this.currentRow.isValid === 1) {
            this.validMsg = '停用'
          } else {
            this.validMsg = '启用'
          }
        } else {
          this.addBtnShow = true
          this.resetBtnShow = false
          this.isValidBtnShow = false
        }
      },
      handleValid() {
        if (!this.currentRow) {
          this.$message({
            type: 'error',
            message: '请先选择要重置密码的客户'
          })
          return false
        }
        this.$confirm('确定' + this.validMsg + '【' + this.currentRow.cuFullName + '】的自助账号?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.updateValid(this.currentRow).then(response => {
            this.$notify({
              title: '成功',
              message: this.validMsg + '成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
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
      }
    },
    watch: {
      checked: function(val) {
        this.queryCondition.isValid = val ? 1 : 0
      }
    }
  }
</script>
<style lang="scss" scoped>
  .addTab {
    position: absolute;
    width: 100%;
    height: 100%;
    background: white;
    z-index: 9999;
  }
</style>
