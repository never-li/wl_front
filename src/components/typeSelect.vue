<template>
  <el-select filterable clearable v-model="currentValue" :disabled="disabled" placeholder="请选择" :size="size"  @blur="handleBlur($event)">
    <el-option v-for="item in typeList" :value="getValue(item)" clearable :label="item.typeName" :key="item.value">
    </el-option>
  </el-select>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    // props: ['disabled', 'value', 'field', 'size'],
    props: {
      disabled: Boolean,
      value: String,
      field: String,
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
      ...mapGetters(['typeList'])
    },
    data() {
      return {
        currentValue: this.value
      }
    },
    methods: {
      handleBlur(e) {
        this.$emit('blur', e)
      },
      getValue(item) {
        if (this.field && this.field !== '') {
          return item[this.field]
        } else {
          return item.id
        }
      }
    }
  }
</script>

