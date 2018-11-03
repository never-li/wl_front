<template>
  <div class="app-container">
    <div class="form-wrap">
      <el-form :inline="true" size="small" label-width="80px">
        <el-form-item label="钢厂名称">
          <el-input v-model="searchItem.factoryName" maxlength="20" class="input-w-168"></el-input>
        </el-form-item>
      </el-form>
    </div>


    <div class="btn-group-container">
      <el-button  type="primary" @click="handleAdd" icon="el-icon-plus">新增</el-button>
      <el-button  type="primary" @click="handleUpdate" icon="el-icon-edit-outline" :disabled="!currentRow" >修改</el-button>
      <el-button  type="danger" @click="handleDelete" icon="el-icon-delete" :disabled="!currentRow">删除</el-button>
      <el-button  type="primary" @click="getList" icon="el-icon-refresh">刷新</el-button>
    </div>
    <el-table :data="list" element-loading-text="给我一点时间" v-loading="listLoading" border fit highlight-current-row stripe height="545"
              header-cell-class-name="table-header-bg text-center"
              @current-change="handleCurrentChange"
              style="width: 100%">
      <el-table-column sortable align="center" label="序号" type="index">
      </el-table-column>
      <el-table-column sortable align="center" label="钢厂名称" prop="factoryName"></el-table-column>
      <el-table-column sortable align="center" label="二维码钢厂名称" prop="qrcodeFactory"></el-table-column>
      <el-table-column sortable align="center" label="排序" prop="orderNo"></el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handlePageChange"
                     :current-page="searchItem.pageNo" :page-sizes="[10,20,30, 50]" :page-size="searchItem.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="35%">
      <el-form label-position="right" :inline="true" ref="dataForm" :model="formParam" :rules="rules"
               label-width="150px" size="small">
        <el-row>
            <el-form-item label="钢厂名称" prop="factoryName" >
              <el-input v-model="formParam.factoryName" maxlength="20" style="width:300px"></el-input>
            </el-form-item>
        </el-row>
          <el-row>
            <el-form-item label="排序" prop="orderNo">
              <el-input v-model.number="formParam.orderNo"  style="width:300px"></el-input>
            </el-form-item>
        </el-row>
        <el-row>
            <el-form-item label="二维码钢厂名称" prop="qrcodeId" >
              <factory-qrcode-select v-model="formParam.qrcodeId"  style="width:300px" ></factory-qrcode-select>
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
  import * as api from '@/api/basedata/factory'
  import FactoryQrcodeSelect from '@/components/factoryQrcodeSelect'

export default {
    name: 'factory',
    components: { FactoryQrcodeSelect },
    data() {
      return {
        list: [],
        listLoading: false,
        searchItem: {
          factoryName: '',
          pageSize: 10,
          pageNo: 1
        },
        formParam: {
          factoryName: '',
          orderNo: '',
          qrcodeId: ''
        },
        currentRow: null,
        isSelectRow: false,
        total: 0,
        dialogVisible: false,
        dialogTitle: '',
        defaultData: null,
        doType: 0,
        factoryQRList: [],
        rules: {
          factoryName: [{ required: true, message: '请输入钢厂名称', trigger: 'blur' }]
        }
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
      search() {
        this.pageNo = 1
        this.getList()
      },
      getList() {
        this.listLoading = true
        api.list(this.searchItem).then(response => {
          this.list = response.factorys
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
      submitForm() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.doType ? this.update() : this.add()
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      handleAdd() {
        this.dialogTitle = '新增操作'
        this.doType = 0
        this.formParam = this.defaultData
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate()
        })
      },
      handleUpdate() {
        this.dialogTitle = '修改操作'
        this.doType = 1
        Object.assign(this.formParam, this.currentRow)
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate()
        })
      },
      add() {
        api.add(this.formParam).then(response => {
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
      },
      update() {
        api.update(this.formParam).then(response => {
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
          api.del(temp).then(response => {
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
      }
    }
  }
</script>

<style lang="scss">



</style>
