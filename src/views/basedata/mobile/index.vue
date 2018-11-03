<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-row class="form-wrap">
        <el-form :inline="true" size="small" label-width="80px">
          <el-form-item label="设备名称">
            <el-input v-model="queryCondition.mbName" class="input-w-168"></el-input>
          </el-form-item>
          <el-form-item label="设备型号">
            <el-input v-model="queryCondition.mbModel" class="input-w-168"></el-input>
          </el-form-item>
          <el-form-item label="序列号">
            <el-input v-model="queryCondition.imei" class="input-w-168"></el-input>
          </el-form-item>
          <br/>
          <el-form-item label="MAC">
            <el-input v-model="queryCondition.mac" class="input-w-168"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="queryCondition.isValid" placeholder="请选择" class="input-w-168">
              <el-option label="全部" value=""></el-option>
              <el-option label="有效" value="1"></el-option>
              <el-option label="无效" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="　">
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="query">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </div>
    <el-row class="el-row-middle">
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-plus" @click="handleAdd">新增</el-button>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-edit" :disabled="!isSelectRow" @click="handleUpdate">修改</el-button>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-delete" :disabled="!isSelectRow" @click="handleDelete">删除</el-button>
    </el-row>

    <el-table :data="list" element-loading-text="给我一点时间" v-loading="listLoading" border fit highlight-current-row stripe height="545"
              @row-click="handleSelectRow"
              header-cell-class-name="table-header-bg text-center"
              style="width: 100%">
      <el-table-column sortable align="center" label="序号" type="index"></el-table-column>
      <el-table-column sortable align="center" label="名称" prop="mbName"></el-table-column>
      <el-table-column sortable align="center" label="型号" prop="mbModel"></el-table-column>
      <el-table-column sortable align="center" label="序列号" prop="imei"></el-table-column>
      <el-table-column sortable align="center" label="MAC" prop="mac"></el-table-column>
      <el-table-column sortable align="center" label="IP" prop="ip"></el-table-column>
      <el-table-column sortable align="center" label="备注" prop="remark"></el-table-column>
      <el-table-column sortable align="center" label="是否有效">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.isValid === 1" readonly></el-checkbox>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handlePageChange"
                     :current-page="queryCondition.pageNo" :page-sizes="[10,20,30, 50]"
                     :page-size="queryCondition.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="dialogMap[dialogStatus]" :visible.sync="dialogVisible" width="60%">
      <el-form label-position="right" :inline="true" ref="dataForm" :model="formParam" :rules="rule"
               label-width="130px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="名称" prop="mbName">
              <el-input v-model.trim="formParam.mbName" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="型号">
              <el-input v-model.trim="formParam.mbModel" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="序列号" >
              <el-input v-model.trim="formParam.imei" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="MAC" >
              <el-input v-model.trim="formParam.mac" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="IP" >
              <el-input v-model.trim="formParam.ip" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否有效">
              <el-checkbox v-model="formParam.validFlag"></el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="备注">
            <el-input type="textarea" style="width:600px" v-model="formParam.remark" maxlength="200" placeholder="200字以内"></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取消</el-button>
    <el-button type="primary" @click="() => dialogStatus==='create' ? createData() : updateData()">保存</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
  import { list, add, update, del } from '@/api/basedata/mobile'
  import waves from '@/directive/waves/index' // 水波纹指令
  export default {
    name: 'mobile',
    directives: {
      waves
    },
    data() {
      return {
        isSelectRow: false,
        queryCondition: {
          isValid: '',
          mbName: '',
          mbModel: '',
          imei: '',
          mac: '',
          pageNo: 1,
          pageSize: 10
        },
        list: [],
        total: null,
        listLoading: true,
        dialogVisible: false,
        dialogStatus: '',
        dialogMap: {
          update: '修改',
          create: '新增'
        },
        currentRow: null,
        formParam: {
          mbName: '',
          mbModel: '',
          imei: '',
          mac: '',
          ip: '',
          isValid: 1,
          validFlag: true,
          remark: ''
        },
        rule: {
          mbName: [{ required: true, message: '请输入名称', trigger: 'blur' }]
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
        this.listLoading = true
        list(this.queryCondition).then(response => {
          this.list = response.mobiles
          this.total = response.dataSize
          this.listLoading = false
          this.isSelectRow = false
        })
      },
      handleAdd() {
        this.dialogStatus = 'create'
        this.formParam = Object.assign(this.formParam, { mbName: '', mbModel: '', imei: '', mac: '', ip: '', validFlag: true, remark: '' })
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate()
        })
      },
      handleUpdate() {
        this.dialogStatus = 'update'
        if (this.currentRow == null) return
        this.currentRow.validFlag = this.currentRow.isValid === 1
        this.formParam = Object.assign({}, this.formParam, this.currentRow)
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate()
        })
      },
      createData() {
        if (!this.checkData()) {
          return
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.formParam.isValid = this.formParam.validFlag ? 1 : 0
            add(this.formParam).then(response => {
              this.$notify({
                title: '成功',
                message: '新增成功',
                type: 'success',
                duration: 2000
              })
              this.dialogVisible = false
              Object.assign(this.formParam, this.defaultData)
              this.getList()
            })
          }
        })
      },
      updateData() {
        if (!this.checkData()) {
          return
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.formParam.isValid = this.formParam.validFlag ? 1 : 0
            update(this.formParam).then(response => {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              this.dialogVisible = false
              this.formParam = Object.assign(this.formParam, this.defaultData)
              this.getList()
            })
          }
        })
      },
      checkData() {
        if (this.formParam.imei === '' && this.formParam.mac === '' && this.formParam.ip === '') {
          this.$message('序列号，MAC和IP不能同时为空')
          return false
        }
        return true
      },
      handleSelectRow(row) {
        this.currentRow = row
        this.isSelectRow = true
      },
      handleDelete() {
        this.$confirm('此操作将会删除相关数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          del({ id: this.currentRow.id }).then(response => {
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
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
