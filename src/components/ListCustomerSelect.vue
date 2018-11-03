<template>

  <el-autocomplete
    class="inline-input"
    v-model="customer.cuName"
    :fetch-suggestions="querySearch"
    placeholder="请输入内容"
    :disabled="disabled"
    @select="handleSelect"
    @focus="handleFocus"
  ></el-autocomplete>

</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    props: [
      'disabled', 'customer'
    ],
    computed: {
      ...mapGetters([
        'customerList'
      ])
    },
    methods: {
      querySearch(queryString, cb) {
        var results = []
        if (!this.customer.flag && this.customer.custId) {
          results = this.customerList.filter((item) => { return item.id === this.customer.custId })
        }
        if (queryString === this.tmpText && this.customer.flag) {
          this.customer.flag = true
        } else {
          this.customer.flag = false
          this.$set(this.customer, 'custId', '')
          this.$delete(this.customer, 'cuFullName')
          this.$delete(this.customer, 'cuType')
          this.$delete(this.customer, 'payMode')
        }
        this.i = 0
        results = queryString ? this.customerList.filter(this.queryFilter(queryString)) : this.customerList.slice(0, 15)
        // 调用 callback 返回建议列表的数据
        cb(results)
      },
      queryFilter(queryString) {
        return (item) => {
          if (item.cuName.indexOf(queryString) !== -1 && this.i < 15) {
            this.i++
            return true
          } else {
            return false
          }
        }
      },
      handleSelect(item) {
        this.$set(this.customer, 'cuName', item.cuName)
        this.$set(this.customer, 'custId', item.id)
        this.$set(this.customer, 'cuFullName', item.cuFullName)
        this.$set(this.customer, 'cuType', item.cuType)
        this.$set(this.customer, 'payMode', item.payMode)
        this.$set(this.customer, 'flag', true)
        this.tmpText = item.cuName
      },
      // 主动触发获取，防止F5刷新后无法重新加载列表内容
      handleFocus() {
        this.customerList.forEach((item) => {
          this.$set(item, 'value', item.cuName)
        })
        this.$set(this.customer, 'flag', false)
      }
    },
    mounted() {
      this.customerList.forEach((item) => {
        this.$set(item, 'value', item.cuName)
      })
      this.$set(this.customer, 'flag', false)
    },
    data() {
      return {
        i: 0,
        currentItem: {
          cuName: ''
        },
        tmpText: '' // 临时文本变量
      }
    }
  }
</script>

