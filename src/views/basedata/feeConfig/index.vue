<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container form-wrap">
      <el-form :inline="true" size="small">
        <el-form-item label="免租天数" label-width="80px">
          <el-input placeholder="起始天数" v-model="queryCondition.fromFreeDay"></el-input>
        </el-form-item>
        <el-form-item label="-">
          <el-input placeholder="结束天数" v-model="queryCondition.toFreeDay"></el-input>
        </el-form-item>
        <el-form-item label="设置名称" label-width="80px">
          <el-input v-model="queryCondition.configName"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="出仓单价" label-width="80px">
          <el-input placeholder="最小单价" v-model="queryCondition.fromOutPrice"></el-input>
        </el-form-item>
        <el-form-item label="-">
          <el-input placeholder="最大单价" v-model="queryCondition.toOutPrice"></el-input>
        </el-form-item>
        <el-form-item label="仓租单价" label-width="80px">
          <el-input placeholder="最小单价" v-model="queryCondition.fromDayPrice"></el-input>
        </el-form-item>
        <el-form-item label="-">
          <el-input placeholder="最大单价" v-model="queryCondition.toDayPrice"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-waves icon="el-icon-search" @click="query">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-row class="el-row-middle">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus"
                  @click="handleAdd">新增
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                  :disabled="!isSelectRow" @click="handleUpdate">修改
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete"
                  :disabled="!isSelectRow" @click="handleDelete">删除
      </el-button>
    </el-row>

    <el-table :data="list" element-loading-text="给我一点时间" v-loading="listLoading" border fit highlight-current-row stripe height="545"
              @current-change="handleCurrentChange"
              header-cell-class-name="table-header-bg text-center"
              style="width: 100%">
      <el-table-column sortable align="center" label="序号" type="index">
      </el-table-column>
      <el-table-column sortable align="center" label="设置名称" prop="configName">

      </el-table-column>

      <el-table-column sortable align="center" label="出仓单价" prop="outPrice">

      </el-table-column>
      <el-table-column sortable align="center" label="最小出仓重量" prop="minOutWeight">

      </el-table-column>
      <el-table-column sortable align="center" label="设仓租免费天数" prop="freeDay">

      </el-table-column>
      <el-table-column sortable align="center" label="仓租单价" prop="dayPrice">

      </el-table-column>
      <el-table-column sortable align="center" label="是否有效">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.isValid === 1" readonly></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" label="备注" prop="remark">

      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handlePageChange"
                     :current-page="queryCondition.pageNo" :page-sizes="[10,20,30, 50]" :page-size="queryCondition.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
      <el-form label-position="right" :inline="true" ref="dataForm" :model="formParam" :rules="rules"
               label-width="130px">
        <el-row>
            <el-col :span="12">
            <el-form-item label="设置名称" prop="configName" >
              <el-input v-model="formParam.configName" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出仓单价" prop="outPrice">
              <el-input v-model.number="formParam.outPrice"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="设仓租免费天数" prop="freeDay">
              <el-input v-model.number="formParam.freeDay"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="仓租单价" prop="dayPrice">
              <el-input v-model.number="formParam.dayPrice"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="最小出仓重量" prop="minOutWeight">
              <el-input v-model.number="formParam.minOutWeight"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否有效">
              <el-checkbox v-model="checked"></el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input type="textarea" style="width:530px" v-model="formParam.remark" maxlength="200" placeholder="200字以内"></el-input>
            </el-form-item>
          </el-col>
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
  import { queryList, addConfig, updateConfig, deleteConfig } from '@/api/basedata/feeConfig'
  import waves from '@/directive/waves/index' // 水波纹指令
  export default {
    name: 'feeConfig',
    directives: {
      waves
    },
    data() {
      return {
        isSelectRow: false,
        queryCondition: {
          configName: null,
          fromDayPrice: null,
          fromFreeDay: null,
          fromOutPrice: null,
          pageNo: 1,
          pageSize: 10,
          toDayPrice: null,
          toFreeDay: null,
          toOutPrice: null
        },
        list: null,
        total: null,
        listLoading: true,
        dialogVisible: false,
        currentRow: null,
        dialogTitle: '',
        checked: true,
        formParam: {
          configName: '',
          dayPrice: '',
          freeDay: '',
          isValid: 1,
          minOutWeight: '',
          outPrice: '',
          remark: ''
        },
        rules: {
          configName: [{ required: true, message: '请输入设置名称', trigger: 'blur' }],
          dayPrice: [{ type: 'number', required: true, message: '请输入出仓单价', trigger: 'blur' }],
          freeDay: [{ type: 'number', required: true, message: '请输入免费天数', trigger: 'blur' }],
          minOutWeight: [{ type: 'number', required: true, message: '请输入最小出仓重量', trigger: 'blur' }],
          outPrice: [{ type: 'number', required: true, message: '请输入仓租单价', trigger: 'blur' }]
        },
        defaultData: null,
        doType: 0
      }
    },
    mounted() {
      this.defaultData = JSON.parse(JSON.stringify(this.formParam))
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
        queryList(this.queryCondition).then(response => {
          this.list = response.list
          this.total = response.datasize
          this.listLoading = false
          this.isSelectRow = false
        })
      },
      handleAdd() {
        this.dialogTitle = '新增操作'
        this.doType = 0
        Object.assign(this.formParam, this.defaultData)
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate()
        })
      },
      handleUpdate() {
        this.dialogTitle = '修改操作'
        this.doType = 1
        Object.assign(this.formParam, this.currentRow)
        this.checked = this.currentRow.isValid === 1
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate()
        })
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
      add() {
        addConfig(this.formParam).then(response => {
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
        updateConfig(this.formParam).then(response => {
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
          deleteConfig(temp).then(response => {
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
    },
    watch: {
      checked: function(val) {
        this.formParam.isValid = val ? 1 : 0
        console.log(this.formParam.isValid)
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
