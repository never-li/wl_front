<template>
  <div >
    <div style="padding-bottom: 10px;">
      附加费明细
    </div>
    <el-table
      :data="formData.subJoinFeeList"
      ref="subJoinFeeTable"
      row-key="id"
      @header-click="tableHeaderClick"
      :header-cell-class-name="setHeaderClass"
      border highlight-current-row
      row-class-name="pointer text-center tab-ellipsis"
      stripe max-height="500"
    >
      <el-table-column label="+" width="50" v-if="action === 'add' || action === 'update'" fixed>
        <template slot-scope="scope">
          <i class="el-icon-delete" @click="deleteSubJoinFee(scope.$index,scope.row)"></i>
        </template>
      </el-table-column>
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column sortable label="附加费类型">
        <template slot-scope="scope">
          <fee-type-select v-model="scope.row.feeTypeId" v-if="isEdit(scope)"></fee-type-select>
          <span v-else>{{scope.row.feeTypeName}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="单价">
        <template slot-scope="scope">
          <el-input v-model.number="scope.row.price"
                    @blur="calAmount(scope.row)"
                    v-if="isEdit(scope)"
                    size="mini">
          </el-input>
          <span v-else>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="重量">
        <template slot-scope="scope">
          <el-input v-model.number="scope.row.num"
                    @blur="calAmount(scope.row)"
                    v-if="isEdit(scope)"
                    size="mini">
          </el-input>
          <span v-else>{{scope.row.num}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="金额">
        <template slot-scope="scope">
          <el-input v-model.number="scope.row.amount"
                    v-if="isEdit(scope)"
                    size="mini">
          </el-input>
          <span v-else>{{scope.row.amount}}</span>
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
  import feeTypeSelect from '@/components/feeTypeSelect'

  export default {
    name: 'usedBatten',
    components: {
      feeTypeSelect
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
          this.formData.subJoinFeeList.splice(index, 1)
          if (row.id) {
            this.formData.subJoinFeeDelList.push(row.id)
          }
        })
      },
      tableHeaderClick(column, event) { // 点击表头
        if (column.label === '+') {
          const subJoinFee = {
            'id': '',
            'feeTypeId': '', // 附加费类型
            'price': 0.0, // 单价
            'num': 0.0, // 数量
            'amount': 0.0, // 金额
            'remark': '' // 备注
          }
          this.formData.subJoinFeeList.push(subJoinFee)
        }
      },
      calAmount(row) {
        if (parseFloat(row.num) && parseFloat(row.price)) {
          row.amount = (parseFloat(row.num) * parseFloat(row.price)).toFixed(2)
        }
      }
    }
  }
</script>

<style lang="scss">

</style>
