<template>

  <el-select   v-model="currentValue" remote  clearable filterable  placeholder="请选择" :disabled="disabled" :remote-method="filterMethod" @focus="handleFocus">
    <el-option v-for="(option,indext) in currentItemList" :key="indext" :label="option.factoryName"
               :value="option.id">
    </el-option>
  </el-select>

</template>

<script>
  import * as api from '@/api/basedata/factory'
  export default {
    props: {
      value: '',
      disabled: Boolean,
      payMode: ''
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
    methods: {
      filterMethod(query) {
        this.queryText = query // 获取下拉 select 输入的值
        //  过滤下拉选项过多
        let filterItems = []
        if (this.queryText.length > 0) {
          for (
            let index = 0;
            index < this.factoryQrcodeList.length && filterItems.length < 10;
            index++
          ) {
            const item = this.factoryQrcodeList[index]
            if (item.factoryName.indexOf(this.queryText) !== -1) {
              filterItems.push(item)
            }
          }
        } else {
          filterItems = this.factoryQrcodeList.slice(0, 10)
        }
        this.currentItemList = filterItems
      },
      // 主动触发获取，防止F5刷新后无法重新加载列表内容
      handleFocus() {
        if (this.currentItemList.length === 0) {
          this.currentItemList = this.factoryQrcodeList.slice(0, 10)
        }
      }
    },
    mounted() {
      api.getAll().then(response => {
        this.factoryQrcodeList = response.list
        if (this.currentValue) {
          // 通过过滤器筛选目标客户
          this.currentItemList = this.factoryQrcodeList.filter((item) => { return item.id === this.currentValue })
          // 在默认客户中剔除目标客户
          this.currentItemList = this.currentItemList.concat(this.factoryQrcodeList.slice(0, 10).filter((item) => { return item.id !== this.currentValue }))
        } else {
          this.currentItemList = this.factoryQrcodeList.slice(0, 10)
        }
      })
    },
    data() {
      return {
        queryText: '', // select 下拉输入值
        factoryQrcodeList: [],
        currentItemList: [],
        currentValue: this.value
      }
    }
  }
</script>

