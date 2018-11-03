<template>
  <div class="stock-check">

    <el-row class='el-row-header'>
      <el-button type="primary" @click="goBack" icon="el-icon-back">返回</el-button>
      <el-button type="primary" @click="audit" :disabled="formData.status!==0" icon= "el-icon-tickets" >处理</el-button>
      <el-button type="primary" @click="back" :disabled="formData.status!==0" icon= "el-icon-back">退回</el-button>
      <el-button type="danger" @click="del" :disabled="formData.status!==0" icon= "el-icon-delete">删除</el-button>
      <el-button type="primary" @click="exports" :loading="downloadLoading" icon= "el-icon-download">导出</el-button>
    </el-row>

    <div class="page-info mb-10">
      <el-row class="mb-10">
        <el-col :span="4">
          单据编号 ： <span>{{formData.blno}}</span>
        </el-col>
        <el-col :span="4">
          仓库 ： <span>{{formData.storeName}}</span>
        </el-col>
        <el-col :span="4">
          单据日期 ： <span>{{formData.createTime}}</span>
        </el-col>
      </el-row>

      <el-row class="mb-10">
        <el-col :span="4">
          应盘 ： <span>{{formData.curStockNum}}</span>
        </el-col>
        <el-col :span="4">
          正常 ： <span>{{formData.norNum}}</span>
        </el-col>
        <el-col :span="4">
          差异 ： <span>{{formData.diffNum}}</span>
        </el-col>
        <el-col :span="4">
          少盘 ： <span>{{formData.lessNum}}</span>
        </el-col>
        <el-col :span="4">
          多盘 ： <span>{{formData.newNum}}</span>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4">
          制单人 ： [{{formData.creatorName+formData.createTime}}]
        </el-col>
        <el-col :span="4">
          修改人 ： [{{formData.editorName+formData.editTime}}]
        </el-col>
        <el-col :span="4">
          审核人 ： [{{formData.checkerName+formData.checkTime}}]
        </el-col>
        <el-col :span="4">
          作业状态 ：[{{formData.mbStatusName}}]
        </el-col>
      </el-row>
    </div>

    <el-tabs v-model="activeName" type="border-card" @tab-click="tabClick">
      <el-tab-pane :label="'全部(' + (formData.curStockNum + formData.newNum) +')'" name="all">
        <stock-table :table-data="checkStockList" v-if="activeName==='all'"></stock-table>
      </el-tab-pane>
      <el-tab-pane :label="'正常('+formData.norNum+')'" name="nor">
        <stock-table :table-data="normalTableData" :tabName="'nor'"  v-if="activeName==='nor'"></stock-table>
      </el-tab-pane>
      <el-tab-pane :label="'差异('+formData.diffNum+')'" name="diff">
        <row-select-table :table-data="diffTableData" :tabName="'diff'"   ref="diffTab" @getDtList="getDtList" v-if="activeName==='diff'" @selectionishowBnt='selectionBntStatus'>
          <div slot="header" class="mb-15" v-if="formData.diffNum>0&&formData.status===0">
            <el-button type="primary" @click="handleDiff" :disabled="diffBntStatus">处理差异</el-button>
          </div>
          <div slot="footer" class="mb-15">
            <el-table :data="dtList"
                      border highlight-current-row
                      header-cell-class-name="table-header-bg"
                      style="width: 100%;margin-bottom:15px;" max-height="500">
              <el-table-column label="序号" type="index" width="50"></el-table-column>
              <el-table-column sortable label="修改内容" prop="displayName"></el-table-column>
              <el-table-column sortable label="修改前" prop="fromLabel"></el-table-column>
              <el-table-column sortable label="修改后" prop="toLabel"></el-table-column>
            </el-table>
          </div>
        </row-select-table>
      </el-tab-pane>
      <el-tab-pane :label="'少盘('+formData.lessNum+')'" name="less">
        <row-select-table ref="lessTable" :table-data="lessTableData"  :tabName="'less'" v-if="activeName==='less'"  @selectionishowBnt='selectionBntStatus'>
          <div slot="header" class="mb-15"  v-if="formData.lessNum&&formData.status===0">
            <el-button type="primary" @click="reSet" :disabled="adjustBntStatus">调整为0</el-button>
          </div>
        </row-select-table>
      </el-tab-pane>
      <el-tab-pane :label="'多盘('+formData.newNum+')'" name="new">
        <row-select-table ref="newTable"  :table-data="newTableData"  :tabName="'new'" v-if="activeName==='new'" @selectionishowBnt='selectionBntStatus'>
          <div slot="header" class="mb-15" v-if="formData.newNum&&formData.status===0">
            <el-button type="primary" @click="toInStore" :disabled="enterBntStatus">生成进仓</el-button>
          </div>
        </row-select-table>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
  import stockTable from './common/stockTable'
  import rowSelectTable from './common/rowSelectTable'
  import { mapGetters } from 'vuex'
  import * as api from '@/api/warehousing/stock/checkMaStock'
  import * as common from '@/utils'
export default {
    name: 'check',
    props: {
      BUS: Object
    },
    components: { stockTable, rowSelectTable },
    computed: {
      ...mapGetters(['userInfo']),
      lessTableData: function() {
        return this.checkStockList.filter(item => item.checkStatus === 3)
      },
      newTableData: function() {
        return this.checkStockList.filter(item => item.checkStatus === 4)
      },
      diffTableData: function() {
        return this.checkStockList.filter(item => item.checkStatus === 2)
      },
      normalTableData: function() {
        return this.checkStockList.filter(item => item.checkStatus === 1)
      }
    },
    data() {
      return {
        activeName: 'all',
        formData: {},
        checkStockList: [],
        dtList: [],
        downloadLoading: false,
        diffBntStatus: true,
        adjustBntStatus: true,
        enterBntStatus: true
      }
    },
    methods: {
      del() {
        this.$confirm('确定删除该盘点单?', '提示', { type: 'warning' }).then(() => {
          api.del({ id: this.formData.id }).then(response => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.goBack()
          })
        })
      },
      getDtList() {
        if (this.activeName === 'diff') {
          const row = this.$refs.diffTab.selectRow
          api.dtList({ blid: row.blCheckId, stockId: row.stockId }).then(response => {
            this.dtList = response.checkDtMas
          })
        }
      },
      getCheckStockList() {
        api.checkStock({ blid: this.formData.id }).then(response => {
          this.checkStockList = response.checkStocks
        })
      },
      tabClick(tab, event) {
        this.diffBntStatus = true
        this.adjustBntStatus = true
        this.enterBntStatus = true
        // console.log(tab, event)
      },
      goBack() {
        this.activeName = 'all'
        this.BUS.changeView('home')
      },
      audit() {
        this.$confirm('确认处理该盘点单？', '温馨提示', { type: 'warning' }).then(() => {
          api.audit({ id: this.formData.id }).then(response => {
            this.$notify({
              title: '成功',
              message: '处理成功',
              type: 'success',
              duration: 2000
            })
            // this.$set(this.formData, 'status', 1)
            this.goBack()
          })
        })
      },
      back() {
        this.$confirm('确定回退该盘点单？', '温馨提示', { type: 'warning' }).then(() => {
          api.back({ id: this.formData.id }).then(response => {
            this.$notify({
              title: '成功',
              message: '回退成功',
              type: 'success',
              duration: 2000
            })
            // this.$set(this.formData, 'status', 1)
            this.goBack()
          })
        })
      },
      exports() {
        this.downloadLoading = true
        this.checkStockList.forEach(function(item, index) {
          item.index = index + 1
        })
        require.ensure([], () => {
          const { export_json_to_excel } = require('@/vendor/Export2Excel')
          const tHeader = ['序号', '盘点状态', '货物编号', '是否冻结', '冻结原因', '钢卷号', '货主', '品名', '规格', '材质', '钢厂', '可用重量', '抄码净重', '抄码毛重', '过磅净重', '过磅毛重', '仓库', '行数', '排数', '备注', '盘点人', '盘点时间']
          const filterVal = ['index', 'cstatusName', 'handCode', 'freezeWeight', 'freezeDes', 'steelCode', 'cuName', 'typeName', 'specName', 'grade', 'parea', 'validWeight', 'weight2', 'weight1', 'weight3', 'weight4', 'storeName', 'positionRow', 'positionColumn', 'remark', 'creatorName', 'createTime']
          const list = this.checkStockList
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '盘点明细')
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      handleDiff() {
        const strArr = []
        this.$refs.diffTab.selectionList.forEach((item) => {
          strArr.push(item.handCode)
        })
        if (strArr.length) {
          this.$confirm('确认将' + strArr.join('、') + '差异数据全部调整？', '温馨提示', { type: 'warning' }).then(() => {
            api.handleDiff({ csList: this.$refs.diffTab.selectionList, blid: this.formData.id }).then(response => {
              this.getCheckStockList()
              this.$notify({
                title: '成功',
                message: '处理成功',
                type: 'success',
                duration: 2000
              })
            })
          })
        } else {
          this.$alert('您尚未选中表格内容', '温馨提示', { closeOnClickModal: true })
        }
      },
      reSet() {
        const strArr = []
        this.$refs.lessTable.selectionList.forEach((item) => {
          strArr.push(item.handCode)
        })
        if (strArr.length) {
          this.$confirm('确认将' + strArr.join('、') + '的重量调整为0？', '温馨提示', { type: 'warning' }).then(() => {
            api.handleLess({ csList: this.$refs.lessTable.selectionList }).then(response => {
              this.getCheckStockList()
              this.$notify({
                title: '成功',
                message: '处理成功',
                type: 'success',
                duration: 2000
              })
            })
          })
        } else {
          this.$alert('您尚未选中表格内容', '温馨提示', { closeOnClickModal: true })
        }
      },
      toInStore() {
        const strArr = []
        const dtList = []
        this.$refs.newTable.selectionList.forEach((item) => {
          strArr.push(item.handCode)
          dtList.push({ handCode: item.handCode, typeId: '', steelCode: '', specName: '', parea: '', grade: '', weight2: '', weight4: '', weight1: '', num: '', unit: '', feeCfgId: '', positionRow: '', positionColumn: '', showDes: '', contractNo: '', shipNo: '', remark: '' })
          if (!item.unit) {
            item.unit = '卷'
          }
        })
        if (strArr.length) {
          this.$confirm('确认将' + strArr.join('、') + '生成进仓？', '温馨提示', { type: 'warning' }).then(() => {
            const data = {
              path: common.findPathByModuleCode('instore'),
              query: {
                pageState: 'check2InStore',
                childViewState: 'check2InStore',
                childViewCondition: 'check2InStore',
                formData: {
                  bldate: common.getNowFormatMinTime(), // 制单时间
                  custId: this.$refs.newTable.selectionList[0].custId, // 客户id
                  cuFullName: '', // 客户名称
                  storeId: this.formData.storeId, // 仓库id
                  vehicleNo: '', // 车号
                  receiveName: '', // 收货人
                  mbHandor: '', // 装卸工
                  mbCreaner: '', // 吊机工
                  remark: '', // 备注
                  dtList: dtList, // 明细数据集合
                  checkStockList: this.$refs.newTable.selectionList
                },
                originPath: common.findPathByModuleCode('checkMaStock')
              }
            }
            this.$router.push(data)
          })
        } else {
          this.$alert('您尚未选中表格内容', '温馨提示', { closeOnClickModal: true })
        }
      },
      selectionBntStatus(val) {
        if (this.activeName === 'diff') {
          this.diffBntStatus = val
        }
        if (this.activeName === 'new') {
          this.enterBntStatus = val
        }
        if (this.activeName === 'less') {
          this.adjustBntStatus = val
        }
      }
    },
    watch: {
      // 监听页面显示状态变化
      'BUS.path': function(val) {
        // 新增页面
        if (val === 'home') {
          this.dtList = []
          this.checkStockList = []
          this.formData = {}
        } else if (val === 'check') {
          this.dtList = []
          this.formData = Object.assign({}, this.formData, this.BUS.selectRow)
          this.getCheckStockList()
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .stock-check {
    .el-row-header {
      width: 100%;
      padding: 10px 15px;
      background: rgba(255, 255, 255, 0.7);
      margin-bottom: 15px;
    }
    .page-info {
      font-size: 12px;
      padding: 10px 20px;
      box-shadow: 2px 4px 6px #d9dadc;
    }
  }
  .el-tabs__item{
    font-size: 12px;
  }
</style>
