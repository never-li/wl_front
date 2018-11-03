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
      stripe height="400"
      row-class-name="pointer text-center tab-ellipsis"
      v-loading="listLoading"
    >
      <el-table-column sortable type="selection" width="50" :disabled="true" :selectable="canSelect"
        v-if="(action === 'view' || action === 'reviseBills') && formData.status === 1">
      </el-table-column>
      <el-table-column label="+" width="50" v-if="action === 'add' || action === 'update'" fixed>
        <template slot-scope="scope">
          <i class="el-icon-delete" v-show="!scope.row.greenDtPdId"></i>
        </template>
      </el-table-column>
      <el-table-column sortable label="操作" :width="action === 'reviseBills'?50:-1">
        <template slot-scope="scope">
          <i class="el-icon-delete" v-if="!scope.row.greenDtPdId && action === 'reviseBills'"></i>
        </template>
      </el-table-column>
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column sortable label="货物编号" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.greenDtPdId" style="color: red;">{{scope.row.handCodes}}</span>
          <span v-else>{{scope.row.handCodes}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="钢卷号" prop="steelCodes" width="150"></el-table-column>
      <el-table-column sortable label="包装备注" prop="remark" width="150"></el-table-column>
      <el-table-column sortable label="库位" prop="position" width="110"></el-table-column>
      <el-table-column sortable label="原料规格组成" prop="specAllMa" width="110"></el-table-column>
      <el-table-column sortable label="成品规格组成" prop="specAllPd" width="110"></el-table-column>
      <el-table-column sortable label="重量结算方式" width="130">
        <template slot-scope="scope">
          <el-select v-model="scope.row.weightFlag"
                     v-if="isEdit(scope)"
                     filterable size="mini">
            <el-option v-for="item in weightCalc"
                       :value="item.value"
                       :label="item.label"
                       :key="item.value">
            </el-option>
          </el-select>
          <span v-else>
            {{scope.row.weightFlag === 1 ? '过磅净重' :
            scope.row.weightFlag === 5 ? '理算重量' : ''
            }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable :label="'理算重量['+tableHeader.outWeight+']'" min-width="140">
        <template slot-scope="scope">
          <span >{{scope.row.outWeight}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable :label="'过磅净重['+tableHeader.outWeight1+']'" min-width="140">
        <template slot-scope="scope">
          <span >{{scope.row.outWeight1}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable :label="'包装数量['+tableHeader.outNum+']'" min-width="120">
        <template slot-scope="scope">
          <span>{{scope.row.outNum}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="仓租单价" min-width="120">
        <template slot-scope="scope">
          <number-input v-model="scope.row.storeFeePrice"
                        decimal="10,2"
                    v-if="isEdit(scope)"
                    size="mini">
          </number-input>
          <span v-else>{{scope.row.storeFeePrice}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="计租天数" width="106">
        <template slot-scope="scope">
          <number-input v-model="scope.row.storeDay"
                        decimal="10,0"
                    v-if="isEdit(scope)"
                    size="mini">
          </number-input>
          <span v-else>{{scope.row.storeDay}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable :label="'仓租金额['+tableHeader.storeFeeAmount+']'" min-width="138">
        <template slot-scope="scope">
          <number-input v-model="scope.row.storeFeeAmount"
                        decimal="10,2"
                    v-if="isEdit(scope)"
                    size="mini">
          </number-input>
          <span v-else>{{scope.row.storeFeeAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="包装编号" prop="packNo" min-width="200"></el-table-column>
      <el-table-column sortable label="加工客户" prop="machCuName" min-width="150"></el-table-column>
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
  import { lock } from '@/api/process/outStorePd/index'
  import numberInput from '@/components/numberInput'
  import { findPathByModuleCode } from '@/utils'
export default {
    name: 'commonTable',
    props: {
      tableData: Array,
      formData: Object,
      action: String
    },
    components: {
      numberInput
    },
    computed: {
      tableHeader: function() {
        const temp = {}
        this.calcTableHeader(temp, ['outWeight', 'outWeight1', 'storeFeeAmount'])
        temp.outNum = this.tableData.reduce((pre, cur) => {
          return pre + parseFloat(cur.outNum)
        }, 0)
        return temp
      },
      tableDataCalc: function() {
        return this.tableData.forEach((item) => {
          let weight = 0
          console.log(item.weightFlag)
          if (item.weightFlag == null || item.weightFlag === 5) {
            weight = item.outWeight ? item.outWeight : 0
            item.weightFlag = 5
          } else if (item.weightFlag === 1) {
            weight = item.outWeight1 ? item.outWeight1 : 0
          }
          console.log(weight)
          const storeDay = parseFloat(item.storeDay) < 0 ? 0 : parseFloat(item.storeDay)
          const temp2 = parseFloat(item.storeFeePrice) * parseFloat(storeDay) * parseFloat(weight)
          item.storeFeeAmount = temp2.toFixed(2)
        })
        // return this.tableData
      }
    },
    data() {
      return {
        currentRow: {},
        selectionList: [],
        weightCalc: [
          { label: '理算重量', value: 5 },
          { label: '过磅净重', value: 1 }
        ],
        listLoading: false
      }
    },
    methods: {
      canSelect(row, index) {
        return !row.greenDtPdId
      },
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
          const len = attr === 'storeFeeAmount' ? 2 : 3
          obj[attr] = this.tableData.reduce((pre, cur) => {
            if (isNaN(cur[attr]) || !cur[attr]) {
              return pre
            } else {
              return pre + parseFloat(cur[attr])
            }
          }, 0).toFixed(len)
          if (attr === 'storeFeeAmount') {
            this.formData.amountSum = obj[attr]
          }
        })
      },
      setHeaderClass({ row, column, rowIndex, columnIndex }) { // 设置表头类
        if (columnIndex === 0) {
          if (row[0].label === '+') {
            return 'table-header-bg text-center pointer table-add-icon'
          }
          return 'table-header-bg text-center pointer tab-ellipsis'
        } else {
          return 'table-header-bg text-center tab-ellipsis'
        }
      },
      handleHeaderClick(column, event) { // 点击表头
        if (column.label === '+') {
          if (!this.formData.custId || this.formData.custId === '') {
            this.$alert('货主不能为空', '提示', {
              confirmButtonText: '确定'
            })
            return
          }
          this.$emit('showSelectGoods')
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
        if (this.action === 'view' && this.formData.status === 1 && !row.greenDtPdId) {
          this.$refs.table.toggleRowSelection(row)
        }
        // 新增修改或者改单时
        if (column.label === '+' || column.label === '操作') { // 点击了删除的一列
          if (!row.greenDtPdId) {
            console.log(row)
            this.$confirm('确认删除该行？', '温馨提示', { type: 'warning' }).then(() => {
              this.tableData.map((item, index, array) => {
                if (item === row) {
                  // tableData 中移除这一项
                  array.splice(index, 1)
                  this.formData.dtDelList.push(row)
                  // 货物解锁
                  lock({
                    revert: 1,
                    packIds: row.packId
                  })
                }
              })
            })
          }
        }
      },
      handleRowDbClick(row, event, column) {
        // 双击修改
        if (this.action === 'add' || this.action === 'reviseBills' || this.action === 'update') {
          if (column.label !== '+') {
            this.currentRow = row
          }
        } else {
          this.toGoodsFlow(row)
        }
      },
      toGoodsFlow(row) {
        this.$router.push({ path: findPathByModuleCode('stockLog'), query: { handCode: row.handCodes }})
      }
    }
  }
</script>

<style lang="scss">

</style>
