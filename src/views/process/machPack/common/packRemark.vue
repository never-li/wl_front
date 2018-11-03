<template>
  <div>
    <el-input type="textarea" v-model="selectRow.remark" ref="remarkInput"></el-input>
    <div style="margin-top: 10px">
      <el-button plain style="margin-top: 7px" v-for="(item,index) in packRemarks"
                 :key="item" @click="appendRemark(item)" :type="typeArr[index%5]">{{item}}</el-button>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'pack-remark',
    props: {
      selectRow: Object
    },
    computed: {
      ...mapGetters(['packRemarks'])
    },
    data() {
      return {
        typeArr: [
          'primary',
          'success',
          'info',
          'warning',
          'danger'
        ]
      }
    },
    methods: {
      appendRemark(val) {
        this.selectRow.remark += val
        this.inputFocus()
      },
      inputFocus() {
        this.$refs.remarkInput.focus()
      }
    },
    mounted() {
      this.inputFocus()
    }
  }
</script>

<style scoped>

</style>
