<template>
  <div class="app-container calendar-list-container">
    <!--<el-select v-model="formParam.accType" placeholder="请选择" class="w-184">-->
      <!--<el-option label="应收" value="1"></el-option>-->
      <!--<el-option label="应付" value="2"></el-option>-->
    <!--</el-select>-->
    <div class="filter-container">
      <el-row class="form-wrap">
        <el-form :inline="true" size="small" label-width="80px">
          <el-form-item label="费用名称">
            <el-input v-model="queryCondition.feeName"></el-input>
          </el-form-item>
          <el-form-item label="是否有效">
            <el-select v-model="queryCondition.isValid" placeholder="请选择" class="w-184">
              <el-option label="全部" value=""></el-option>
              <el-option label="有效" value="1"></el-option>
              <el-option label="无效" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" class="search_label">
            <el-button type="primary" v-waves icon="el-icon-search" @click="query">查询</el-button>
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
      <el-table-column sortable align="center" label="费用名称" prop="feeName"></el-table-column>
      <el-table-column sortable align="center" label="单价（元/吨）" prop="price"></el-table-column>
      <el-table-column sortable align="center" label="费用类别" prop="accName"></el-table-column>
      <el-table-column sortable align="center" label="是否有效">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.isValid === 1" readonly></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" label="报表一级分类" prop="class1"></el-table-column>
      <el-table-column sortable align="center" label="报表二级分类" prop="class2"></el-table-column>
      <el-table-column sortable align="center" label="报表三级分类" prop="class3"></el-table-column>
      <el-table-column sortable align="center" label="对应费用单编号" prop="noPrefix"></el-table-column>
      <el-table-column sortable align="center" label="备注" prop="remark"></el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handlePageChange"
                     :current-page="queryCondition.pageNo" :page-sizes="[10,20,30, 50]"
                     :page-size="queryCondition.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="dialogMap[dialogStatus]" :visible.sync="dialogVisible" width="60%">
      <el-form label-position="right" :inline="true" ref="dataForm" :rules="rule" :model="formParam"
               label-width="130px">
        <el-row>
            <el-form-item label="费用名称" prop="feeName">
              <el-input v-model.trim="formParam.feeName" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="单价（元/吨）" prop="price">
              <el-input v-model.number="formParam.price"></el-input>
            </el-form-item>
            <el-form-item label="费用类别" prop="accType">
              <el-select v-model="formParam.accType" placeholder="请选择" class="w-184">
                <el-option
                  v-for="item in accTypes"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
        </el-row>
        <el-row>
            <el-form-item label="报表一级分类" >
              <el-input v-model.trim="formParam.class1" maxlength="15"></el-input>
            </el-form-item>
            <el-form-item label="报表二级分类" >
              <el-input v-model.trim="formParam.class2" maxlength="15"></el-input>
            </el-form-item>
            <el-form-item label="报表三级分类" >
              <el-input v-model.trim="formParam.class3" maxlength="15"></el-input>
            </el-form-item>
        </el-row>
        <el-row>
            <el-form-item label="对应费用单号" >
              <el-input v-model.trim="formParam.noPrefix" maxlength="10"></el-input>
            </el-form-item>
            <el-form-item label="是否有效">
              <el-checkbox v-model="formParam.validFlag"></el-checkbox>
            </el-form-item>
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
  import { list, add, update, del } from '@/api/basedata/feeType'
  import waves from '@/directive/waves/index' // 水波纹指令
  export default {
    name: 'feeType',
    directives: {
      waves
    },
    data() {
      return {
        isSelectRow: false,
        queryCondition: {
          isValid: '',
          feeName: '',
          pageNo: 1,
          pageSize: 10
        },
        accTypes: [
          { name: '应收', value: 1 },
          { name: '应付', value: 2 }
        ],
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
          feeName: '', price: '', accType: '', class1: '', class2: '', class3: '', noPrefix: '', isValid: 1, validFlag: true, remark: ''
        },
        rule: {
          feeName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
          accType: [{ required: true, message: '请选择费用类别', trigger: 'blur' }],
          price: [{ required: true, message: '请输入单价', trigger: 'blur' },
            { type: 'number', message: '单价必须为数字值' }]
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
          this.list = response.feeTypes
          this.total = response.dataSize
          this.listLoading = false
          this.isSelectRow = false
        })
      },
      handleAdd() {
        this.dialogStatus = 'create'
        this.formParam = Object.assign(this.formParam, { feeName: '', price: '', accType: '', class1: '', class2: '', class3: '', noPrefix: '', isValid: 1, validFlag: true, remark: '' })
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate()
        })
      },
      handleUpdate() {
        this.dialogStatus = 'update'
        if (this.currentRow == null) return
        this.currentRow.validFlag = this.currentRow.isValid === 1
        Object.assign(this.formParam, this.currentRow)
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
