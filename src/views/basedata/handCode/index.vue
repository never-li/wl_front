<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container form-wrap">
      <el-form :inline="true" size="small" label-width="80px">
        <el-form-item label="货主">
          <customer-select v-model="queryCondition.custId"></customer-select>
        </el-form-item>
        <el-form-item label="编码前缀">
          <el-input  v-model="queryCondition.code"></el-input>
        </el-form-item>
        <el-form-item label="编码状态">
          <el-select v-model="queryCondition.status" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="已使用" value="1"></el-option>
            <el-option label="正使用" value="2"></el-option>
            <el-option label="未使用" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="search_label">
          <el-button  type="primary" v-waves icon="el-icon-search" @click="query">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-row class="el-row-middle">
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-plus"      @click="handleAdd" >新增</el-button>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-edit" :disabled="!isPermitChange" @click="handleUpdate" >修改</el-button>
      <el-button class="filter-item" type="danger" v-waves icon="el-icon-delete"  :disabled="!isPermitChange" @click="handleDelete" >删除</el-button>
      <el-button class="filter-item" type="primary" v-waves  :disabled="!isPermitStop" @click="stopUse" >终止使用</el-button>
    </el-row>

    <el-table :data="list" element-loading-text="给我一点时间" v-loading="listLoading" border fit highlight-current-row stripe height="545"
              header-cell-class-name="table-header-bg text-center"
              @row-click="handleCurrentChange"
              @row-dblclick="handleDblClick"
              style="width: 100%">
      <el-table-column sortable align="center" label="序号" type="index">
      </el-table-column>
      <el-table-column sortable align="center" label="货主" prop="cuName">

      </el-table-column>

      <el-table-column sortable align="center" label="编码前缀" prop="code">

      </el-table-column>
      <el-table-column sortable align="center" label="序号起始" prop="startCodeSn">

      </el-table-column>
      <el-table-column sortable align="center" label="序号结束" prop="endCodeSn" >

      </el-table-column>
      <el-table-column sortable align="center" label="当前序号" prop="codeSn">
      </el-table-column>
      <el-table-column sortable align="center" label="编码状态" prop="status">
        <template slot-scope="scope">
          {{getStatus(scope.row.status)}}
        </template>
      </el-table-column>
      <el-table-column sortable align="center" label="创建时间" prop="createTime" >
      </el-table-column>
      <el-table-column sortable align="center" label="开始使用时间" prop="openTime">
      </el-table-column>
      <el-table-column sortable align="center" label="结束使用时间" prop="closeTime">
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handlePageChange"
                     :current-page="queryCondition.pageNo" :page-sizes="[10,20,30, 50]" :page-size="queryCondition.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
      <el-form label-position="right" :inline="true" ref="dataForm" :model="formParam" :rules="rule"
               label-width="130px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="货主" >
              <customer-select v-model="formParam.custId"></customer-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编码前缀" prop="code">
              <el-input v-model="formParam.code" maxlength="10" class="input-w-168"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="序号起始" prop="startCodeSn" >
              <el-input-number v-model="formParam.startCodeSn" :min="1" class="input-w-168"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="序号结束" prop="endCodeSn" >
              <el-input-number v-model="formParam.endCodeSn" :min="1" class="input-w-168"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitForm">确 定</el-button>
  </span>
    </el-dialog>



    <el-dialog title="货物编码要求" :visible.sync="getNoDialogVisible" width="40%">
      <el-form label-position="right" :inline="true"
               label-width="130px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="货主" >
              <customer-select v-model="obj.custId" :disabled="true"></customer-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编码前缀" prop="code">
              <el-input v-model="obj.code" maxlength="10" class="input-w-168" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="编码状态" >
              <el-input :value="getStatus(obj.status)" readonly class="input-w-168"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="当前序号" prop="code">
              <el-input v-model="obj.codeSn" maxlength="10" class="input-w-168" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="序号起始" prop="startCodeSn" >
              <el-input v-model="obj.startCodeSn" :min="1" class="input-w-168" readonly ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="序号结束" prop="endCodeSn" >
              <el-input v-model="obj.endCodeSn" :min="1" class="input-w-168" readonly ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="取号" prop="startCodeSn" >
              <number-input  :min="1" :max="20" v-model="obj.num" decimal="10,0"  class="input-w-168"  ></number-input>
              <span>(max:20)</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="numResult!=''">
          <el-col :span="24">
            <el-form-item label="取号结果"  >
              <span style="color:red">{{numResult}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="getHandCode" :disabled="obj.status==1">取 号</el-button>
    <el-button @click="getNoDialogVisible = false">取 消</el-button>

  </span>
    </el-dialog>
  </div>
</template>

<script>
  import { queryList, addCode, updateCode, deleteCode, terminate, getNum } from '@/api/basedata/handCode'
  import waves from '@/directive/waves/index' // 水波纹指令
  import CustomerSelect from '@/components/customerSelect'
  import NumberInput from '@/components/numberInput'
export default {
    name: 'handCode',
    components: {
      NumberInput,
      CustomerSelect
    },
    computed: {
      isPermitChange: function() {
        if (this.isSelectRow && this.currentRow.status === 3) {
          return true
        } else {
          return false
        }
      },
      isPermitStop: function() {
        if (this.isSelectRow && this.currentRow.status === 2) {
          return true
        } else {
          return false
        }
      }
    },
    directives: {
      waves
    },
    data() {
      return {
        numResult: '',
        getNoDialogVisible: false,
        isSelectRow: false,
        queryCondition: {
          status: '',
          code: '',
          custId: '',
          pageNo: 1,
          pageSize: 10
        },
        obj: {
          custId: '',
          code: '',
          startCodeSn: '',
          endCodeSn: ''
        },
        list: [],
        total: null,
        listLoading: true,
        dialogVisible: false,
        currentRow: null,
        dialogTitle: '',
        formParam: {
          custId: '',
          custName: '',
          code: '',
          startCodeSn: 1,
          endCodeSn: 1,
          num: ''
        },
        rule: {
          code: [{ required: true, message: '请输入编码前缀', trigger: 'blur' }]
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
      getStatus(val) {
        switch (val) {
          case 1 : return '已使用'
          case 2 : return '正使用'
          case 3 : return '未使用'
        }
      },
      query() {
        this.queryCondition = Object.assign(this.queryCondition, { pageNo: 1, pageSize: 10 })
        this.getList()
      },
      getList() {
        // this.queryCondition.custId = this.$refs['selectOne'].value
        this.listLoading = true
        queryList(this.queryCondition).then(response => {
          this.list = response.handCodes
          this.total = response.dataSize
          this.listLoading = false
          this.isSelectRow = false
        })
      },
      handleAdd() {
        this.dialogTitle = '新增编码'
        this.doType = 0
        Object.assign(this.formParam, this.defaultData)
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate()
        })
        this.dialogVisible = true
      },
      handleUpdate() {
        this.dialogTitle = '修改编码'
        this.doType = 1
        if (this.currentRow == null) return
        Object.assign(this.formParam, this.currentRow)
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate()
        })
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
        // if (this.$refs['selectTwo'].value === '') {
        //   this.$message({
        //     type: 'info',
        //     message: '请选择货主'
        //   })
        //   return
        // } else {
        //   this.formParam.custId = this.$refs['selectTwo'].value
        //   console.log(this.formParam.custId)
        // }
        if (this.formParam.custId === '') {
          this.$message({
            type: 'info',
            message: '请选择货主'
          })
          return
        }
        addCode(this.formParam).then(response => {
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
        // if (this.$refs['selectTwo'].value === '') {
        //   this.$message({
        //     type: 'info',
        //     message: '请选择货主'
        //   })
        //   return
        // } else {
        //   this.formParam.custId = this.$refs['selectTwo'].value
        // }
        // console.log(this.formParam.custId)
        if (this.formParam.custId === '') {
          this.$message({
            type: 'info',
            message: '请选择货主'
          })
          return
        }
        updateCode(this.formParam).then(response => {
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
      stopUse() {
        const temp = {
          'id': this.currentRow.id
        }
        terminate(temp).then(response => {
          this.$notify({
            title: '成功',
            message: '已停止使用',
            type: 'success',
            duration: 2000
          })
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
          deleteCode(temp).then(response => {
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
      handleDblClick(row) {
        Object.assign(this.obj, row)
        this.numResult = ''
        this.obj.num = ''
        this.getNoDialogVisible = true
      },
      getHandCode() {
        this.$confirm('是否确认取号', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.obj.num && this.obj.num > 0 && this.obj.num <= 20 && this.obj.num < (this.obj.endCodeSn - this.obj.codeSn)) {
            getNum(this.obj).then(response => {
              this.numResult = response.handCode
              this.obj.codeSn = parseInt(this.obj.codeSn) + parseInt(this.obj.num)
              this.getList()
            })
          } else {
            this.$message({
              type: 'warning',
              message: '请正确输入取号数'
            })
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
