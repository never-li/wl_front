<template>
  <div >
    <el-form :disabled="BUS.action === 'view'">
      <el-table
        :data="tableData"
        ref="table"
        @header-click="handleHeaderClick"
        @row-click="handleRowClick"
        @selection-change="handleSelectionChange"
        :header-cell-class-name="setHeaderClass"
        row-key="id"
        border stripe height="545"
        row-class-name="pointer text-center tab-ellipsis"
        highlight-current-row
        max-height="500">
        <el-table-column label="+" width="50" v-if="BUS.action === 'add' || BUS.action === 'update'">
          <template slot-scope="scope">
            <i class="el-icon-delete"></i>
          </template>
        </el-table-column>
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column sortable label="货物编号" prop="handCode"  min-width="150">
          <template slot-scope="scope">
            <span v-if="BUS.action === 'view'">
             {{scope.row.handCode}}
            </span>
            <span v-else>
              <el-input v-model="scope.row.handCode" maxlength="50"></el-input>
            </span>
          </template>
        </el-table-column>
        <el-table-column sortable label="钢卷号" prop="steelCode" min-width="152">
          <template slot-scope="scope">
             <span v-if="BUS.action === 'view'">
             {{scope.row.steelCode}}
            </span>
            <span v-else>
              <el-input v-model="scope.row.steelCode" maxlength="50"></el-input>
            </span>
          </template>
        </el-table-column>
        <el-table-column sortable label="品名" prop="typeName"  min-width="120">
          <template slot-scope="scope">
               <span v-if="BUS.action === 'view'">
             {{scope.row.typeName}}
            </span>
            <span v-else>
            <type-select v-model="scope.row.typeName" :field="'typeName'"></type-select>
            </span>
          </template>
        </el-table-column>
        <el-table-column sortable label="规格" prop="specAll" min-width="150">
          <template slot-scope="scope">
                  <span v-if="BUS.action === 'view'">
             {{scope.row.specAll}}
            </span>
            <span v-else>
              <el-input v-model="scope.row.specAll" maxlength="100"></el-input>
            </span>
          </template>
        </el-table-column>
        <el-table-column sortable label="产地" prop="parea">
          <template slot-scope="scope">
             <span v-if="BUS.action === 'view'">
               {{scope.row.parea}}
             </span>
            <span v-else>
            <factory-select v-model="scope.row.parea"></factory-select>
            </span>
          </template>
        </el-table-column>
        <el-table-column sortable label="材质" prop="grade">
          <template slot-scope="scope">
               <span v-if="BUS.action === 'view'">
               {{scope.row.grade}}
             </span>
            <span v-else>
                   <el-input v-model="scope.row.grade" maxlength="50"></el-input>
            </span>
          </template>
        </el-table-column>
        <el-table-column sortable :label="'重量['+ tableHeader.changeStWeight+']'">
          <template slot-scope="scope">
            <span v-if="BUS.action === 'view'">
               {{scope.row.weight}}
             </span>
            <span v-else>
              <!--<el-input v-model="scope.row.weight" maxlength="13"  ></el-input>-->
              <number-input v-model="scope.row.weight" decimal="10,3" @change="scope.row.amountCalc = true"></number-input>
            </span>
          </template>
        </el-table-column>
        <el-table-column sortable label="单价" prop="price">
          <template slot-scope="scope">
                 <span v-if="BUS.action === 'view'">
               {{scope.row.price}}
             </span>
            <span v-else>
               <!--<el-input v-model="scope.row.price" maxlength="13"  ></el-input>-->
              <number-input v-model="scope.row.price" decimal="10,2" @change="scope.row.amountCalc = true"></number-input>
            </span>
          </template>
        </el-table-column>
        <el-table-column sortable label="计租天数" prop="storeDay">
          <template slot-scope="scope">
            <span v-if="BUS.action === 'view'">
               {{scope.row.storeDay}}
             </span>
            <span v-else>
              <number-input v-model="scope.row.storeDay" decimal="10,0" @change="scope.row.amountCalc = true"></number-input>
              <!--<el-input v-model="scope.row.storeDay" maxlength="11"></el-input>-->
            </span>
          </template>
        </el-table-column>
        <el-table-column sortable :label="'金额['+ tableHeader.changeStAmount+']'">
          <template slot-scope="scope">
            <span v-if="BUS.action === 'view'">
               {{scope.row.amount}}
             </span>
            <span v-else>
             <!--<el-input v-model="scope.row.amount" maxlength="13"></el-input>-->
              <number-input v-model="scope.row.amount" decimal="10,2"></number-input>
            </span>
          </template>
        </el-table-column>
        <el-table-column sortable label="备注" prop="remark">
          <template slot-scope="scope">
            <span v-if="BUS.action === 'view'">
               {{scope.row.remark}}
             </span>
            <span v-else>
          <el-input v-model="scope.row.remark" maxlength="200"></el-input>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <span v-show="false">{{ rowCalculate }}</span>
  </div>
</template>

<script>
  import typeSelect from '@/components/typeSelect'
  import factorySelect from '@/components/factorySelect'
  import numberInput from '@/components/numberInput'

  export default {
    name: 'common-table',
    components: {
      typeSelect, factorySelect, numberInput
    },
    props: {
      BUS: Object,
      formData: Object,
      tableData: Array
    },
    computed: {
      tableHeader: function() {
        const temp = {}
        temp.changeStWeight = this.tableData.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight)
        }, 0).toFixed(3)
        temp.changeStAmount = this.tableData.reduce((pre, cur) => {
          return pre + parseFloat(cur.amount)
        }, 0).toFixed(2)
        this.$set(this.formData, 'amountSum', temp.changeStAmount)
        this.formData.weightSum = temp.changeStWeight
        return temp
      },
      rowCalculate() {
        this.tableData.forEach((item) => {
          if (item.price !== '' && item.weight !== '' && item.amountCalc) {
            if (item.storeDay !== '' && item.storeDay !== null && parseInt(item.storeDay) > 0) {
              item.amount = parseFloat(item.price) * parseFloat(item.weight) * parseFloat(item.storeDay)
            } else {
              item.amount = parseFloat(item.price) * parseFloat(item.weight)
            }
            item.amountCalc = false
          }
        })
      }
    },
    data() {
      return {
        selectionList: [],
        currentRow: {}, // 选中行
        initFlag: true
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
      handleHeaderClick(column, event) {
        if (column.label === '+') {
          if (!this.formData.custId || this.formData.custId === '') {
            this.$alert('客户不能为空', '提示', {
              confirmButtonText: '确定'
            })
            return
          }
          const tmp = {
            'hangCode': '',
            'steelCode': '',
            'typeName': '',
            'specAll': '',
            'parea': '',
            'grade': '',
            'weight': '0',
            'price': '',
            'storeDay': '',
            'amount': '0',
            'remark': '',
            amountCalc: false // 计算开始的标志
          }
          this.tableData.push(tmp)
        }
      },
      handleSelectionChange(val) {
        this.currentRow = val
      },
      handleRowClick(row, event, column) {
        // 已审核下的单击行 实行多选
        if (this.BUS.action === 'afterAuth') {
          this.$refs.table.toggleRowSelection(row)
        }
        // 新增修改时
        if (column.label === '+') { // 点击了删除的一列
          this.$confirm('确认删除该行？', '温馨提示', { type: 'warning' }).then(() => {
            this.tableData.map((item, index, array) => {
              if (item === row) {
                array.splice(index, 1)
              }
            })
          })
        }
      }
    }
  }
</script>

<style scoped>

</style>
