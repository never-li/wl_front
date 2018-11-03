<template>
  <div :value="value">
    <el-date-picker
      v-model="dateArr"
      type="daterange"
      :disabled="!isEdit"
      :picker-options="pickerOptions"
      range-separator="-"
      unlink-panels
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      size="small"
      :clearable="flag"
      value-format="yyyy-MM-dd">
    </el-date-picker>
  </div>
</template>

<script>
  export default {
    name: 'date-range',
    props: {
      isEdit: Boolean,
      value: Array
    },
    mounted() {
      this.dateArr = this.value
    },
    watch: {
      dateArr(val) {
        this.$emit('input', val)
      }
    },
    data() {
      return {
        flag: false,
        dateArr: [],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }
          // , {
          //   text: '最近三个月',
          //   onClick(picker) {
          //     const end = new Date()
          //     const start = new Date()
          //     start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          //     picker.$emit('pick', [start, end])
          //   }
          // }
          ]
        }
      }
    }
  }
</script>

<style scoped>
  .el-range-editor--small.el-input__inner {
    width: 238px;
  }
</style>
