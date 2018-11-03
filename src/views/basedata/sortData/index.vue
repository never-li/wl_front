<template>
  <div class="app-container">
    <div class="filter-container form-wrap">
      <el-form :inline="true"  size="small" label-width="80px">
        <el-form-item label="类型名称：">
          <el-input v-model="queryCondition.sortName"></el-input>
        </el-form-item>
        <el-form-item label="品名名称：">
          <el-input v-model="queryCondition.typeName"></el-input>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="queryCondition.isValid" placeholder="请选择">
            <el-option label="全部" value></el-option>
            <el-option label="有效" value="1"></el-option>
            <el-option label="无效" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <el-row class="el-row-middle">
      <el-button class="filter-item" @click="handleCreate" type="primary"
                  icon="el-icon-plus">新增
      </el-button>
      <el-button class="filter-item" @click="handleUpdate" type="primary"
                  icon="el-icon-edit">修改
      </el-button>
      <el-button class="filter-item" @click="handleDelete" type="danger"
                  icon="el-icon-delete">删除
      </el-button>
      <el-button class="filter-item" @click="handleInValid" type="primary"
                  icon="el-icon-edit-outline" :disabled="selectRowFlag">终止使用
      </el-button>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="refreshData">刷新
      </el-button>
    </el-row>
    <!-- 左侧列表 -->
    <div style="float: left;width: 30%;">
      <el-table @row-click='handleSelect' :data="list" v-loading="listLoading" element-loading-text="数据加载中..." border stripe height="545"
                header-cell-class-name="table-header-bg text-center"
                fit highlight-current-row style="width: 100%">
        <el-table-column sortable align="center" label="类型名称">
          <template slot-scope="scope">
            <span>{{scope.row.sortName}}</span>
          </template>
        </el-table-column>
        <!--<el-table-column sortable align="center" label="排序">-->
          <!--<template slot-scope="scope">-->
            <!--<span>{{scope.row.sortCode}}</span>-->
          <!--</template>-->
        <!--</el-table-column>-->
      </el-table>
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                      :current-page="queryCondition.pageNo" :page-sizes="[10,20,30, 50]"
                      :page-size="queryCondition.pageSize" layout="total, sizes, prev, pager, next, jumper"
                      :total="total">
        </el-pagination>
      </div>
    </div>
    <!-- 右侧列表 -->
    <div style="float: left;width: 70%;padding-left: 20px">
      <el-table :data="selectList" border fit highlight-current-row header-cell-class-name="table-header-bg text-center" style="width: 100%;margin-bottom: 20px;">
        <el-table-column sortable align="center" label="类型名称">
          <template slot-scope="scope">
            <span>{{scope.row.sortName}}</span>
          </template>
        </el-table-column>
        <!--<el-table-column sortable align="center" label="排序">-->
          <!--<template slot-scope="scope">-->
            <!--<span>{{scope.row.sortCode}}</span>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column sortable align="center" label="备注">
          <template slot-scope="scope">
            <span>{{scope.row.sortDes}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable align="center" label="是否有效">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isValid===1" :aria-readonly="true"></el-checkbox>
          </template>
        </el-table-column>
      </el-table>

      <el-table :data="dtList" border fit highlight-current-row style="width: 100%;" header-cell-class-name="table-header-bg text-center" stripe max-height="545">
        <el-table-column sortable align="center" label="品名">
          <template slot-scope="scope">
            <span>{{scope.row.typeName}}</span>
          </template>
        </el-table-column>
        <!--<el-table-column sortable align="center" label="统计类别">
          <template slot-scope="scope">
            <span>{{scope.row.typeLb}}</span>
          </template>
        </el-table-column>-->
        <el-table-column sortable align="center" label="密度">
          <template slot-scope="scope">
            <span>{{scope.row.density}}</span>
          </template>
        </el-table-column>
        <!--<el-table-column sortable align="center" label="排序">-->
          <!--<template slot-scope="scope">-->
            <!--<span>{{scope.row.sortCode}}</span>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column sortable align="center" label="是否有效">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isValid===1" :aria-readonly="true"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column sortable align="center" label="是否显示">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isShow===1" :aria-readonly="true"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column sortable align="center" label="是否常用">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isCommonUse===1" :aria-readonly="true"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column sortable align="center" label="允许修改数量">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.canModifyNum===1" :aria-readonly="true"></el-checkbox>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增修改框 -->
    <el-dialog :title="dialogMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="moduleInfo" label-position="right" label-width="80px"
               style='width: 100%'>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="类型名称：" prop="sortName">
              <el-input v-model="moduleInfo.sortName" maxlength="20" class="input-w-168"></el-input>
            </el-form-item>
          </el-col>
          <!--<el-col :span="12">-->
            <!--<el-form-item label="排序：">-->
              <!--<el-input v-model="moduleInfo.sortCode"></el-input>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
          <el-col :span="12">
            <el-form-item label="是否有效：">
              <el-checkbox v-model="moduleInfo.validFlag"></el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="备注：">
              <el-input v-model="moduleInfo.sortDes" maxlength="200" placeholder="200字以内" class="input-w-238"></el-input>
            </el-form-item>
          </el-col>
        </el-row>


        <el-row class="btn-group-container">
          <el-button @click="handleAddDt">新增</el-button>
        </el-row>
        <el-table :data="moduleInfo.dtList" border stripe fit highlight-current-row height="400px" style="width: 100%">
          <el-table-column sortable align="center" label="品名">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.typeName" size="medium"></el-input>
            </template>
          </el-table-column>
          <!--<el-table-column sortable align="center" label="统计类别">
            <template slot-scope="scope">
              <el-select v-model="scope.row.typeLb" placeholder="请选择">
                <el-option
                  v-for="item in Object.values(systemparmMap.TypeLB)"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </template>
          </el-table-column>-->
          <el-table-column sortable align="center" label="密度">
            <template slot-scope="scope">
              <!--<el-input v-model.trim="scope.row.density"></el-input>-->
              <number-input v-model="scope.row.density" decimal="10,2"></number-input>
            </template>
          </el-table-column>
          <!--<el-table-column sortable align="center" label="排序">-->
            <!--<template slot-scope="scope">-->
              <!--<el-input v-model="scope.row.sortCode"></el-input>-->
            <!--</template>-->
          <!--</el-table-column>-->
          <el-table-column sortable align="center" label="是否有效">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.validFlag"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column sortable align="center" label="是否显示">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.showFlag"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column sortable align="center" label="是否常用">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.commonUseFlag"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column sortable align="center" label="允许修改数量">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.canModifyNumFlag"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column sortable align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="danger" @click="handleDeleteDt(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="() => dialogStatus==='create' ? createData() : updateData()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { list, dtList, update, add, del } from '@/api/basedata/sortData'
  import waves from '@/directive/waves' // 水波纹指令
  import { mapGetters } from 'vuex'
  import numberInput from '@/components/numberInput'

  export default {
    name: 'sortData',
    directives: {
      waves
    },
    components: {
      numberInput
    },
    computed: {
      ...mapGetters([
        'systemparmMap'
      ])
    },
    data() {
      return {
        listLoading: false,
        selectRow: null,
        selectRowFlag: true,
        selectList: [],
        list: [],
        total: 0,
        dtList: [],
        dialogMap: {
          update: '修改',
          create: '新增'
        },
        queryCondition: {
          sortName: null,
          typeName: null,
          isValid: null,
          pageNo: 1,
          pageSize: 20
        },
        dialogFormVisible: false,
        dialogStatus: '',
        formView: {},
        moduleInfo: {},
        rules: {
          sortName: [{ required: true, message: '类型名称不能为空', trigger: 'blur' }]
        }
      }
    },
    methods: {
      refreshData() {
        this.selectRow = null
        this.selectRowFlag = true
        this.selectList = []
        this.dtList = []
        this.listLoading = true
        this.dialogFormVisible = false
        this.queryCondition.pageNo = 1
        this.queryCondition.pageSize = 20
        this.getList()
      },
      getList() {
        list(this.queryCondition).then(response => {
          this.list = response.sorts
          this.total = response.dataSize
          this.listLoading = false
        }).catch(error => {
          if (error) console.error(error)
          this.listLoading = false
        })
      },
      // 点击行
      handleSelect(row) {
        this.selectRow = row
        this.selectRowFlag = this.selectRow.isValid !== 1
        this.selectList = [this.selectRow]
        this.formView = row
        this.formView.validFlag = this.formView.isValid === 1
        dtList(this.selectRow.id).then(response => {
          this.dtList = response.types
          this.formView.dtList = this.dtList
        }).catch(error => {
          if (error) console.error(error)
        })
      },
      // 打开新增框
      handleCreate() {
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        Object.assign(this.moduleInfo, { sortName: '', sortCode: '', validFlag: true, sortDes: '', dtList: [], dtDelList: [] })
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate()
        })
      },
      createData() {
        let returnFlag = false
        this.moduleInfo.dtList.forEach(function(dt) {
          if (dt.typeName === '') {
            returnFlag = true
          }
          dt.isValid = dt.validFlag ? 1 : 0
          dt.isShow = dt.showFlag ? 1 : 0
          dt.canModifyNum = dt.canModifyNumFlag ? 1 : 0
          dt.isCommonUse = dt.commonUseFlag ? 1 : 0
        })
        if (returnFlag) {
          this.$message.warning('品名必填，请检查')
          return
        }
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.moduleInfo.isValid = this.moduleInfo.validFlag ? 1 : 0
            add(this.moduleInfo).then(() => {
              this.refreshData()
            })
          }
        })
      },
      // 打开修改框
      handleUpdate: function() {
        if (!this.selectRow) {
          this.$message.warning('请选择要修改的类型')
          return
        }
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        // 深拷贝
        this.moduleInfo = JSON.parse(JSON.stringify(this.formView))
        this.moduleInfo.dtDelList = []
        const that = this
        this.moduleInfo.dtList.forEach(function(dt) {
          // dt = Object.assign({}, dt, { validFlag: dt.isValid === 1, showFlag: dt.isShow === 1, canModifyNumFlag: dt.canModifyNum === 1, commonUseFlag: dt.isCommonUse === 1 })
          // dt.showFlag = dt.isShow === 1
          // dt.canModifyNumFlag = dt.canModifyNum === 1
          // dt.commonUseFlag = dt.isCommonUse === 1
          that.$set(dt, 'validFlag', dt.isValid === 1)
          that.$set(dt, 'showFlag', dt.isShow === 1)
          that.$set(dt, 'canModifyNumFlag', dt.canModifyNum === 1)
          that.$set(dt, 'commonUseFlag', dt.isCommonUse === 1)
        })
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate()
        })
      },
      // 终止使用
      handleInValid() {
        if (!this.selectRow) {
          this.$message.warning('请选择要修改的类型')
          return
        }
        this.selectRow.isValid = 0
        update(this.selectRow).then(() => {
          this.handleSelect(this.selectRow)
        }).catch(error => {
          if (error) console.error(error)
        })
      },
      // 修改操作
      updateData() {
        let returnFlag = false
        this.moduleInfo.dtList.forEach(function(dt) {
          if (dt.typeName === '') {
            returnFlag = true
          }
          dt.isValid = dt.validFlag ? 1 : 0
          dt.isShow = dt.showFlag ? 1 : 0
          dt.canModifyNum = dt.canModifyNumFlag ? 1 : 0
          dt.isCommonUse = dt.commonUseFlag ? 1 : 0
        })
        if (returnFlag) {
          this.$message.warning('品名必填，请检查')
          return
        }
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.moduleInfo.isValid = this.moduleInfo.validFlag ? 1 : 0
            update(this.moduleInfo).then(() => {
              this.refreshData()
              this.handleSelect(this.moduleInfo)
            }).catch(error => {
              if (error) console.error(error)
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
        this.moduleInfo.dtList.push({ typeName: '', /* typeLb: '',*/ sortCode: '', density: '', validFlag: true, showFlag: true, canModifyNumFlag: false, commonUseFlag: false })
      },
      handleSizeChange(val) {
        this.queryCondition.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.queryCondition.pageNo = val
        this.getList()
      },
      handleDelete() {
        if (!this.selectRow) {
          this.$message.warning('请选择要删除的数据')
          return
        }
        this.$confirm('确认是否删除选中信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          del({ id: this.selectRow.id }).then(() => {
            this.refreshData()
          })
        }).catch(() => {
        })
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

  .dialog-form {
    &:before {
      content: '';
      display: block;
      position: relative;
      top: -25px;
      border-bottom: 2px solid #2a3950;
    }
  }

  .el-form-item div {
    margin-left: 0;
  }
</style>

