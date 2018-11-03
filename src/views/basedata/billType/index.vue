<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container form-wrap">
      <el-form :inline="true" size="small" label-width="80px">
        <el-row style="margin:10px 0;">
          <el-form-item label="单据名称">
            <el-input  v-model="queryCondition.typeName"  @keyup.enter="getList" ></el-input>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <el-row class="el-row-middle">
      <!--<el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus">新增-->
      <!--</el-button>-->
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" :disabled="!isSelectRow" @click="handleUpdate">修改</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="query" icon="el-icon-refresh">刷新</el-button>
    </el-row>

    <el-table  :data="list" element-loading-text="给我一点时间" v-loading="listLoading" border fit highlight-current-row
              @current-change="handleCurrentChange"
              header-cell-class-name="table-header-bg text-center"
              stripe height="550"
              style="width: 100%;table-layout: fixed;">
      <el-table-column sortable align="center" label="序号" type="index">
      </el-table-column>
      <el-table-column sortable align="center" label="单据类型" prop="billType"></el-table-column>
      <!--<el-table-column sortable align="center" label="单据名称" prop="typeName" width="150"></el-table-column>-->
      <el-table-column sortable align="center" label="单据行数" prop="itemNum"></el-table-column>
      <el-table-column sortable align="center" label="打印次数" prop="printNum"></el-table-column>
      <el-table-column sortable align="center" label="审核次数" prop="checkNum"></el-table-column>
      <el-table-column sortable align="center" label="单据前缀" prop="noPrefix"></el-table-column>
      <el-table-column sortable align="center" label="日期格式" prop="noDateFormat"></el-table-column>
      <el-table-column sortable align="center" label="编号长度" prop="noSeqLen"></el-table-column>
      <el-table-column sortable align="center" label="单据说明" >
        <template slot-scope="scope">
          <div  style="width:100%; white-space:nowrap;overflow:hidden;text-overflow: ellipsis;">{{scope.row.sysRemark}}</div>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" label="单据存根" >
        <template slot-scope="scope">
          <div  style="width:100%; white-space:nowrap;overflow:hidden;text-overflow: ellipsis;">{{scope.row.sysStub}}</div>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" label="是否上传">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.isUp === 1" readonly></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" label="报表一级分类" prop="class1"></el-table-column>
        <el-table-column sortable align="center" label="报表二级分类" prop="class2"></el-table-column>
          <el-table-column sortable align="center" label="报表三级分类" prop="class3"></el-table-column>
    </el-table>


    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="55%">
      <el-form label-position="right" :inline="true" ref="dataForm" :model="formParam" :rules="rules"
               label-width="130px">
        <el-row>
            <el-col :span="8">
            <el-form-item label="单据类型" prop="billType" >
              <el-input v-model="formParam.billType" readonly></el-input>
            </el-form-item>
          </el-col>
          <!--<el-col :span="8">-->
            <!--<el-form-item label="单据名称" prop="typeName">-->
              <!--<el-input v-model="formParam.typeName" readonly></el-input>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
          <el-col :span="8">
            <el-form-item label="单据行数" prop="itemNum">
              <el-input v-model.number="formParam.itemNum"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="打印次数" prop="printNum">
              <el-input v-model.number="formParam.printNum"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审核次数" prop="checkNum">
              <el-input v-model.number="formParam.checkNum" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单据前缀" prop="noPreFix">
              <el-input v-model="formParam.noPrefix"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="日期格式" prop="noDateFormat">
              <el-input v-model="formParam.noDateFormat" readonly></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="编号长度" prop="noSeqLen">
              <el-input v-model.number="formParam.noSeqLen"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单据说明" prop="">
              <el-input v-model="formParam.blRemark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="报表一级分类" prop="class1">
              <el-input v-model="formParam.class1"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="报表二级分类" prop="class2">
              <el-input v-model="formParam.class2"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="报表三级分类" prop="class3">
              <el-input v-model="formParam.class3"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否上传" >
              <el-checkbox v-model="checked"></el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单据存根" prop="sysStub">
              <el-input v-model="formParam.blStub"></el-input>
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
  import { queryList, addBill, updateBill, deleteBill } from '@/api/basedata/billType'
  import waves from '@/directive/waves/index' // 水波纹指令
  export default {
    name: 'billType',
    directives: {
      waves
    },
    data() {
      return {
        isSelectRow: false,
        queryCondition: {
          typeName: '',
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
          isUp: 0,
          billType: '',
          typeName: '',
          itemNum: '',
          checkNum: '',
          printNum: '',
          noPrefix: '',
          noDateFormat: '',
          noSeqLen: '',
          blRemark: '',
          class1: '',
          class2: '',
          class3: '',
          blStub: ''
        },
        rules: {
        },
        defaultData: null,
        doType: 0
      }
    },
    mounted() {
      this.defaultData = JSON.parse(JSON.stringify(this.formParam))
      this.getList()
      // alert(document.getElementsByTagName('el-radio')[0].html)
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
      },
      handleUpdate() {
        this.dialogTitle = '修改操作'
        this.doType = 1
        // 修改前进行对话框赋值
        Object.assign(this.formParam, this.currentRow)
        this.checked = this.currentRow.isUp === 1
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
        addBill(this.formParam).then(response => {
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
        updateBill(this.formParam).then(response => {
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
          deleteBill(temp).then(response => {
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
        this.formParam.isUp = val ? 1 : 0
        console.log(this.formParam.isUp)
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
