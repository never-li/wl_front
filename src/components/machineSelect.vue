<template>
  <el-select filterable clearable v-model="currentValue" :disabled="disabled" placeholder="请选择">
    <el-option v-for="item in currentMachineList" :value="item.id" clearable :label="item.machineName" :key="item.value">
    </el-option>
  </el-select>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    props: ['disabled', 'value', 'machTypeId'],
    watch: {
      currentValue: {
        handler: function(newVal, oldVal) {
          this.$emit('input', newVal)
        },
        immediate: true
      },
      value: function(newVal, oldVal) {
        this.currentValue = newVal
      },
      machTypeId: function(newVal, oldVal) {
        this.currentValue = ''
        if (newVal) {
          const items = []
          for (const d of this.machineList) {
            if (d.machTypeId && d.machTypeId === newVal) {
              items.push(d)
            }
          }
          this.currentMachineList = items
        } else {
          this.currentMachineList = this.machineList
        }
      }
    },
    computed: {
      ...mapGetters(['machineList'])
    },
    data() {
      return {
        currentValue: this.value,
        currentMachineList: []
      }
    }
  }
</script>

