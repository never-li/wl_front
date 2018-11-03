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
<!--          <el-form-item label="货物编号">
            <el-input v-model="listQuery.handCode" style="width: 238px"></el-input>
          </el-form-item>-->
          <br>
          <el-form-item label="状态">
            <el-radio-group v-model="listQuery.inOrder" @change="handleRadioChange">
              <el-radio label="1">未排单</el-radio>
              <el-radio label="2">已排单</el-radio>
              <el-radio label="0">全部</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="" class="search_label">
            <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>

      <!--btn-group-->
      <el-row class="btn-group-container">
        <el-button type="primary" @click="showEditView" icon="el-icon-edit-outline">修改</el-button>
        <el-button type="primary" @click="showMachOrder" icon= "el-icon-sort-down">生产排序</el-button>
      </el-row>

      <!-- 左侧列表 -->
      <span style="float: left;width: 50%;">
        <el-table :data="homeList"
                  v-loading="listLoading"
                  @row-click="rowClick"
                  border highlight-current-row
                  header-cell-class-name="table-header-bg text-center" row-class-name="pointer text-center tab-ellipsis"
                  stripe height="545"
                  >
          <el-table-column label="序号" type="index" width="50"></el-table-column>
          <el-table-column sortable label="单据编号" prop="blno" min-width="120" ></el-table-column>
          <el-table-column sortable label="客户" prop="cuName" min-width="100" ></el-table-column>
          <el-table-column sortable label="加工类型" prop="machName" min-width="140"></el-table-column>
          <el-table-column sortable :label="'总重量['+ tableHeader.weight+']'" prop="useWeight" min-width="140"></el-table-column>
          <el-table-column sortable :label="'总数量['+ tableHeader.num+']'" prop="useNum" min-width="100"></el-table-column>
          <el-table-column sortable label="提货日期" prop="timeSectionObj" min-width="140"></el-table-column>
          <el-table-column sortable label="排单数" min-width="80">
            <template slot-scope="scope">
              <span>{{scope.row.inOrder}}/{{scope.row.totalInOrder}}</span>
            </template>
          </el-table-column>
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
      </span>
      <!-- 右侧列表 -->
      <span  style="float: left;width: 50%;padding-left: 20px">
        <el-input type="textarea" v-bind:value="selectRow?selectRow.remark:''" readonly placeholder="关联加工单分条和平直备注"></el-input>

        <el-table :data="machList"
                  border
                  header-cell-class-name="table-header-bg text-center" row-class-name="pointer text-center tab-ellipsis"
                  style="-moz-user-select:none;margin-top: 20px">
          <el-table-column label="序号" type="index" width="50"></el-table-column>
          <el-table-column sortable label="货物编号" prop="handCode" min-width="150"></el-table-column>
          <el-table-column sortable label="钢卷号" prop="steelCode" min-width="100"></el-table-column>
          <el-table-column sortable label="品名" prop="typeName"></el-table-column>
          <el-table-column sortable label="规格" prop="specAll" min-width="200"></el-table-column>
          <el-table-column sortable label="产地" prop="parea"></el-table-column>
          <el-table-column sortable label="材质" prop="grade"></el-table-column>
          <el-table-column sortable label="开料规格" prop="machSpec" min-width="150"></el-table-column>
          <el-table-column sortable label="重量" prop="useWeight"></el-table-column>
          <el-table-column sortable label="机台" prop="machineName"></el-table-column>
          <el-table-column sortable label="加工状态" prop="mbStatusName" min-width="100"></el-table-column>
          <el-table-column sortable label="排单时间" prop="orderTime" min-width="140"></el-table-column>
          <el-table-column sortable label="排单人" prop="orderUser" min-width="120"></el-table-column>
        </el-table>
      </span>
    </div>

    <views v-if="pageState === 'views'" :selectRow="selectRow" :machSrcList="machList" @hideView="hideView" ref="views"></views>
    <order v-if="pageState === 'order'" @hideView="hideView"></order>
  </div>
</template>

<script>
  import views from './views'
  import order from './order'
  import dateRange from '@/components/dateRange'
  import customerSelect from '@/components/customerSelect'
  import * as api from '@/api/process/machScheduling/machScheduling'
  import * as common from '@/utils'

  export default {
    name: 'machScheduling',
    components: {
      views,
      order,
      dateRange,
      customerSelect
    },
    computed: {
      tableHeader() {
        const temp = {}
        temp.weight = this.homeList.reduce((pre, cur) => {
          return pre + parseFloat(cur.useWeight ? cur.useWeight : 0)
        }, 0).toFixed(3)
        temp.num = this.homeList.reduce((pre, cur) => {
          return pre + parseFloat(cur.useNum ? cur.useNum : 0)
        }, 0)
        return temp
      }
    },
    activated() {
      if (JSON.stringify(this.$route.query) !== '{}') {
        // this.rowClick(this.$route.query.formData)
        this.selectRow = this.$route.query.formData
        api.machlist({ blid: this.selectRow.id }).then((response) => {
          this.machList = response.list
          for (const v of this.machList) {
            if (v.machineId) {
              v.selectMachineId = v.machineId
            }
          }
          this.pageState = this.$route.query.pageState
          if (this.$refs['views']) {
            this.$refs['views'].loadData(this.machList)
          }
        }).catch(error => {
          if (error) console.error(error)
        })
        this.originPath = this.$route.query.originPath
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
          inOrder: '1'
        },
        homeList: [],
        machList: [],
        originPath: ''
      }
    },
    methods: {
      handleRadioChange(val) {
        this.search()
      },
      getList() {
        this.selectRow = null
        this.homeList = []
        this.machList = []
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
        this.machList = []
        api.machlist({ blid: this.selectRow.id }).then((response) => {
          this.machList = response.list
          for (const v of this.machList) {
            if (v.machineId) {
              v.selectMachineId = v.machineId
            }
          }
        }).catch(error => {
          if (error) console.error(error)
        })
      },
      showEditView() {
        if (!this.selectRow) {
          this.$message('请选择要修改的数据')
          return
        }
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
        if (this.originPath) {
          this.$router.push({ path: this.originPath, query: { path: 'mach' }})
          this.originPath = ''
        }
        this.pageState = 'home'
      },
      showMachOrder() {
        this.pageState = 'order'
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
