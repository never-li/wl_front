<template>

        <el-select v-model="value" clearable filterable placeholder="请选择" >
            <el-option v-for="(option,indext) in filterDisplayItems(selectData)" :key="indext" :label="option[displayItem]" :value="option[selectedValue]">
            </el-option>
        </el-select>

</template>

<script>
export default {
  props: {
    selectData: Array, // 子组间传入 下拉需要显示的字段
    displayItem: String,
    selectedValue: String
  },
  watch: {},

  methods: {
    filterMethod(query) {
      this.queryText = query // 获取下拉 select 输入的值
      // console.log(query)
    },
    filterDisplayItems(options) {
      // const that = this
      //  过滤下拉选项过多
      let filterItems = []
      // if (this.queryText.length > 0) {
      //   for (
      //     let index = 0;
      //     index < options.length && filterItems.length < 15;
      //     index++
      //   ) {
      //     const item = options[index]
      //     if (item[that.displayItem].indexOf(this.queryText) !== -1) {
      //       filterItems.push(item)
      //     }
      //   }
      // } else {
      //   filterItems = options.slice(0, 15)
      // }
      filterItems = options.slice(0, 15)
      return filterItems
    }
  },

  data() {
    return {
      queryText: '', // select 下拉输入值
      value: ''
    }
  }
}
</script>

