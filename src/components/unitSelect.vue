<template>
  <el-select filterable clearable v-model="currentValue" :disabled="disabled" placeholder="请选择" :size="size">
    <el-option v-for="unit in unitList" :value="unit" clearable :label="unit" :key="unit">
    </el-option>
  </el-select>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    // props: ['disabled', 'value'],
    props: {
      disabled: Boolean,
      value: String,
      size: {
        type: String,
        default: 'mini'
      }
    },
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
      ...mapGetters(['systemparmMap']),
      unitList() {
        const unitList = []
        if (this.systemparmMap.NUMBERUNIT) {
          for (const key in this.systemparmMap.NUMBERUNIT) {
            unitList.push(this.systemparmMap.NUMBERUNIT[key])
          }
        }
        return unitList
      }
    },
    data() {
      return {
        currentValue: this.value
      }
    }
  }
</script>

