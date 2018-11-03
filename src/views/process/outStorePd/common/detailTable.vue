<template>
  <div >
    <el-table
      :data="tableData"
      ref="table"
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
      header-cell-class-name="table-header-bg text-center"
      border highlight-current-row
      stripe height="545"
      row-class-name="pointer text-center tab-ellipsis"
      v-loading="listLoading"
      max-height="500">
      <el-table-column sortable type="selection" width="50"></el-table-column>
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column sortable label="货物编号" prop="handCodes" min-width="120"></el-table-column>
      <el-table-column sortable label="钢卷号" prop="steelCodes" min-width="150"></el-table-column>
      <el-table-column sortable label="原料规格组成" prop="specAllMa" min-width="120"></el-table-column>
      <el-table-column sortable label="成品规格组成" prop="specAllPd" min-width="120"></el-table-column>
      <el-table-column sortable label="重量结算方式" width="120">
        <template slot-scope="scope">
          <span>
            {{
              scope.row.weightFlag === 1 ? '过磅净重' :
              scope.row.weightFlag === 5 ? '理算重量' : ''
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column sortable :label="'理算重量['+tableHeader.weightSum+']'" prop="weight" min-width="120"></el-table-column>
      <el-table-column sortable :label="'过磅净重['+tableHeader.weight1Sum+']'" prop="weight1" min-width="120"></el-table-column>
      <el-table-column sortable :label="'数量['+tableHeader.numSum+']'" prop="num"></el-table-column>
      <el-table-column sortable label="发货单号">
        <template slot-scope="scope">
          <span>{{scope.row.blno + (scope.row.subNo?"-"+scope.row.subNo:"")}}
          </span>
        </template>
      </el-table-column>
      <el-table-column sortable label="发货员" prop="mbUserName"></el-table-column>
      <el-table-column sortable label="装卸工" prop="mbHandor"></el-table-column>
      <el-table-column sortable label="吊机工" prop="mbCraner"></el-table-column>
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
        temp.weightSum = this.tableData.reduce((pre, cur) => {
          if (cur.weight === null || isNaN(cur.weight)) {
            return pre
          } else {
            return pre + parseFloat(cur.weight)
          }
        }, 0).toFixed(3)
        temp.weight1Sum = this.tableData.reduce((pre, cur) => {
          if (cur.weight1 === null || isNaN(cur.weight1)) {
            return pre
          } else {
            return pre + parseFloat(cur.weight1)
          }
        }, 0).toFixed(3)
        temp.numSum = this.tableData.reduce((pre, cur) => {
          if (cur.num === null || isNaN(cur.num)) {
            return pre
          } else {
            return pre + parseFloat(cur.num)
          }
        }, 0)
        return temp
      }
    },
    data() {
      return {
        selectionList: [],
        listLoading: false
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
