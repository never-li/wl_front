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
      border
      :row-class-name="tableRowClassName"
      stripe
      height="385"
    >
      <el-table-column sortable type="selection" width="50" :selectable="isUsed"
        v-if="(action === 'view' || action === 'reviseBills') && formData.status === 1">
      </el-table-column>
      <el-table-column label="+" width="50" v-if="action === 'add' || action === 'update'" fixed>
        <template slot-scope="scope">
          <i class="el-icon-delete" v-show="scope.row.isUsed !== 1"></i>
        </template>
      </el-table-column>
      <el-table-column sortable label="操作" :width="action === 'reviseBills'?50:-1">
        <template slot-scope="scope">
          <i class="el-icon-delete" v-if="scope.row.isUsed !== 1 && action === 'reviseBills'"></i>
        </template>
      </el-table-column>
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column sortable label="货物编号" width="120">
        <template slot-scope="scope">
          <span :style="{color: scope.row.isUsed ? 'red' : ''}">{{scope.row.handCode}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="钢卷号" prop="steelCode" width="150"></el-table-column>
      <el-table-column sortable label="仓库" width="110">
        <template slot-scope="scope">
          <span>{{scope.row.storeName + " " + (scope.row.positionRow?scope.row.positionRow + "行":"")
                      + (scope.row.positionColumn?scope.row.positionColumn + "排":"")}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="品名" prop="typeName"></el-table-column>
      <el-table-column sortable label="规格" prop="specName" width="120"></el-table-column>
      <el-table-column sortable label="产地" prop="parea" width="120"></el-table-column>
      <el-table-column sortable label="材质" prop="grade"></el-table-column>
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
            {{scope.row.weightFlag === 1 ? '抄码磅重' :
            scope.row.weightFlag === 2 ? '抄码净重' :
            scope.row.weightFlag === 4 ? '抄码毛重' : ''
            }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable :label="'净重['+tableHeader.outWeight2+']'" width="106">
        <template slot-scope="scope">
          <number-input v-model="scope.row.outWeight2" decimal="10,3" :min="0"
            :max="scope.row.maxWeight2" v-if="isEdit(scope) && scope.row.isUsed !== 1" size="mini"></number-input>
          <!-- <el-input-number v-model="scope.row.outWeight2" :precision="3" v-if="isEdit(scope)"
              :min="0" :max="scope.row.weight2" :controls="false" :step="0.01" size="mini"></el-input-number> -->
          <!-- <el-input v-model.number="scope.row.outWeight2"
                    :min="0"
                    :max="scope.row.weight2"
                    v-if="isEdit(scope)"
                    size="mini">
          </el-input> -->
          <span v-else>{{scope.row.outWeight2}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable :label="'磅重['+tableHeader.outWeight1+']'" width="106">
        <template slot-scope="scope">
          <number-input v-model="scope.row.outWeight1" decimal="10,3" :min="0"
            :max="scope.row.maxWeight1" v-if="isEdit(scope) && scope.row.isUsed !== 1" size="mini"></number-input>
          <!-- <el-input v-model.number="scope.row.outWeight1"
                    :min="0"
                    :max="scope.row.weight1"
                    v-if="isEdit(scope)"
                    size="mini">
          </el-input> -->
          <span v-else>{{scope.row.outWeight1}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable :label="'毛重['+tableHeader.outWeight4+']'" width="106">
        <template slot-scope="scope">
          <number-input v-model="scope.row.outWeight4" decimal="10,3" :min="0"
            :max="scope.row.maxWeight4" v-if="isEdit(scope) && scope.row.isUsed !== 1" size="mini"></number-input>
          <!-- <el-input v-model.number="scope.row.outWeight4"
                    :min="0"
                    :max="scope.row.weight4"
                    v-if="isEdit(scope)"
                    size="mini">
          </el-input> -->
          <span v-else>{{scope.row.outWeight4}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable :label="'数量['+tableHeader.outNum+']'">
        <template slot-scope="scope">
          <number-input v-model="scope.row.outNum" decimal="10,0" :min="0"
            :max="scope.row.maxNum" v-if="isEdit(scope) && scope.row.isUsed !== 1" size="mini" @input="changeNum(scope.row)"></number-input>
          <!-- <el-input v-model.number="scope.row.outNum"
                    :min="0"
                    :max="scope.row.num"
                    v-if="isEdit(scope)"
                    size="mini">
          </el-input> -->
          <span v-else>{{scope.row.outNum}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="出仓单价" width="106">
        <template slot-scope="scope">
          <number-input v-model="scope.row.price" decimal="10,2" :min="0"
            v-if="isEdit(scope)" size="mini"></number-input>
          <!-- <el-input v-model.number="scope.row.price"
                    v-if="isEdit(scope)"
                    size="mini">
          </el-input> -->
          <span v-else>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="仓租单价" width="106">
        <template slot-scope="scope">
          <number-input v-model="scope.row.storeFeePrice" decimal="10,2" :min="0"
            v-if="isEdit(scope)" size="mini"></number-input>
          <!-- <el-input v-model.number="scope.row.storeFeePrice"
                    v-if="isEdit(scope)"
                    size="mini">
          </el-input> -->
          <span v-else>{{scope.row.storeFeePrice}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="计租天数">
        <template slot-scope="scope">
          <number-input v-model="scope.row.storeDay" decimal="10,0" :min="0"
            v-if="isEdit(scope)" size="mini"></number-input>
          <!-- <el-input v-model.number="scope.row.storeDay"
                    v-if="isEdit(scope)"
                    size="mini">
          </el-input> -->
          <span v-else>{{scope.row.storeDay}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable :label="'出仓金额['+tableHeader.amount+']'" width="138">
        <template slot-scope="scope">
          <number-input v-model="scope.row.amount" decimal="10,2" :min="0"
            v-if="isEdit(scope)" size="mini"></number-input>
          <!-- <el-input v-model.number="scope.row.amount"
                    v-if="isEdit(scope)"
                    size="mini">
          </el-input> -->
          <span v-else>{{scope.row.amount}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable :label="'仓租金额['+tableHeader.storeFeeAmount+']'" width="138">
        <template slot-scope="scope">
          <number-input v-model="scope.row.storeFeeAmount" decimal="10,2" :min="0"
            v-if="isEdit(scope)" size="mini"></number-input>
          <!-- <el-input v-model.number="scope.row.storeFeeAmount"
                    v-if="isEdit(scope)"
                    size="mini">
          </el-input> -->
          <span v-else>{{scope.row.storeFeeAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="卷面名称" prop="initCuName" min-width="150"></el-table-column>
      <el-table-column sortable label="单位" prop="unit"></el-table-column>
      <el-table-column sortable label="外观描述" prop="showDes"></el-table-column>
      <el-table-column sortable label="备注" prop="remark"></el-table-column>
    </el-table>
    <span>{{tableDataCalc}}</span>
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
  import { lock } from '@/api/warehousing/pickUpGoods/index'
  import { findPathByModuleCode } from '@/utils'

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
        this.calcTableHeader(temp, ['outWeight4', 'outWeight2', 'outWeight1', 'amount', 'storeFeeAmount'])
        temp.outNum = this.tableData.reduce((pre, cur) => {
          return pre + parseFloat(cur.outNum)
        }, 0)
        return temp
      },
      tableDataCalc: function() {
        return this.tableData.forEach((item) => {
          // 出仓金额 = 出仓单价 x weightFlag (根据 weightFlag 计算)
          let weight = 0
          if (item.weightFlag == null || item.weightFlag === 2) {
            weight = item.outWeight2
            item.weightFlag = 2
          } else if (item.weightFlag === 1) {
            weight = item.outWeight1
          } else if (item.weightFlag === 4) {
            weight = item.outWeight4
          }
          const temp = parseFloat(item.price) * parseFloat(weight)
          item.amount = temp.toFixed(2)
          // 仓租金额 = 仓租单价 x 天数 * 重量
          const temp2 = parseFloat(item.storeFeePrice) * parseFloat(item.storeDay) * parseFloat(weight)
          if (!isNaN(temp2)) {
            item.storeFeeAmount = temp2.toFixed(2)
          }
        })
        // return this.tableData
      }
    },
    data() {
      return {
        currentRow: {},
        selectionList: [],
        weightCalc: [
          { label: '抄码净重', value: 2 },
          { label: '抄码毛重', value: 4 },
          { label: '过磅净重', value: 1 }
        ]
      }
    },
    methods: {
      tableRowClassName({ row, rowIndex }) {
        for (let i = 0; i < this.selectionList.length; i++) {
          if (this.selectionList[i].id === row.id) {
            return 'table-select-bgcolor pointer text-center'
          }
        }
        return 'pointer text-center'
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
          const val = this.tableData.reduce((pre, cur) => {
            return pre + parseFloat(cur[attr])
          }, 0)
          if (attr === 'amount' || attr === 'storeFeeAmount') {
            obj[attr] = val.toFixed(2)
          } else {
            obj[attr] = val.toFixed(3)
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
        if ((this.action === 'view' || this.action === 'reviseBills') && this.formData.status === 1 && !row.isUsed) {
          this.$refs.table.toggleRowSelection(row)
        }
        // 新增修改或者改单时
        if (column.label === '+' || column.label === '操作') { // 点击了删除的一列
          if (row.isUsed !== 1) {
            this.$confirm('确认删除该行？', '温馨提示', { type: 'warning' }).then(() => {
              this.tableData.map((item, index, array) => {
                if (item.stockId === row.stockId) {
                  // tableData 中移除这一项
                  array.splice(index, 1)
                  this.formData.dtDelList.push(row)
                  // 货物解锁
                  lock({
                    revert: 1,
                    stockIds: row.stockId
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
        this.$router.push({ path: findPathByModuleCode('stockLog'), query: { handCode: row.handCode }})
      },
      isUsed(row, index) {
        return !row.isUsed
      },
      changeNum(row) {
        console.log(row.outNum)
        if (row.outNum) {
          row.outWeight1 = Number(row.maxWeight1 / row.maxNum * row.outNum).toFixed(3)
          row.outWeight2 = Number(row.maxWeight2 / row.maxNum * row.outNum).toFixed(3)
          row.outWeight4 = Number(row.maxWeight4 / row.maxNum * row.outNum).toFixed(3)
        }
      }
    }
  }
</script>

<style lang="scss">

</style>
