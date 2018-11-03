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
          <type-select v-model="listQuery.typeName" :field="'typeName'" class="input-w-168"></type-select>
        </el-form-item>
        <el-form-item label="产地">
          <factory-select v-model="listQuery.parea" class="input-w-168"></factory-select>
        </el-form-item>
        <el-form-item label="材质">
          <el-input v-model="listQuery.grade" class="input-w-168"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="钢卷号">
          <el-input v-model="listQuery.steelCode" class="input-w-168" @input="listQuery.steelCode=listQuery.steelCode.replace('，', ',')"></el-input>
        </el-form-item>
        <el-form-item label="货物编号">
          <el-input v-model="listQuery.handCode" class="input-w-168" @input="listQuery.handCode=listQuery.handCode.replace('，', ',')"></el-input>
        </el-form-item>
        <el-form-item label=""  class="search_label" >
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <!--btn-->
    <el-row class="btn-group-container">
      <el-button type="primary" @click="$emit('hideSelectGoods')" icon="el-icon-back">返回</el-button>
      <el-button type="primary" @click="confirm">确认</el-button>
      <span class="ml-20 fz-12">已选重量 {{selectData.weight}} 吨</span>
      <span class="ml-20 fz-12">已选数量 {{selectData.num}} 件</span>
    </el-row>

    <!--table-->
    <el-table :data="goodsList"
              stripe
              height="545"
              v-loading="listLoading"
              ref="multipleTable"
              @selection-change="handleSelectionChange"
              @row-click="handleRowClick"
              header-cell-class-name="table-header-bg text-center"
              border row-class-name="tab-ellipsis pointer text-center"
              >
      <el-table-column sortable type="selection" width="50" fixed
                       :selectable="isLock"></el-table-column>
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column sortable label="锁定"  width="70">
        <template slot-scope="scope">
          <!--
     freezeWeight > 0 ||  selectFlag > 0 锁定
     freezeWeight 冻结  ==>  0 非冻结
     selectFlag 临时锁定 ==>  0 非锁定
-->
          <svg-icon icon-class="lock" v-if="scope.row.freezeWeight >0 || scope.row.selectFlag > 0"></svg-icon>
        </template>
      </el-table-column>
      <el-table-column sortable label="货物编号" prop="handCode" min-width="120"></el-table-column>
      <el-table-column sortable label="钢卷号" prop="steelCode" min-width="150"></el-table-column>
      <el-table-column sortable label="品名" prop="typeName"></el-table-column>
      <el-table-column sortable label="规格" prop="specName"></el-table-column>
      <el-table-column sortable label="产地" prop="parea"></el-table-column>
      <el-table-column sortable label="材质" prop="grade"></el-table-column>
      <el-table-column sortable :label="'净重['+ tableHeader.weight2+']'" prop="validWeight2" min-width="140"></el-table-column>
      <el-table-column sortable :label="'磅重['+ tableHeader.weight1+']'" prop="validWeight1" min-width="140"></el-table-column>
      <el-table-column sortable :label="'毛重['+ tableHeader.weight4+']'" prop="validWeight4" min-width="140"></el-table-column>
      <el-table-column sortable :label="'数量['+tableHeader.num+']'" prop="validNum" min-width="140"></el-table-column>
      <el-table-column sortable label="仓库">
        <template slot-scope="scope">
          <span>{{scope.row.storeName + " " + (scope.row.positionRow?scope.row.positionRow + "行":"")
                      + (scope.row.positionColumn?scope.row.positionColumn + "排":"")}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="长度" prop="lengthRemark"></el-table-column>
      <el-table-column sortable label="单位" prop="unit" min-width="70"></el-table-column>
      <el-table-column sortable label="外观描述" prop="showDes" min-width="150"></el-table-column>
      <el-table-column sortable label="进仓日期" prop="initStoreDate" min-width="120"></el-table-column>
      <el-table-column sortable label="合同号" prop="contractNo" min-width="120"></el-table-column>
      <el-table-column sortable label="船号" prop="shipNo"></el-table-column>
      <el-table-column sortable label="卷面名称" prop="initCuName"  width="150"></el-table-column>
      <el-table-column sortable label="锁定原因" prop="freezeDes" min-width="150"></el-table-column>
      <el-table-column sortable label="备注" prop="remark"></el-table-column>
    </el-table>

    <!--分页-->
    <div class="mt-10" style="width:95%;text-align:right">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.pageNo" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import storeSelect from '@/components/storeSelect'
  import customerSelect from '@/components/customerSelect'
  import typeSelect from '@/components/typeSelect'
  import factorySelect from '@/components/factorySelect'
  import * as api from '@/api/warehousing/transferGoods/transferGoods'
  import Factory from '@/views/basedata/factory/index'
  //   import { stocklist } from '@/api/warehousing/transferStore/transferStore'

  export default {
    name: 'select-goods',
    components: {
      Factory,
      storeSelect,
      customerSelect,
      typeSelect,
      factorySelect
    },
    created() {
      // this.$parent.viewsBus.$on('selectionList', (selectionList) => { // 获取commonTable 的选中列表
      //   this.changeGoodsNum = selectionList.length
      // })
      this.getList()
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
    props: {
      pageState: String,
      formData: Object,
      changeGoodsNum: {
        type: Number,
        default: 0
      }
    },
    computed: {
      tableHeader: function() {
        const temp = {}
        temp.weight1 = this.goodsList
          .reduce((pre, cur) => {
            return pre + parseFloat(cur.validWeight1)
          }, 0)
          .toFixed(3)
        temp.weight2 = this.goodsList
          .reduce((pre, cur) => {
            return pre + parseFloat(cur.validWeight2)
          }, 0)
          .toFixed(3)
        temp.weight4 = this.goodsList
          .reduce((pre, cur) => {
            return pre + parseFloat(cur.validWeight4)
          }, 0)
          .toFixed(3)
        temp.num = this.goodsList.reduce((pre, cur) => {
          return pre + parseFloat(cur.validNum)
        }, 0)
        return temp
      },
      selectData: function() {
        const temp = {}
        temp.weight = this.selectionList.reduce((pre, cur) => {
          // 净重
          return pre + parseFloat(cur.weight2)
        }, 0).toFixed(3)
        temp.num = this.selectionList.reduce((pre, cur) => {
          return pre + parseFloat(cur.num)
        }, 0)
        return temp
      }
    },
    methods: {
      // 货物查询
      getList() {
        if (!this.formData.fromCustId || this.formData.fromCustId === '') {
          this.$alert('货主不能为空', '提示', {
            confirmButtonText: '确定'
          })
          return
        } else {
          this.listQuery.custId = this.formData.fromCustId
        }
        this.goodsList = []
        this.listLoading = true
        this.listQuery.bldate = this.formData.bldate
        api
          .stocklist(this.listQuery)
          .then(response => {
            this.goodsList = response.mastocks
            this.total = response.dataSize
            this.listLoading = false
          })
          .catch(error => {
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
        // console.log('changeGoodsNum ' + this.changeGoodsNum)
        // console.log('selectionListNum ' + this.selectionList.length)
        // console.log(this.selectionList)
        if (this.changeGoodsNum) { // 有换货件数的情况下 【改单】
          if (this.changeGoodsNum !== this.selectionList.length) { // 换货件数不符合
            this.$alert('您选择的换货件数为' + this.changeGoodsNum + '件，当前选中的货物件数为' + this.selectionList.length + '件，换货件数不符合，请重新选择货物', '温馨提示')
            return
          } else {
            // 删除上次的选中
            this.$parent.selectionList.forEach((selectItem) => {
              this.$parent.dtList.map((tableItem, index) => {
                if (tableItem.fromStockId === selectItem.fromStockId) {
                  this.$parent.dtList.splice(index, 1)
                  this.formData.dtDelList.push(tableItem)
                }
              })
            })
            this.$emit('hideSelectGoods')
            this.$emit('addGoods', this.selectionList)
          }
        } else { // 没有换货件数的情况下【非改单】
          this.$emit('hideSelectGoods')
          this.$emit('addGoods', this.selectionList)
        }
        //   console.log(this.selectionList)
      },
      handleSelectionChange(val) {
        this.selectionList = val
        // this.$message('select')
      },
      handleRowClick(row, event, column) {
        //   this.$refs.multipleTable.toggleRowSelection(row)
        if (this.isLock(row)) {
          this.$refs.multipleTable.toggleRowSelection(row)
        }
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.pageNo = val
        // console.log(this.listQuery.pageNo)
        this.getList()
      },
      isLock(row) {
        return !(row.freezeWeight > 0 || row.selectFlag > 0)
      }
    },
    watch: {
      // 监听页面显示状态变化
      pageState: function(val) {
        if (val) {
          this.selectionList = []
          this.search()
        }
      }
    }
  }
</script>

<style scoped>
</style>
