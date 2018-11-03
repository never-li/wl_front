<template>
  <div class="topbar">
    <div class="logo"><img class="logo-img" :src="avatarImg">自信科技 - 仓储管理系统</div>
    <topbar-item :routes="permission_routers"></topbar-item>
    <div class="user">
                <span class="user-msg">
                  <router-link to="/">
                  <i class="el-icon-third-xiaoxi icon"><span v-if="userInfo.taskCount" class="icon-num">{{userInfo.taskCount}}</span></i>
                  </router-link>
                </span>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <i class="el-icon-third-yonghu user-icon"></i>
          <!-- <img class="user-avatar" width="40px" height="40px;" :src="avatar+'?imageView2/1/w/80/h/80'"> -->
          <span class="user-name">{{userInfo.name}}</span>
          <i class="el-icon-caret-bottom user-caret"></i>
        </div>
        <el-dropdown-menu class="user-dropdown" slot="dropdown">
          <router-link class="inlineBlock" to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span @click="changePWD.dialogVisible = true" style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span @click="refreshCommonData" style="display:block;">刷新公用数据</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      title="修改密码"
      :visible.sync="changePWD.dialogVisible"
      width="350px"
    :before-close="changePWDFromReset">
      <el-form :rules="changePwdRules" ref="changePWDForm" :model="changePWD" label-width="100px">
        <el-row>
          <el-form-item label="旧密码" prop="oPWD">
            <el-input v-model="changePWD.oPWD" type="password" autoComplete="off" class="input-w-168"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="新密码" prop="nPWD">
            <el-input v-model="changePWD.nPWD" type="password" autoComplete="off" class="input-w-168"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="新密码确认" prop="nPWD2">
            <el-input v-model="changePWD.nPWD2" type="password" autoComplete="off" class="input-w-168"></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="changePWDCancel">取 消</el-button>
          <el-button type="primary" @click="changePWDSubmit">确 定</el-button>
        </span>
    </el-dialog>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import TopbarItem from './TopbarItem'
  import { dologout, rsa, changePwd } from '@/api/login'
  import JSEncrypt from '@/assets/jsencrypt/js/jsencrypt'
  import * as auth from '@/utils/auth'
  import avatarImg from '@/assets/images/logo.png'

  export default {
    data() {
      const validatePassCheck = (rule, value, callback) => {
        if (!value || value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.changePWD.nPWD) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      const validatePass = (rule, value, callback) => {
        if (!value || value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.changePWD.nPWD !== '' && this.changePWD.nPWD2 !== '') {
            this.$refs.changePWDForm.validateField('nPWD2')
          }
          callback()
        }
      }
      return {
        avatarImg: avatarImg,
        changePWD: {
          dialogVisible: false,
          oPWD: '',
          nPWD: '',
          nPWD2: ''
        },
        changePwdRules: {
          oPWD: [{ validator: validatePass, trigger: 'blur' }],
          nPWD: [{ validator: validatePass, trigger: 'blur' }],
          nPWD2: [{ validator: validatePassCheck, trigger: 'blur' }]
        }
      }
    },
    components: { TopbarItem },
    computed: {
      ...mapGetters([
        'avatar',
        'userInfo',
        'permission_routers'
      ]),
      routes() {
        return this.$router.options.routes
      },
      isCollapse() {
        return !this.sidebar.opened
      }
    },
    methods: {
      // 登出
      logout() {
        const token = auth.getToken()
        dologout(token).then(() => {
          auth.removeToken()
          location.reload() // 为了重新实例化vue-router对象 避免bug
        }).catch(error => {
          if (error) console.error(error)
        })
      },
      changePWDFromReset(done) {
        this.$refs['changePWDForm'].resetFields()
        if (done) {
          done()
        }
      },
      changePWDCancel() {
        this.changePWD.dialogVisible = false
        this.changePWDFromReset()
      },
      changePWDSubmit() {
        this.$refs['changePWDForm'].validate(valid => {
          if (valid) {
            rsa().then(response => {
              const encrypt = new JSEncrypt()
              encrypt.setRSAKey(response.m, response.e)
              const rsaOPwd = encrypt.encrypt(this.changePWD.oPWD)
              const rsaNPwd = encrypt.encrypt(this.changePWD.nPWD)
              changePwd(rsaOPwd, rsaNPwd, response.sn).then(response => {
                auth.setToken(response.token)
                this.changePWD.dialogVisible = false
                this.changePWDFromReset()
              }).catch(e => {})
            })
          } else {
            return false
          }
        })
      },
      // 刷新公用数据
      refreshCommonData() {
        this.$store.dispatch('Member')
        this.$store.dispatch('Store')
        this.$store.dispatch('Factory')
        this.$store.dispatch('Type')
        this.$store.dispatch('Sort')
        this.$store.dispatch('Grade')
        this.$store.dispatch('Feeconfig')
        this.$store.dispatch('Bank')
        this.$store.dispatch('Spec')
        this.$store.dispatch('User')
        this.$store.dispatch('Customer')
        this.$store.dispatch('Machtype')
        this.$store.dispatch('Machine')
        this.$store.dispatch('Feetype')
        this.$store.dispatch('MemberGroup')
        this.$store.dispatch('Systemparm')
        this.$store.dispatch('Receivers')
        this.$store.dispatch('Craners')
        this.$store.dispatch('Handors')
        this.$store.dispatch('Packremarks')
      }
    }
  }

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .topbar {
    background: #2963ac;
  }

  div.user {
    float: right;
    margin-top: 10px;
    margin-right: 5px;
  }

  div.logo {
    float: left;
    height: 60px;
    overflow: hidden;
    line-height: 60px;
    margin: 0 50px 0 10px;
    font-size: 18px;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 700;
    .logo-img {
      height: 55px;
      vertical-align: middle;
    }
  }

  .menu-wrapper {
    display: inline-block;
  }

  .user {
    .user-icon {
      cursor: pointer;
      font-size: 30px;
      color: #fff;
      margin-top: 5px;
    }
    .user-name {
      cursor: pointer;
      font-size: 14px;
      color: #fff;
      display: inline-block;
      vertical-align: top;
      margin: 12px 0px 0px 5px;
    }
    .user-caret {
      cursor: pointer;
      display: inline-block;
      vertical-align: top;
      margin: 12px 0 0 0;
      color: #fff;
    }
    .user-msg {
      cursor: pointer;
      margin-right: 30px;
      .icon {
        position: relative;
        font-size: 25px;
        color: #fff;
        .icon-num {
          position: absolute;
          display: inline-block;
          top: -8px;
          right: -10px;
          font-size: 12px;
          background: #ff0000cc;
          min-width: 20px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          border-radius: 50%;
        }
      }
    }
  }
</style>
