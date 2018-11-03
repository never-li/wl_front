<template>
  <div class="app-container">
    <!--行首-->
    <el-row class="pageTop mb10">
      <el-form label-width="100px" :inline="true">
        <el-form-item label="登陆账号：" style="margin-bottom: 0;">
          <el-input v-model="listQuery.userCode" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="用户信息：" style="margin-bottom: 0;">
          <el-input v-model="listQuery.userName" size="mini"></el-input>
        </el-form-item>
      </el-form>
    </el-row>

    <!--页面主题内容-->
    <el-row :gutter="80">
      <!--用户代码 & 用户名称 表格-->
      <el-col :span="5">
        <!--按钮组-->
        <el-row class="mb10">
          <el-button type="primary" round size="mini" @click="handleCreate">新增</el-button>
          <el-button type="primary" round size="mini" :disabled="!isSelectRow" @click="handleUpdate">修改</el-button>
          <el-button type="danger" round size="mini" :disabled="!isSelectRow" @click="handleDelete">删除</el-button>
          <el-button type="primary" round size="mini" @click="getList" icon="el-icon-refresh">刷新</el-button>
        </el-row>

        <!--页面左侧表格-->
        <el-table :data="codenameTable" style="width: 100%;text-align: center;"
                  row-class-name="cursor-pointer"
                  highlight-current-row
                  stripe height="545"
                  ref="codenameTable"
                  @row-click="handleSelect"
                  border>
          <el-table-column sortable label="用户代码" prop="userCode"></el-table-column>
          <el-table-column sortable label="用户名称" prop="userName0"></el-table-column>
        </el-table>
      </el-col>

      <el-col :span="16">

        <!--页面数据-->
        <el-form ref="pageDataForm" :inline="true">
          <!--基本信息-->
          <el-row class="info-wrap mb10">
            <el-row class="title">基本信息</el-row>
            <el-row class="info">

              <el-form-item label="登陆账号">
                <el-input size="mini" disabled v-model="user.userCode"></el-input>
              </el-form-item>
              <el-form-item label="用户名称">
                <el-input size="mini" disabled v-model="user.userName"></el-input>
              </el-form-item>
              <el-form-item label="　　密码">
                <el-input size="mini" disabled v-model="user.password" type="password"></el-input>
              </el-form-item>
              <el-form-item label="移动电话">
                <el-input size="mini" disabled v-model="user.mobile"></el-input>
              </el-form-item>
              <el-form-item label="固定电话">
                <el-input size="mini" disabled v-model="user.telephone"></el-input>
              </el-form-item>
              <el-form-item label="　　邮箱">
                <el-input size="mini" disabled v-model="user.email"></el-input>
              </el-form-item>
              <el-form-item label="注册日期">
                <el-date-picker
                  v-model="user.regDate"
                  size="mini"
                  type="date"
                  disabled>
                </el-date-picker>
              </el-form-item>
              <el-form-item label="　　备注">
                <el-input size="mini" disabled v-model="user.remark"></el-input>
              </el-form-item>
              <el-form-item>
                <el-checkbox label="锁定" :true-label="1" :false-label="0" disabled v-model="user.isLock"></el-checkbox>
              </el-form-item>
            </el-row>
          </el-row>

          <!--权限设置-->
          <el-row class="info-wrap">
            <el-row class="title mb10">权限设置</el-row>
            <el-row :gutter="20">
              <el-col :span="7">
                <el-table :data="roleListGlobal" border stripe ref="pageRoleTable">
                  <el-table-column sortable label="选择" type="selection" disabled></el-table-column>
                  <el-table-column sortable label="权限代码" prop="roleCode"></el-table-column>
                  <el-table-column sortable label="权限名称" prop="roleName"></el-table-column>
                </el-table>
              </el-col>

              <!--右侧菜单-->
              <el-col :span="17">
                <el-table border stripe :data="user.tableModuleList" :span-method="arraySpanMethod" height="800">
                  <el-table-column sortable label="一级菜单" prop="moduleName0" width="80"></el-table-column>
                  <el-table-column sortable label="一级菜单" prop="childMemuName" width="140"></el-table-column>
                  <el-table-column sortable label="权限集合">
                    <template slot-scope="scope">
                      <span v-for="right in scope.row.rightList" :key="right.id" style="padding-right:5px;">
                        <el-checkbox v-model="right.rightChecked" disabled>{{right.rightName0}}</el-checkbox>
                      </span>
                      <!-- <el-checkbox-group>
                        <el-checkbox v-for="item in scope.row.rightList" disabled v-model="item.rightChecked"
                                     :label="item.rightName0" :key="item.id" :value="item.rightCode"
                        ></el-checkbox>
                      </el-checkbox-group> -->
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-row>
        </el-form>

        <!--对话框数据-->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="80%" :fullscreen="true">
          <el-form ref="dataForm" :rules="rules" :model="dialogData" :inline="true" class="dialog-form">
            <!--基本信息-->
            <el-row class="info-wrap mb10">
              <el-row class="title">基本信息</el-row>
              <el-row class="info">

                <el-form-item label="登陆账号">
                  <el-input size="mini" v-model="dialogData.userCode"></el-input>
                </el-form-item>
                <el-form-item label="用户名称">
                  <el-input size="mini" v-model="dialogData.userName"></el-input>
                </el-form-item>
                <el-form-item label="　　密码">
                  <el-input size="mini" v-model="dialogData.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="移动电话">
                  <el-input size="mini" v-model="dialogData.mobile"></el-input>
                </el-form-item>
                <el-form-item label="固定电话">
                  <el-input size="mini" v-model="dialogData.telephone"></el-input>
                </el-form-item>
                <el-form-item label="　　邮箱">
                  <el-input size="mini" v-model="dialogData.email"></el-input>
                </el-form-item>
                <el-form-item label="注册日期">
                  <el-date-picker
                    v-model="dialogData.regDate"
                    size="mini"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="　　备注">
                  <el-input size="mini" v-model="dialogData.remark"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-checkbox label="锁定" :true-label="1" :false-label="0" v-model="dialogData.isLock"></el-checkbox>
                </el-form-item>
              </el-row>
            </el-row>

            <!--权限设置-->
            <el-row class="info-wrap">
              <el-row class="title mb10">权限设置</el-row>
              <el-row :gutter="20">
                <el-col :span="5">
                  <el-table :data="roleListDialog" border stripe ref="dialogTableOne"
                            @selection-change="handleSelectionChange">
                    <el-table-column sortable label="选择" type="selection"></el-table-column>
                    <el-table-column sortable label="权限代码" prop="roleCode"></el-table-column>
                    <el-table-column sortable label="权限名称" prop="roleName"></el-table-column>
                  </el-table>
                </el-col>

                <el-col :span="3">
                  <el-button type="primary" @click="allocateByRole" round>按角色分配权限</el-button>
                </el-col>

                <!--右侧菜单-->
                <el-col :span="16">
                  <el-table border stripe :data="dialogData.tableModuleList" :span-method="arraySpanMethod"
                            height="800">
                    <el-table-column sortable label="一级菜单" prop="moduleName0" width="80"></el-table-column>
                    <el-table-column sortable label="一级菜单" prop="childMemuName" width="140"></el-table-column>
                    <el-table-column sortable label="权限集合">
                      <template slot-scope="scope">
                        <span v-for="right in scope.row.rightList" :key="right.id" style="padding-right:5px;">
                          <el-checkbox v-model="right.rightChecked">{{right.rightName0}}</el-checkbox>
                        </span>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确 定</el-button>
            <el-button v-else type="primary" @click="updateData">确 定</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>


    <!--分页-->
    <el-pagination
      style="text-align: right;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400">
    </el-pagination>

  </div>
</template>

<script>
  import * as userInfo from '@/api/system/userInfo'
  import { rsa } from '@/api/login'
  import JSEncrypt from '@/assets/jsencrypt/js/jsencrypt'

  export default {
    name: 'form',
    mounted() {
      this.getList()
      userInfo.getAllUserRoleList().then((res) => {
        this.user.roleList = res.roleList
        this.roleListGlobal = res.roleList
        this.roleListDialog = res.roleList// 弹出层用 为了不影响主页面中表格的勾选情况
      })
      this.getAllModuleList()

      const _this = this
      document.onkeydown = function(e) { // shift事件
        const _key = window.event.keyCode
        if (_key === 13) {
          _this.search()
        }
      }
    },
    data() {
      return {
        roleListGlobal: [],
        roleListDialog: [],
        codenameTable: [],
        currentPage: 2,
        allModuleList: [],
        tableModuleList: [],
        user: {
          id: '',
          roleCode: '',
          roleName0: '',
          mobile: '',
          password: '',
          email: '',
          isLock: 0,
          regDate: '',
          remark: '',
          userCode: '',
          userName: '',
          telephone: '',
          tableModuleList: [],
          roleList: []
        }, // 页面数据
        selectRow: {},
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '修改',
          create: '新增',
          detail: '查看'
        },
        isSelectRow: false,
        dialogData: {
          id: '',
          roleCode: '',
          roleName0: '',
          mobile: '',
          password: '',
          email: '',
          isLock: 0,
          regDate: '',
          remark: '',
          userCode: '',
          userName: '',
          telephone: '',
          tableModuleList: [],
          roleList: [],
          userModuleList: []
          // pageRoleList: []
        },
        listQuery: {
          pageno: 1,
          pagesize: 20,
          userCode: '',
          userName: ''
        },
        rules: {
          userCode: [{ required: true, message: '必填', trigger: 'change' }],
          // startTime: [{ type: 'date', required: true, message: '必填', trigger: 'change' }],
          userName: [{ required: true, message: '必填', trigger: 'blur' }],
          password: [{ required: true, message: '必填', trigger: 'blur' }]
        }
      }
    },
    methods: {
      search() {
        this.listQuery.pageNo = 1
        this.getList()
      },
      getList() {
        userInfo.getList(this.listQuery).then((res) => {
          this.codenameTable = res.list
        })
      },
      getAllModuleList() {
        userInfo.getAllModuleList().then((response) => {
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
              temp.childMemuId = j.id
              temp.childMemuName = j.moduleName0
              temp.childChecked = false
              temp.rightList = j.rightList
              temp.rightList.forEach((item) => {
                item.rightChecked = false
              })
              this.tableModuleList.push(temp)
            }
          }
          this.user.tableModuleList = [...this.tableModuleList]
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
      handleSelect(row, event) {
        this.selectRow = row
        this.isSelectRow = true
        this.user = Object.assign(this.user, row)
        this.user.userName = this.user.userName0
        this.user.tableModuleList = JSON.parse(JSON.stringify(this.tableModuleList)) // 这种虽然能生层拷贝 但因为深层拷贝之后重新渲染页面的时候 效率比较慢 后续可以考虑优化
        userInfo.getUserModuleList({ userId: row.id }).then(response => { // todo 3级菜单
          this.user.tableModuleList.forEach((pageItem) => {
            response.usermodulelist.forEach((matchItem) => {
              if (pageItem.childMemuId === matchItem.moduleId) { // 匹配二级菜单
                pageItem.rightList.forEach((pageRight) => {
                  matchItem.rightList.forEach((matchRight) => { // 3级菜单 - 权限集合
                    if (pageRight.rightCode === matchRight.rightCode) {
                      pageRight.rightChecked = true
                    }
                  })
                })
              }
            })
          })
        })
        userInfo.getUserRoleList({ userId: row.id }).then((res) => { // 权限设置
          this.user.roleList = res.roleList
          this.$refs.pageRoleTable.clearSelection()

          res.roleList.forEach((role) => {
            this.roleListGlobal.forEach((item) => {
              if (role.id === item.id) {
                this.$refs.pageRoleTable.toggleRowSelection(item)
              }
            })
          })

          // const selectArr = this.user.roleList.filter((item) => {
          //   return res.roleList.some((match) => {
          //     return match.id === item.id
          //   })
          // })
          // selectArr.forEach((match) => {
          //   this.$refs.pageRoleTable.toggleRowSelection(match)
          // })
          // console.log(selectArr)
        })
      }, // 页面 <- 左侧表格的行
      handleCreate() {
        this.dialogData = {
          id: '',
          roleCode: '',
          roleName0: '',
          mobile: '',
          password: '',
          email: '',
          isLock: 0,
          regDate: '',
          remark: '',
          userCode: '',
          userName: '',
          telephone: '',
          tableModuleList: JSON.parse(JSON.stringify(this.tableModuleList)), // [...this.tableModuleList],
          userModuleList: [],
          roleList: []
          // pageRoleList: this.roleListGlobal
        }
        this.$nextTick(() => { // 等vue渲染完页面后再调用
          this.$refs.dialogTableOne.clearSelection()
        })
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      }, // 页面 <- 新增按钮
      handleModuleRoleData(tempData) {
        const userModuleList = []
        for (const z of tempData.tableModuleList) {
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
            userModuleList.push(moduleRole)
          }
        }
        tempData.userModuleList = userModuleList
      },
      createData() {
        const tempData = Object.assign({}, this.dialogData)
        this.handleModuleRoleData(tempData)
        rsa().then((response) => {
          const encrypt = new JSEncrypt()
          encrypt.setRSAKey(response.m, response.e)
          tempData.password = encrypt.encrypt(tempData.password)
          tempData.sn = response.sn

          userInfo.addUser(tempData).then(() => {
            this.dialogFormVisible = false
            this.getList()
            // this.codenameTable.unshift(tempData)
            this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
          })
        })
      }, // 对话框 <- 确定按钮 创建数据
      handleUpdate() { // todo updataButton
        this.dialogData = JSON.parse(JSON.stringify(this.user))
        // this.dialogData.pageRoleList = this.dialogData.roleList
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => { // 等vue渲染完页面后再调用
          this.$refs.dialogTableOne.clearSelection()
          this.user.roleList.forEach((role) => {
            this.roleListDialog.forEach((item) => {
              if (role.id === item.id) {
                this.$refs.dialogTableOne.toggleRowSelection(item)
              }
            })
          })
        })
      }, // 页面 <- 修改按钮
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.dialogData)
            this.handleModuleRoleData(tempData)
            rsa().then((response) => {
              const encrypt = new JSEncrypt()
              encrypt.setRSAKey(response.m, response.e)
              if (tempData.password === '******') {
                tempData.password = ''
              } else {
                tempData.password = encrypt.encrypt(tempData.password)
              }
              tempData.sn = response.sn
              userInfo.updateUser(tempData).then(() => {
                // for (const v of this.codenameTable) {
                //   if (v.id === this.dialogData.id) {
                //     const index = this.codenameTable.indexOf(v)
                //     this.codenameTable.splice(index, 1, this.dialogData)
                //     break
                //   }
                // }
                this.getList()
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: '更新成功',
                  type: 'success',
                  duration: 2000
                })
              })
            })
          }
        })
      }, // 对话框 <- 确定按钮 修改数据
      handleDelete() {
        // this.user = Object.assign({}, this.selectRow)
        // this.role = Object.assign({}, row)
        this.$confirm('此操作将会删除相关数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const tempData = {
            'id': this.user.id
          }
          userInfo.deleteUser(tempData).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
            // const index = this.list.indexOf(this.user)
            // this.list.splice(index, 1)
            // this.deleteVisible = false
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
        // this.deleteVisible = true
      }, // 页面 <- 删除按钮 删除数据
      handleSizeChange(val) {
        this.listQuery.pagesize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.pageno = val
        this.getList()
      },
      allocateByRole() {
        this.$message('按角色分配')
        this.dialogData.roleList.forEach((role) => {
          role.modulerolelist.forEach((moduleRole) => {
            this.dialogData.tableModuleList.forEach((tableModule) => {
              if (tableModule.childMemuId === moduleRole.moduleId) {
                tableModule.rightList.forEach((pageRight) => {
                  moduleRole.rightList.forEach((matchRight) => { // 3级菜单 - 权限集合
                    if (pageRight.rightCode === matchRight.rightCode) {
                      pageRight.rightChecked = true
                    }
                  })
                })
              }
            })
          })
        })
      }, // 对话框 <- 按角色分配按钮
      handleSelectionChange(val) {
        // console.log(val)
        // this.$message('select change')
        this.dialogData.roleList = val
      } // 页面 权限集合发生改变时
    }
  }
</script>

<style lang="scss" scoped>
  .pageTop {
    border: 1px solid #ddd;
    box-shadow: 0px 4px 6px #d9dadc;
  }

  .mb10 {
    margin-bottom: 10px;
  }

  .tac {
    text-align: center;
  }

  .table-header {
    background: #000;
  }

  .line {
    text-align: center;
  }

  .el-table .cursor-pointer {
    cursor: pointer;
  }

  .info-wrap {
    border: 1px solid #ddd;
    box-shadow: 0px 4px 6px #d9dadc;
    .title {
      border-left: 3px solid #2a3950;
      height: 40px;
      border-bottom: 1px solid #ddd;
      padding-left: 20px;
      line-height: 40px;
      font-size: 12px;
      font-weight: bold;
      color: #323232;
    }
    .info {
      padding: 10px 20px 0 20px;
    }
    .el-date-editor.el-input, .el-date-editor.el-input__inner {
      width: 163px;
    }
    .el-form-item {
      margin-bottom: 0;
    }
  }

  .mb10 {
    margin-bottom: 10px;
  }

  .dialog-form {
    &:before {
      content: '';
      display: block;
      position: relative;
      top: -25px;
      border-bottom: 2px solid #2a3950;
    }
  }
</style>

