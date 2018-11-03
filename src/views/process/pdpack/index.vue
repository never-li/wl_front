<template>
  <div class="app-container">
    <div class="stock-check" v-show="pageState==='home'">
      <el-row class="form-wrap">
        <el-form :inline="true" size="small" label-width="80px">
          <el-form-item label="加工单号">
            <el-input v-model="listQuery.machBlnoes" class="input-w-168"></el-input>
          </el-form-item>
          <el-form-item label="包装编号">
            <el-input v-model="listQuery.blno" class="input-w-168"></el-input>
          </el-form-item>
          <div class="ml-select-box">
            <el-select v-model="weightType" size="small" >
              <el-option  v-for="item in weightTypeOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
              </el-option>
            </el-select>
            <span v-if="weightType === 0">
              <el-form-item label=""><number-input v-model="listQuery.fromWeight" decimal="10,3" style="height:24px;width:120px;"></number-input></el-form-item>
              <el-form-item  label-width="20" label="-"><number-input v-model="listQuery.toWeight" decimal="10,3" style="height:24px;width:120px;"></number-input></el-form-item>
            </span>
            <span v-else>
              <el-form-item label=""><number-input v-model="listQuery.fromWeight1" decimal="10,3" style="height:24px;width:120px;"></number-input></el-form-item>
              <el-form-item label-width="20" label="-"><number-input v-model="listQuery.toWeight1" decimal="10,3" style="height:24px;width:120px;"></number-input></el-form-item>
            </span>
          </div>
          <el-form-item label="结算状态">
            <el-checkbox-group v-model="status" @change="handleRadioChange">
              <el-checkbox v-for="item in statusList"
                        :label="item.value"
                        :key="item.value">
                {{item.label}}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="listQuery.isValid" @change="handleRadioChange">
              <el-radio v-for="item in validList"
                        :label="item.value"
                        :key="item.value">
                {{item.label}}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <br>
          <el-form-item label="客户">
            <customer-select v-model="listQuery.custId"></customer-select>
          </el-form-item>
          <el-form-item label="成品规格">
            <el-input v-model="listQuery.specAllPd" class="input-w-168"  @keyup.native="handlePdChange"></el-input>
          </el-form-item>
          <el-form-item label="原料规格">
            <el-input v-model="listQuery.specAllMa" class="input-w-168"  @keyup.native="handleMaChange"></el-input>
          </el-form-item>
          <el-form-item label="货物编号">
            <el-input v-model="listQuery.handCodes" class="input-w-168" @keyup.native="handleHandCodeChange"></el-input>
          </el-form-item>
          <el-form-item label="　">
            <el-button type="primary" @click="search" icon="el-icon-search"  >查询</el-button>
            <el-button type="primary" @click="handleDownload" :disabled="downloadLoading" icon="el-icon-download">导出</el-button>
            <el-button type="primary" @click="modifyColumnConfig" icon="el-icon-setting">列设置</el-button>
          </el-form-item>

        </el-form>
      </el-row>

      <el-row class='el-row-header'>
        <el-button type="primary" :disabled="btnDisabled" @click="changePd" icon="el-icon-share">过户</el-button>
        <el-button type="primary"  :disabled="btnDisabled" @click="outStorePd" icon="el-icon-sold-out">提货</el-button>
        <el-button type="primary" :disabled="splitPackDialog.btnDisabled" @click="showSplitPack" icon="el-icon-more-outline">分包</el-button>
      </el-row>

      <el-table ref="pdPackTable"
                v-loading="listLoading"
                :data="pdPackList" border highlight-current-row
                header-cell-class-name="table-header-bg text-center" row-class-name="pointer text-center tab-ellipsis"
                stripe height="545"
                @selection-change="handleSelectionChange"
                @row-click="handleRowClick"
                @row-dblclick="handleRowDblClick"
                style="width: 100%;margin-bottom:15px;"
                :span-method="arraySpanMethod"
      >

        <el-table-column type="selection" width="55"  ></el-table-column>
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column sortable v-for="element in columnList"  :label="getLabelName(element.id,element.name)" :key="element.id" :prop="element.id" :min-width="getWidth(element.id)">

          <template  slot-scope="scope">

             <span v-if="element.id === 'isLock'" >
          <svg-icon icon-class="lock" v-if="scope.row.isLock >0"></svg-icon>
          <svg-icon icon-class="password" class-name="icon-color" v-else-if="scope.row.selectFlag > 0"></svg-icon>
             </span>
            <span v-if="element.id === 'stateLabel'">{{scope.row.stateLabel}}</span>
            <span v-if="element.id === 'blno'">{{scope.row.blno}}</span>
            <span v-if="element.id === 'remark'">{{scope.row.remark}}</span>
            <span v-if="element.id === 'steelCodes'">{{scope.row.steelCodes}}</span>
            <span v-if="element.id === 'handCodes'">{{scope.row.handCodes}}</span>
            <span v-if="element.id === 'cuName'">{{scope.row.cuName}}</span>
            <span v-if="element.id === 'specAllMa'">{{scope.row.specAllMa}}</span>
            <span v-if="element.id === 'specAllPd'">{{scope.row.spec}}</span>
            <span v-if="element.id === 'weight'">{{scope.row.dtWeight}}</span>
            <span v-if="element.id === 'weight1'">{{scope.row.weight1}}</span>
            <span v-if="element.id === 'weight3'">{{scope.row.weight3}}</span>
            <span v-if="element.id === 'weight6'">{{scope.row.weight6}}</span>
            <span v-if="element.id === 'num'">{{scope.row.num}}</span>
            <span v-if="element.id === 'machCuName'">{{scope.row.machCuName}}</span>
            <span v-if="element.id === 'position'">{{scope.row.position}}</span>
            <span v-if="element.id === 'bldate'">{{scope.row.bldate}}</span>
            <span v-if="element.id === 'lockDes'">{{scope.row.lockDes}}</span>
            <span v-if="element.id === 'selUserName'">{{scope.row.selUserName}}</span>
            <span v-if="element.id === 'machBlnoes'">{{scope.row.machBlnoes}}</span>
          </template>
        </el-table-column>

      </el-table>

      <div class="block">
        <div style="width:95%;text-align:right">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="listQuery.pageNo" :page-sizes="[20,100,1000, 5000]" :page-size="listQuery.pageSize"
                         layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>

    </div>


    <div v-if="pageState=='columnConfig'">
      <column-config @hideColumnConfig="hideColumnConfig"></column-config>
    </div>

    <!-- 分包 -->
    <el-dialog :visible.sync="splitPackDialog.visible" v-if='splitPackDialog.visible' width="80%">
      <split-pack :packId="splitPackDialog.packId" @hideSplitPack="hideSplitPack"></split-pack>
    </el-dialog>
  </div>
</template>

<script>
  import { list, getPdPackColumn } from '@/api/process/pdpack/pdpack'
  import customerSelect from '@/components/customerSelect'
  import storeSelect from '@/components/storeSelect'
  import numberInput from '@/components/numberInput'
  import columnConfig from './columnConfig'
  import splitPack from './splitPack'

  import Viewer from 'v-viewer'
  import Vue from 'vue'
  import { findPathByModuleCode } from '@/utils'
Vue.use(Viewer)

  export default {
    name: 'pdpack',
    components: {
      customerSelect,
      storeSelect,
      columnConfig,
      numberInput,
      splitPack
    },
    activated() {
      if (JSON.stringify(this.$route.query) !== '{}') {
        if (this.$route.query.id) {
          this.getList(this.$route.query.id)
        }
      }
    },
    watch: {
      weightType: function(newVal, oldVal) {
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
    },
    computed: {
      tableHeader() {
        const temp = {}
        temp.weightSum = this.pdPackList.reduce((pre, cur) => {
          if (!isNaN(cur.weight) && cur.weight !== null) {
            return pre + parseFloat(cur.weight)
          } else {
            return pre
          }
        }, 0).toFixed(3)
        temp.weight1Sum = this.pdPackList.reduce((pre, cur) => {
          if (!isNaN(cur.weight1) && cur.weight1 !== null) {
            return pre + parseFloat(cur.weight1)
          } else {
            return pre
          }
        }, 0).toFixed(3)
        temp.weight3Sum = this.pdPackList.reduce((pre, cur) => {
          if (!isNaN(cur.weight3) && cur.weight3 !== null) {
            return pre + parseFloat(cur.weight3)
          } else {
            return pre
          }
        }, 0).toFixed(3)
        temp.weight6Sum = this.pdPackList.reduce((pre, cur) => {
          if (!isNaN(cur.weight6) && cur.weight6 !== null) {
            return pre + parseFloat(cur.weight6)
          } else {
            return pre
          }
        }, 0).toFixed(3)
        temp.numSum = this.pdPackList.reduce((pre, cur) => {
          if (!isNaN(cur.num) && cur.num !== null) {
            return pre + parseInt(cur.num)
          } else {
            return pre
          }
        }, 0)
        return temp
      }
    },
    data() {
      return {
        shiftState: false,
        weightType: 0,
        weightTypeOptions: [
          { value: 0, label: '理算重量' },
          { value: 1, label: '过磅净重' }
        ],
        status: [1, 2, 3],
        listQuery: {
          pageNo: 1,
          pageSize: 20,
          blno: '',
          fromWeight: '',
          toWeight: '',
          fromWeight1: '',
          toWeight1: '',
          status: '',
          isValid: 1,
          specAllPd: '',
          handCodes: '',
          machBlnoes: ''
        },
        btnDisabled: true,
        total: 0,
        listLoading: false,
        downloadLoading: false,
        pageState: '',
        statusList: [
          { label: '未结算', value: 1 },
          { label: '已结算', value: 2 },
          { label: '已办提货', value: 3 }
        ],
        validList: [
          { label: '在库', value: 1 },
          { label: '不在库', value: 0 },
          { label: '全部', value: '' }
        ],
        pdPackList: [],
        columnList: [],
        columnAllList: [
          { name: '锁定', id: 'isLock' },
          { name: '结算状态', id: 'stateLabel' },
          { name: '包装编号', id: 'blno' },
          { name: '包装备注', id: 'remark' },
          { name: '货物编号', id: 'handCodes' },
          { name: '钢卷号', id: 'steelCodes' },
          { name: '客户', id: 'cuName' },
          { name: '原料规格组成', id: 'specAllMa' },
          { name: '成品规格组成', id: 'specAllPd' },
          { name: '理算重量', id: 'weight' },
          { name: '过磅净重', id: 'weight1' },
          { name: '过磅毛重', id: 'weight3' },
          { name: '木架重量', id: 'weight6' },
          { name: '包装数量', id: 'num' },
          { name: '加工客户', id: 'machCuName' },
          { name: '库位', id: 'position' },
          { name: '包装日期', id: 'bldate' },
          { name: '锁定原因', id: 'lockDes' },
          { name: '锁定人', id: 'selUserName' },
          { name: '加工单号', id: 'machBlnoes' }
        ],
        list: [
        ],
        selectionList: [],
        selectRow: null,
        splitPackDialog: {
          btnDisabled: true,
          visible: false,
          packId: ''
        }
      }
    },
    created() {
      this.getList()
      this.getColumnList()
      this.pageState = 'home'
      const _this = this
      document.onkeydown = function(e) { // shift事件
        const _key = window.event.keyCode
        if (_key === 16) {
          _this.shiftState = true
        }
        if (_key === 13) {
          _this.search()
        }
      }
      document.onkeyup = function(e) {
        const _key = window.event.keyCode
        if (_key === 16) {
          _this.shiftState = false
        }
      }
    },
    methods: {
      arraySpanMethod({ row, column, rowIndex, columnIndex }) {
        const mergeArr = ['weight1', 'weight3', 'weight6', 'num', 'blno']
        if (mergeArr.indexOf(column.property) > -1 || columnIndex === 0) {
          if (row.childLength) {
            return [row.childLength, 1]
          } else {
            return [0, 0]
          }
        }
      },
      handleHandCodeChange() {
        this.listQuery.handCodes = this.listQuery.handCodes.replace('，', ',')
      },
      handlePdChange() {
        this.listQuery.specAllPd = this.listQuery.specAllPd.replace('\*', '×')
      },
      handleMaChange() {
        this.listQuery.specAllMa = this.listQuery.specAllMa.replace('\*', '×')
      },
      handleRadioChange(val) {
        this.search()
      },
      search: function() {
        this.listQuery.pageNo = 1
        this.listQuery.id = ''
        this.getList()
      },
      getLabelName(id, name) {
        switch (id) {
          case 'weight' : return name + '\n' + '[' + this.tableHeader.weightSum + ']'
          case 'weight1' : return name + '[' + this.tableHeader.weight1Sum + ']'
          case 'weight3' : return name + '[' + this.tableHeader.weight3Sum + ']'
          case 'weight6' : return name + '[' + this.tableHeader.weight6Sum + ']'
          case 'num' : return name + '[' + this.tableHeader.numSum + ']'
          default : return name
        }
      },
      getWidth(id) {
        switch (id) {
          case 'isLock' : return 70
          case 'lockDes' : return 100
          case 'stateLabel' : return 100
          case 'blno' : return 140
          case 'remark' : return 120
          case 'createTime' : return 150
          case 'handCodes' : return 150
          case 'steelCodes' : return 150
          case 'specAllMa' : return 140
          case 'specAllPd' : return 140
          case 'weight' : return 160
          case 'weight1' : return 160
          case 'weight3' : return 160
          case 'weight6' : return 160
          case 'num' : return 140
          case 'machCuName' : return 100
          case 'machBlnoes' : return 140
          case 'selUserName' : return 100
        }
      },
      getList(id) {
        // this.selectRow = null
        this.listLoading = true
        if (id) {
          // 根据id查加工单
          this.listQuery.id = id
        }
        this.listQuery.status = this.status.join(',')
        this.listQuery.handCodes = this.listQuery.handCodes.replace('，', ',')
        let num = 0
        list(this.listQuery)
          .then(response => {
            this.pdPackList = response.list
            const tmpId = []
            for (let i = 0; i < this.pdPackList.length; i++) {
              if (tmpId.indexOf(this.pdPackList[i].id) === -1) {
                num = 0
                for (let j = 0; j < this.pdPackList.length; j++) {
                  if (this.pdPackList[i].id === this.pdPackList[j].id) {
                    num++
                  }
                }
                tmpId.push(this.pdPackList[i].id)
              } else {
                continue
              }
              this.$set(this.pdPackList[i], 'childLength', num)
            }
            this.total = response.dataSize
            this.listLoading = false
          })
          .catch(error => {
            if (error) console.error(error)
            this.listLoading = false
          })
      },
      getColumnList() {
        this.columnList = []
        getPdPackColumn().then(response => {
          if (response.pdPackColumnVoList.length > 0) {
            this.columnList = response.pdPackColumnVoList
            for (const v of this.columnList) {
              for (const i of this.columnAllList) {
                if (v.id === i.id) {
                  v.name = i.name
                  break
                }
              }
            }
          } else {
            this.columnList = this.columnAllList
          }
        }).catch(error => {
          if (error) console.error(error)
          this.columnList = this.columnAllList
        })
      },
      handleDownload() {
        this.downloadLoading = true
        this.pdPackList.forEach(function(item, index) {
          console.log(item.selectFlag)
          item.lock = item.isLock > 0 || item.selectFlag > 0 ? '已锁定' : '未锁定'
        })
        require.ensure([], () => {
          const { export_json_to_excel } = require('@/vendor/Export2Excel')
          const tHeader = []
          const filterVal = []
          tHeader.push('序号')
          filterVal.push('index')
          this.columnList.forEach((item, index) => {
            tHeader.push(item.name)
            if (item.name === '锁定') {
              filterVal.push('lock')
            } else {
              filterVal.push(item.id)
            }
          })
          const data = this.formatJson(filterVal, this.pdPackList)
          export_json_to_excel(tHeader, data, '成品库存资料')
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      rowDbclick() {
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.pageNo = val
        this.getList()
      },
      handleSelectionChange(val) {
        this.btnDisabled = val.length === 0
        this.selectionList = val
        let custId = ''
        for (let i = 0; i < val.length; i++) {
          if (val[i].status !== 2 || val[i].isLock > 0 || val[i].selectFlag > 0) {
            this.btnDisabled = true
            break
          }
          if (!custId) {
            custId = val[i].custId
          } else if (custId !== val[i].custId) {
            this.btnDisabled = true
            break
          }
        }
        // 判断分包按钮显示
        if (val.length === 1) {
          if (val[0].isValid === 1 && val[0].isLock === 0 && val[0].status < 3) {
            this.splitPackDialog.btnDisabled = false
          } else {
            this.splitPackDialog.btnDisabled = true
          }
        } else {
          this.splitPackDialog.btnDisabled = true
        }
      },
      changePd() {
        // 添加packNo方便目标页面赋值
        this.selectionList.forEach((item) => {
          this.$set(item, 'packNo', item.blno)
        })
        const data = {
          path: findPathByModuleCode('changepd'),
          query: {
            stockList: this.selectionList
          }
        }
        this.$router.push(data)
      },
      outStorePd() {
        // 添加packNo方便目标页面赋值
        this.selectionList.forEach((item) => {
          this.$set(item, 'packNo', item.blno)
        })
        const data = {
          path: findPathByModuleCode('outStorePd'),
          query: {
            stockList: this.selectionList
          }
        }
        this.$router.push(data)
      },
      // 显示分包页面
      showSplitPack() {
        if (!this.splitPackDialog.btnDisabled) {
          if (this.selectionList.length !== 1) {
            this.$message('请选择要分包的包装')
            return
          }
          this.splitPackDialog.packId = this.selectionList[0].id
          this.splitPackDialog.visible = true
        }
      },
      // 关闭分包页面
      hideSplitPack(isRefresh) {
        if (isRefresh === true) {
          this.getList()
        }
        this.splitPackDialog.visible = false
      },
      modifyColumnConfig() {
        this.pageState = 'columnConfig'
      },
      hideColumnConfig() {
        this.pageState = 'home'
        this.getColumnList()
      },
      handleRowDblClick(row) {
        const data = {
          path: findPathByModuleCode('stockLog'),
          query: {
            handCode: row.handCodes
          }
        }
        this.$router.push(data)
      },
      handleRowClick(row, event, column) {
        // 兼容SHIFT键盘多选事件
        if (this.shiftState && this.selectRow) {
          const unique = []
          for (let i = this.findIndex(this.selectRow); i <= this.findIndex(row); i++) {
            if (unique.indexOf(this.pdPackList[i]) > -1) { continue }
            for (let j = i; j <= this.findIndex(row); j++) {
              if (this.pdPackList[j].id === this.pdPackList[i].id) {
                this.$refs.pdPackTable.toggleRowSelection(this.pdPackList[j], true)
                break
              }
            }
            unique.push(this.pdPackList[i])
          }
          this.selectRow = row
        } else {
          // 同一ID的包装只需选中第一个
          for (let i = 0; i < this.pdPackList.length; i++) {
            if (this.pdPackList[i].id === row.id) {
              this.$refs.pdPackTable.toggleRowSelection(this.pdPackList[i])
              this.selectRow = this.pdPackList[i]
              break
            }
          }
        }
      },
      findIndex(row) {
        for (let i = 0; i < this.pdPackList.length; i++) {
          if (this.pdPackList[i] === row) {
            return i
          }
        }
      }
    }
  }
</script>

<style lang="scss">
  .el-form-item--small .el-form-item__content, .el-form-item--small .el-form-item__label{
    line-height: 24px;
    font-size: 12px;
  }
  .ml-select-box{
    display: inline-block;
    margin-left: 88px;
  }
  .stock-check {
    .el-row-header {
      width: 100%;
      padding: 10px 15px;
      background: rgba(255, 255, 255, 0.7);
      margin-bottom: 15px;
    }
    .row-class {
      cursor: pointer;
    }
  }
  .icon-item {
    color: #24292e;
  }
  .icon-color{
    color: red;
    /*font-size: 18px;*/
  }
</style>
