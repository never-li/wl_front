<template>
  <div >
    <el-table
      :data="tableData"
      ref="table"
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
      header-cell-class-name="table-header-bg text-center"
      border highlight-current-row
      row-class-name="pointer text-center tab-ellipsis"
      stripe
      height="385">
      <el-table-column sortable type="selection" width="50"></el-table-column>
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column sortable label="货物编号" prop="handCode" width="120"></el-table-column>
      <el-table-column sortable label="品名规格" prop="specDes" width="150"></el-table-column>
      <el-table-column sortable :label="'重量['+tableHeader.weight+']'" prop="weight" min-width="106"></el-table-column>
      <el-table-column sortable :label="'数量['+tableHeader.num+']'" prop="num"></el-table-column>
      <el-table-column sortable label="发货单号" min-width="150">
        <template slot-scope="scope">
          <span>{{scope.row.blno + (scope.row.subNo?"-"+scope.row.subNo:"")}}
          </span>
        </template>
      </el-table-column>
      <el-table-column sortable label="发货员" prop="mbUserName" min-width="150"></el-table-column>
      <el-table-column sortable label="装卸工" prop="mbHandor" min-width="150"></el-table-column>
      <el-table-column sortable label="吊机工" prop="mbCraner" min-width="150"></el-table-column>
      <el-table-column sortable label="发货状态" prop="status">
        <template slot-scope="scope">
          <span>
            {{
              scope.row.status === 0 ? '待发货' :
              scope.row.status === 1 ? '发货完成' : ''
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column sortable label="发货完成时间" width="158" prop="mbEndTime"></el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: 'detail-table',
    props: {
      tableData: Array
    },
    computed: {
      tableHeader: function() {
        const temp = {}
        temp.weight = this.tableData.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight)
        }, 0).toFixed(3)
        temp.num = this.tableData.reduce((pre, cur) => {
          return pre + parseFloat(cur.num)
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
      }
    }
  }
</script>

<style scoped>

</style>
