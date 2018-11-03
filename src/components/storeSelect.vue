<template>
  <el-select filterable clearable v-model="currentValue" :disabled="disabled" placeholder="请选择">
    <el-option v-for="item in storeList" :value="item.id" clearable :label="item.storeName" :key="item.value">
    </el-option>
  </el-select>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    props: ['disabled', 'value'],
    watch: {
      currentValue: {
        handler: function(newVal, oldVal) {
          this.$emit('input', newVal)
        },
        immediate: true
      },
      value: function(newVal, oldVal) {
        this.currentValue = newVal
      }
    },
    computed: {
      ...mapGetters(['storeList'])
    },
    data() {
      return {
        currentValue: this.value
      }
    }
  }
</script>

