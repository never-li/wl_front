<template>
  <div class="app-container calendar-list-container">
    <!--<el-select v-model="formParam.accType" placeholder="请选择" class="w-184">-->
      <!--<el-option label="应收" value="1"></el-option>-->
      <!--<el-option label="应付" value="2"></el-option>-->
    <!--</el-select>-->
    <div class="filter-container">
      <el-row class="form-wrap">
        <el-form :inline="true" size="small" label-width="80px">
          <el-form-item label="发布日期">
            <date-range :is-edit="true" v-model="queryCondition.dateArr"></date-range>
          </el-form-item>
          <el-form-item label="标　题">
            <el-input v-model="queryCondition.title" class="input-w-168"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" v-waves icon="el-icon-search" @click="query">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </div>
    <el-row class="el-row-middle">
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-plus" @click="handleAdd">新增</el-button>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-edit" :disabled="!isSelectRow" @click="handleUpdate">修改 </el-button>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-delete" :disabled="!isSelectRow"  @click="handleDelete">删除</el-button>
    </el-row>

    <el-table :data="list" element-loading-text="给我一点时间" v-loading="listLoading" border fit highlight-current-row stripe height="545"
              @row-click="handleSelectRow"
              @cell-dblclick="handleUpdate"
              header-cell-class-name="table-header-bg text-center"
              style="width: 100%">
      <el-table-column sortable align="center" label="序号" type="index"></el-table-column>
      <el-table-column sortable align="center" label="标题" prop="title"></el-table-column>
      <el-table-column sortable align="center" label="发布时间" prop="createTime"></el-table-column>
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
               label-width="50px">
        <el-row>
            <el-form-item label="标题" prop="title">
              <el-input v-model.trim="formParam.title" maxlength="50" class="input-w-238"></el-input>
            </el-form-item>
        </el-row>
        <el-row>
          <quill-editor v-model="formParam.content"
            ref="QuillEditor"
            @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
            @change="onEditorChange($event)"
            @ready="onEditorReady($event)">
          </quill-editor>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取消</el-button>
    <el-button type="primary" :disabled="btnDisabled" @click="() => dialogStatus==='create' ? createData() : updateData()" v-if="dialogStatus==='create'||formParam.memberId">保存</el-button>
  </span>
    </el-dialog>
    <!--<div v-html="contentDetail"></div>-->

  </div>
</template>

<script>
  import * as api from '@/api/basedata/announce'
  import waves from '@/directive/waves/index' // 水波纹指令
  import dateRange from '@/components/dateRange'
  import { quillEditor } from 'vue-quill-editor'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import { dateFormat } from '@/utils'
  export default {
    name: 'announce',
    directives: {
      waves
    },
    components: {
      dateRange,
      quillEditor
    },
    data() {
      return {
        isSelectRow: false,
        queryCondition: {
          dateArr: [],
          title: '',
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
          id: '', title: '', content: '', memberId: ''
        },
        rule: {
          title: [{ required: true, message: '标题不能为空', trigger: 'blur' }]
        },
        // contentDetail: ''
        btnDisabled: false
      }
    },
    mounted() {
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      this.queryCondition.dateArr = [dateFormat(start, 'yyyy-MM-dd'), dateFormat(new Date(), 'yyyy-MM-dd')]
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
          this.list = response.announces
          this.total = response.dataSize
          this.listLoading = false
          this.isSelectRow = false
        })
      },
      handleAdd() {
        this.dialogStatus = 'create'
        this.formParam = Object.assign(this.formParam, { title: '', content: '', memberId: '' })
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate()
        })
      },
      handleUpdate() {
        const that = this
        this.dialogStatus = 'update'
        if (this.currentRow == null) return
        this.listLoading = true
        api.detail({ id: this.currentRow.id }).then(response => {
          this.formParam = response.detail
          this.dialogVisible = true
          this.$nextTick(() => {
            that.$refs.dataForm.clearValidate()
          })
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      },
      createData() {
        this.btnDisabled = true
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.formParam.isValid = this.formParam.validFlag ? 1 : 0
            api.add(this.formParam).then(response => {
              this.$notify({
                title: '成功',
                message: '新增成功',
                type: 'success',
                duration: 2000
              })
              this.btnDisabled = false
              this.dialogVisible = false
              this.getList()
            }).catch(() => {
              this.btnDisabled = false
            })
          } else {
            this.btnDisabled = false
          }
        })
      },
      updateData() {
        this.btnDisabled = true
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.formParam.isValid = this.formParam.validFlag ? 1 : 0
            api.update(this.formParam).then(response => {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              this.btnDisabled = false
              this.dialogVisible = false
              this.formParam = Object.assign(this.formParam, this.defaultData)
              this.getList()
            }).catch(() => {
              this.btnDisabled = false
            })
          } else {
            this.btnDisabled = false
          }
        })
      },
      handleSelectRow(row) {
        this.currentRow = row
        if (this.currentRow.memberId !== null && this.currentRow.memberId !== '') {
          this.isSelectRow = true
        }
      },
      handleDelete() {
        this.$confirm('此操作将会删除相关数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.del({ id: this.currentRow.id }).then(response => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        })
      },
      onEditorChange({ editor, html, text }) {
        // this.contentDetail = html
      },
      onEditorFocus() {

      },
      onEditorReady() {

      },
      onEditorBlur() {

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
<style lang="scss">

</style>
