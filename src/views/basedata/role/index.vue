<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container form-wrap">
      <el-row>
        <el-form :inline="true" label-width="80px" size="small">
          <el-form-item label="角色名称"  label-width="100px">
            <el-input @keyup.enter.native="handleFilter" :placeholder="'角色名称'" v-model="listQuery.roleName0"></el-input>
          </el-form-item>
          <el-form-item label="角色代码"  label-width="100px">
            <el-input @keyup.enter.native="handleFilter" :placeholder="'角色代码'" v-model="listQuery.roleCode"></el-input>
          </el-form-item>
        </el-form>
      </el-row>
      <!-- <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.type" :placeholder="'活动类型'">
        <el-option v-for="item in  activityTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select> -->
      <!-- <el-select @change='handleFilter' style="width: 140px" class="filter-item" v-model="listQuery.sort">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select> -->

      <!-- <el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">导出</el-button> -->
      <!-- <el-checkbox class="filter-item" style='margin-left:15px;' @change='tableKey=tableKey+1' v-model="showReviewer">审核人</el-checkbox> -->
    </div>
    <el-row class="el-row-middle">
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-plus">添加</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleUpdate" type="primary" icon="el-icon-edit" :disabled="!isSelectRow">修改</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleDelete" type="danger" icon="el-icon-delete" :disabled="!isSelectRow">删除</el-button>
    </el-row>
    <el-table @row-click='handleSelect' :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row stripe height="545"
      header-cell-class-name="table-header-bg text-center"
      style="width: 100%">
      <el-table-column sortable align="center" label="序号" type="index">
      </el-table-column>
      <el-table-column sortable align="center" label="角色代码" >
        <template slot-scope="scope">
          <span>{{scope.row.roleCode}}</span>
        </template>
      </el-table-column>

      <el-table-column sortable align="center" label="角色名称">
        <template slot-scope="scope">
          <span>{{scope.row.roleName0}}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column sortable align="center" :label="'操作'" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNo" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="1100px">
      <el-form :rules="rules" ref="dataForm" :model="role" label-position="left" label-width="80px" style='width: 1000px; margin-left:50px;'>
        <el-form-item label="角色代码" prop="roleCode">
          <el-input v-model="role.roleCode" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName0">
          <el-input v-model="role.roleName0" maxlength="20"></el-input>
        </el-form-item>

        <el-table :key="moduleRoleTableKey" :data="tableModuleList" :span-method="arraySpanMethod" height="400"
             header-cell-class-name="table-header-bg text-center"
              >
          <el-table-column sortable align="center" label="一级菜单">
            <template slot-scope="scope">
              <el-checkbox :indeterminate="scope.row.isIndeterminate" v-model="scope.row.checked" @change="handleChecked(scope.row)">{{scope.row.moduleName0}}</el-checkbox>
            </template>
          </el-table-column>
          <el-table-column sortable align="center" label="二级菜单">
            <template slot-scope="scope">
              <el-checkbox :indeterminate="scope.row.isChildIndeterminate" v-model="scope.row.childChecked" @change="handleChildChecked(scope.row)">{{scope.row.childMemuName}}</el-checkbox>
            </template>
          </el-table-column>
          <el-table-column sortable align="center" label="按钮权限" width="500px">
            <template slot-scope="scope">
                <span v-for="right in scope.row.rightList" :key="right.id" style="padding-right:5px;">
                  <el-checkbox v-model="right.rightChecked" @change="handleRightChecked(scope.row)">{{right.rightName0}}</el-checkbox>
                </span>
            </template>
          </el-table-column>

        </el-table>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确 定</el-button>
        <el-button v-else type="primary" @click="updateData">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/customer'
import { queryList, getAllModuleList, getModuleRoleList, addRole, updateRole, deleteRole } from '@/api/basedata/role'
import waves from '@/directive/waves/index' // 水波纹指令
// import { parseTime } from '@/utils'

export default {
  name: 'roleRight',
  directives: {
    waves
  },
  data() {
    return {
      // baseURL: process.env.BASE_API,
      tableKey: 0,
      moduleRoleTableKey: 0,
      list: null,
      allModuleList: null,
      tableModuleList: [],
      defaultModuleList: [],
      total: null,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        roleCode: '',
        roleName0: ''
      },
      role: {
        id: '',
        roleCode: '',
        roleName0: ''
        // tableModuleList: []
      },
      selectRow: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '创建',
        detail: '查看'
      },
      deleteVisible: false,
      rules: {
        roleCode: [{ required: true, message: '必填', trigger: 'change' }],
        // startTime: [{ type: 'date', required: true, message: '必填', trigger: 'change' }],
        roleName0: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      downloadLoading: false,
      isSelectRow: false
    }
  },
  filters: {
  },
  created() {
    this.getList()
    this.getAllModuleList()
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
      this.listQuery.pageNo = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      // 这里访问反问后台获取数据
      queryList(this.listQuery).then(response => {
        this.list = response.roleList
        this.total = response.datasize
        this.listLoading = false
      })
    },
    getAllModuleList() {
      getAllModuleList().then(response => {
        const permission = []
        for (const v of response.moduleList) {
          if (!v.parentId) {
            var obj = {}
            obj.id = v.id
            obj.moduleName0 = v.moduleName0
            obj.parentId = v.parentId
            permission.push(obj)
          }
        }
        // 格式化权限集
        var perList = this.initPermission(permission, response.moduleList)
        for (const i of perList) {
          let isFirst = true // 用于行合并用
          for (const j of i.childMemu) {
            const temp = Object.assign({}, i)
            if (isFirst) { // 循环的第一个值才有chileLength字段 用于行合并用
              temp.chileLength = i.childMemu.length
              isFirst = false
            }
            temp.checked = false
            temp.isIndeterminate = false // 一级半选状态
            temp.childMemuId = j.id
            temp.childMemuName = j.moduleName0
            temp.childChecked = false
            temp.isChildIndeterminate = false // 二级半选状态
            temp.rightList = j.rightList
            this.tableModuleList.push(temp)
          }
        }
        this.defaultModuleList = this.tableModuleList
        this.allModuleList = perList
      })
    },
    initPermission(permission, answer) {
      for (let i = 0; i < permission.length; i++) {
        // 子权限
        var childMemu = []
        for (var j = 0; j < answer.length; j++) {
          if (permission[i].id === answer[j].parentId) {
            var obj = {}
            obj.id = answer[j].id
            obj.moduleName0 = answer[j].moduleName0
            obj.parentId = answer[j].parentId
            obj.rightList = answer[j].rightList
            childMemu.push(obj)
          }
        }
        permission[i].childMemu = childMemu
      }
      return permission
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) { // 用于实现新增权限表格行合并
      if (columnIndex === 0) {
        if (row.chileLength) {
          return { rowspan: row.chileLength, colspan: 1 }
        } else {
          return { rowspan: 0, colspan: 0 }
        }
      }
    },
    handleChecked(row) {
      if (row.checked) {
        for (const v of this.tableModuleList) {
          if (row.id === v.id) {
            v.checked = true
            v.childChecked = true
            for (const i of v.rightList) {
              i.rightChecked = true
            }
            v.isChildIndeterminate = false
          }
        }
      } else {
        for (const v of this.tableModuleList) {
          if (row.id === v.id) {
            v.checked = false
            v.childChecked = false
            for (const i of v.rightList) {
              i.rightChecked = false
            }
            v.isChildIndeterminate = false
          }
        }
      }
      row.isIndeterminate = false
    },
    handleChildChecked(row) {
      if (row.childChecked) {
        for (const i of row.rightList) {
          i.rightChecked = true
        }
      } else {
        for (const i of row.rightList) {
          i.rightChecked = false
        }
      }
      row.isChildIndeterminate = false
      // 改变一级菜单复选框状态
      this.reverseHandleChecked(row)
    },
    handleRightChecked(row) {
      // 改变二级菜单复选框状态
      this.reverseHandleChildChecked(row)
      // 改变一级菜单
      this.reverseHandleChecked(row)
    },
    reverseHandleChecked(row) { // 反向修改一级菜单复选框
      let checked = true
      let isIndeterminate = false
      for (const v of this.tableModuleList) {
        if (row.id === v.id) {
          if (!v.childChecked) {
            checked = false
          } else {
            isIndeterminate = true
          }
        }
        for (const i of v.rightList) {
          if (i.rightChecked) {
            isIndeterminate = true
          }
        }
      }
      for (const v of this.tableModuleList) {
        if (row.id === v.id) {
          v.checked = checked
          v.isIndeterminate = false
          if (!checked) { // 当不为全选时，才能出现半选状态
            v.isIndeterminate = isIndeterminate
          }
        }
      }
    },
    reverseHandleChildChecked(row) { // 反向修改二级菜单复选框
      let childChecked = true
      let isChildIndeterminate = false
      for (const i of row.rightList) {
        if (!i.rightChecked) {
          childChecked = false
        } else {
          isChildIndeterminate = true
        }
      }
      row.childChecked = childChecked
      row.isChildIndeterminate = false
      if (!childChecked) {
        row.isChildIndeterminate = isChildIndeterminate
      }
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    resetRole() {
      this.role = {
        id: '',
        roleCode: '',
        roleName0: ''
        // tableModuleList: Object.assign([], this.tableModuleList) // 该方法只能深拷贝两层
        // tableModuleList: JSON.parse(JSON.stringify(this.tableModuleList)) // 快速实现深层拷贝
      }
      this.tableModuleList = this.defaultModuleList
    },
    handleSelect(row) {
      this.selectRow = row
      this.isSelectRow = true
    },
    handleCreate() {
      this.resetRole()
      this.moduleRoleTableKey++ // 解决表格错位问题
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleModuleRoleData(tempData) {
      const moduleRoleList = []
      for (const z of this.tableModuleList) {
        const moduleRole = {
          moduleId: z.childMemuId,
          rightList: []
        }
        for (const y of z.rightList) {
          if (y.rightChecked) {
            const rightCode = {
              rightCode: y.rightCode
            }
            moduleRole.rightList.push(rightCode)
          }
        }
        if (moduleRole.rightList.length > 0) {
          moduleRoleList.push(moduleRole)
        }
      }
      tempData.moduleRoleList = moduleRoleList
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.role)
          this.handleModuleRoleData(tempData)
          addRole(tempData).then(response => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate() {
      this.role = Object.assign({}, this.selectRow) // copy obj
      // this.tableModuleList = Object.assign([], this.tableModuleList)
      this.tableModuleList = JSON.parse(JSON.stringify(this.defaultModuleList))
      this.moduleRoleTableKey++ // 解决表格错位问题
      const tempData = { roleId: this.role.id }
      getModuleRoleList(tempData).then(response => {
        for (const v of response.moduleRoleList) {
          for (const i of this.tableModuleList) {
            if (v.moduleId === i.childMemuId) {
              for (const j of v.rightList) {
                for (const z of i.rightList) {
                  if (j.rightCode === z.rightCode) {
                    z.rightChecked = true
                  }
                }
              }
              // 改变二级菜单复选框状态
              this.reverseHandleChildChecked(i)
              // 改变一级菜单
              this.reverseHandleChecked(i)
            }
          }
        }
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.role)
          this.handleModuleRoleData(tempData)
          updateRole(tempData).then(response => {
            for (const v of this.list) {
              if (v.id === this.role.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.role)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete() {
      // this.role = Object.assign({}, this.selectRow)
      // this.role = Object.assign({}, row)
      this.$confirm('此操作将会删除相关数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const tempData = {
          'id': this.selectRow.id
        }
        deleteRole(tempData).then(() => {
          // this.$notify({
          //   title: '成功',
          //   message: '删除成功',
          //   type: 'success',
          //   duration: 2000
          // })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // const index = this.list.indexOf(this.role)
          // this.list.splice(index, 1)
          // this.deleteVisible = false
          this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      // this.deleteVisible = true
    },
    handleUpdatePicture(res, file) {
      file.url = 'https://c36bbd258b7ee694eb987221b2b197b0.oss-cn-shenzhen.aliyuncs.com/' + res.result
    }
  }
}
</script>
