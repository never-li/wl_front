<template>
  <el-select filterable clearable v-model="currentValue" :disabled="disabled" placeholder="请选择" @change="machTypeChange">
    <el-option v-for="item in filterDisplayItems(machtypeList)" :value="item.id" clearable :label="item.machName" :key="item.value">
    </el-option>
  </el-select>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    props: ['disabled', 'value', 'isConMach'],
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
      filterDisplayItems(options) {
        const filterItems = []
        if (this.isConMach === 1) {
          for (const v of options) {
            if (v.isConMach === 1 || v.isMulti === 1) {
              filterItems.push(v)
            }
          }
          return filterItems
        } else if (this.isConMach === 0) {
          for (const v of options) {
            if (v.isConMach === 0) {
              filterItems.push(v)
            }
          }
          return filterItems
        } else {
          return options
        }
      },
      machTypeChange(machTypeId) {
        var temp = {}
        for (const machType of this.machtypeList) {
          if (machTypeId === machType.id) {
            temp = machType
          }
        }
        this.$emit('machTypeChange', temp)
      }
    },
    computed: {
      ...mapGetters(['machtypeList'])
    },
    data() {
      return {
        currentValue: this.value
      }
    }
  }
</script>

