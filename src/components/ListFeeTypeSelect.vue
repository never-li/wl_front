<template>

  <el-autocomplete
    class="inline-input"
    v-model="feeType.feeName"
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
      'disabled', 'feeType'
    ],
    computed: {
      ...mapGetters([
        'feetypeList'
      ])
    },
    methods: {
      querySearch(queryString, cb) {
        var results = []
        if (!this.feeType.flag && this.feeType.id) {
          results = this.feetypeList.filter((item) => { return item.id === this.feeType.id })
        }
        if (queryString === this.tmpText && this.feeType.flag) {
          this.feeType.flag = true
        } else {
          this.feeType.flag = false
          this.$set(this.feeType, 'feeId', '')
        }
        this.i = 0
        results = queryString ? this.feetypeList.filter(this.queryFilter(queryString)) : this.feetypeList.slice(0, 15)
        // 调用 callback 返回建议列表的数据
        cb(results)
      },
      queryFilter(queryString) {
        return (item) => {
          if (item.feeName.indexOf(queryString) !== -1 && this.i < 15) {
            this.i++
            return true
          } else {
            return false
          }
        }
      },
      handleSelect(item) {
        this.$set(this.feeType, 'feeName', item.feeName)
        // this.$set(this.feeType, 'feeId', item.id)
        this.$set(this.feeType, 'flag', true)
        this.tmpText = item.feeName
      },
      // 主动触发获取，防止F5刷新后无法重新加载列表内容
      handleFocus() {
        this.feetypeList.forEach((item) => {
          this.$set(item, 'value', item.feeName)
        })
        this.$set(this.feeType, 'flag', false)
      }
    },
    mounted() {
      this.feetypeList.forEach((item) => {
        this.$set(item, 'value', item.feeName)
      })
      this.$set(this.feeType, 'flag', false)
    },
    data() {
      return {
        i: 0,
        modalShow: true,
        currentItem: {
          feeName: ''
        },
        tmpText: '' // 临时文本变量
      }
    }
  }
</script>

