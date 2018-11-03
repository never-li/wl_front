<template>
    <div class="addTab" v-show="isShow">
      <el-row style="padding:20px;">
          <el-button class="filter-item" type="primary" v-waves  @click="submitForm">保存</el-button>
          <el-button class="filter-item" type="primary" v-waves @click="$emit('hideTab')">取消</el-button>
      </el-row>
      <el-form :inline="true" ref="dataForm" :model="userInfo" :rules="rule">
      <el-tabs type="border-card" v-loading="loading" element-loading-text="正在保存设置，请稍后" style="width:75%;">
        <el-tab-pane label="基本信息">

            <el-row>
              <el-col :span="8"><el-form-item label="登录账号" prop="userCode"><el-input v-model="userInfo.userCode" maxlength="50" ></el-input></el-form-item></el-col>
              <el-col :span="8"><el-form-item label="用户名称" prop="userName"><el-input v-model="userInfo.userName"  maxlength="50" ></el-input></el-form-item></el-col>
              <el-col :span="8"><el-form-item label="密码" prop="password2"><el-input v-model="userInfo.password2" maxlength="50" ></el-input></el-form-item></el-col>
            </el-row>
            <el-row style="text-align: center;">
              <el-col :span="8"><el-form-item label="移动电话"><el-input v-model="userInfo.mobile" ></el-input></el-form-item></el-col>
              <el-col :span="8"><el-form-item label="注册日期" prop="regDate">  <el-date-picker size="mini" v-model="userInfo.regDate" type="date" placeholder="选择日期" readonly="readonly">
              </el-date-picker></el-form-item></el-col>
            </el-row>
            <el-row style="text-align: center;">
              <el-col :span="6"><el-form-item label="设为管理员"><el-checkbox :true-label="1" :false-label="0" v-model="userInfo.isAdmin" ></el-checkbox></el-form-item></el-col>
              <el-col :span="6"><el-form-item label="锁定"><el-checkbox :true-label="1" :false-label="0" v-model="userInfo.isLock" ></el-checkbox></el-form-item></el-col>
              <el-col :span="6"><el-form-item label="访问所有仓库"><el-checkbox :true-label="1" :false-label="0" v-model="userInfo.accessAllStore" ></el-checkbox></el-form-item></el-col>
              <el-col :span="6"><el-form-item label="访问隐藏单据"><el-checkbox :true-label="1" :false-label="0" v-model="userInfo.accessBill" ></el-checkbox></el-form-item></el-col>
            </el-row>
            <el-row style="width:60%;text-align: right">
              <el-row >
                <el-form-item  label="访问客户限制(只允许)"><commonSelect  v-model="cuidsArray" ></commonSelect></el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="访问客户限制(不允许)"><commonSelect  v-model="denyCuidsArray" ></commonSelect></el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="备注"><el-input type="textarea" style="width:500px"   v-model="userInfo.remark" ></el-input></el-form-item>
              </el-row>
            </el-row>

        </el-tab-pane>
        <el-tab-pane label="权限设置">
          <el-row>
            <el-col :span="8">
              <el-table :data="roleList" height="500" element-loading-text="给我一点时间"  border fit highlight-current-row>
                <el-table-column sortable align="center" label="选择" width="60">
                  <template slot-scope="scope">
                    <input type="checkbox" :value="scope.row.id" v-model="userRoleArray" ></input>
                  </template>
                </el-table-column>
                <el-table-column sortable align="center" label="权限代码" prop="roleCode"></el-table-column>
                <el-table-column sortable align="center" label="权限名称" prop="roleName"></el-table-column>
              </el-table>
            </el-col>
            <el-col :span="4" style="text-align:center;padding-top:10%"> <el-button class="filter-item" type="primary" v-waves  @click="getRightByRole" >按角色分配权限</el-button></el-col>
            <el-col :span="12" style="padding:0 20px 0 40px;">

                <el-collapse v-model="activeName" accordion height="500">
                  <el-collapse-item  v-for="item in moduleMenuList" :key="item.id" :title="item.moduleName0" :name="item.id">
                    <el-table :data="getModuleListByParentId(item.id)" height="500" element-loading-text="给我一点时间"  border fit highlight-current-row>
                      <el-table-column sortable align="center" label="二级菜单" prop="moduleName0" width="200"></el-table-column>
                      <el-table-column sortable align="center" label="权限集合">
                        <template slot-scope="scope">
                          <el-form-item v-for="obj in scope.row.rightList" :key="obj.id"  name="obj.id" :label="obj.rightName">
                            <input type="checkbox" :value="concat(scope.row.id,obj.rightCode)" v-model="rigthArray"  ></input>
                          </el-form-item>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-collapse-item>
                </el-collapse>

            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="仓库设置">
          <el-transfer v-model="storeArray" :data="storeData" :titles="storeTitles" ></el-transfer>
        </el-tab-pane>
      </el-tabs>
      </el-form>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { addUser, updateUser } from '@/api/basedata/userConfig'
  import { rsa } from '@/api/login'
  import JSEncrypt from '@/assets/jsencrypt/js/jsencrypt'
  import waves from '@/directive/waves/index' // 水波纹指令
  import commonSelect from '@/views/basedata/userConfig/customerSelect'
  import * as common from '@/utils'
  export default {
    props: {
      isShow: Boolean,
      currentRow: Object,
      type: 0, // 0为新增操作，1为修改操作
      roleList: Array,
      allModuleList: Array,
      moduleMenuList: Array,
      userStoreList: Array,
      noUserStoreList: Array,
      chooseRightArray: Array,
      chooseUserRoleArray: Array
    },
    components: {
      commonSelect: commonSelect
    },
    directives: {
      waves
    },
    computed: {
      ...mapGetters([
        'storeList'
      ])
    },
    data() {
      return {
        activeName: '',
        cuids_options: [],
        cuidsArray: [],
        denyCuidsArray: [],
        listLoading: true,
        rigthArray: [],
        userRoleArray: [],
        storeData: [],
        storeArray: [],
        storeTitles: ['仓库名称(未添加)', '仓库名称(已添加)'],
        rule: {
          userCode: [{ required: true, message: '请输入登录账号', trigger: 'blur' }],
          userName: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
          password2: [{ required: true, message: '请输入密码', trigger: 'blur' }],
          regDate: [{ required: true, message: '请选择注册日期', trigger: 'blur' }]
        },
        userInfo: {
          userName: '',
          userCode: '',
          mobile: '',
          password: '',
          password2: '',
          isAdmin: 0,
          isLiasonMan: 0,
          isLock: 0,
          accessAllStore: 0,
          accessBill: 0,
          regDate: common.getNowFormatDate(),
          cuids: '',
          denyCuids: '',
          remark: '',
          roleList: [],
          storeList: [],
          userModuleList: [],
          sn: ''
        },
        defaultData: null,
        loading: false
      }
    },
    mounted() {
      this.defaultData = JSON.parse(JSON.stringify(this.userInfo))
      for (let i = 0; i < this.storeList.length; i++) {
        this.storeData.push({
          key: this.storeList[i].id,
          label: this.storeList[i].storeName,
          disabled: false
        })
      }
    },
    methods: {
      getRightByRole() {
        this.rigthArray = []
        for (var x in this.userRoleArray) {
          for (var xx in this.roleList) {
            if (this.userRoleArray[x] === this.roleList[xx].roleId) {
              for (var xxx in this.roleList[xx].moduleRoleList) {
                var moduleId = this.roleList[xx].moduleRoleList[xxx].moduleId
                for (var xxxx in this.roleList[xx].moduleRoleList[xxx].rightList) {
                  var rightCode = this.roleList[xx].moduleRoleList[xxx].rightList[xxxx].rightCode
                  this.rigthArray.push(moduleId + '-' + rightCode)
                }
              }
            }
          }
        }
      },
      submitForm() {
        this.userInfo.roleList = []
        this.userInfo.storeList = []
        this.userInfo.userModuleList = []
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            rsa().then(response => {
              const encrypt = new JSEncrypt()
              encrypt.setRSAKey(response.m, response.e)
              this.userInfo.sn = response.sn
              if (this.userInfo.password2 !== '******') {
                this.userInfo.password = encrypt.encrypt(this.userInfo.password2)
              } else {
                this.userInfo.password = ''
              }
              this.userInfo.cuids = this.cuidsArray.join(',')
              this.userInfo.denyCuids = this.denyCuidsArray.join(',')
              for (var x in this.userRoleArray) {
                this.userInfo.roleList.push({ 'roleId': this.userRoleArray[x] })
              }
              for (var xx in this.storeArray) {
                if (this.type === 1) {
                  this.userInfo.storeList.push({ 'storeId': this.storeArray[xx], 'userId': this.currentRow.id })
                } else {
                  this.userInfo.storeList.push({ 'storeId': this.storeArray[xx] })
                }
              }
              var mlist = []
              var unique = []
              for (var xxx in this.rigthArray) {
                var tmp = this.rigthArray[xxx].split('-')
                var key = tmp[0]
                if (this.array_contain(unique, key)) { continue }
                var rightArr = []
                for (var xxxx in this.rigthArray) {
                  var tmp2 = this.rigthArray[xxxx].split('-')
                  var key2 = tmp2[0]
                  if (key === key2) {
                    rightArr.push({ 'rightCode': tmp2[1] })
                  }
                }
                mlist.push({ 'moduleId': key, 'rightList': rightArr })
                unique.push(key)
              }
              this.userInfo.userModuleList = mlist
              if (this.type === 0) {
                addUser(this.userInfo).then(response => {
                  this.$notify({
                    title: '成功',
                    message: '新增成功',
                    type: 'success',
                    duration: 2000
                  })
                  this.loading = false
                  this.$emit('hideTab')
                  this.$parent.getList()
                }).catch(() => {
                  this.loading = false
                })
              } else {
                updateUser(this.userInfo).then(response => {
                  this.$notify({
                    title: '成功',
                    message: '更新成功',
                    type: 'success',
                    duration: 2000
                  })
                  this.loading = false
                  this.$emit('hideTab')
                  this.$parent.getList()
                }).catch(() => {
                  this.loading = false
                })
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      array_contain(array, obj) {
        for (var i = 0; i < array.length; i++) {
          if (array[i] === obj) {
            return true
          }
        }
        return false
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
      concat(a, b) {
        return a + '-' + b
      }
    },
    watch: {
      isShow: function(val) {
        this.$refs.dataForm.clearValidate()
        // 数组初始化
        this.rigthArray = []
        this.userRoleArray = []
        this.storeArray = []
        this.cuidsArray = []
        this.denyCuidsArray = []
        this.userInfo.roleList = []
        this.userInfo.storeList = []
        this.userInfo.userModuleList = []
        // 判断新增或修改操作进行相应的初始化赋值
        if (this.type === 1) {
          // console.log(this.currentRow)
          Object.assign(this.userInfo, this.currentRow)
          this.userInfo.userName = this.currentRow.userName0
          this.rigthArray = this.chooseRightArray
          this.userRoleArray = this.chooseUserRoleArray

          for (var x in this.userStoreList) {
            this.storeArray.push(this.userStoreList[x].id)
          }
          if (this.currentRow.cuids !== '') {
            var tmp = this.currentRow.cuids.split(',')
            for (var xx in tmp) {
              this.cuidsArray.push(tmp[xx])
            }
          }
          if (this.currentRow.denyCuids !== '') {
            tmp = this.currentRow.denyCuids.split(',')
            for (var xxx in tmp) {
              this.denyCuidsArray.push(tmp[xxx])
            }
          }
        } else {
          Object.assign(this.userInfo, this.defaultData)
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .addTab{position: absolute;width:100%;height:100%;background: white;z-index: 10;}
  .el-col{text-align: right;}
  .el-option{z-index:20;}
</style>
