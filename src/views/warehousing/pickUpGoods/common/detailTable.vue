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
      <el-table-column sortable label="钢卷号" prop="steelCode" width="150"></el-table-column>
      <el-table-column sortable label="品名" prop="typeName"></el-table-column>
      <el-table-column sortable label="规格" prop="specName" width="120"></el-table-column>
      <el-table-column sortable label="产地" prop="parea" width="120"></el-table-column>
      <el-table-column sortable label="材质" prop="grade"></el-table-column>
      <el-table-column sortable label="重量结算方式" width="110">
        <template slot-scope="scope">
          <span>
            {{
              scope.row.weightFlag === 1 ? '过磅净重' :
              scope.row.weightFlag === 2 ? '抄码净重' :
              scope.row.weightFlag === 4 ? '抄码毛重' : ''
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column sortable :label="'净重['+tableHeader.greenWeight2+']'" prop="greenWeight2" min-width="106"></el-table-column>
      <el-table-column sortable :label="'磅重['+tableHeader.greenWeight1+']'" prop="greenWeight1" min-width="106"></el-table-column>
      <el-table-column sortable :label="'毛重['+tableHeader.greenWeight4+']'" prop="greenWeight4" min-width="106"></el-table-column>
      <el-table-column sortable :label="'数量['+tableHeader.greenNum+']'" prop="greenNum"></el-table-column>
      <el-table-column sortable label="卷面名称" prop="initCuName" min-width="150"></el-table-column>
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
        temp.greenWeight4 = this.tableData.reduce((pre, cur) => {
          return pre + parseFloat(cur.greenWeight4)
        }, 0).toFixed(3)
        temp.greenWeight2 = this.tableData.reduce((pre, cur) => {
          return pre + parseFloat(cur.greenWeight2)
        }, 0).toFixed(3)
        temp.greenWeight1 = this.tableData.reduce((pre, cur) => {
          return pre + parseFloat(cur.greenWeight1)
        }, 0).toFixed(3)
        temp.greenNum = this.tableData.reduce((pre, cur) => {
          return pre + parseFloat(cur.greenNum)
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
