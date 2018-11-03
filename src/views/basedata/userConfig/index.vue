<template>
  <div class="app-container calendar-list-container">
    <add-tab :isShow="dialogVisible" :currentRow="currentRow" :type="doType" @hideTab="hideTab"
             :roleList="roleList" :allModuleList="allModuleList" :moduleMenuList="moduleMenuList" :userStoreList="userStoreList"  :noUserStoreList="noUserStoreList"
             :chooseRightArray="chooseRightArray" :chooseUserRoleArray="chooseUserRoleArray"></add-tab>
    <div class="filter-container form-wrap">
      <el-form :inline="true" label-width="80px" size="small">
        <el-row>
          <el-form-item label="登录账号">
            <el-input v-model="queryCondition.userCode" maxlength="50" ></el-input>
          </el-form-item>
          <el-form-item label="用户信息">
            <el-input  v-model="queryCondition.userName" maxlength="50" ></el-input>
          </el-form-item>
          <el-form-item class="search_label" >
            <el-button type="primary" v-waves icon="el-icon-search" @click="search">查询</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <el-row class="el-row-middle">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus"
                    @click="handleAdd">新增
        </el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                    :disabled="!isSelectRow" @click="handleUpdate">修改
        </el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-delete"
                    :disabled="!isSelectRow" @click="handleDelete">删除
        </el-button>
    </el-row>
    <el-row>
      <el-col :span="7" style="margin-right:50px;">
        <el-table :data="list" element-loading-text="给我一点时间" v-loading="listLoading" border fit highlight-current-row
                  header-cell-class-name="table-header-bg text-center"
                  height="440"
                  @current-change="handleCurrentChange">
          <el-table-column sortable align="center" label="序号" type="index"></el-table-column>
          <el-table-column sortable align="center" label="用户代码" prop="userCode"></el-table-column>
          <el-table-column sortable align="center" label="用户名称" prop="userName0"></el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handlePageChange"
                         :current-page="queryCondition.pageNo" :page-sizes="[10,20,30, 50]" :page-size="queryCondition.pageSize"
                         layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </el-col>
      <el-col :span="16" >
        <el-tabs type="border-card" v-loading="tabLoading">
          <el-tab-pane label="基本信息">
            <el-form :inline="true" style="text-align: center;">
              <el-row>
                <el-col :span="8"><el-form-item label="登录账号"><el-input v-model="userInfo.userCode" readonly></el-input></el-form-item></el-col>
                <el-col :span="8"><el-form-item label="用户名称"><el-input v-model="userInfo.userName0" readonly ></el-input></el-form-item></el-col>
                <el-col :span="8"><el-form-item label="密码"><el-input v-model="userInfo.password" readonly></el-input></el-form-item></el-col>
              </el-row>
              <el-row style="text-align: center;">
                <el-col :span="8"><el-form-item label="移动电话"><el-input v-model="userInfo.mobile" readonly></el-input></el-form-item></el-col>
                <el-col :span="8"><el-form-item label="注册日期"><el-input v-model="userInfo.regDate" readonly></el-input></el-form-item></el-col>
              </el-row>
              <el-row style="text-align: center;">
                <el-col :span="6"><el-form-item label="设为管理员"><el-checkbox v-model="userInfo.isAdmin === 1" readonly></el-checkbox></el-form-item></el-col>
                <el-col :span="6"><el-form-item label="锁定"><el-checkbox v-model="userInfo.isLock === 1" readonly></el-checkbox></el-form-item></el-col>
                <el-col :span="6"><el-form-item label="访问所有仓库"><el-checkbox v-model="userInfo.accessAllStore === 1" readonly></el-checkbox></el-form-item></el-col>
                <el-col :span="6"><el-form-item label="访问隐藏单据"><el-checkbox v-model="userInfo.accessBill === 1" readonly></el-checkbox></el-form-item></el-col>
              </el-row>
              <el-row style="width:60%;text-align: right">
                <el-row >
                  <el-form-item  label="访问客户限制(只允许)"><el-input type="textarea" style="width:500px"  :value="allowName" readonly></el-input></el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="访问客户限制(不允许)"><el-input type="textarea" style="width:500px;"   :value="notAllowName" readonly></el-input></el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="备注"><el-input type="textarea" style="width:500px"   v-model="userInfo.remark" readonly></el-input></el-form-item>
                </el-row>
              </el-row>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="权限设置">
            <el-row>
              <el-col :span="8">
                <el-table :data="roleList" height="500" element-loading-text="给我一点时间" v-loading="listLoading" border fit highlight-current-row>
                  <el-table-column sortable align="center" label="选择" width="60">
                    <template slot-scope="scope">
                      <input type="checkbox" :value="scope.row.id" v-model="chooseUserRoleArray" onclick="return false"/>
                    </template>
                  </el-table-column>
                  <el-table-column sortable align="center" label="权限代码" prop="roleCode"></el-table-column>
                  <el-table-column sortable align="center" label="权限名称" prop="roleName"></el-table-column>
                </el-table>
              </el-col>
              <el-col :span="16" style="padding:0 20px 0 40px;">
                <el-form :inline="true" >
                  <el-collapse v-model="activeName" accordion height="500">
                    <el-collapse-item  v-for="item in moduleMenuList" :key="item.id" :title="item.moduleName0" :name="item.id">
                      <el-table :data="getModuleListByParentId(item.id)" height="500" element-loading-text="给我一点时间" v-loading="listLoading" border fit highlight-current-row>
                        <el-table-column sortable align="center" label="二级菜单" prop="moduleName0" width="200"></el-table-column>
                        <el-table-column sortable align="center" label="权限集合">
                          <template slot-scope="scope">
                            <el-form-item v-for="obj in scope.row.rightList" :key="obj.id"  name="obj.id" :label="obj.rightName">
                              <input type="checkbox" :value="concat(scope.row.id,obj.rightCode)" v-model="chooseRightArray"  onclick="return false" />
                            </el-form-item>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-collapse-item>
                  </el-collapse>
                </el-form>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="仓库设置">
            <el-col :span="10">
              <el-table :data="userStoreList" height="500" element-loading-text="给我一点时间" v-loading="listLoading" border fit highlight-current-row>
                <el-table-column sortable align="center" label="仓库名称(已添加)" prop="storeName"></el-table-column>
              </el-table>
            </el-col>
            <el-col :span="4" style="text-align: center;padding-top: 200px;">

            </el-col>
            <el-col :span="10">
              <el-table :data="noUserStoreList" height="500" element-loading-text="给我一点时间" v-loading="listLoading" border fit highlight-current-row>
                <el-table-column sortable align="center" label="仓库名称(未添加)" prop="storeName"></el-table-column>
              </el-table>
            </el-col>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { queryList, deleteUser, getRoleListByMid, getModuleListByMid, getUserStoreList, getNoUserStoreList, allUserRoleList as queryRoleList } from '@/api/basedata/userConfig'
  import { getAllModuleList } from '@/api/basedata/role'
  import waves from '@/directive/waves/index' // 水波纹指令
  import addTab from '@/views/basedata/userConfig/add'
  export default {
    name: 'userConfig',
    directives: {
      waves
    },
    components: {
      addTab
    },
    computed: {
      ...mapGetters([
        'customerList'
      ])
    },
    data() {
      return {
        isSelectRow: false,
        activeName: '',
        chooseRightArray: [],
        chooseUserRoleArray: [],
        queryCondition: {
          pageNo: 1,
          pageSize: 10,
          userName0: '',
          userCode: ''
        },
        list: [],
        roleList: [],
        allModuleList: [],
        moduleMenuList: [],
        userRoleList: [],
        userModuleList: [],
        userStoreList: [],
        noUserStoreList: [],
        total: null,
        listLoading: true,
        tabLoading: false,
        dialogVisible: false,
        currentRow: null,
        dialogTitle: '',
        checked: true,
        userInfo: {
          userName0: '',
          userCode: '',
          mobile: '',
          password: '',
          isAdmin: 0,
          isLiasonMan: 0,
          isLock: 0,
          accessAllStore: 0,
          accessBill: 0,
          regDate: '',
          cuids: '',
          denyCuids: '',
          remark: ''
        },
        rules: {
        },
        defaultData: null,
        doType: 0,
        allowName: '',
        notAllowName: ''
      }
    },
    mounted() {
      this.getList()
      // 查询全部角色列表
      queryRoleList().then(response => {
        this.roleList = response.roleList
      })
      // 查询全部权限列表
      getAllModuleList().then(response => {
        this.allModuleList = response.moduleList
        for (var x in this.allModuleList) {
          if (this.allModuleList[x].parentId === undefined) {
            this.moduleMenuList.push(this.allModuleList[x])
          }
        }
      })
      this.tabLoading = false

      const _this = this
      document.onkeydown = function(e) { // shift事件
        const _key = window.event.keyCode
        if (_key === 13) {
          _this.search()
        }
      }
    },
    methods: {
      hideTab() {
        this.dialogVisible = false
      },
      replaceId2Name(val) {
        if (val !== null && val !== '') {
          var str = ''
          var tmp = val.split(',')
          for (var x in tmp) {
            for (var xx in this.customerList) {
              if (tmp[x] === this.customerList[xx].id) {
                str += this.customerList[xx].cuName + ','
                break
              }
            }
          }
          return str.substring(0, str.length - 1)
        }
        return ''
      },
      search() {
        this.queryCondition.pageNo = 1
        this.getList()
      },
      getList() {
        this.listLoading = true
        queryList(this.queryCondition).then(response => {
          this.list = response.list.map(item => {
            this.$set(item, 'password2', item.password)
            return item
          })
          this.total = response.dataSize
          this.listLoading = false
          this.isSelectRow = false
          this.tabLoading = false
        })
      },
      getModuleListByParentId(val) {
        var tmpArray = []
        for (var x in this.allModuleList) {
          if (this.allModuleList[x].parentId === val) {
            tmpArray.push(this.allModuleList[x])
          }
        }
        return tmpArray
      },
      tabOneShow() {
        // 基础信息赋值显示
        Object.assign(this.userInfo, this.currentRow)
      },
      tabTwoShow() {
        // 权限信息显示
        const tmp = { userId: this.currentRow.id }
        this.chooseUserRoleArray = []
        getRoleListByMid(tmp).then(res => {
          this.userRoleList = res.roleList
          for (var x in this.userRoleList) {
            this.chooseUserRoleArray.push(this.userRoleList[x].id)
          }
        })
        // 权限勾选表
        const t = { userId: this.currentRow.id }
        // 初始化取消所有选中
        this.chooseRightArray = []
        getModuleListByMid(t).then(res => {
          this.userModuleList = res.usermodulelist
          for (var m in this.userModuleList) {
            for (var mm in this.userModuleList[m].rightList) {
              var rightCode = this.userModuleList[m].moduleId + '-' + this.userModuleList[m].rightList[mm].rightCode
              this.chooseRightArray.push(rightCode)
            }
          }
        })
      },
      handleCurrentChange(val) {
        if (val === null) return
        this.tabLoading = true
        this.currentRow = val
        this.allowName = this.replaceId2Name(val.cuids)
        this.notAllowName = this.replaceId2Name(val.denyCuids)
        this.tabOneShow()
        this.tabTwoShow()
        this.tabThreeShow()
        this.isSelectRow = true
        this.tabLoading = false
      },
      handleAdd() {
        this.doType = 0
        this.dialogVisible = true
      },
      handleUpdate() {
        this.doType = 1
        this.dialogVisible = true
      },
      tabThreeShow() {
        const tmp = { mid: this.currentRow.id }
        getUserStoreList(tmp).then(res => {
          this.userStoreList = res.storeList
        })
        getNoUserStoreList(tmp).then(res => {
          this.noUserStoreList = res.storeList
        })
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
          deleteUser(temp).then(response => {
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
      concat(a, b) {
        return a + '-' + b
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
