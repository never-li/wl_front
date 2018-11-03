<template>
  <div class="app-container">
    <el-row class="el-row-middle">
      <el-button class="filter-item" type="primary" @click="refreshData" icon="el-icon-refresh">刷新</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleUpdate" type="primary" icon="el-icon-edit-outline">修改</el-button>
    </el-row>
    <!-- 左侧列表 -->
    <span style="float: left;width: 30%;">
      <el-table @row-click='handleSelect' :data="list" v-loading="listLoading" element-loading-text="数据加载中..." border fit highlight-current-row header-cell-class-name="table-header-bg text-center" height="660" style="width: 100%">
        <el-table-column sortable align="center" label="编码">
          <template slot-scope="scope">
            <span>{{scope.row.code}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable align="center" label="编码名称">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNo" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    </span>
    <!-- 右侧列表 -->
    <span  style="float: left;width: 70%;padding-left: 20px">
      <el-table :data="selectList" border fit highlight-current-row header-cell-class-name="table-header-bg text-center" style="width: 100%;margin-bottom: 20px;">
        <el-table-column sortable align="center" label="编码">
          <template slot-scope="scope">
            <span>{{scope.row.code}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable align="center" label="编码名称">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable align="center" label="备注">
          <template slot-scope="scope">
            <span>{{scope.row.remark}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable align="center" label="可否增加子项">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.dynamicCode===1" :aria-readonly="true"></el-checkbox>
          </template>
        </el-table-column>
      </el-table>

      <el-table :data="dtList" border fit highlight-current-row style="width: 100%;"  header-cell-class-name="table-header-bg text-center" stripe height="545">
        <el-table-column sortable align="center" label="选项编码">
          <template slot-scope="scope">
            <span>{{scope.row.itemCode}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable align="center" label="选项名称">
          <template slot-scope="scope">
            <span>{{scope.row.itemName}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable align="center" label="选项值">
          <template slot-scope="scope">
            <span>{{scope.row.itemValue}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable align="center" label="备注">
          <template slot-scope="scope">
            <span>{{scope.row.remark}}</span>
          </template>
        </el-table-column>
      </el-table>
    </span>

    <!-- 新增修改框 -->
    <el-dialog title="修改" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="moduleInfo" label-position="right" label-width="120px" style='width: 100%'>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="编码：" prop="code">
                <el-input v-model="moduleInfo.code" maxlength="50" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="编码名称：" prop="name">
                <el-input v-model="moduleInfo.name" maxlength="20" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="可增加子项：">
                <el-checkbox v-model="moduleInfo.dynamicFlag" onclick="return false;"></el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="备注：">
            <el-input type="textarea" v-model="moduleInfo.remark" readonly></el-input>
          </el-form-item>

        <el-row>
          <el-button @click="handleAddDt" v-if="moduleInfo.dynamicFlag">新增</el-button>
        </el-row>
        <el-table :data="moduleInfo.dtList" border fit highlight-current-row style="width: 100%">
          <el-table-column sortable align="center" label="选项编码">
            <template slot-scope="scope">
                <el-input v-model.trim="scope.row.itemCode"></el-input>
            </template>
          </el-table-column>
          <el-table-column sortable align="center" label="选项名称">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.itemName"></el-input>
            </template>
          </el-table-column>
          <el-table-column sortable align="center" label="选项值">
            <template slot-scope="scope">
              <el-input v-model="scope.row.itemValue"></el-input>
            </template>
          </el-table-column>
          <el-table-column sortable align="center" label="备注">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark"></el-input>
            </template>
          </el-table-column>
          <el-table-column sortable align="center" label="操作" v-if="moduleInfo.dynamicFlag">
            <template slot-scope="scope">
              <el-button type="danger" @click="handleDeleteDt(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updateData()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { list, dtList, update } from '@/api/basedata/systemcode'
  import waves from '@/directive/waves' // 水波纹指令

  export default {
    name: 'systemCodeManage',
    directives: {
      waves
    },
    data() {
      return {
        listLoading: false,
        selectRow: null,
        selectList: [],
        list: [],
        total: 0,
        dtList: [],
        listQuery: {
          pageNo: 1,
          pageSize: 20
        },
        dialogFormVisible: false,
        dialogStatus: '',
        formView: {},
        moduleInfo: {
          code: '',
          name: ''
        },
        rules: {
          code: [{ required: true, message: '编码不能为空', trigger: 'blur' }],
          name: [{ required: true, message: '编码名称不能为空', trigger: 'blur' }]
        }
      }
    },
    methods: {
      refreshData() {
        this.selectRow = null
        this.listLoading = true
        this.listQuery = { pageNo: 1, pageSize: 20 }
        this.getList()
      },
      getList() {
        list(this.listQuery).then(response => {
          this.list = response.list
          this.total = response.dataSize
          this.listLoading = false
        }).catch(error => {
          if (error)console.error(error)
          this.listLoading = false
        })
      },
      // 点击行
      handleSelect(row) {
        this.selectRow = row
        this.selectList = [this.selectRow]
        this.formView = row
        this.formView.dynamicFlag = this.formView.dynamicCode === 1
        dtList(this.selectRow.id).then(response => {
          this.dtList = response.list
          this.formView.dtList = this.dtList
        }).catch(error => {
          if (error)console.error(error)
        })
      },
      // 打开修改框
      handleUpdate() {
        if (!this.selectRow) {
          this.$message.warning('请选择要修改的菜单')
          return
        }
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        // 深拷贝
        this.moduleInfo = JSON.parse(JSON.stringify(this.formView))
        this.moduleInfo.dtDelList = []
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate()
        })
      },
      // 修改操作
      updateData() {
        let returnFlag = false
        this.moduleInfo.dtList.forEach(function(dt) {
          if (dt.itemCode === '') {
            returnFlag = true
          }
          if (dt.itemName === '') {
            returnFlag = true
          }
        })
        if (returnFlag) {
          this.$message.warning('选项编码和选项名称必填，请检查')
          return
        }
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.moduleInfo.dynamicCode = this.moduleInfo.dynamicFlag ? 1 : 0
            update(this.moduleInfo).then(() => {
              this.refreshData()
              this.dialogFormVisible = false
              this.handleSelect(this.moduleInfo)
            }).catch(error => {
              if (error)console.error(error)
            })
          }
        })
      },
      handleDeleteDt(right) {
        const index = this.moduleInfo.dtList.indexOf(right)
        this.moduleInfo.dtDelList.push({ id: this.moduleInfo.dtList[index].id })
        this.moduleInfo.dtList.splice(index, 1)
      },
      handleAddDt() {
        this.moduleInfo.dtList.push({ itemCode: '', itemName: '', itemValue: '', remark: '' })
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.pageNo = val
        this.getList()
      }
    },
    created() {
      this.refreshData()
      const _this = this
      document.onkeydown = function(e) { // shift事件
        const _key = window.event.keyCode
        if (_key === 13) {
          _this.refreshData()
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

  .dialog-form{
    &:before{
      content: '';
      display: block;
      position: relative;
      top: -25px;
      border-bottom: 2px solid #2a3950;
    }
  }
  .el-form-item div{
    margin-left: 0;
  }
</style>

