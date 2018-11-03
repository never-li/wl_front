<template>
  <el-select filterable clearable v-model="currentValue" :disabled="disabled" placeholder="请选择" :size="size" @blur="handleBlur($event)">
    <el-option v-for="item in factoryList" :value="item.factoryName" clearable :label="item.factoryName" :key="item.id" >
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
      ...mapGetters(['factoryList'])
    },
    data() {
      return {
        currentValue: this.value
      }
    },
    methods: {
      handleBlur(e) {
        this.$emit('blur', e)
      }
    }
  }
</script>

