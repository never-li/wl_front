<template>
  <div class="login-container">
    <div class="head_wrap">
      <div class="wrap_logo">
        <span class="logo"><img src="../../assets/images/logo.png"></span>
        <span class="logo-txt"><img src="../../assets/images/login-txt.png"></span>
      </div>
    </div>
    <div class="min_wrap">
        <div class="banner">
            <img src="../../assets/images/login-img.png"/>
        </div>
          <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
              <h3 class="title">欢迎登录仓储加工管理系统!</h3>
              <el-form-item prop="username">
                <span class="svg-container svg-container_login">
                  <svg-icon icon-class="user" />
                </span>
                <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="请输入您的用户名" />
              </el-form-item>
              <el-form-item prop="password">
                <span class="svg-container">
                  <svg-icon icon-class="password"></svg-icon>
                </span>
                <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on"
                  placeholder="请输入您的密码"></el-input>
                  <span class="show-pwd" @click="showPwd"><svg-icon v-if="pwdShow" icon-class="eye" /><i v-else class="el-icon-view"></i></span>
              </el-form-item>
              <el-form-item prop="member">
                <span class="svg-container">
                  <svg-icon icon-class="list"></svg-icon>
                </span>
                <el-select v-model="loginForm.memberId" filterable placeholder="请选择仓库">
                <el-option
                  v-for="item in memberList"
                  :key="item.id"
                  :label="item.simpleName"
                  :value="item.id">
                </el-option>
              </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
                  登录
                </el-button>
              </el-form-item>
      <!--   <div class="tips">
            <span style="margin-right:20px;">username: admin</span>
            <span> password: admin</span>
          </div>-->
          </el-form>
    </div>
    <div class="foot_wrap">
        <p class="fz-16">Copyright © 2018  广东自信科技有限公司 版权所有，并保留所有权利</p>
        <p class="fz-14">
          <a href="http://www.miibeian.gov.cn/">
            <i class="icppic-icon"></i>粤ICP备18120641号-1
          </a>
        </p>
    </div>
  </div>
</template>

<script>
// import { isvalidUsername } from '@/utils/validate'
import { login, rsa } from '@/api/login'
import JSEncrypt from '@/assets/jsencrypt/js/jsencrypt'
import * as auth from '@/utils/auth'
import * as commonData from '@/api/commondata'

export default {
  name: 'login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value || value === '') {
        callback(new Error('用户名不能为空'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (!value || value === '') {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        memberId: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      memberList: [],
      loading: false,
      pwdType: 'password',
      pwdShow: true
    }
  },
  created() {
    this.getMemberList()
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdShow = false
        this.pwdType = ''
      } else {
        this.pwdShow = true
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          const username = this.loginForm.username.trim()
          const memberId = this.loginForm.memberId
          // 获取rsa
          rsa().then(response => {
            const encrypt = new JSEncrypt()
            encrypt.setRSAKey(response.m, response.e)
            const rsaPwd = encrypt.encrypt(this.loginForm.password)
            login(username, rsaPwd, memberId, response.sn).then(response => {
              auth.setToken(response.token)
              this.loading = false
              this.$router.push({ path: '/' })
            }).catch(error => {
              if (error)console.error(error)
              this.loading = false
            })
          }).catch(error => {
            if (error)console.error(error)
            this.loading = false
          })
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    },
    getMemberList() {
      const url = location.href
      const matchs = url.match(/^https?:\/\/([^.]+)\..*/)
      commonData.member().then(response => {
        this.memberList = response.memberList
        if (matchs && matchs.length > 1) {
          const member = this.memberList.filter((member) => member.subDomain === matchs[1])
          if (member && member.length > 0) {
            this.loginForm.memberId = member[0].id
          }
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 88.4%;
    background: #303C4B;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px !important;
      font-size: 14px;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inse;
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-select {
    width: 88.4%;
    .el-input--suffix {
      width: 100%;
    }
  }
  .el-form-item__error{
    padding-top: 7px;
    padding-left: 65px;
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .el-button{
    padding: 15px 20px;
    font-size:14px;
  }
  .el-form-item__content{
    margin-left: 0px;
    
  }
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  .head_wrap{
    position: relative;
    min-width: 1200px;
    width: 100%;
    height: 110px;
    background:#fff;
    line-height:110px;
    .wrap_logo{
      position: absolute;
      top:0;
      left: 100px;
    }
    img{
      vertical-align: middle;
    }
  }
  .min_wrap{
    display: flex;
    justify-content: space-around;
    align-items: center;
    background:url(../../assets/images/login_bg.png);
    // box-shadow: inset 0 1px 5px 0 rgba(0,0,0,.6);
    background-size: cover;
    width: 100%;
    min-width:1200px;
    position: absolute;
    top: 100px;
    height: calc(100% - 234px);
    overflow: hidden;
  }
  .login-form {
    width: 500px;
    padding:40px;
    background:rgba(27,46,71,0.7);
    box-sizing: border-box;
    border-radius:5px;
    box-shadow: 0px 2px 5px 1px rgba(250,250,250,.1);
  }
  .foot_wrap{
    width: 100%;
    position: absolute;
    bottom:0;
    left: 0;
    height: 130px;
    background:#fff;
    text-align: center;
    font-size:18px;
    p{
      line-height:20px;
    }
    .icppic-icon{
      display: inline-block;
      width:38px;
      height: 43px;
      background:url(../../assets/images/icppic.gif);
      vertical-align: middle;
      margin-right: 8px;
    }

  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    color: $dark_gray;
    vertical-align: middle;
    text-align: center;
    width: 45px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 24px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: left;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 14px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
