<template>
  <div>
    <el-row class="form-wrap">
      <el-form :inline="true" size="small" label-width="80px">
        <el-form-item label="仓库">
          <store-select v-model="listQuery.storeId" class="input-w-168"></store-select>
        </el-form-item>
        <el-form-item label="规格">
          <el-input v-model="listQuery.specName" class="input-w-168" @input="listQuery.specName=listQuery.specName.replace('*', '×')"></el-input>
        </el-form-item>
        <el-form-item label="品名">
          <type-select v-model="listQuery.typeId" class="input-w-168"></type-select>
        </el-form-item>
        <el-form-item label="产地">
          <factory-select v-model="listQuery.parea" class="input-w-168"></factory-select>
        </el-form-item>
        <el-form-item label="材质">
          <el-input v-model="listQuery.grade" class="input-w-168"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="钢卷号">
          <el-input v-model="listQuery.steelCode" class="input-w-168" @input="listQuery.steelCode = listQuery.steelCode.replace('，', ',')"></el-input>
        </el-form-item>
        <el-form-item label="货物编号">
          <el-input v-model="listQuery.handCode" class="input-w-168" @input="listQuery.handCode = listQuery.handCode.replace('，', ',')"></el-input>
        </el-form-item>
        <el-form-item label="" class="search_label" >
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <!--btn-->
    <el-row class="btn-group-container">
      <el-button type="primary" @click="returnBack">返回</el-button>
      <el-button type="primary" @click="confirm">确认</el-button>
      <span class="ml-20 fz-12">已选重量 {{selectData.weight}} 吨</span>
      <span class="ml-20 fz-12">已选数量 {{selectData.num}} 件</span>
    </el-row>

    <!--table-->
    <el-table
      :data="goodsList"
      v-loading="listLoading"
      ref="table"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
      header-cell-class-name="table-header-bg text-center"
      border highlight-current-row
      row-class-name="pointer text-center"
      cell-class-name="tab-ellipsis"
      stripe
      height="545"
      >
      <!-- 去掉 reserve-selection="true" 表格数据变更后，不会记录选中项，赵总要求去掉-->
      <el-table-column sortable type="selection" width="50" fixed
                       :selectable="isLock"></el-table-column>
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column sortable label="锁定" width="70">
        <template slot-scope="scope">
          <!--
               freezeWeight > 0 ||  selectFlag > 0 锁定
               freezeWeight 冻结  ==>  0 非冻结
               selectFlag 临时锁定 ==>  0 非锁定
          -->
          <svg-icon icon-class="lock" v-if="scope.row.freezeWeight >0 || scope.row.selectFlag > 0"></svg-icon>
        </template>
      </el-table-column>
      <el-table-column sortable label="货物编号" prop="handCode" min-width="150"></el-table-column>
      <el-table-column sortable label="钢卷号" prop="steelCode" width="152"></el-table-column>
      <el-table-column sortable label="品名" prop="typeName"></el-table-column>
      <el-table-column sortable label="规格" prop="specName"></el-table-column>
      <el-table-column sortable label="产地" prop="parea" min-width="100"></el-table-column>
      <el-table-column sortable label="材质" prop="grade"></el-table-column>
      <el-table-column sortable :label="'净重['+ tableHeader.weight2+']'" prop="validWeight2" min-width="140"></el-table-column>
      <el-table-column sortable :label="'磅重['+ tableHeader.weight1+']'" prop="validWeight1" min-width="140"></el-table-column>
      <el-table-column sortable :label="'毛重['+ tableHeader.weight4+']'" prop="validWeight4" min-width="140"></el-table-column>
      <el-table-column sortable :label="'数量['+tableHeader.num+']'" prop="validNum"min-width="140"></el-table-column>
      <el-table-column sortable label="仓库" prop="storeName"></el-table-column>
      <el-table-column sortable label="库位" >
        <template slot-scope="scope">
          <span>{{scope.row.positionRow}}行 {{scope.row.positionColumn}}排</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="长度" prop="lengthRemark"></el-table-column>
      <el-table-column sortable label="单位" prop="unit"></el-table-column>
      <el-table-column sortable label="外观描述" prop="showDes" min-width="140"></el-table-column>
      <el-table-column sortable label="进仓日期" prop="initStoreDate" min-width="120"></el-table-column>
      <el-table-column sortable label="合同号" prop="contractNo" min-width="120"></el-table-column>
      <el-table-column sortable label="船号" prop="shipNo"></el-table-column>
      <el-table-column sortable label="锁定原因" prop="freezeDes"  min-width="200"></el-table-column>
      <el-table-column sortable label="备注" prop="remark"></el-table-column>
    </el-table>

    <!--分页-->
    <div class="mt-10" style="width:95%;text-align:right">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.pageNo"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import storeSelect from '@/components/storeSelect'
  import typeSelect from '@/components/typeSelect'
  import factorySelect from '@/components/factorySelect'
  import customerSelect from '@/components/customerSelect'
  import { stocklist } from '@/api/warehousing/transferStore/transferStore'

  export default {
    name: 'select-goods',
    components: {
      storeSelect, customerSelect, typeSelect, factorySelect
    },
    props: {
      formData: Object
    },
    computed: {
      tableHeader: function() {
        const temp = {}
        temp.weight1 = this.goodsList.reduce((pre, cur) => {
          return pre + parseFloat(cur.validWeight1)
        }, 0).toFixed(3)
        temp.weight2 = this.goodsList.reduce((pre, cur) => {
          return pre + parseFloat(cur.validWeight2)
        }, 0).toFixed(3)
        temp.weight4 = this.goodsList.reduce((pre, cur) => {
          return pre + parseFloat(cur.validWeight4)
        }, 0).toFixed(3)
        temp.num = this.goodsList.reduce((pre, cur) => {
          return pre + parseFloat(cur.validNum)
        }, 0)
        return temp
      },
      selectData: function() {
        const temp = {}
        temp.weight = this.selectionList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight2)
        }, 0).toFixed(3)
        temp.num = this.selectionList.reduce((pre, cur) => {
          return pre + parseFloat(cur.num)
        }, 0)
        return temp
      }
    },
    data() {
      return {
        total: 0,
        listLoading: false,
        listQuery: {
          pageNo: 1,
          pageSize: 20
        },
        goodsList: [],
        selectionList: []
      }
    },
    created() {
      this.search()
    },
    methods: {
      // 货物查询
      getList() {
        if (!this.formData.custId || this.formData.custId === '') {
          this.$alert('货主不能为空', '提示', {
            confirmButtonText: '确定'
          })
          return
        } else {
          this.listQuery.custId = this.formData.custId
        }
        if (this.formData.fromStoreId) {
          this.listQuery.storeId = this.formData.fromStoreId
        }
        this.goodsList = []
        this.listLoading = true
        stocklist(this.listQuery).then((response) => {
          this.goodsList = response.mastocks
          this.total = response.dataSize
          this.listLoading = false
        }).catch(error => {
          if (error) console.error(error)
          this.listLoading = false
        })
      },
      search() {
        this.listQuery.pageNo = 1
        this.getList()
      },
      // 确认选择货物
      confirm() {
        this.$emit('addGoods', this.selectionList)
      },
      handleSelectionChange(val) {
        this.selectionList = val
      },
      handleRowClick(row, event, column) {
        if (this.isLock(row)) {
          this.$refs.table.toggleRowSelection(row)
        }
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.pageNo = val
        this.getList()
      },
      isLock(row) {
        return !(row.freezeWeight > 0 || row.selectFlag > 0)
      },
      returnBack() {
        this.$emit('toggleSelect', false)
      }
    }
  }
</script>

<style scoped>

</style>
