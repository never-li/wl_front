<template>
  <div >
    <el-dialog
      title="打印"
      :visible="print.visible"
      width="850px"
      @close="handleClose">
      <div style="padding-bottom: 10px;">
        <el-button type="primary" size="mini" @click="printMachBill(1)" :disabled="formData.isMulti===1">分条加工单</el-button>
        <el-button type="primary" size="mini" @click="printMachBill(2)" :disabled="formData.isMulti===1">分转平加工单</el-button>
        <el-button type="primary" size="mini" @click="printMachBill(3)" :disabled="formData.isMulti===1">平直加工单</el-button>
        <el-button type="primary" size="mini" @click="printMachBill(4)" :disabled="formData.isMulti!==1">一体机加工单</el-button>
      </div>
      <iframe name="printFrame" width="100%" height="400px" v-if="print.printType===1"></iframe>
      <iframe name="printFrame" width="100%" height="400px" v-if="print.printType===2"></iframe>
      <iframe name="printFrame" width="100%" height="400px" v-if="print.printType===3"></iframe>
      <iframe name="printFrame" width="100%" height="400px" v-if="print.printType===4"></iframe>
    </el-dialog>
  </div>
</template>

<script>
  import { print } from '@/api/process/mach/index'
  import * as common from '@/utils'

  export default {
    name: 'machOrderPrint',
    components: {
    },
    props: {
      formData: Object
    },
    computed: {
    },
    data() {
      return {
        print: {
          visible: true,
          billId: '',
          billType: -1,
          printType: ''
        }
      }
    },
    methods: {
      printMachBill(type) {
        const param = {
          id: this.formData.id,
          printType: type
        }
        this.print.printType = type
        print(param).then(response => {
          this.print.visible = true
          this.print.url = response.billPrintList[0].url
          this.print.billId = response.billPrintList[0].billId
          this.print.billType = response.billPrintList[0].billType
        }
        ).then(() => {
          setTimeout(this.toPrint, 100)
        })
      },
      handleClose() {
        this.$emit('handleClose')
      },
      toPrint() {
        common.doPrint('printFrame', this.print.url, this.print.billId)
      }
    }
  }
</script>

<style lang="scss">

</style>
