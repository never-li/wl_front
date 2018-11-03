<template>
  <div >
    <el-table
      :data="subList"
      ref="table"
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
      header-cell-class-name="table-header-bg text-center"
      border highlight-current-row
      :row-class-name="tableRowClassName"
      stripe
      height="385">
      <el-table-column sortable type="selection" width="50"></el-table-column>
      <!--<el-table-column sortable type="selection" width="50"></el-table-column>-->
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column sortable label="货物编号" prop="handCode" width="120"></el-table-column>
      <el-table-column sortable label="钢卷号" prop="steelCode" width="150"></el-table-column>
      <el-table-column sortable label="品名" prop="typeName"></el-table-column>
      <el-table-column sortable label="规格" prop="specName"></el-table-column>
      <el-table-column sortable label="产地" prop="parea"></el-table-column>
      <el-table-column sortable label="材质" prop="grade"></el-table-column>
      <el-table-column sortable :label="'净重['+ tableHeader.changeStWeight2+']'" prop="changeStWeight2" min-width="100"></el-table-column>
      <el-table-column sortable :label="'磅重['+ tableHeader.changeStWeight1+']'" prop="changeStWeight1" min-width="100"></el-table-column>
      <el-table-column sortable :label="'毛重['+ tableHeader.changeStWeight4+']'" prop="changeStWeight4" min-width="100"></el-table-column>
      <el-table-column sortable :label="'数量['+tableHeader.changeStNum+']'" prop="changeStNum"></el-table-column>
      <el-table-column sortable label="发货单号" prop="greenBlnoSub" min-width="150"></el-table-column>
      <el-table-column sortable label="发货员" prop="fmbUserName"></el-table-column>
      <el-table-column sortable label="装卸工" prop="fmbHandor"></el-table-column>
      <el-table-column sortable label="吊机工" prop="fmbCraner"></el-table-column>
      <el-table-column sortable label="发货完成时间" prop="fmbEndTime" min-width="140"></el-table-column>
      <el-table-column sortable label="收货员" prop="smbUserName"></el-table-column>
      <el-table-column sortable label="装卸工" prop="smbHandor"></el-table-column>
      <el-table-column sortable label="吊机工" prop="smbCraner"></el-table-column>
      <el-table-column sortable label="收货完成时间" prop="smbEndTime" min-width="140"></el-table-column>
      <el-table-column sortable label="转仓状态" prop="mbStatusName"></el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: 'sub-table',
    props: {
      subList: Array
    },
    computed: {
      tableHeader: function() {
        const temp = {}
        temp.changeStWeight1 = this.subList.reduce((pre, cur) => {
          return pre + parseFloat(cur.changeStWeight1)
        }, 0).toFixed(3)
        temp.changeStWeight2 = this.subList.reduce((pre, cur) => {
          return pre + parseFloat(cur.changeStWeight2)
        }, 0).toFixed(3)
        temp.changeStWeight4 = this.subList.reduce((pre, cur) => {
          return pre + parseFloat(cur.changeStWeight4)
        }, 0).toFixed(3)
        temp.changeStNum = this.subList.reduce((pre, cur) => {
          return pre + parseFloat(cur.changeStNum)
        }, 0)
        return temp
      }
    },
    data() {
      return {
        selectionList: []
      }
    },
    methods: {
      handleSelectionChange(val) {
        this.selectionList = val
        if (this.selectionList.length) {
          this.$emit('selectionishowBnt', false)
        } else {
          this.$emit('selectionishowBnt', true)
        }
      },
      handleRowClick(row, event, column) {
        this.$refs.table.toggleRowSelection(row)
      },
      tableRowClassName({ row, rowIndex }) {
        for (let i = 0; i < this.selectionList.length; i++) {
          if (this.selectionList[i].id === row.id) {
            return 'table-select-bgcolor pointer text-center tab-ellipsis'
          }
        }
        return 'pointer text-center tab-ellipsis'
      }
    }
  }
</script>

<style scoped>

</style>
