<template>

  <el-select v-model="currentValue" clearable multiple filterable placeholder="请选择"  style="width:500px;">
    <el-option v-for="(option,indext) in filterDisplayItems(customerList)" :key="indext" :label="option.cuName"
               :value="option.id">
    </el-option>
  </el-select>

</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    props: {
      value: ''
    },
    computed: {
      ...mapGetters([
        'customerList'
      ]),
      currentValue: {
        get: function() {
          return this.value // 将props中的value赋值给currentValue
        },
        set: function(val) {
          this.$emit('input', val) // 通过$emit触发父组件
        }
      }
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
    created() {
    },
    data() {
      return {
        queryText: '' // select 下拉输入值
      }
    }
  }
</script>

