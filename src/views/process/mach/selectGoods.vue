<template>
  <div>
    <!--form-->
    <el-row class="form-wrap">
      <el-form :inline="true" size="small" label-width="80px">
        <el-form-item label="仓库" v-if="formData.resType===1">
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
        <!-- <el-form-item label="客户">
          <customer-select v-model="formData.custId" disabled class="input-w-168"></customer-select>
        </el-form-item> -->
        <el-form-item label="钢卷号">
          <el-input v-model="listQuery.steelCode" class="input-w-168" @input="listQuery.steelCode=listQuery.steelCode.replace('，', ',')"></el-input>
        </el-form-item>
        <el-form-item label="货物编号">
          <el-input v-model="listQuery.handCode" class="input-w-168" @input="listQuery.handCode=listQuery.handCode.replace('，', ',')"></el-input>
        </el-form-item>
        <el-form-item class="search_label">
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
        <br>
        <span v-for="item in plusFormArr" :key="item.key">
          <el-form-item>
            <el-select class="w-184" v-model="item.key">
              <el-option label="选项1" :value="1"></el-option>
              <el-option label="选项2" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="item.value"></el-input>
          </el-form-item>
        </span>
        <i class="el-icon-plus addIcon" @click="addFormItem"></i>
      </el-form>
    </el-row>

    <!--btn-->
    <el-row class="btn-group-container">
      <el-button type="primary" @click="$emit('hideSelectGoods')" icon="el-icon-back">返回</el-button>
      <el-button type="primary" @click="confirm">确认</el-button>
      <span class="ml-20 fz-12">已选重量 {{selectData.weight}}吨</span>
      <span class="ml-20 fz-12">已选数量 {{selectData.num}} 件</span>
    </el-row>

    <!--table [row-key => 优化渲染]-->
    <el-table
      :data="goodsList"
      v-loading="listLoading"
      ref="table"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
      row-key="id"
      header-cell-class-name="table-header-bg text-center"
      border highlight-current-row
      row-class-name="pointer text-center tab-ellipsis"
      stripe height="545" style="-moz-user-select:none;">
      <el-table-column type="selection" width="50" fixed
                       :selectable="isLock"></el-table-column>
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column sortable label="锁定" v-if="formData.resType===1" min-width="70">
        <template slot-scope="scope">
          <!--
               freezeWeight > 0 ||  selectFlag > 0 锁定
               freezeWeight 冻结  ==>  0 非冻结
               selectFlag 临时锁定 ==>  0 非锁定
          -->

          <!--<svg-icon icon-class="password" class-name="icon-color" v-if="scope.row.freezeWeight >0 || scope.row.selectFlag > 0"></svg-icon>-->
          <svg-icon icon-class="lock" class-name="icon-color" v-if="scope.row.freezeWeight >0 || scope.row.selectFlag > 0"></svg-icon>
        </template>
      </el-table-column>
      <el-table-column sortable label="货物编号" prop="handCode" width="100"></el-table-column>
      <el-table-column sortable label="钢卷号" prop="steelCode" width="120"></el-table-column>
      <!-- <el-table-column sortable label="客户" prop="cuName" width="180" v-if="formData.resType===1"></el-table-column> -->
      <el-table-column sortable label="品名" prop="typeName"   min-width="120"></el-table-column>
      <el-table-column sortable label="规格" prop="specName"  min-width="120"></el-table-column>
      <el-table-column sortable label="产地" prop="parea" min-width="110"></el-table-column>
      <el-table-column sortable label="材质" prop="grade"></el-table-column>
      <el-table-column sortable :label="(formData.resType===1?'净重[':'理重[')+tableHeader.validWeight2+']'" prop="validWeight2" min-width="140"></el-table-column>
      <el-table-column sortable :label="'磅重['+tableHeader.validWeight1+']'" prop="validWeight1" min-width="140" v-if="formData.resType===1"></el-table-column>
      <el-table-column sortable :label="'毛重['+tableHeader.validWeight4+']'" prop="validWeight4" min-width="140" v-if="formData.resType===1"></el-table-column>
      <el-table-column sortable :label="'数量['+tableHeader.validNum+']'" prop="validNum" min-width="120"></el-table-column>
      <!-- <el-table-column sortable :label="'可用理重['+tableHeader.pdValidWeight+']'" prop="pdValidWeight" min-width="120" v-if="formData.resType===2"></el-table-column>
      <el-table-column sortable :label="'可用数量['+tableHeader.pdValidNum+']'" prop="pdValidNum" v-if="formData.resType===2" min-width="120"></el-table-column> -->
      <el-table-column sortable label="仓库" v-if="formData.resType===1">
        <template slot-scope="scope">
            <span>{{scope.row.storeName + " "
                      + (scope.row.positionRow?scope.row.positionRow + "行":"")
                      + (scope.row.positionColumn?scope.row.positionColumn + "排":"")}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="长度" prop="lengthRemark" v-if="formData.resType===1"></el-table-column>
      <el-table-column sortable label="单位" prop="unit"></el-table-column>
      <el-table-column sortable label="外观描述" prop="showDes" min-width="100"></el-table-column>
      <el-table-column sortable label="进仓日期" prop="storeDate" width="152" v-if="formData.resType===1"></el-table-column>
      <el-table-column sortable label="合同号" prop="contractNo" width="150"></el-table-column>
      <el-table-column sortable label="船号" prop="shipNo"></el-table-column>
      <el-table-column sortable label="锁定原因" prop="reason" min-width="100"></el-table-column>
      <el-table-column sortable label="备注" prop="remark"></el-table-column>
    </el-table>

    <!--分页-->
    <div class="mt-10" style="width:95%;text-align:right">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.pageNo"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import * as api from '@/api/process/mach/index'
  import storeSelect from '@/components/storeSelect'
  import customerSelect from '@/components/customerSelect'
  import typeSelect from '@/components/typeSelect'
  import factorySelect from '@/components/factorySelect'

  export default {
    name: 'select-goods',
    props: {
      formData: Object
    },
    components: {
      storeSelect, customerSelect, typeSelect, factorySelect
    },
    computed: {
      tableHeader: function() {
        const temp = {}
        temp.validWeight4 = this.goodsList.reduce((pre, cur) => {
          return pre + parseFloat(cur.validWeight4)
        }, 0).toFixed(3)
        temp.validWeight2 = this.goodsList.reduce((pre, cur) => {
          return pre + parseFloat(cur.validWeight2)
        }, 0).toFixed(3)
        temp.validWeight1 = this.goodsList.reduce((pre, cur) => {
          return pre + parseFloat(cur.validWeight1)
        }, 0).toFixed(3)
        temp.validNum = this.goodsList.reduce((pre, cur) => {
          return pre + parseFloat(cur.validNum)
        }, 0).toFixed(3)
        temp.pdValidWeight = this.goodsList.reduce((pre, cur) => {
          return pre + parseFloat(cur.pdValidWeight)
        }, 0).toFixed(3)
        temp.pdValidNum = this.goodsList.reduce((pre, cur) => {
          return pre + parseFloat(cur.pdValidNum)
        }, 0).toFixed(3)
        return temp
      },
      selectData: function() {
        const temp = {}
        temp.weight = this.selectionList.reduce((pre, cur) => { // 净重
          return pre + parseFloat(cur.validWeight2)
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
        selectionList: [],
        plusFormArr: []
      }
    },
    created() {
      this.getList()
      // this.listLoading = true
      // this.listQuery.custId = this.formData.custId
      // this.listQuery.resType = this.formData.resType
      // api.goodslist(this.listQuery).then((res) => {
      //   this.goodsList = res.list
      //   this.total = res.dataSize
      //   this.listLoading = false
      //   // 改变选中状态
      //   // this.formData.resList.map((dtItem) => {
      //   //   this.goodsList.map((goodsItem) => {
      //   //     if (dtItem.stockId === goodsItem.stockId) {
      //   //       this.$refs.table.toggleRowSelection(goodsItem)
      //   //     }
      //   //   })
      //   // })
      // }).catch(error => {
      //   if (error) console.error(error)
      //   this.listLoading = false
      // })
    },
    methods: {
      getList() {
        this.listLoading = true
        this.listQuery.custId = this.formData.custId
        this.listQuery.resType = this.formData.resType
        api.goodslist(this.listQuery).then((res) => {
          this.goodsList = res.list
          this.total = res.dataSize
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
      // === 表格
      handleSelectionChange(rowArr) {
        this.selectionList = rowArr
      },
      handleRowClick(row, event, column) {
        if (this.isLock(row)) { // 非锁定的货物才可选中
          this.$refs.table.toggleRowSelection(row)
        }
      },
      // 确认选择货物
      confirm() {
        // if (this.changeDtList && this.changeDtList.length > 0 && this.changeDtList.length !== this.selectionList.length) {
        //   this.$message.warning('换货需要选择相等数量的货物')
        //   return
        // }
        // 确认 => 选中锁货 revert: 0 锁定 1解锁
        const stockids = []
        this.selectionList.map((item) => {
          stockids.push(item.id)
        })
        api.lock({
          revert: 0,
          stockIds: stockids.join(',')
        })
        this.$emit('addGoods', this.selectionList)
        this.$emit('hideSelectGoods')
      },
      addFormItem() {
        this.plusFormArr.push({
          key: Date.now(),
          value: ''
        })
      },
      isLock(row, index) {
        return !(row.freezeWeight > 0 || row.selectFlag > 0)
      },
      // ===分页
      handleCurrentChange(val) {
        this.listQuery.pageNo = val
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val
        this.getList()
      }
    }
  }
</script>

<style scoped>
  .icon-color{
    color: red;
    /*font-size: 18px;*/
  }
</style>
