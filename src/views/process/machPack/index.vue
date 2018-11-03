<template>
  <div class="app-container">
    <div v-show="pageState === 'home'">
      <!--form-->
      <el-row class="form-wrap">
        <el-form :inline="true" size="small" label-width="80px">
          <el-form-item label="单据日期">
            <date-range :is-edit="true" v-model="listQuery.dateArr"></date-range>
          </el-form-item>
          <el-form-item label="客户">
            <customer-select v-model="listQuery.custId"></customer-select>
          </el-form-item>
          <el-form-item label="单据编号">
            <el-input v-model="listQuery.blno" class="input-w-168"></el-input>
          </el-form-item>
          <el-form-item label="货物编号">
            <el-input v-model="listQuery.handCode" class="input-w-168"></el-input>
          </el-form-item>
          <el-form-item label="钢卷号">
            <el-input v-model="listQuery.steelCode" class="input-w-168"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="加工机台">
            <mach-type-select v-model="listQuery.machTypeId"></mach-type-select>
            <machine-select v-model="listQuery.machineId" :machTypeId="listQuery.machTypeId"></machine-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="listQuery.listStatus" @change="handleRadioChange">
              <el-radio label="0">待加工</el-radio>
              <el-radio label="1">加工完成</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="" class="search_label">
            <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>

      <el-table :data="homeList"
                v-loading="listLoading"
                @row-click="rowClick"
                @cell-dblclick="rowDbclick"
                border highlight-current-row
                stripe height="545"
                header-cell-class-name="table-header-bg text-center" row-class-name="pointer text-center tab-ellipsis"
                >
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column sortable label="单据编号" prop="blno" min-width="150"></el-table-column>
        <el-table-column sortable label="客户" prop="cuName" min-width="200"></el-table-column>
        <el-table-column sortable label="加工类型" prop="machName"></el-table-column>
        <el-table-column sortable :label="'计划用料重量['+ tableHeader.machWeight+']'" prop="machWeight" min-width="140"></el-table-column>
        <el-table-column sortable :label="'计划用料数量['+ tableHeader.machNum+']'" prop="machNum" min-width="140"></el-table-column>
        <el-table-column sortable :label="'实际用料重量['+ tableHeader.useWeight+']'" prop="useWeight" min-width="140"></el-table-column>
        <el-table-column sortable :label="'卷回重量['+ tableHeader.rollbackWeight+']'" prop="rollbackWeight" min-width="140"></el-table-column>
        <el-table-column sortable :label="'产出理重['+ tableHeader.packWeight+']'" prop="packWeight" min-width="120"></el-table-column>
        <el-table-column sortable :label="'产出磅重['+ tableHeader.packWeight1+']'" prop="packWeight1" min-width="120"></el-table-column>
        <el-table-column sortable label="提货日期" prop="timeSectionObj" min-width="120"></el-table-column>
        <el-table-column sortable label="机台号" prop="machineName"></el-table-column>
      </el-table>

      <!--分页-->
      <div class="mt-10" style="width:95%;text-align:right">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="listQuery.pageNo"
                       :page-sizes="[20,100,500,1000]" :page-size="listQuery.pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
      </div>
    </div>

    <views v-if="pageState === 'views'" :selectRow="selectRow" @hideView="hideView"></views>
  </div>
</template>

<script>
  import views from './views'
  import dateRange from '@/components/dateRange'
  import customerSelect from '@/components/customerSelect'
  import machTypeSelect from '@/components/machTypeSelect'
  import machineSelect from '@/components/machineSelect'
  import * as api from '@/api/process/machPack/machPack'
  import * as common from '@/utils'

  export default {
    name: 'machPack',
    components: {
      views,
      dateRange,
      customerSelect,
      machTypeSelect,
      machineSelect
    },
    computed: {
      tableHeader() {
        const temp = {}
        temp.machWeight = this.homeList.reduce((pre, cur) => {
          return pre + parseFloat(cur.machWeight ? cur.machWeight : 0)
        }, 0).toFixed(3)
        temp.machNum = this.homeList.reduce((pre, cur) => {
          return pre + parseInt(cur.machNum ? cur.machNum : 0)
        }, 0)
        temp.useWeight = this.homeList.reduce((pre, cur) => {
          return pre + parseFloat(cur.useWeight ? cur.useWeight : 0)
        }, 0).toFixed(3)
        temp.rollbackWeight = this.homeList.reduce((pre, cur) => {
          return pre + parseFloat(cur.rollbackWeight ? cur.rollbackWeight : 0)
        }, 0).toFixed(3)
        temp.packWeight = this.homeList.reduce((pre, cur) => {
          return pre + parseFloat(cur.packWeight ? cur.packWeight : 0)
        }, 0).toFixed(3)
        temp.packWeight1 = this.homeList.reduce((pre, cur) => {
          return pre + parseFloat(cur.packWeight1 ? cur.packWeight1 : 0)
        }, 0).toFixed(3)
        return temp
      }
    },
    data() {
      return {
        pageState: 'home', // 页面显示状态
        selectRow: null, // 选择行
        total: 0,
        listLoading: false,
        listQuery: {
          pageNo: 1,
          pageSize: 20,
          dateArr: [common.leastWeekDate()[0], common.leastWeekDate()[1]],
          listStatus: '0'
        },
        homeList: []
      }
    },
    methods: {
      handleRadioChange(val) {
        this.search()
      },
      getList() {
        this.selectRow = null
        if (this.listQuery.dateArr.length > 0) {
          this.listQuery.fromDate = this.listQuery.dateArr[0]
          this.listQuery.toDate = this.listQuery.dateArr[1]
        }
        this.listLoading = true
        api.list(this.listQuery).then((response) => {
          this.homeList = response.list
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
      // ===表格
      rowClick(row, event, column) {
        this.selectRow = row
      },
      rowDbclick() {
        this.pageState = 'views'
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.pageNo = val
        this.getList()
      },
      hideView() {
        this.pageState = 'home'
      }
    },
    created() {
      this.search()
      const _this = this
      document.onkeydown = function(e) { // shift事件
        const _key = window.event.keyCode
        if (_key === 13) {
          _this.search()
        }
      }
    }
  }
</script>

<style scoped>

</style>
