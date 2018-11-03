<template>
  <input  v-model.number="content" :disabled="disabled">
</template>

<script>
  export default {
    props: ['value', 'disabled', 'decimal', 'min', 'max'],
    watch: {
      content: function(newVal, oldVal) {
        this.$emit('input', this.NumberFilter(newVal, oldVal))
        this.$emit('change')
      },
      value: function(newVal, oldVal) {
        this.content = newVal
      }
    },
    methods: {
      NumberFilter(newVal, oldVal) {
        if (isNaN(newVal)) {
          this.content = ''
          return ''
        }
        if (!isNaN(this.min)) {
          const min = parseFloat(this.min)
          if (parseFloat(newVal) < min) { // 输入最小值限制
            this.content = min
            return this.content
          }
        }
        if (!isNaN(this.max)) {
          const max = parseFloat(this.max)
          if (parseFloat(newVal) > max) { // 输入最大值限制
            this.content = max
            return this.content
          }
        }
        const format = this.decimal.split(',')
        const tmp = newVal.toString().split('.')
        if (tmp[0].length > parseInt(format[0])) {
          this.content = oldVal
          return this.content
        }
        // 防止内容回退导致无法正常输入
        if (tmp.length === 1 || tmp[1].length < parseInt(format[1])) {
          this.content = newVal
          return this.content
        }
        if (format[1] === '0' || isNaN(format[1])) {
          this.content = tmp[0]
          return this.content
        }
        this.content = tmp[0] + '.' + tmp[1].substring(0, parseInt(format[1]))
        return this.content
      }
    },
    data() {
      return {
        content: this.value // 输入值
      }
    }
  }
</script>

<style scoped>
  input {
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 24px;
    line-height: 24px;
    outline: 0;
    padding: 0 15px;
    -webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    width: 100%;
  }

  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  input::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }

  input:focus {
    border-color: #409EFF;
    outline: 0;
  }
</style>
