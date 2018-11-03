<template>
  <el-radio-group v-model="value" @change="handleChange">
    <el-radio v-for="item in statusList"
              :label="item.value"
              :key="item.value">
      {{item.label}}
    </el-radio>
  </el-radio-group>
</template>

<script>
export default {
  watch: {
    value(val) {
      this.$emit('input', val)
    }
  },
  data() {
    return {
      statusList: [
        { label: '非删除', value: 3 },
        { label: '已审核', value: 2 },
        { label: '未审核', value: 1 },
        { label: '删除', value: 4 },
        { label: '全部', value: 0 }
      ],
      value: 3
    }
  },
  created() {
    this.$emit('input', this.value)
  },
  methods: {
    handleChange() {
      this.$emit('change', this.value)
    }
  }
}
</script>

