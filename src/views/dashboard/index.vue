<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="title">任务列表</span>
          </div>
          <div style="min-height:600px;">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
              <el-tab-pane :label="'全部 ('+taskCount+')'" name="all"></el-tab-pane>
              <el-tab-pane v-if="inStorePath" :label="'进仓 ('+inStoreCount+')'" name="inStore"></el-tab-pane>
              <el-tab-pane v-if="machOrderPath" :label="'加工排单 ('+machOrderCount+')'" name="machOrder"></el-tab-pane>
              <el-tab-pane v-if="machCheckPath" :label="'加工复核 ('+machCheckCount+')'" name="machCheck"></el-tab-pane>
              <el-tab-pane v-if="feePath" :label="'费用 ('+feeCount+')'" name="fee"></el-tab-pane>
            </el-tabs>
            <el-table
              :data="activeName === 'all'?taskList:tableData" v-loading="listLoading" element-loading-text="给我一点时间"
              border
              stripe
              height="545"
              row-class-name="pointer text-center"
              :cell-class-name="rowClass"
              header-cell-class-name="table-header-bg text-center"
              @row-click="showTaskDetail"
              style="width: 100%">
              <el-table-column sortable type="index" align="center"
                label="序号">
              </el-table-column>
              <el-table-column sortable
                prop="blno"
                label="单据编号"
                align="center"
                min-width="140">
              </el-table-column>
              <el-table-column sortable
                prop="cuName"
                label="客户"
                min-width="140"
                align="center">
              </el-table-column>
              <el-table-column sortable
                prop="weight"
                align="center"
                min-width="100"
                label="重量">
              </el-table-column>
              <el-table-column sortable
                prop="taskTypeName"
                align="center"
                min-width="90"
                label="类型">
              </el-table-column>
              <el-table-column sortable
                prop="statusName"
                align="center"
                min-width="100"
                label="状态">
              </el-table-column>
              <el-table-column sortable
                prop="createTime"
                align="center"
                min-width="140"
                label="日期">
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="box-card" :body-style="{padding: '0px','background-color': '#fafafa'}">
          <div slot="header" class="clearfix">
            <span class="title">公告通知</span>
            <span class="more"><a href="javascript:void(0)" @click="showMore">更多</a> </span>
          </div>
          <div class="board-column-content">
            <!--<div class="board-item">-->
              <!--<span>{{item.title}}</span>-->
              <!--<span v-html="item.content"></span>-->
              <!--<span>{{item.createTime}}</span>-->
            <!--</div>-->
            <el-table :data="announceData" fit highlight-current-row :show-header="false" class="table-border"
                      stripe
                      @row-click="handleSelectRow"
                      row-class-name ="pointer row-line-bg"
                      style="width: 100%">
              <el-table-column sortable style="width: 80%;">
                <template slot-scope="scope">
                  <span class="cell-title">{{ scope.row.title }}</span>
                </template>
              </el-table-column>
              <el-table-column sortable align="right"  style="width: 20%;">
                <template slot-scope="scope">
                  <span class="time">{{ scope.row.createTime }}<i v-if="scope.row.isNew">new~</i></span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="公告明细" :visible.sync="dialogVisible" width="60%">
      <el-card class="box-card">
        <el-container style="height: 500px;">
          <el-main>
            <el-row>
              <div style="margin: 20px 0;text-align: center;">
                <span style="font-size: xx-large ;font-weight: bold">{{announceDetail.title}}</span>
              </div>
            </el-row>
            <el-row>
              <div style="width: 100%;"  class="ql-editor" v-html="announceDetail.content"></div>
            </el-row>
          </el-main>
        </el-container>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import * as api from '../../api/dashbord'
  import { dateFormat, dateAdd, findPathByModuleCode } from '@/utils'
  import 'quill/dist/quill.core.css'
  export default {
    name: 'dashboard',
    activated() {
      if (JSON.stringify(this.$route.query) !== '{}') {
        if (this.$route.query.path) {
          this.loadData()
        }
      }
    },
    data() {
      return {
        activeName: 'all',
        listLoading: false,
        queryCondition: { pageSize: 10 },
        taskTypeNameMap: {
          inStore: '进仓',
          machOrder: '加工复核',
          machScheduling: '加工排单',
          fee: '费用'
        },
        tableData: [],
        inStoreList: [],
        inStoreCount: 0,
        inStorePath: findPathByModuleCode('instore'),
        machOrderList: [],
        machOrderCount: 0,
        machOrderPath: findPathByModuleCode('machScheduling'),
        machCheckList: [],
        machCheckCount: 0,
        machCheckPath: findPathByModuleCode('machOrder'),
        feeList: [],
        feeCount: 0,
        feePath: findPathByModuleCode('feeRc'),
        announceData: [],
        currentAnnounce: null,
        announceDetail: { title: '', content: '' },
        dialogVisible: false,
        editorOption: {
          modules: {
            toolbar: null
          },
          readOnly: true
        },
        currentTask: null
      }
    },
    mounted() {
      this.listAnnounce()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      this.queryCondition.fromDate = start
      this.queryCondition.toDate = new Date()
      this.loadData()
      this.$nextTick(function() {
        setInterval(this.loadData, 120000)
      })
    },
    methods: {
      rowClass({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 1) {
          return 'tab-color'
        }
      },
      loadData() {
        this.getFeeList()
        this.getInStoreList()
        this.getMachOrderList()
        this.getMachCheckList()
      },
      handleClick(tab, event) {
        // if (this.activeName !== 'all') {
        //   this.listLoading = true
        // }
        // if (this.activeName === 'all') {
        //   this.taskList()
        // } else
        if (this.activeName === 'inStore') {
          this.tableData = this.inStoreList
          // this.tableData = this.tableData.concat(this.inStoreList)
        } else if (this.activeName === 'machOrder') {
          this.tableData = this.machOrderList
          // this.tableData = this.tableData.concat(this.machOrderList)
        } else if (this.activeName === 'machCheck') {
          this.tableData = this.machCheckList
          // this.tableData = this.tableData.concat(this.machCheckList)
        } else if (this.activeName === 'fee') {
          this.tableData = this.feeList
          // this.tableData = this.tableData.concat(this.feeList)
        }
        // this.listLoading = false
      },
      getInStoreList() {
        if (!this.inStorePath) {
          return false
        }
        const condition = {}
        Object.assign(condition, this.queryCondition)
        condition.listStatus = 1
        api.queryInStoreList(condition).then(respone => {
          const list = respone.listInStores
          list.forEach(item => {
            item.taskTypeName = this.taskTypeNameMap.inStore
            item.weight = item.weightSum
            item.statusName = '未审核'
          })
          this.inStoreList = list
          this.inStoreCount = respone.dataSize
          if (this.activeName === 'inStore') {
            this.tableData = this.inStoreList
          }
        })
      },
      getMachOrderList() {
        if (!this.machOrderPath) {
          return false
        }
        const condition = {}
        Object.assign(condition, this.queryCondition)
        condition.inOrder = '1'
        // condition.mbStatus = 0
        // Object.assign(this.queryCondition, { listStatus: 2, mbStatus: 0 })
        api.queryMachSchedulingList(condition).then(respone => {
          const list = respone.list
          list.forEach(item => {
            item.taskTypeName = this.taskTypeNameMap.machScheduling
            item.weight = item.useWeight
            item.statusName = '待排单'
            item.createTime = item.bldate
          })
          this.machOrderList = list
          this.machOrderCount = respone.dataSize
          if (this.activeName === 'machOrder') {
            this.tableData = this.machOrderList
          }
        })
      },
      getMachCheckList() {
        if (!this.machCheckPath) {
          return false
        }
        const condition = {}
        Object.assign(condition, this.queryCondition)
        condition.listStatus = 2
        condition.mbStatus = 3
        // Object.assign(this.queryCondition, { listStatus: 2, mbStatus: 3 })
        api.queryMachOrderList(condition).then(respone => {
          const list = respone.list
          list.forEach(item => {
            item.taskTypeName = this.taskTypeNameMap.machOrder
            item.weight = item.totalMachWeight
            item.statusName = '待确认'
          })
          this.machCheckList = list
          this.machCheckCount = respone.dataSize
          if (this.activeName === 'machCheck') {
            this.tableData = this.machCheckList
          }
        })
      },
      getFeeList() {
        if (!this.feePath) {
          return false
        }
        const condition = {}
        Object.assign(condition, this.queryCondition)
        condition.listStatus = 2
        condition.isFee = 0
        condition.notPayMode = '月结'
        api.queryFeeList(condition).then(respone => {
          const list = respone.list
          list.forEach(item => {
            item.taskTypeName = item.feeName// this.taskTypeNameMap.fee
            item.weight = item.weightSum
            item.statusName = '待收款'
            item.createTime = item.bldate
          })
          this.feeList = list
          this.feeCount = respone.dataSize
          if (this.activeName === 'fee') {
            this.tableData = this.feeList
          }
        })
      },
      listAnnounce() {
        const that = this
        api.queryAnnounce().then(respone => {
          this.announceData = respone.announces
          this.announceData.forEach(item => {
            const createTime = new Date(item.createTime)
            that.$set(item, 'createTime', dateFormat(createTime, 'yyyy-MM-dd'))
            if (dateAdd(createTime, 3) >= dateFormat(new Date(), 'yyyy-MM-dd')) {
              that.$set(item, 'isNew', true)
            } else {
              that.$set(item, 'isNew', false)
            }
          })
        }).catch(error => {
          if (error) console.error(error)
        })
      },
      handleSelectRow(row) {
        this.currentAnnounce = row
        api.queryAnnounceDetail({ id: this.currentAnnounce.id }).then(response => {
          this.announceDetail = response.detail
          this.dialogVisible = true
        })
      },
      showMore() {
        this.$router.push({ path: findPathByModuleCode('announce') })
      },
      showTaskDetail(row) {
        this.currentTask = row
        const originPath = '/dashboard'
        let data = null
        if (this.currentTask.taskTypeName === this.taskTypeNameMap.inStore) {
          data = { path: this.inStorePath,
            query: {
              pageState: 'edit',
              childViewState: 'edit',
              childViewCondition: 'normal',
              formData: this.currentTask,
              originPath: originPath
            }}
        } else if (this.currentTask.taskTypeName === this.taskTypeNameMap.machScheduling) {
          data = { path: this.machOrderPath, query: {
            pageState: 'views',
            formData: this.currentTask,
            originPath: originPath
          }}
        } else if (this.currentTask.taskTypeName === this.taskTypeNameMap.machOrder) {
          data = { path: this.machCheckPath, query: {
            pageState: 'views',
            action: 'view',
            formData: this.currentTask,
            originPath: originPath
          }}
        } else /* if (this.currentTask.taskTypeName === this.taskTypeNameMap.fee)*/ {
          data = { path: this.feePath, query: {
            path: 'views',
            action: 'view',
            formData: this.currentTask,
            originPath: originPath
          }}
        }
        if (data) {
          this.$router.push(data)
        }
      },
      sortList(a, b) {
        const aTime = new Date(a.createTime).getTime()
        const bTime = new Date(b.createTime).getTime()
        return bTime - aTime
      }
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ]),
      taskList: function() {
        let dataList = []
        if (this.inStoreList.length > 0) {
          dataList = dataList.concat(this.inStoreList)
        }
        if (this.machOrderList.length > 0) {
          dataList = dataList.concat(this.machOrderList)
        }
        if (this.machCheckList.length > 0) {
          dataList = dataList.concat(this.machCheckList)
        }
        if (this.feeList.length > 0) {
          dataList = dataList.concat(this.feeList)
        }
        if (dataList.length > 0) {
          dataList = dataList.sort(this.sortList)
          dataList = dataList.slice(0, 10)
          return dataList
        }
        return []
      },
      taskCount: function() {
        const taskCount = this.inStoreCount + this.machOrderCount + this.machCheckCount + this.feeCount
        this.$set(this.userInfo, 'taskCount', taskCount)
        return taskCount
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .el-tabs__item.is-active{
     background: #2963ac;
     color: #fff;
  }
  .dashboard-container{
    .el-card__header{
      .title{
        position: relative;
        font-size: 18px;
        padding-left: 15px;
        font-weight: 700;
        &::before{
          content: '';
          position:absolute;
          width: 0;
          height: 20px;
          top:50%;
          left: 0;
          margin-top: -10px;
          border:3px solid #409EFF;
        }
      }
      .more{
        margin-top:4px;
        float: right;
        font-size: small;
        color: #2b9fff;
      }
    }
    .time{
      position: relative;
      margin-right: 50px;
      i{
        position: absolute;
        width: 40px;
        top:-5px;
        right: -40px;
        font-size: 12px;
        color: red;
      }
    }
    .cell-title{
      display: block;
      position: relative;
      height: 35px;
      line-height: 35px;
      padding-left: 15px;
      cursor: pointer;
      &::after{
        content: '';
        position: absolute;
        top:50%;
        left: 0;
        width: 4px;
        height: 4px;
        margin-top: -2px;
        border-radius: 50%;
        background: #666;

      }
    }
    .bulletin-wrap{
      background: #2b9fff;
    }

  }
  .dashboard {
    &-container {
      margin: 30px;
    }
    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }

  .board-item {
    cursor: pointer;
    width: 100%;
    height: 64px;
    margin: 10px 0;
    background-color: #fff;
    text-align: left;
    line-height: 54px;
    padding: 5px 10px;
    box-sizing: border-box;
    box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.2);
  }
  .tab-color{
    color: #2963ac;
    cursor: pointer;
  }
  .table-border{
    &.el-table td,
    &.el-table th{
      border-right:none;
    }
  }
</style>
