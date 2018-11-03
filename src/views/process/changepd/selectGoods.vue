<template>
  <div>
    <el-row class="form-wrap">
      <el-form :inline="true" size="small" label-width="80px">
        <el-row>
        <el-form-item label="加工单号">
          <el-input v-model="listQuery.machBlNoes" ></el-input>
        </el-form-item>
        <el-form-item label="包装编号">
          <el-input v-model="listQuery.blno" style="width:300px"></el-input>
        </el-form-item>
        <el-select v-model="weightFlag" size="small" >
          <el-option  v-for="item in weightFlagOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
          </el-option>
        </el-select>
        <span v-if="weightFlag === 5">
            <el-form-item label=""><number-input v-model="listQuery.fromWeight" decimal="10,3" style="height:32px;width:120px;"></number-input></el-form-item>
            <el-form-item  label-width="20" label="-"><number-input v-model="listQuery.toWeight" decimal="10,3" style="height:32px;width:120px;"></number-input></el-form-item>
          </span>
        <span v-else>
            <el-form-item label=""><number-input v-model="listQuery.fromWeight1" decimal="10,3" style="height:32px;width:120px;"></number-input></el-form-item>
            <el-form-item label-width="20" label="-"><number-input v-model="listQuery.toWeight1" decimal="10,3" style="height:32px;width:120px;"></number-input></el-form-item>
          </span>
        </el-row>
        <el-row>
        <el-form-item label="成品规格">
          <el-input v-model="listQuery.specAllPd" style="width:300px;"  @keyup.native="handlePdChange"></el-input>
        </el-form-item>
          <el-form-item label="原料规格">
            <el-input v-model="listQuery.specAllMa" style="width:300px;"  @keyup.native="handleMaChange"></el-input>
          </el-form-item>
        <el-form-item label="货物编号">
          <el-input v-model="listQuery.handCodes" style="width:300px;" @keyup.native="handleHandCodeChange"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
        </el-row>
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
              max-height="500"
              v-loading="listLoading"
              ref="multipleTable"
              @selection-change="handleSelectionChange"
              @row-click="handleRowClick"
              row-key="dtId"
              stripe height="545"
              header-cell-class-name="table-header-bg text-center"
              border row-class-name="pointer text-center tab-ellipsis"
              :span-method="arraySpanMethod"
              >
      <el-table-column type="selection" width="50" fixed
                       :selectable="isLock"></el-table-column>
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column sortable label="锁定" width="70">
        <template slot-scope="scope">
          <svg-icon icon-class="lock" v-if="scope.row.isLock >0 || scope.row.selectFlag > 0"></svg-icon>
        </template>
      </el-table-column>
      <el-table-column sortable label="包装备注" prop="remark" min-width="100"></el-table-column>
      <el-table-column sortable label="货物编号" prop="handCodes" min-width="100"></el-table-column>
      <el-table-column sortable label="钢卷号" prop="steelCodes" min-width="100"></el-table-column>
      <el-table-column sortable label="原料规格组成" prop="specAllMa" min-width="140"></el-table-column>
      <el-table-column sortable label="成品规格组成" prop="spec" min-width="140"></el-table-column>
      <el-table-column sortable :label="'理算重量['+ tableHeader.weight+']'" prop="dtWeight" min-width="140"></el-table-column>
      <el-table-column sortable :label="'过磅净重['+ tableHeader.weight1+']'" prop="weight1" min-width="140"></el-table-column>
      <el-table-column sortable :label="'过磅毛重['+ tableHeader.weight3+']'" prop="weight3" min-width="140"></el-table-column>
      <el-table-column sortable :label="'木架重量['+ tableHeader.weight6+']'" prop="weight6" min-width="140"></el-table-column>
      <el-table-column sortable :label="'包装数量['+tableHeader.num+']'" prop="num" min-width="120"></el-table-column>
      <el-table-column sortable label="包装编号" prop="packNo" min-width="120"></el-table-column>
      <el-table-column sortable label="加工客户" prop="machCuName" min-width="100"></el-table-column>
      <el-table-column sortable label="库位" prop="position"></el-table-column>
      <el-table-column sortable label="包装日期" prop="createTime" min-width="140"></el-table-column>
      <el-table-column sortable label="锁定原因" prop="lockDes" min-width="100"></el-table-column>
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
  import * as api from '@/api/process/changepd/changepd'
  import Factory from '@/views/basedata/factory/index'
  import numberInput from '@/components/numberInput'
  //   import { stocklist } from '@/api/warehousing/transferStore/transferStore'

  export default {
    name: 'select-goods',
    components: {
      Factory,
      storeSelect,
      customerSelect,
      typeSelect,
      factorySelect,
      numberInput
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
          pageSize: 10,
          blno: '',
          fromWeight: '',
          toWeight: '',
          fromWeight1: '',
          toWeight1: '',
          specAllPd: '',
          specAllMa: '',
          handCodes: '',
          machBlNoes: '',
          custId: ''
        },
        goodsList: [],
        selectionList: [],
        weightFlag: 5,
        weightFlagOptions: [
          { value: 5, label: '理算重量' },
          { value: 1, label: '过磅净重' }
        ]
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
        temp.weight = this.goodsList
          .reduce((pre, cur) => {
            if (!isNaN(cur.dtWeight) && cur.dtWeight !== null) {
              return pre + parseFloat(cur.dtWeight)
            } else {
              return pre
            }
          }, 0)
          .toFixed(3)
        temp.weight1 = this.goodsList
          .reduce((pre, cur) => {
            if (!isNaN(cur.weight1) && cur.weight1 !== null) {
              return pre + parseFloat(cur.weight1)
            } else {
              return pre
            }
          }, 0)
          .toFixed(3)
        temp.weight3 = this.goodsList
          .reduce((pre, cur) => {
            if (!isNaN(cur.weight3) && cur.weight3 !== null) {
              return pre + parseFloat(cur.weight3)
            } else {
              return pre
            }
          }, 0)
          .toFixed(3)
        temp.weight6 = this.goodsList
          .reduce((pre, cur) => {
            if (!isNaN(cur.weight6) && cur.weight6 !== null) {
              return pre + parseFloat(cur.weight6)
            } else {
              return pre
            }
          }, 0)
          .toFixed(3)
        temp.num = this.goodsList.reduce((pre, cur) => {
          if (!isNaN(cur.num) && cur.num !== null) {
            return pre + parseFloat(cur.num)
          } else {
            return pre
          }
        }, 0)
        return temp
      },
      selectData: function() {
        const temp = {}
        temp.weight = this.selectionList.reduce((pre, cur) => {
          // 净重
          return pre + parseFloat(cur.weight)
        }, 0).toFixed(3)
        temp.num = this.selectionList.reduce((pre, cur) => {
          return pre + parseFloat(cur.num)
        }, 0)
        return temp
      }
    },
    methods: {
      arraySpanMethod({ row, column, rowIndex, columnIndex }) {
        const mergeArr = ['weight1', 'weight3', 'weight6', 'num', 'packNo']
        if (mergeArr.indexOf(column.property) > -1 || columnIndex === 0) {
          if (row.childLength) {
            return [row.childLength, 1]
          } else {
            return [0, 0]
          }
        }
      },
      handlePdChange() {
        this.listQuery.specAllPd = this.listQuery.specAllPd.replace('\*', '×')
      },
      handleMaChange() {
        this.listQuery.specAllMa = this.listQuery.specAllMa.replace('\*', '×')
      },
      handleHandCodeChange() {
        this.listQuery.handCodes = this.listQuery.handCodes.replace('，', ',')
      },
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
        this.listQuery.specAllPd = this.listQuery.specAllPd.replace('\*', '×')
        let num = 0
        api
          .stocklist(this.listQuery)
          .then(response => {
            this.goodsList = response.list
            // 拼接上childLength字段，用于合并
            const tmpId = []
            for (let i = 0; i < this.goodsList.length; i++) {
              if (tmpId.indexOf(this.goodsList[i].id) === -1) {
                num = 0
                for (let j = 0; j < this.goodsList.length; j++) {
                  if (this.goodsList[i].id === this.goodsList[j].id) {
                    num++
                  }
                }
                tmpId.push(this.goodsList[i].id)
              } else {
                continue
              }
              this.$set(this.goodsList[i], 'childLength', num)
            }
            this.total = response.datasize
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
        console.log('changeGoodsNum ' + this.changeGoodsNum)
        console.log('selectionListNum ' + this.selectionList.length)
        console.log(this.selectionList)
        if (this.changeGoodsNum) { // 有换货件数的情况下 【改单】
          if (this.changeGoodsNum !== this.selectionList.length) { // 换货件数不符合
            this.$alert('您选择的换货件数为' + this.changeGoodsNum + '件，当前选中的货物件数为' + this.selectionList.length + '件，换货件数不符合，请重新选择货物', '温馨提示')
            return
          } else {
            console.log(this.$parent.selectionList)
            // 删除上次的选中
            this.$parent.selectionList.forEach((selectItem) => {
              this.$parent.dtList.map((tableItem, index) => {
                if (tableItem.id === selectItem.id) {
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
      },
      handleSelectionChange(val) {
        this.selectionList = val
      },
      handleRowClick(row, event, column) {
        if (this.isLock(row)) {
          // 同一ID的包装只需选中第一个
          for (let i = 0; i < this.goodsList.length; i++) {
            if (this.goodsList[i].id === row.id) {
              this.$refs.multipleTable.toggleRowSelection(this.goodsList[i])
              break
            }
          }
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
        return !(row.isLock > 0 || row.selectFlag > 0)
      }
    },
    watch: {
      // 监听页面显示状态变化
      pageState: function(val) {
        if (val) {
          this.selectionList = []
          this.search()
        }
      },
      weightFlag: function(newVal, oldVal) {
        if (newVal === 0) {
          this.$set(this.listQuery, 'fromWeight', '')
          this.$set(this.listQuery, 'toWeight', '')
          this.$delete(this.listQuery, 'fromWeight1', '')
          this.$delete(this.listQuery, 'toWeight1', '')
        } else {
          this.$set(this.listQuery, 'fromWeight1', '')
          this.$set(this.listQuery, 'toWeight1', '')
          this.$delete(this.listQuery, 'fromWeight', '')
          this.$delete(this.listQuery, 'toWeight', '')
        }
      }
    }
  }
</script>

<style scoped>
</style>
