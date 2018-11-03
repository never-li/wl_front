<template>
  <div>
    <div v-show="!BUS.showSelectGoods">
      <!--头部按钮组-->
      <div class="btn-group-container">
        <!--新增修改-->
        <div v-if="BUS.action === 'add' || BUS.action === 'update' ">
          <el-button type="primary" icon="el-icon-close" @click="back">取消</el-button>
          <el-button type="primary" icon="el-icon-check" @click="saveOrUpdate">保存</el-button>
          <el-button type="primary" icon="el-icon-view" @click="saveOrUpdate('audit')">{{auditMsg}}</el-button>
          <el-checkbox v-model="checkPrint" class="ml-15">审核打印</el-checkbox>
        </div>

        <!--查看-->
        <div v-if="BUS.action === 'view'">
          <el-button type="primary" @click="back" icon="el-icon-back">返回</el-button>
          <el-button type="primary" icon="el-icon-edit" @click="BUS.action = 'update'" v-if="this.BUS.selectRow.status==0">修改</el-button>
          <el-button type="primary" icon="el-icon-check" @click="audit">{{auditMsg}}</el-button>
          <el-button type="primary" icon="el-icon-goods" @click="makeCollection" :disabled="formData.status === 0">{{collectionMsg}}</el-button>
          <el-button type="primary" v-if="BUS.selectRow.status==1" @click="printBill()" icon="el-icon-printer">打印</el-button>
          <el-checkbox v-if="this.BUS.selectRow.status==0" v-model="checkPrint" class="ml-15">审核打印</el-checkbox>
        </div>
      </div>

      <!--表单-->
      <common-form :BUS="BUS" :formData="formData" ref="feeForm"></common-form>

      <el-tabs v-model="tabName" type="border-card" @tab-click="tabClick" v-if="BUS.action !== ''">
        <el-tab-pane label="费用明细" name="first" >
          <common-table :formData="formData" :table-data="dtList" :BUS="BUS" >
          </common-table>
        </el-tab-pane>
        <el-tab-pane label="操作明细" name="second" >
          <el-table :data="logData" header-cell-class-name="table-header-bg text-center" row-key="id" border stripe height="545"
                   row-class-name="pointer text-center" highlight-current-row max-height="500"  >
            <el-table-column sortable label="操作人" prop="userName"></el-table-column>
            <el-table-column sortable label="操作名称" prop="feeName"></el-table-column>
            <el-table-column sortable label="操作时间" prop="feeTime"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>


  </div>
</template>

<script>
  import commonForm from './common/commonForm'
  import commonTable from './common/commonTable'
  import * as api from '@/api/collectfee/feeRc/feeRc'
  import { mapGetters } from 'vuex'
  import * as common from '@/utils'
  export default {
    name: 'views',
    props: {
      BUS: Object
    },
    computed: {
      ...mapGetters(['userInfo']),
      auditMsg: function() {
        if (this.formData.status === 1) {
          return '反审核'
        } else {
          return '审核'
        }
      },
      collectionMsg: function() {
        if (this.formData.isFee === 2) {
          return '取消收款'
        } else {
          return '收款'
        }
      }
    },
    components: {
      commonForm, commonTable
    },
    data() {
      return {
        checkPrint: true,
        logData: [],
        tabName: 'first',
        formData: {},
        dtList: []
      }
    },
    methods: {
      tabClick(tab, event) {
      },
      // getNowFormatDate() {
      //   const date = new Date()
      //   var seperator1 = '-'
      //   var seperator2 = ':'
      //   var month = date.getMonth() + 1
      //   var strDate = date.getDate()
      //   if (month >= 1 && month <= 9) {
      //     month = '0' + month
      //   }
      //   if (strDate >= 0 && strDate <= 9) {
      //     strDate = '0' + strDate
      //   }
      //   var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + ' ' + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds()
      //   return currentdate
      // },
      // 保存
      saveOrUpdate(val) {
        if (!this.formData.custId) {
          this.$message.info('客户不能为空')
          return false
        }
        if (!this.formData.feeId) {
          this.$message.info('费用类型不能为空')
          return false
        }
        if (!this.formData.bldate) {
          this.$message.info('单据日期不能为空')
          return false
        }
        // if (!this.formData.payType) {
        //   this.$message.info('付款单位不能为空')
        //   return false
        // }
        // if (!this.formData.payMode) {
        //   this.$message.info('付款方式不能为空')
        //   return false
        // }
        if (this.dtList.length === 0) {
          this.$message.info('明细不能为空')
          return false
        }
        for (const x in this.dtList) {
          const item = this.dtList[x]
          if (item.handCode === '' || item.price === '' || item.weight === '' || item.amount === '') {
            this.$message.info('货物单价、金额、单价、重量都不能为空')
            return false
          }
          if (item.storeDay === '' || item.storeDay === null) {
            this.dtList[x].storeDay = 0
          }
        }
        this.formData.dtList = this.dtList
        if (!this.formData.id) {
          api.add(this.formData).then((res) => {
            this.$notify({
              title: '成功',
              message: '新增成功',
              type: 'success',
              duration: 2000
            })
            this.formData.id = res.obj.id
            this.BUS.selectRow = res.obj
            this.formData.status = 0
            if (val !== 'audit') {
              this.back()
              this.$parent.getList()
            } else {
              this.audit()
            }
          }).catch(error => {
            if (error)console.error(error)
          })
        } else {
          api.update(this.formData).then(() => {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
            if (val !== 'audit') {
              this.back()
              this.$parent.getList()
            } else {
              this.audit()
            }
          }).catch(error => {
            if (error)console.error(error)
          })
        }
      },
      printBill() {
        this.$parent.printBill()
        this.back()
      },
      audit() {
        if (this.formData.status === 0) {
          api.audit(this.formData.id).then(() => {
            this.$notify({
              title: '成功',
              message: '审核成功',
              type: 'success',
              duration: 2000
            })
            if (this.checkPrint) {
              this.$parent.printBill()
            }
            this.back()
            this.$parent.getList()
          }).catch(error => {
            if (error) console.error(error)
          })
        } else if (this.formData.status === 1) {
          api.unaudit(this.formData.id).then(() => {
            this.$notify({
              title: '成功',
              message: '反审成功',
              type: 'success',
              duration: 2000
            })
            this.back()
            this.$parent.getList()
          }).catch(error => {
            if (error) console.error(error)
          })
        }
      },
      makeCollection() {
        const that = this
        if (this.formData.isFee === 0) {
          api.makeCollections({ id: this.formData.id, type: 1 }).then(() => {
            that.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
            this.back()
            this.$parent.getList()
          }).catch(error => {
            if (error) console.error(error)
          })
        } else if (this.formData.status === 1) {
          api.makeCollections({ id: this.formData.id, type: 2 }).then(() => {
            that.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
            this.back()
            this.$parent.getList()
          }).catch(error => {
            if (error) console.error(error)
          })
        }
      },
      loadData() {
        this.dtList = []
        this.formData = Object.assign({}, this.formData, this.BUS.selectRow)
        this.formData.countFlag = this.formData.countFlag + ''
        console.log(this.formData)
        api.dtlist(this.BUS.selectRow.id).then(response => {
          this.dtList.forEach((item) => {
            item.storeDay = item.storeDay < 1 ? '' : item.storeDay
          })
          this.formData.initFlag = false
          this.dtList = response.list
        })
        api.feeChargeLogList(this.BUS.selectRow.id).then(response => {
          this.logData = response.list
        })
      },
      back() {
        if (this.BUS.originPath) {
          this.$router.push({ path: this.BUS.originPath, query: { path: 'feeRc' }})
          this.BUS.originPath = ''
        }
        this.BUS.changeView({ path: 'home', action: '' })
      }
    },
    watch: {
      // 监听页面显示状态变化
      'BUS.action': function(val) {
        // 新增页面
        if (val === 'add') {
          this.dtList = []
          this.formData = {}
          this.formData.initFlag = true
          this.formData.countFlag = '0'
          this.formData.creatorName = this.userInfo.name
          this.formData.createTime = common.getNowFormatMinTime()
          this.formData.bldate = common.getNowFormatMinTime()
        } else if (val === 'update' || val === 'view') {
          this.loadData()
        } else {
          this.BUS.selectRow = null
        }
      }
    }
  }
</script>

<style scoped>

</style>
