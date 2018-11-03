<template>

  <el-select v-model="currentValue" clearable filterable placeholder="请选择"  >
    <el-option v-for="(option,indext) in filterDisplayItems(feetypeList)" :key="indext" :label="option.feeName"
               :value="returnItem?option.feeName:option.id">
    </el-option>
  </el-select>

</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    props: {
      value: '',
      returnItem: false
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
      ...mapGetters([
        'feetypeList'
      ])
    },
    methods: {
      filterMethod(query) {
        this.queryText = query // 获取下拉 select 输入的值
        // console.log(query)
      },
      filterDisplayItems(options) {
        //  过滤下拉选项过多
        let filterItems = []
        filterItems = options.slice(0, 15)
        return filterItems
      }
    },
    data() {
      return {
        currentValue: this.value,
        queryText: '' // select 下拉输入值
      }
    }
  }
</script>

