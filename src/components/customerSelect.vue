<template>

  <el-select   v-model="currentValue" remote  clearable filterable   placeholder="请选择" :disabled="disabled" :remote-method="filterMethod" @change="handleChange" @focus="handleFocus">
    <el-option v-for="(option,indext) in currentItemList" :key="indext" :label="option.cuName"
               :value="option.id">
    </el-option>
  </el-select>

</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    props: {
      value: '',
      disabled: Boolean,
      payMode: ''
    },
    computed: {
      ...mapGetters([
        'customerList'
      ])
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
            index < this.customerList.length && filterItems.length < 15;
            index++
          ) {
            const item = this.customerList[index]
            if (item.cuName.indexOf(this.queryText) !== -1) {
              filterItems.push(item)
            }
          }
        } else {
          filterItems = this.customerList.slice(0, 15)
        }
        this.currentItemList = filterItems
      },
      handleChange(custId) {
        for (
          let index = 0;
          index < this.currentItemList.length;
          index++
        ) {
          const item = this.currentItemList[index]
          if (item.id === custId) {
            this.$emit('payModeChange', item.payMode ? item.payMode : '')
          }
        }
      },
      // 主动触发获取，防止F5刷新后无法重新加载列表内容
      handleFocus() {
        if (this.currentItemList.length === 0) {
          this.currentItemList = this.customerList.slice(0, 15)
        }
      }
    },
    mounted() {
      this.currentItemList = []
      if (this.currentValue) {
        // 通过过滤器筛选目标客户
        this.currentItemList = this.customerList.filter((item) => { return item.id === this.currentValue })
        // 在默认客户中剔除目标客户
        this.currentItemList = this.currentItemList.concat(this.customerList.slice(0, 15).filter((item) => { return item.id !== this.currentValue }))
      } else {
        this.currentItemList = this.customerList.slice(0, 15)
      }
    },
    data() {
      return {
        queryText: '', // select 下拉输入值
        currentItemList: [],
        currentValue: this.value
      }
    }
  }
</script>

