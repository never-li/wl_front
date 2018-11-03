<template>
  <div>
    <!--头部按钮组-->
    <el-row class="btn-group-container">
      <el-button type="primary" @click="$emit('hideModify', true)">取消</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </el-row>

    <!--</el-table>-->
    <el-table
      :data="maStockList"
      @row-click="handleRowClick"
      row-class-name="pointer text-center"
      stripe
      height="545"
      style="width: 100%"
      header-cell-class-name="table-header-bg text-center"
      border highlight-current-row
    >
      <el-table-column sortable label="操作" width="50">
        <template slot-scope="scope">
          <i class="el-icon-delete"></i>
        </template>
      </el-table-column>
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column sortable label="货物编号" prop="handCode" min-width="150"></el-table-column>
      <el-table-column sortable label="客户" prop="cuName" min-width="200"></el-table-column>
      <el-table-column sortable label="钢卷号" width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.steelCode" size="mini">
          </el-input>
          <!-- <span v-else>{{scope.row.steelCode}}</span> -->
        </template>
      </el-table-column>
      <el-table-column sortable label="品名" width="150">
        <template slot-scope="scope">
          <type-select v-model="scope.row.typeId" filterable size="mini"></type-select>
          <!-- <el-select v-model="scope.row.typeId" filterable size="mini">
              <el-option v-for="option in filterDisplayItems(typeList)" :key="option.value" :label="option.typeName" :value="option.id">
              </el-option>
          </el-select> -->
          <!-- <span v-else>{{scope.row.typeName}}</span> -->
        </template>
      </el-table-column>
      <el-table-column sortable label="规格" width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.specName" size="mini" @input="formatSpecName(scope.row)">
          </el-input>
          <!-- <span v-else>{{scope.row.specName}}</span> -->
        </template>
      </el-table-column>
      <el-table-column sortable label="产地" width="150">
        <template slot-scope="scope">
          <!-- <el-select v-model="scope.row.parea" filterable size="mini">
              <el-option v-for="option in filterDisplayItems(factoryList)" :key="option.value" :label="option.factoryname" :value="option.factoryname">
              </el-option>
          </el-select> -->
          <factory-select v-model="scope.row.parea" filterable size="mini"></factory-select>
          <!-- <span v-else>{{scope.row.parea}}</span> -->
        </template>
      </el-table-column>
      <el-table-column sortable label="材质" width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.grade" size="mini">
          </el-input>
          <!-- <span v-else>{{scope.row.grade}}</span> -->
        </template>
      </el-table-column>
      <el-table-column sortable label="可用净重" width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.validWeight2" size="mini">
          </el-input>
          <!-- <span v-else>{{scope.row.validWeight}}</span> -->
        </template>
      </el-table-column>
      <el-table-column sortable label="可用磅重" width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.validWeight1" size="mini">
          </el-input>
          <!-- <span v-else>{{scope.row.weight1}}</span> -->
        </template>
      </el-table-column>
      <el-table-column sortable label="可用毛重" width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.validWeight4" size="mini">
          </el-input>
          <!-- <span v-else>{{scope.row.weight4}}</span> -->
        </template>
      </el-table-column>
      <el-table-column sortable label="可用数量" width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.validNum" size="mini">
          </el-input>
          <!-- <span v-else>{{scope.row.num}}</span> -->
        </template>
      </el-table-column>
      <el-table-column sortable label="仓库" prop="grade" width="150">
        <template slot-scope="scope">
          <el-select v-model="scope.row.storeId" filterable size="mini">
              <el-option v-for="option in filterDisplayItems(storeList)" :key="option.value" :label="option.storeName" :value="option.id">
              </el-option>
          </el-select>
          <!-- <span v-else>{{scope.row.storeName}}</span> -->
        </template>
      </el-table-column>
      <el-table-column sortable label="库位" width="180">
        <template slot-scope="scope">
          <!-- <el-input v-model="scope.row.position" size="mini">
          </el-input> -->
          <el-input v-model="scope.row.positionRow" size="mini" style="width: 50px; display:inline-block" maxlength="50"></el-input>
          <span class="input-txt">行</span>
          <el-input v-model="scope.row.positionColumn" size="mini" style="width: 50px; display:inline-block" maxlength="50"></el-input>
          <span class="input-txt">排</span>
          <!-- <span v-else>{{scope.row.position}}</span> -->
        </template>
      </el-table-column>
      <el-table-column sortable label="进仓日期" width="245">
        <template slot-scope="scope">
          <el-date-picker
              v-model="scope.row.storeDate"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期">
            </el-date-picker>
          <!-- <el-date-picker v-model="scope.row.storeDate"
            value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder='选择日期'>
          </el-date-picker> -->
          <!-- <span v-else>{{scope.row.storeDate}}</span> -->
        </template>
      </el-table-column>
      <el-table-column sortable label="收费类别" width="150">
        <template slot-scope="scope">
          <el-select v-model="scope.row.feeCfgId" filterable size="mini">
              <el-option v-for="option in filterDisplayItems(feeconfigList)" :key="option.value" :label="option.configName" :value="option.id">
              </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column sortable label="单位" width="100">
        <template slot-scope="scope">
          <el-input v-model="scope.row.unit" size="mini">
          </el-input>
          <!-- <span v-else>{{scope.row.unit}}</span> -->
        </template>
      </el-table-column>
      <el-table-column sortable label="长度" width="100">
        <template slot-scope="scope">
          <el-input v-model="scope.row.lengthRemark" size="mini">
          </el-input>
          <!-- <span v-else>{{scope.row.lengthRemark}}</span> -->
        </template>
      </el-table-column>
      <el-table-column sortable label="外观描述" width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.showDes" size="mini">
          </el-input>
          <!-- <span v-else>{{scope.row.showDes}}</span> -->
        </template>
      </el-table-column>
      <el-table-column sortable label="合同号" width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.contractNo" size="mini">
          </el-input>
          <!-- <span v-else>{{scope.row.contractNo}}</span> -->
        </template>
      </el-table-column>
      <el-table-column sortable label="船号" prop="grade" width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.shipNo" size="mini">
          </el-input>
          <!-- <span v-else>{{scope.row.shipNo}}</span> -->
        </template>
      </el-table-column>
      <el-table-column sortable label="备注" prop="grade" width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remark" size="mini">
          </el-input>
          <!-- <span v-else>{{scope.row.remark}}</span> -->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import customerSelect from '@/components/customerSelect'
  import storeSelect from '@/components/storeSelect'
  // import feeTypeSelect from '@/components/feeTypeSelect'
  import { mapGetters } from 'vuex'
  import { changeMaStock } from '@/api/warehousing/stock/maStock'
  import factorySelect from '@/components/factorySelect'
  import typeSelect from '@/components/typeSelect'

  export default {
    name: 'modify',
    components: {
      customerSelect,
      storeSelect,
      factorySelect,
      typeSelect
    },
    props: {
      maStockList: Array // 子组间传入 下拉需要显示的字段
    },
    computed: {
      ...mapGetters([
        // 'typeList', // 品名
        // 'factoryList', // 产地
        'feeconfigList', // 收费类别
        'storeList' // 仓库
      ])
    },
    data() {
      return {
        currentRow: {
          id: ''
        }
      }
    },
    methods: {
      submit() {
        // console.log(this.maStockList)
        // this.$refs['form'].validate((valid) => {
        //   if (valid) {
        //     alert('submit!')
        //   } else {
        //     console.log('error submit!!')
        //     return false
        //   }
        // })

        changeMaStock({ 'maStockList': this.maStockList }).then(response => {
          this.$emit('hideModify', true)
        }).catch(error => {
          if (error) console.error(error)
        })
      },
      handleRowClick(row, event, column) {
        if (column.label !== '操作') {
          // this.$message.success('row click')
          // console.log(row)
          this.currentRow = row
        } else {
          for (let v = 0; v < this.maStockList.length; v++) {
            if (this.maStockList[v].id === row.id) {
              this.maStockList.splice(v, 1)
              break
            }
          }
        }
      },
      filterDisplayItems(options) {
        //  过滤下拉选项过多
        let filterItems = []
        filterItems = options.slice(0, 15)
        return filterItems
      },
      formatSpecName(row) {
        if (row.specName) {
          row.specName = row.specName.replace('*', '×')
        }
      }
    }
  }
</script>

<style scoped>

</style>
