<template>
  <div>
    <!--头部按钮组-->
    <div class="btn-group-container">
      <!--修改-->
      <template v-if="formData.status === 0">
        <el-button type="primary" @click="returnHome" icon="el-icon-back">返回</el-button>
        <el-button type="primary" @click="finishMach">完成加工</el-button>
      </template>

      <!--查看-->
      <template v-else>
        <el-button type="primary" @click="returnHome" icon="el-icon-back">返回</el-button>
        <el-button type="primary" @click="cancelMach">取消完成</el-button>
      </template>
    </div>

  <el-container id="order-hight">
        <el-main>
          <el-tabs type="border-card">
            <el-tab-pane label="加工要求">
              <mach-tab :formData="formData"></mach-tab>
            </el-tab-pane>
            <el-tab-pane label="领料记录">
              <receive-tab :formData="formData" @queryMachPackInfo="queryMachPackInfo"></receive-tab>
            </el-tab-pane>
            <el-tab-pane label="打包记录">
              <pack-tab :formData="formData" @queryMachPackInfo="queryMachPackInfo"></pack-tab>
            </el-tab-pane>
          </el-tabs>
        </el-main>
  </el-container>
  </div>
</template>

<script>
  import machTab from './common/machTab'
  import receiveTab from './common/receiveTab'
  import packTab from './common/packTab'
  import * as api from '@/api/process/machPack/machPack'

  export default {
    name: 'views',
    props: {
      selectRow: Object
    },
    components: {
      machTab,
      receiveTab,
      packTab
    },
    data() {
      return {
        formData: this.selectRow
      }
    },
    mounted() {
      const orderHight = document.body.clientHeight
      document.getElementById('order-hight').style.height = (orderHight - 180) + 'px'
    },
    methods: {
      // 加工打包查询
      queryMachPackInfo() {
        const reqData = {
          machPackId: this.formData.id
        }
        api.queryMachPackInfo(reqData).then((response) => {
          this.formData = response.machPackInfo
        }).catch(error => {
          if (error) console.error(error)
        })
      },
      // 完成加工
      finishMach() {
        const reqData = {
          machPackId: this.formData.id
        }
        api.finishMach(reqData).then(response => {
          this.$parent.getList()
          this.returnHome()
        }).catch(error => {
          if (error)console.error(error)
        })
      },
      // 取消完成
      cancelMach() {
        const reqData = {
          machPackId: this.formData.id
        }
        api.cancelMach(reqData).then(response => {
          this.$parent.getList()
          this.returnHome()
        }).catch(error => {
          if (error)console.error(error)
        })
      },
      returnHome() {
        this.$emit('hideView')
      }
    },
    created() {
      this.queryMachPackInfo()
    }
  }
</script>

<style scoped>

</style>
