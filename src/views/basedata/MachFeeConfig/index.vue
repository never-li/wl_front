<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container form-wrap">
      <el-form :inline="true" size="small" label-width="80px">
        <el-form-item label="加工类型" @change="handleRadioChange">
           <el-radio v-model="queryCondition.machType" label="1">冷板分条</el-radio>
          <el-radio v-model="queryCondition.machType" label="2">冷板平直</el-radio>
          <el-radio v-model="queryCondition.machType" label="3">热板分条</el-radio>
          <el-radio v-model="queryCondition.machType" label="4">热板平直</el-radio>
        </el-form-item>
        <br>
        <el-form-item label="厚度">
          <el-input  v-model="queryCondition.thick"></el-input>
        </el-form-item>
        <el-form-item label="宽度">
          <el-input  v-model="queryCondition.width"></el-input>
        </el-form-item>
        <el-form-item label="条数/长度">
          <el-input v-model="queryCondition.num"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-waves icon="el-icon-search" @click="query">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-row class="el-row-middle">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" :disabled="!isSelectRow" @click="handleUpdate">修改</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-delete" :disabled="!isSelectRow" @click="handleDelete">删除</el-button>
    </el-row>

    <el-table :data="list" element-loading-text="给我一点时间" v-loading="listLoading" border fit highlight-current-row stripe height="545"
              @current-change="handleCurrentChange"
              header-cell-class-name="table-header-bg text-center"
              style="width: 100%">
      <el-table-column sortable align="center" label="序号" type="index">
      </el-table-column>
      <el-table-column sortable align="center" label="最小厚度" prop="fromThick"></el-table-column>
      <el-table-column sortable align="center" label="最大厚度" prop="toThick"></el-table-column>
      <el-table-column sortable align="center" label="最小宽度" prop="fromWidth"></el-table-column>
      <el-table-column sortable align="center" label="最大宽度" prop="toWidth"></el-table-column>
      <el-table-column sortable align="center" label="最小条数" prop="fromNum"></el-table-column>
      <el-table-column sortable align="center" label="最大条数" prop="toNum"></el-table-column>
      <el-table-column sortable align="center" label="价格(元/吨)" prop="price"></el-table-column>
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

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="55%">
      <el-form label-position="right" :inline="true" ref="dataForm" :model="formParam" :rules="rules"
               label-width="130px">
        <el-row>
            <el-col :span="8">
            <el-form-item label="最小厚度" prop="fromThick" >
              <el-input v-model="formParam.fromThick"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最大厚度" prop="toThick">
              <el-input v-model.number="formParam.toThick"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最小宽度" prop="fromWidth">
              <el-input v-model.number="formParam.fromWidth"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="最大宽度" prop="toWidth">
              <el-input v-model.number="formParam.toWidth"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最小条数" prop="fromNum">
              <el-input v-model.number="formParam.fromNum"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最大条数" prop="toNum">
              <el-input v-model.number="formParam.toNum"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="价格" prop="price">
              <el-input v-model.number="formParam.price"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="加工类型" >
              <el-input v-model="typeName" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否有效">
              <el-checkbox v-model="checked"></el-checkbox>
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
  import { queryList, addConfig, updateConfig, deleteConfig } from '@/api/basedata/MachFeeConfig'
  import waves from '@/directive/waves/index' // 水波纹指令
  export default {
    name: 'MachFeeConfig',
    directives: {
      waves
    },
    data() {
      return {
        isSelectRow: false,
        queryCondition: {
          machType: '1',
          num: '',
          thick: '',
          width: '',
          pageNo: 1,
          pageSize: 10
        },
        list: null,
        total: null,
        listLoading: true,
        dialogVisible: false,
        currentRow: null,
        dialogTitle: '',
        checked: true,
        formParam: {
          isValid: 1,
          fromThick: '',
          toThick: '',
          fromWidth: '',
          toWidth: '',
          fromNum: '',
          toNum: '',
          price: '',
          machType: '1',
          isJuan: 0
        },
        rules: {
          fromThick: [{ required: true, message: '请输入最小厚度', trigger: 'blur' }],
          toThick: [{ required: true, message: '请输入最大厚度', trigger: 'blur' }],
          fromWidth: [{ required: true, message: '请输入最小宽度', trigger: 'blur' }],
          toWidth: [{ required: true, message: '请输入最大宽度', trigger: 'blur' }],
          fromNum: [{ required: true, message: '请输入最小条数', trigger: 'blur' }],
          toNum: [{ required: true, message: '请输入最大条数', trigger: 'blur' }],
          price: [{ required: true, message: '请输入价格', trigger: 'blur' }]
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
      // alert(document.getElementsByTagName('el-radio')[0].html)
    },
    methods: {
      handleRadioChange(val) {
        this.query()
      },
      getTypeName(val) {
        switch (val) {
          case '1': return '冷板分条'
          case '2': return '冷板平直'
          case '3': return '热板分条'
          case '4': return '热板平直'
        }
      },
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
        this.formParam.machType = this.queryCondition.machType
        this.dialogVisible = true
      },
      handleUpdate() {
        this.dialogTitle = '修改操作'
        this.doType = 1
        // 修改前进行对话框赋值
        Object.assign(this.formParam, this.currentRow)
        this.checked = this.currentRow.isValid === 1
        this.formParam.isValid = this.formParam.isValid ? 1 : 0
        this.formParam.machType = this.queryCondition.machType
        this.dialogVisible = true
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
    },
    computed: {
      typeName: function() {
        this.getList()
        return this.getTypeName(this.queryCondition.machType)
      }
    }
  }
</script>
<style lang="scss" scoped>
.el-radio{
  font-weight: bold;
}
</style>
