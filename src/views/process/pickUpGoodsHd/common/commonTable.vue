<template>
  <div >
    <el-table
      :data="tableData"
      ref="table"
      row-key="stockId"
      @header-click="handleHeaderClick"
      @row-click="handleRowClick"
      @row-dblclick="handleRowDbClick"
      @selection-change="handleSelectionChange"
      :header-cell-class-name="setHeaderClass"
      border highlight-current-row
      row-class-name="pointer text-center tab-ellipsis"
      stripe height="545"
    >
      <el-table-column sortable type="selection" width="50" :selectable="isUsed"
                       v-if="action === 'view' && formData.status === 1">
      </el-table-column>
      <el-table-column label="+" width="50" v-if="action === 'add' || action === 'update'" fixed>
        <template slot-scope="scope">
          <i class="el-icon-delete" @click="removeDt(scope.row,scope.$index)"></i>
        </template>
      </el-table-column>
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column sortable label="货物编号" min-width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.handCode"
                    v-if="isEdit(scope)"
                    size="mini">
          </el-input>
          <span v-else :style="{color: scope.row.isUsed ? 'red' : ''}">{{scope.row.handCode}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="品名规格" >
        <template slot-scope="scope">
          <el-input v-model="scope.row.specDes"
                    v-if="isEdit(scope)"
                    size="mini">
          </el-input>
          <span v-else>{{scope.row.specDes}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable :label="'重量['+tableHeader.weight+']'" min-width="120" >
        <template slot-scope="scope">
          <number-input v-model.number="scope.row.weight" decimal="10,3" :min="0"
                    v-if="isEdit(scope)"
                    size="mini">
          </number-input>
          <span v-else>{{scope.row.weight}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable :label="'数量['+tableHeader.num+']'" min-width="120" >
        <template slot-scope="scope">
          <number-input v-model.number="scope.row.num" decimal="10,0" :min="0"
                    v-if="isEdit(scope)"
                    size="mini">
          </number-input>
          <span v-else>{{scope.row.num}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="单价" min-width="106">
        <template slot-scope="scope">
          <number-input v-model.number="scope.row.price" decimal="10,2" :min="0"
                    v-if="isEdit(scope)"
                    size="mini">
          </number-input>
          <span v-else>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable :label="'金额['+tableHeader.amount+']'" min-width="120" >
        <template slot-scope="scope">
          <number-input v-model.number="scope.row.amount" decimal="10,2" :min="0"
                    v-if="isEdit(scope)"
                    size="mini">
          </number-input>
          <span v-else>{{scope.row.amount}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="库位" min-width="100" >
        <template slot-scope="scope">
          <el-input v-model="scope.row.storePosition"
                    v-if="isEdit(scope)"
                    size="mini">
          </el-input>
          <span v-else>{{scope.row.storePosition}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="备注" min-width="120">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remark"
                    v-if="isEdit(scope)"
                    size="mini">
          </el-input>
          <span v-else>{{scope.row.remark}}</span>
        </template>
      </el-table-column>
    </el-table>
    <span v-show="false">{{tableDataCalc}}</span>
    <!--
        price : 出仓单价
        storeFeePrice ：仓租单价
        amount ： 出仓金额
        storeFeeAmount： 仓租金额
        outNum：出仓数量
    -->
  </div>
</template>

<script>
  import numberInput from '@/components/numberInput'

  export default {
    name: 'commonTable',
    components: {
      numberInput
    },
    props: {
      tableData: Array,
      formData: Object,
      action: String
    },
    computed: {
      tableHeader: function() {
        const temp = {}
        this.calcTableHeader(temp, ['weight', 'num', 'amount'])
        console.log(this.tableData)
        temp.num = this.tableData.reduce((pre, cur) => {
          return pre + parseFloat(cur.num)
        }, 0)
        return temp
      },
      tableDataCalc: function() {
        return this.tableData.forEach((item) => {
          // 出仓金额 = 出仓单价 x weightFlag (根据 weightFlag 计算)
          const weight = item.weight
          const temp = parseFloat(item.price) * parseFloat(weight)
          if (!isNaN(temp)) {
            item.amount = temp.toFixed(2)
          }
        })
        // return this.tableData
      }
    },
    data() {
      return {
        currentRow: {},
        selectionList: []
      }
    },
    methods: {
      isEdit(scope) { // 是否为可编辑状态
        if (this.currentRow.stockId === scope.row.stockId) {
          // 增加修改和改单时可编辑
          if (this.action === 'add' || this.action === 'reviseBills' || this.action === 'update') {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      },
      calcTableHeader(obj, attrList) { // 计算表格头数据
        attrList.map((attr) => {
          obj[attr] = this.tableData.reduce((pre, cur) => {
            return pre + parseFloat(cur[attr])
          }, 0).toFixed(3)
        })
      },
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
      addDetail() {
        this.tableData.push({
          weight: 0,
          num: 0,
          price: 0,
          amount: 0
        })
      },
      removeDt(row, index) {
        this.$confirm('确认删除该行？', '温馨提示', { type: 'warning' }).then(() => {
          this.tableData.splice(index, 1)
        })
      },
      handleHeaderClick(column, event) { // 点击表头
        console.log(column)
        if (column.label === '+') {
          console.log('add')
          this.addDetail()
        }
      },
      handleSelectionChange(val) {
        this.selectionList = val
        if (this.selectionList.length) {
          this.$emit('selectionishowBnt', false)
        } else {
          this.$emit('selectionishowBnt', true)
        }
      },
      handleRowClick(row, event, column) {
        // 已审核下的单击行 实行多选
        if (this.action === 'view' && this.formData.status === 1 && !row.isUsed) {
          this.$refs.table.toggleRowSelection(row)
        }
        // 新增修改或者改单时
        // if (column.label === '+') { // 点击了删除的一列
        //   this.$confirm('确认删除该行？', '温馨提示', { type: 'warning' }).then(() => {
        //     this.tableData.map((item, index, array) => {
        //       if (item.stockId === row.stockId) {
        //         // tableData 中移除这一项
        //         array.splice(index, 1)
        //         this.formData.dtDelList.push(row)
        //       }
        //     })
        //   })
        // }
      },
      handleRowDbClick(row, event, column) {
        // 双击修改
        if (this.action === 'add' || this.action === 'reviseBills' || this.action === 'update') {
          if (column.label !== '+') {
            this.currentRow = row
          }
        }
      },
      isUsed(row, index) {
        return !row.isUsed
      }
    }
  }
</script>

<style lang="scss">

</style>
