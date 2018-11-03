<template>
  <div >
    <el-table
      :data="dtList"
      ref="table"
      @header-click="handleHeaderClick"
      @row-click="handleRowClick"
      @row-dblclick="handleRowDbClick"
      @selection-change="handleSelectionChange"
      :header-cell-class-name="setHeaderClass"
      row-key="id"
      border
      stripe
      :row-class-name="tableRowClassName"
      height="385">
      <el-table-column label="+" width="50" v-if="action === 'add' || action === 'update'">
        <template slot-scope="scope">
          <i class="el-icon-delete" @click="deleteDt(scope.$index,scope.row)"></i>
        </template>
      </el-table-column>
      <el-table-column sortable type="selection" width="50" :selectable='checkboxInit'
        v-if="(action === 'view' || action === 'reviseBills') && formData.status === 1">
      </el-table-column>
      <!--<el-table-column label="+" width="50" type="selection" v-if="action === 'view'"></el-table-column>-->
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column sortable label="货物编号" prop="handCode" min-width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.changeStSubId" style="color: red;">{{scope.row.handCode}}</span>
          <span v-else>{{scope.row.handCode}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="钢卷号" prop="steelCode" min-width="150"></el-table-column>
      <el-table-column sortable label="库位">
        <template slot-scope="scope">
          <span>{{scope.row.positionRow}}行 {{scope.row.positionColumn}}排</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="品名" prop="typeName"></el-table-column>
      <el-table-column sortable label="规格" prop="specName"></el-table-column>
      <el-table-column sortable label="产地" prop="parea"></el-table-column>
      <el-table-column sortable label="材质" prop="grade"></el-table-column>
      <el-table-column sortable :label="'净重['+ tableHeader.changeStWeight2+']'" min-width="100">
        <template slot-scope="scope">
          <span v-if="action === 'view'">{{scope.row.changeStWeight2}}</span>
          <number-input v-else v-model="scope.row.changeStWeight2" size="mini"
                        decimal="10,3"
                        :min="0"
                        :max="scope.row.maxWeight2"
          ></number-input>
        </template>
      </el-table-column>
      <el-table-column sortable :label="'磅重['+ tableHeader.changeStWeight1+']'" min-width="100">
        <template slot-scope="scope">
          <span v-if="action === 'view'">{{scope.row.changeStWeight1}}</span>
          <number-input v-else v-model="scope.row.changeStWeight1" size="mini" decimal="10,3"
                        :min="0"
                        :max="scope.row.maxWeight1"
          ></number-input>
        </template>
      </el-table-column>
      <el-table-column sortable :label="'毛重['+ tableHeader.changeStWeight4+']'" min-width="100">
        <template slot-scope="scope">
          <span v-if="action === 'view'">{{scope.row.changeStWeight4}}</span>
          <number-input v-else v-model="scope.row.changeStWeight4" size="mini" decimal="10,3"
                        :min="0"
                        :max="scope.row.maxWeight4"
          ></number-input>
        </template>
      </el-table-column>
      <el-table-column sortable :label="'数量['+tableHeader.changeStNum+']'" min-width="100">
        <template slot-scope="scope">
          <span v-if="action === 'view'">{{scope.row.changeStNum}}</span>
          <number-input v-else v-model="scope.row.changeStNum" size="mini" decimal="10"
                        :min="0"
                        :max="scope.row.maxNum"
                        @input="changeNum(scope.row)"
          ></number-input>
        </template>
      </el-table-column>
      <el-table-column sortable label="单位" prop="unit"></el-table-column>
      <el-table-column sortable label="外观描述" prop="showDes"></el-table-column>
      <el-table-column sortable label="备注" prop="remark"></el-table-column>
      <!--<el-table-column sortable label="查看货物流动日志">-->
      <!--<template slot-scope="scope">-->
      <!--<el-button type="primary" size="small"-->
      <!--@click="$router.push({path:'/warehousing/stockLog', query:{handCode: scope.row.handCode}})">查看-->
      <!--</el-button>-->
      <!--</template>-->
      <!--</el-table-column>-->
    </el-table>
  </div>
</template>

<script>
  import numberInput from '@/components/numberInput'
  import { findPathByModuleCode } from '@/utils'

export default {
    name: 'common-table',
    components: {
      numberInput
    },
    props: {
      action: String,
      lockGoods: Array,
      formData: Object,
      dtList: Array,
      dtDelList: Array
    },
    computed: {
      tableHeader: function() {
        const temp = {}
        temp.changeStWeight1 = this.dtList.reduce((pre, cur) => {
          return pre + parseFloat(cur.changeStWeight1)
        }, 0).toFixed(3)
        temp.changeStWeight2 = this.dtList.reduce((pre, cur) => {
          return pre + parseFloat(cur.changeStWeight2)
        }, 0).toFixed(3)
        temp.changeStWeight4 = this.dtList.reduce((pre, cur) => {
          return pre + parseFloat(cur.changeStWeight4)
        }, 0).toFixed(3)
        temp.changeStNum = this.dtList.reduce((pre, cur) => {
          return pre + parseFloat(cur.changeStNum)
        }, 0)
        return temp
      }
    },
    data() {
      return {
        selectionList: [],
        currentRow: {}, // 双击时候选中行
        clickTimer: null // 修复双击影响单击事件的计时器
      }
    },
    methods: {
      setHeaderClass({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          if (row[0].label === '+') {
            return 'table-header-bg text-center pointer table-add-icon'
          }
          return 'table-header-bg text-center pointer'
        } else {
          return 'table-header-bg text-center'
        }
      },
      tableRowClassName({ row, rowIndex }) {
        for (let i = 0; i < this.selectionList.length; i++) {
          if (this.selectionList[i].id === row.id) {
            return 'table-select-bgcolor pointer text-center tab-ellipsis'
          }
        }
        return 'pointer text-center tab-ellipsis'
      },
      handleHeaderClick(column, event) {
        if (column.label === '+') {
          if (!this.formData.custId || this.formData.custId === '') {
            this.$alert('货主不能为空', '提示', {
              confirmButtonText: '确定'
            })
            return
          }
          this.$emit('toggleSelect', true)
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
        if (this.action === 'view' && !row.changeStSubId) {
          clearTimeout(this.clickTimer) // 取消上次延时未执行的方法
          this.clickTimer = setTimeout(() => {
            this.$refs.table.toggleRowSelection(row)
          }, 250)
        }
      },
      // 删除明细
      deleteDt(index, row) {
        this.dtList.splice(index, 1)
        if (row.id) {
          this.dtDelList.push({ id: row.id })
        }
        // 从锁定货物中去除
        for (let i = 0; i < this.lockGoods.length; i++) {
          if (row.fromStockId === this.lockGoods[i]) {
            this.lockGoods.splice(i, 1)
            // 解锁货物
            this.$emit('lockGood', ...[1, [row.fromStockId]])
          }
        }
      },
      handleRowDbClick(row, event) {
        clearTimeout(this.clickTimer)
        if (this.action === 'view') {
          this.$router.push({ path: findPathByModuleCode('stockLog'), query: { handCode: row.handCode }})
        }
      },
      checkboxInit(row, index) {
        return !row.changeStSubId
      },
      changeNum(row) {
        if (row.changeStNum) {
          row.changeStWeight1 = Number(row.maxWeight1 / row.maxNum * row.changeStNum).toFixed(3)
          row.changeStWeight2 = Number(row.maxWeight2 / row.maxNum * row.changeStNum).toFixed(3)
          row.changeStWeight4 = Number(row.maxWeight4 / row.maxNum * row.changeStNum).toFixed(3)
        }
      }
    }
  }
</script>

