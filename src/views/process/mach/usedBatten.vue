<template>
  <div >
    <div style="padding-bottom: 10px;">
      木架使用明细
    </div>
    <el-table
      :data="formData.usedBattenDtList"
      ref="usedBattenTable"
      row-key="id"
      @header-click="tableHeaderClick"
      @row-click="tableRowClick"
      :header-cell-class-name="setHeaderClass"
      border highlight-current-row
      row-class-name="pointer text-center tab-ellipsis"
      stripe max-height="500"
    >
      <el-table-column label="+" width="50" v-if="action === 'add' || action === 'update'" fixed>
        <template slot-scope="scope">
          <i class="el-icon-delete" @click="deleteUsedBattenDt(scope.$index,scope.row)"></i>
        </template>
      </el-table-column>
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column sortable label="规格">
        <template slot-scope="scope">
          <el-input v-model="scope.row.shelfSpec"
                    v-if="isEdit(scope)"
                    size="mini">
          </el-input>
          <span v-else>{{scope.row.shelfSpec}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="类型">
        <template slot-scope="scope">
          <el-select v-model="scope.row.shelfType"
                     v-if="isEdit(scope)"
                     filterable size="mini">
            <el-option value="订造" label="订造"></el-option>
            <el-option value="客户自带" label="客户自带"></el-option>
          </el-select>
          <span v-else>{{scope.row.shelfType}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="数量">
        <template slot-scope="scope">
          <el-input v-model.number="scope.row.num"
                    v-if="isEdit(scope)"
                    size="mini">
          </el-input>
          <span v-else>{{scope.row.num}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="备注">
        <template slot-scope="scope">
          <el-input v-model.number="scope.row.remark"
                    v-if="isEdit(scope)"
                    size="mini">
          </el-input>
          <span v-else>{{scope.row.remark}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: 'usedBatten',
    components: {
    },
    props: {
      formData: Object,
      action: String
    },
    computed: {
    },
    data() {
      return {
      }
    },
    methods: {
      setHeaderClass({ row, column, rowIndex, columnIndex }) { // 设置表头类
        if (columnIndex === 0) {
          if (row[0].label === '+') {
            return 'table-header-bg text-center pointer table-add-icon'
          }
          return 'table-header-bg text-center pointer'
        } else {
          return 'table-header-bg text-center'
        }
      },
      isEdit(scope) { // 是否为可编辑状态
        if (this.action === 'add' || this.action === 'update') {
          return true
        } else {
          return false
        }
      },
      deleteUsedBattenDt(index, row) {
        this.$confirm('确认删除该行？', '温馨提示', { type: 'warning' }).then(() => {
          this.formData.usedBattenDtList.splice(index, 1)
          if (row.id) {
            this.formData.usedBattenDtDelList.push(row.id)
          }
        })
      },
      tableHeaderClick(column, event) { // 点击表头
        if (column.label === '+') {
          const usedBattenDt = {
            'id': '',
            'machBlid': '',
            'shelfSpec': '', // 规格
            'shelfType': '', // 类型
            'num': '', // 数量
            'bottomBatten': '',
            'bottomNum': '',
            'topBatten': '',
            'topNum': '',
            'remark': '' // 备注
          }
          this.formData.usedBattenDtList.push(usedBattenDt)
        }
      },
      tableRowClick(row, event, column) {
      }
    }
  }
</script>

<style lang="scss">

</style>
