<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container form-wrap">
      <el-form :inline="true" size="small" label-width="80px">
        <el-form-item label="仓库名称">
          <el-input  v-model="queryCondition.storeName"></el-input>
        </el-form-item>
        <el-form-item label="是否有效">
          <el-select v-model="queryCondition.isValid" placeholder="请选择">
            <el-option label="全部" value="" ></el-option>
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-waves icon="el-icon-search" @click="query">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-row class="el-row-middle">
        <el-button class="filter-item" type="primary" v-waves icon="el-icon-plus"      @click="handleAdd" >新增</el-button>
        <el-button class="filter-item" type="primary" v-waves icon="el-icon-edit" :disabled="!isSelectRow" @click="handleUpdate" >修改</el-button>
        <el-button class="filter-item" type="danger" v-waves icon="el-icon-delete"  :disabled="!isSelectRow" @click="handleDelete" >删除</el-button>
        <el-button class="filter-item" type="danger" v-waves :disabled="ifMaintaining" @click="handleUpdateMaintaining(1)">吊机维修</el-button>
        <el-button class="filter-item" type="primary" v-waves :disabled="ifFinish" @click="handleUpdateMaintaining(0)">维修完成</el-button>
    </el-row>

    <el-table :data="list" element-loading-text="给我一点时间" v-loading="listLoading" border fit highlight-current-row stripe height="545"
              @row-click="handleCurrentChange"
              header-cell-class-name="table-header-bg text-center"
              style="width: 100%">
      <el-table-column sortable align="center" label="序号" type="index">
      </el-table-column>
      <el-table-column sortable align="center" label="仓库名称" prop="storeName">

      </el-table-column>

      <el-table-column sortable align="center" label="区域" prop="area">

      </el-table-column>
      <el-table-column sortable align="center" label="位置" prop="position">

      </el-table-column>
      <el-table-column sortable align="center" label="是否已满" >
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.isFull === 1" readonly></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" label="是否有效">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.isValid === 1" readonly></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" label="是否物联网仓" >
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.isIot === 1" readonly></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" label="是否加工仓" >
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.isMach === 1" readonly></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" label="维护中" >
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.maintaining === 1" readonly></el-checkbox>
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

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="60%">
      <el-form label-position="right" :inline="true" ref="dataForm" :model="formParam" :rules="rule"
               label-width="130px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="仓库名称" prop="storeName" >
              <el-input v-model="formParam.storeName" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属区域" prop="area" >
              <el-input v-model="formParam.area" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="位置" prop="position" >
              <el-input v-model="formParam.position" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">  <el-form-item label="是否已满"> <el-checkbox v-model="isFullFlag"></el-checkbox> </el-form-item></el-col>
          <el-col :span="8">  <el-form-item label="是否有效"><el-checkbox v-model="isValidFlag"></el-checkbox> </el-form-item></el-col>
          <el-col :span="8">  <el-form-item label="是否物联网仓"><el-checkbox v-model="isIotFlag"></el-checkbox> </el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col :span="8">  <el-form-item label="是否加工仓"><el-checkbox v-model="isMachFlag"></el-checkbox>  </el-form-item></el-col>
        </el-row>
        <el-row>
          <el-form-item label="备注">
          <el-input type="textarea" style="width:600px" v-model="formParam.remark" maxlength="200" placeholder="200字以内"></el-input>
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
  import { queryList, addStore, updateStore, deleteStore, updateMaintaining } from '@/api/basedata/store'
  import waves from '@/directive/waves/index' // 水波纹指令
  export default {
    name: 'store',
    directives: {
      waves
    },
    data() {
      return {
        isSelectRow: false,
        queryCondition: {
          isValid: '',
          storeName: '',
          pageNo: 1,
          pageSize: 10
        },
        list: [],
        total: null,
        listLoading: true,
        dialogVisible: false,
        currentRow: null,
        dialogTitle: '',
        isValidFlag: true,
        isMachFlag: false,
        isIotFlag: false,
        isFullFlag: false,
        formParam: {
          storeName: '',
          area: '',
          position: '',
          isFull: 0,
          isIot: 0,
          isMach: 0,
          isValid: 1,
          remark: ''
        },
        rule: {
          storeName: [{ required: true, message: '请输入仓库名称', trigger: 'blur' }]
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
          this.list = response.stores
          this.total = response.datasize
          this.listLoading = false
          this.isSelectRow = false
        })
      },
      handleAdd() {
        this.dialogTitle = '资料新增'
        this.doType = 0
        this.isValidFlag = true
        this.isMachFlag = false
        this.isIotFlag = false
        this.isFullFlag = false
        Object.assign(this.formParam, this.defaultData)
        this.dialogVisible = true
      },
      handleUpdate() {
        this.dialogTitle = '资料修改'
        this.doType = 1
        if (this.currentRow == null) return
        Object.assign(this.formParam, this.currentRow)
        this.isValidFlag = this.currentRow.isValid === 1
        this.isFullFlag = this.currentRow.isFull === 1
        this.isIotFlag = this.currentRow.isIot === 1
        this.isMachFlag = this.currentRow.isMach === 1
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
        addStore(this.formParam).then(response => {
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
        updateStore(this.formParam).then(response => {
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
          deleteStore(temp).then(response => {
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
      handleUpdateMaintaining(val) {
        var id = this.currentRow.id
        const tmp = {
          'id': id,
          'maintaining': val
        }
        updateMaintaining(tmp).then(response => {
          this.$notify({
            title: '成功',
            message: '修改状态成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
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
    computed: {
      ifMaintaining: function() {
        if (this.isSelectRow && (this.currentRow.maintaining !== 1)) {
          return false
        } else {
          return true
        }
      },
      ifFinish: function() {
        if (this.isSelectRow && (this.currentRow.maintaining === 1)) {
          return false
        } else {
          return true
        }
      }
    },
    watch: {
      isFullFlag: function(val) {
        this.formParam.isFull = val ? 1 : 0
      },
      isIotFlag: function(val) {
        this.formParam.isIot = val ? 1 : 0
      },
      isMachFlag: function(val) {
        this.formParam.isMach = val ? 1 : 0
      },
      isValidFlag: function(val) {
        this.formParam.isValid = val ? 1 : 0
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
