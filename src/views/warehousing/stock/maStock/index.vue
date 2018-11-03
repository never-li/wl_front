<template>
  <div class="app-container">
    <div class="stock-check" v-show="pageState==='home'">
      <el-row class="form-wrap">
        <el-form :inline="true" size="small" label-width="80px">
          <el-form-item label="仓库">
            <store-select v-model="listQuery.storeId" class="input-w-168" ></store-select>
          </el-form-item>
          <el-form-item label="规格">
            <el-input v-model="listQuery.specName" class="input-w-168" @input="listQuery.specName=listQuery.specName.replace('*', '×')"  @keyup.enter.native="search"></el-input>
          </el-form-item>
          <el-form-item label="品名">
            <!-- <el-input v-model="listQuery.typeName"  class="input-w-168"  @keyup.enter.native="search"></el-input> -->
            <type-select v-model="listQuery.typeId" filterable class="input-w-168" size="mini"></type-select>
          </el-form-item>
          <el-form-item label="产地">
            <!-- <el-input v-model="listQuery.parea"  class="input-w-168"  @keyup.enter.native="search"></el-input> -->
            <factory-select v-model="listQuery.parea" filterable class="input-w-168" size="mini"></factory-select>
          </el-form-item>
          <el-form-item label="材质">
            <el-input v-model="listQuery.grade"  class="input-w-168"  ></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="listQuery.onlyInstore" @change="handleRadioChange">
              <el-radio v-for="item in onlyInstoreList"
                        :label="item.value"
                        :key="item.value">
                {{item.label}}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <br/>
          <el-form-item label="客户">
            <!-- <customer-select v-model="listQuery.custId"  class="input-w-168"></customer-select> -->
            <customer-select v-model="selectList" :customer= 'listQuery'  class="input-w-168" ></customer-select>
          </el-form-item>
          <el-form-item label="钢卷号">
            <el-input v-model="listQuery.steelCode"  class="input-w-168"   @input="listQuery.steelCode=listQuery.steelCode.replace('，', ',')"></el-input>
          </el-form-item>
          <el-form-item label="货物编号">
            <el-input v-model="listQuery.handCode" class="input-w-168" @input="listQuery.handCode=listQuery.handCode.replace('，', ',')"></el-input>
          </el-form-item>
          <el-form-item label="　">
            <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
            <el-button type="primary" icon="el-icon-download" :loading="downloadLoading" @click="handleDownload">导出</el-button>
            <!-- <el-button type="primary" icon="el-icon-download">导出</el-button> -->
            <el-button type="primary" @click="modifyColumnConfig" icon="el-icon-setting">列设置</el-button>
          </el-form-item>
          <!--<el-form-item label="　">-->
            <!--<el-button type="primary" @click="search">导出</el-button>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="　">-->
            <!--<el-button type="primary" @click="search">列设置</el-button>-->
          <!--</el-form-item>-->
          <div class="clearfix"></div>
          <span v-for="item in plusFormArr" :key="item.key" class="ml-select">
          <el-form-item style="width: 100px">
            <el-select  v-model="item.query" value-key="id">
              <el-option v-for="option in plusQueryOptions"
                         :key="option.name" :label="option.name" :value="option"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width: 200px">
            <span v-if="item.query.date">
              <date-range :is-edit="true" v-model="item.value"></date-range>
            </span>
            <span v-else>
              <el-input v-model="item.value" v-bind:class="{'query-range-wight': item.query.range}"></el-input>
              <span v-if="item.query.range">-</span>
              <el-input v-model="item.toValue" v-if="item.query.range" style="width: 40%"></el-input>
            </span>
          </el-form-item>

          </span>
          <i class="el-icon-plus addIcon" @click="addFormItem"></i>
        </el-form>
      </el-row>

      <el-row class='el-row-header'>
        <el-button type="primary" @click="transferGoods" :disabled="btnDisabled">过户</el-button>
        <el-button type="primary" @click="outStore" :disabled="btnDisabled">提货</el-button>
        <el-button type="primary" @click="machOrder" :disabled="machBtnDisabled">加工</el-button>
        <el-button type="primary" @click="transferStore" :disabled="changeStBtnDisabled">转仓</el-button>
        <el-button type="primary" @click="modifyMastock" :disabled="modifyBtnDisabled" icon="el-icon-edit-outline">修改</el-button>
        <el-button type="primary" @click="openFreezeDialog('unFreeze')" :disabled="freezeBtnDisabled">解锁</el-button>
        <el-button type="primary" @click="openFreezeDialog('freeze')" :disabled="unFreezeBtnDisabled">锁定</el-button>
        <el-button type="primary" @click="importDialogVisible=true" >导入</el-button>
        <span class="ml-20 fz-12">已选重量 {{selectData.weight}} 吨</span>
        <span class="ml-20 fz-12">已选数量 {{selectData.num}} 件</span>
      </el-row>

      <el-table ref="maStockTable"
                v-loading="listLoading"
                :data="maStockList" border highlight-current-row
                header-cell-class-name="table-header-bg text-center" row-class-name="tab-ellipsis pointer text-center"
                stripe
                height="545"
                @selection-change="handleSelectionChange"
                @row-click="handleRowClick"
                @row-dblclick="showSockFlow"
                style="width: 100%;margin-bottom:15px;">
        <el-table-column sortable type="selection" width="55"></el-table-column>
        <el-table-column sortable type="index" width="50" label="序号">
        </el-table-column>
        <el-table-column sortable v-for="element in columnList" :key="element.id" :prop="element.id" :label="getTableColumnName(element)" :width="element.columnWidth">
          <template slot-scope="scope">
            <span v-if="element.id === 'freezeWeight'">
              <svg-icon icon-class="lock" v-if="scope.row.freezeWeight >0"></svg-icon>
              <svg-icon icon-class="password" class-name="icon-color" v-else-if="scope.row.selectFlag > 0"></svg-icon>
            </span>
            <span v-if="element.id === 'operate'" style="color: #008de7;" @click="dispalyModel(scope.row,scope.$index)">跟踪</span>
            <span v-if="element.id === 'handCode'">{{scope.row.handCode}}</span>
            <span v-if="element.id === 'steelCode'">{{scope.row.steelCode}}</span>
            <span v-if="element.id === 'custId'">{{scope.row.cuName}}</span>
            <span v-if="element.id === 'typeId'">{{scope.row.typeName}}</span>
            <span v-if="element.id === 'specName'">{{scope.row.specName}}</span>
            <span v-if="element.id === 'parea'">{{scope.row.parea}}</span>
            <span v-if="element.id === 'grade'">{{scope.row.grade}}</span>
            <span v-if="element.id === 'validWeight2'">{{scope.row.validWeight2}}</span>
            <span v-if="element.id === 'storeWeight2'">{{scope.row.storeWeight2}}</span>
            <span v-if="element.id === 'validNum'">{{scope.row.validNum}}</span>
            <span v-if="element.id === 'weight2'">{{scope.row.weight2}}</span>
            <span v-if="element.id === 'weight4'">{{scope.row.weight4}}</span>
            <span v-if="element.id === 'weight1'">{{scope.row.weight1}}</span>
            <span v-if="element.id === 'num'">{{scope.row.num}}</span>
            <span v-if="element.id === 'position'">{{scope.row.storeName + " "
                      + (scope.row.positionRow?scope.row.positionRow + "行":"")
                      + (scope.row.positionColumn?scope.row.positionColumn + "排":"")}}</span>
            <span v-if="element.id === 'lengthRemark'">{{scope.row.lengthRemark}}</span>
            <span v-if="element.id === 'unit'">{{scope.row.unit}}</span>
            <span v-if="element.id === 'showDes'">{{scope.row.showDes}}</span>
            <span v-if="element.id === 'storeDate'">{{scope.row.storeDate}}</span>
            <span v-if="element.id === 'contractNo'">{{scope.row.contractNo}}</span>
            <span v-if="element.id === 'shipNo'">{{scope.row.shipNo}}</span>
            <span v-if="element.id === 'freezeDes'">{{scope.row.freezeDes}}</span>
            <span v-if="element.id === 'remark'">{{scope.row.remark}}</span>
            <span v-if="element.id === 'selectUserName'">{{scope.row.selectUserName}}</span>
            <span v-if="element.id === 'initCuName'">{{scope.row.initCuName}}</span>
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

      <el-dialog :visible.sync="dialogVisible" width="70%">
        <el-container style="height: 500px;">
          <el-main>
            <el-table :data="checkedRow" style="width: 100%" border header-cell-class-name="table-header-bg">
              <el-table-column sortable label="货物编号" prop="handCode"></el-table-column>
              <el-table-column sortable label="钢卷号" prop="steelCode"></el-table-column>
              <el-table-column sortable label="客户" prop="cuName"></el-table-column>
              <el-table-column sortable label="品名" prop="typeName"></el-table-column>
              <el-table-column sortable label="规格" prop="specName"></el-table-column>
              <el-table-column sortable label="产地" prop="parea"></el-table-column>
              <el-table-column sortable label="材质" prop="grade"></el-table-column>
              <el-table-column sortable label="可用重量" prop="validWeight2"></el-table-column>
              <el-table-column sortable label="可用数量" prop="validNum"></el-table-column>
              <el-table-column sortable label="锁定" prop="freezeWeight">
                <template slot-scope="scope">
                  <span v-if="scope.row.freezeWeight > 0 || scope.row.selectFlag > 0">已锁定</span>
                  <span v-else>未锁定</span>
                </template>
              </el-table-column>
            </el-table>

            <div class="grid-content bg-purple-light" style="width:100%;overflow:hidden;padding:30px 20px">
              <div class="images" style="height:500px;background-image:none" v-viewer="{inline: true, button: false,title:false, navbar: false,rotatable: false ,scalable: false}">
                <img v-for="src in picList" :src="src.picPath" :key="src.picPath" height="200" width="200">
              </div>
            </div>

            <h1>库存跟踪</h1>
            <el-table :data="maStockShadowList" style="width: 100%" border header-cell-class-name="table-header-bg">
              <el-table-column sortable label="类型" prop="changeTypeName"></el-table-column>
              <el-table-column sortable label="修改内容" prop="changeTypeDetailName"></el-table-column>
              <el-table-column sortable label="修改前" prop="fromValue"></el-table-column>
              <el-table-column sortable label="修改后" prop="toValue"></el-table-column>
              <el-table-column sortable label="修改人" prop="creatorName"></el-table-column>
              <el-table-column sortable label="修改时间" prop="createTime"></el-table-column>
            </el-table>
          </el-main>
        </el-container>
      </el-dialog>

      <div>
        <el-dialog :visible.sync="freezeDialogVisible" width="70%">
          <el-input v-model="reason" placeholder="请输入事由" type="textarea" :autosize="{ minRows: 2, maxRows: 4}">
          </el-input>
          <div slot="footer" class="dialog-footer">
            <el-button @click="freezeDialogVisible = false">取 消</el-button>
            <el-button v-if="freezeDialogStatus=='freeze'" type="primary" @click="freeze">确 定</el-button>
            <el-button v-else type="primary" @click="unFreeze">确 定</el-button>
          </div>
        </el-dialog>
      </div>

      <div>
        <el-dialog :visible.sync="importDialogVisible" width="30%" @close="clearFile"  >
          <el-upload action="123" :before-upload="beforeUpload"  :limit=1 :on-change="chooseFile">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button :disabled="!file" style="margin-left: 10px;" size="small" type="success" @click="submitUpload" v-loading.fullscreen.lock="lockScreen"  element-loading-text="正在导入，请稍后...">开始导入</el-button>
            <div slot="tip" class="el-upload__tip">注意：只能上传xls/xlsx文件</div>
            <div>{{filename}}</div>
          </el-upload>
        </el-dialog>
      </div>
    </div>

    <div v-if="pageState=='modify'">
      <modify :maStockList="modifyList" @hideModify="hideModify"></modify>
    </div>

    <div v-if="pageState=='columnConfig'">
      <column-config @hideColumnConfig="hideColumnConfig"></column-config>
    </div>
  </div>
</template>

<script>
  import { list, queryStockShadow, freeze, unfreeze, getMaStockColumn, checkimage, importFile, exportFile } from '@/api/warehousing/stock/maStock'
  import customerSelect from '@/components/ListCustomerSelect'
  import storeSelect from '@/components/storeSelect'
  import typeSelect from '@/components/typeSelect'
  import factorySelect from '@/components/factorySelect'
  import modify from './modify'
  import columnConfig from './columnConfig'
  import dateRange from '@/components/dateRange'
  import * as common from '@/utils'
  import 'viewerjs/dist/viewer.css'
  import Viewer from 'v-viewer'
  import Vue from 'vue'
  import { findPathByModuleCode } from '@/utils'
Vue.use(Viewer)

  export default {
    name: 'inventory',
    components: {
      customerSelect,
      storeSelect,
      modify,
      columnConfig,
      typeSelect,
      factorySelect,
      dateRange
    },
    computed: {
      tableHeader() {
        const temp = {}
        temp.validWeight2 = this.maStockList.reduce((pre, cur) => {
          return pre + parseFloat(cur.validWeight2)
        }, 0).toFixed(3)
        temp.storeWeight2 = this.maStockList.reduce((pre, cur) => {
          return pre + parseFloat(cur.storeWeight2)
        }, 0).toFixed(3)
        temp.validNum = this.maStockList.reduce((pre, cur) => {
          return pre + parseFloat(cur.validNum)
        }, 0)
        return temp
      },
      plusQueryOptions() {
        return this.columnAllList.filter(function(item) {
          return item.plusQuery
        })
      },
      selectData: function() {
        const temp = {}
        temp.weight = this.modifyList.reduce((pre, cur) => {
          // 净重
          return pre + parseFloat(cur.validWeight2)
        }, 0).toFixed(3)
        temp.num = this.modifyList.reduce((pre, cur) => {
          return pre + parseFloat(cur.num)
        }, 0)
        return temp
      }
    },
    data() {
      return {
        lockScreen: false,
        file: null,
        filename: '',
        importDialogVisible: false,
        selectList: [],
        listQuery: {
          pageNo: 1,
          pageSize: 20,
          storeId: '',
          specName: '',
          typeName: '',
          parea: '',
          grade: '',
          onlyInstore: '1',
          custId: '',
          steelCode: '',
          handCode: ''
        },
        total: 0,
        listLoading: false,
        pageState: '',
        onlyInstoreList: [
          { label: '全部', value: '-1' },
          { label: '在库', value: '1' },
          { label: '不在库', value: '0' }
        ],
        maStockList: [],
        modifyList: [],
        btnDisabled: true, // 控制 过户、提货、加工 按钮是否可以点击
        changeStBtnDisabled: true, // 转仓按钮是否可以点击
        modifyBtnDisabled: true, // 控制 修改按钮是否可以点击
        freezeBtnDisabled: true, // 控制冻结按钮是否可以点击
        unFreezeBtnDisabled: true, // 控制解冻按钮是否可以点击
        machBtnDisabled: true, // 控制加工按钮是否可以点击
        dialogVisible: false,
        freezeDialogVisible: false, // 用于是否显示冻结或解冻的填写理由弹出层
        freezeDialogStatus: '',
        checkedRow: [], // 用于查看选中查看跟踪的货物
        maStockShadowList: [], // 用户查看货物跟踪信息
        reason: '', // 用于冻结 或 解冻的是由
        columnList: [],
        columnAllList: [
          // { name: '', id: 'selection' },
          // { name: '序号', id: 'index' },
          { name: '锁定', id: 'freezeWeight', columnWidth: 70 },
          { name: '操作', id: 'operate', columnWidth: 70 },
          { name: '货物编号', id: 'handCode', columnWidth: 120 },
          { name: '钢卷号', id: 'steelCode', columnWidth: 120 },
          { name: '客户', id: 'custId' },
          { name: '品名', id: 'typeId' },
          { name: '规格', id: 'specName' },
          { name: '产地', id: 'parea' },
          { name: '材质', id: 'grade' },
          { name: '可用重量', id: 'validWeight2', columnWidth: 150, plusQuery: true, range: true },
          { name: '可用数量', id: 'validNum', columnWidth: 120, plusQuery: true, range: true },
          { name: '库存重量', id: 'storeWeight2', columnWidth: 150, plusQuery: true, range: true },
          { name: '抄码净重', id: 'weight2', plusQuery: true, range: true, columnWidth: 120 },
          { name: '抄码毛重', id: 'weight4', plusQuery: true, range: true, columnWidth: 120 },
          { name: '过磅重量', id: 'weight1', plusQuery: true, range: true, columnWidth: 120 },
          { name: '抄码数量', id: 'num', plusQuery: true, range: true, columnWidth: 120 },
          { name: '库位', id: 'position' },
          { name: '长度', id: 'lengthRemark', plusQuery: true },
          { name: '单位', id: 'unit', plusQuery: 'unit' },
          { name: '外观描述', id: 'showDes', plusQuery: true, columnWidth: 120 },
          { name: '进仓日期', id: 'storeDate', columnWidth: 140, plusQuery: true, date: true, value: [common.leastWeekDate()[0], common.leastWeekDate()[1]] },
          { name: '合同号', id: 'contractNo', plusQuery: true, columnWidth: 110 },
          { name: '船号', id: 'shipNo', plusQuery: true },
          { name: '锁定原因', id: 'freezeDes', columnWidth: 200, plusQuery: true },
          { name: '备注', id: 'remark', plusQuery: true },
          { name: '锁定人', id: 'selectUserName', plusQuery: true, columnWidth: 110 },
          { name: '卷面名称', id: 'initCuName', plusQuery: true }
        ],
        list: [
        ],
        plusFormArr: [],
        downloadLoading: false,
        picList: [],
        selectRow: null,
        shiftState: false
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
      }
      document.onkeyup = function(e) {
        const _key = window.event.keyCode
        if (_key === 16) {
          _this.shiftState = false
        }
      }
    },
    mounted() {
      // this.$refs.singleTable.toggleRowSelection(this.tableData[0])
      const _this = this
      document.onkeydown = function(e) { // shift事件
        const _key = window.event.keyCode
        if (_key === 13) {
          _this.search()
        }
      }
    },
    methods: {
      handleRadioChange(val) {
        this.search()
      },
      clearFile() {
        this.file = null
        this.filename = ''
      },
      chooseFile(file, filelist) {
        this.filename = file.name
      },
      beforeUpload(file) {
        this.file = file
        return false
      },
      submitUpload() {
        this.lockScreen = true
        const fd = new FormData()
        fd.append('file', this.file)
        importFile(fd).then(response => {
          this.$notify({
            title: '成功',
            message: '导入完成',
            type: 'success',
            duration: 2000
          })
          this.importDialogVisible = false
          this.lockScreen = false
          this.file = null
          this.search()
        }).catch(error => {
          this.lockScreen = false
          if (error) console.error(error)
        })
      },
      search() {
        this.listQuery.pageNo = 1
        this.getList()
      },
      getList() {
        this.listLoading = true
        const querys = Object.assign({}, this.listQuery) // 复制原查询参数
        // 拼接外加参数
        if (this.plusFormArr) {
          for (const arr of this.plusFormArr) {
            const name = arr.query.id.replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
            // debugger
            if (arr.query.date) {
              querys['from' + name] = arr.value[0]
              querys['to' + name] = arr.value[1]
            } else {
              if (arr.query.range) {
                querys['from' + name] = arr.value
                if (arr.toValue) {
                  querys['to' + name] = arr.toValue
                }
              } else {
                querys[arr.query.id] = arr.value
              }
            }
          }
        }
        list(querys)
          .then(response => {
            this.maStockList = response.mastocks
            this.modifyList = []
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
        getMaStockColumn().then(response => {
          if (response.maStockColumnVoList.length > 0) {
            this.columnList = response.maStockColumnVoList
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
      rowClick(row, event, column) {
        this.btnDisabled = false
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
      modifyMastock() {
        if (this.modifyList.length > 0) {
          this.pageState = 'modify'
        }
      },
      modifyColumnConfig() {
        this.pageState = 'columnConfig'
      },
      hideModify(refresh) {
        this.pageState = 'home'
        if (refresh) {
          this.getList()
        }
      },
      hideColumnConfig() {
        this.pageState = 'home'
        this.getColumnList()
      },
      handleSelectionChange(val) {
        this.modifyList = val
        if (this.modifyList.length === 0) {
          this.btnDisabled = true
          this.changeStBtnDisabled = true
          this.modifyBtnDisabled = true
          this.freezeBtnDisabled = true
          this.unFreezeBtnDisabled = true
          this.machBtnDisabled = true
        } else {
          this.btnDisabled = false
          this.changeStBtnDisabled = false
          this.modifyBtnDisabled = false
          this.freezeBtnDisabled = false
          this.unFreezeBtnDisabled = false
          this.machBtnDisabled = false
        }
        var custId = ''
        var storeId = ''
        for (const v of this.modifyList) {
          if (v.freezeWeight > 0) {
            this.unFreezeBtnDisabled = true
            this.modifyBtnDisabled = true
          }
          if (v.freezeWeight === 0) {
            this.freezeBtnDisabled = true
          }
          if (!custId) {
            custId = v.custId
          }
          if (!storeId) {
            storeId = v.storeId
          }
          if (custId !== v.custId || v.freezeWeight > 0 || v.selectFlag > 0 || v.validWeight2 <= 0 || v.validNum <= 0) {
            this.btnDisabled = true
            this.machBtnDisabled = true
          }
          if (custId !== v.custId || v.freezeWeight > 0 || v.selectFlag > 0 || v.validWeight2 <= 0 || v.validNum <= 0 || storeId !== v.storeId) {
            this.changeStBtnDisabled = true
          }
        }
      },
      dispalyModel(row, index) {
        // 模态框切换
        this.checkedRow = [row]
        this.getMaStockShadowList(row.id)
        this.dialogVisible = true
        if (row.handCode) {
          const param = {
            handCode: row.handCode
          }
          checkimage(param).then(response => {
            this.picList = response.stockPics // 获取table 明细
            // 排序图片
            if (this.picList && this.picList.length > 0) {
              const last = this.picList.pop()
              this.picList.unshift(last)
            }
          }).catch(error => {
            if (error) console.error(error)
          })
        }
      },
      getMaStockShadowList(id) {
        queryStockShadow({ 'id': id }).then(response => {
          this.maStockShadowList = response.stockShadowVoList
        })
      },
      openFreezeDialog(val) {
        this.freezeDialogVisible = true
        this.freezeDialogStatus = val
        this.reason = ''
      },
      freeze() {
        const data = {
          reason: this.reason,
          freezeIds: ''
        }
        for (const v of this.modifyList) {
          data.freezeIds += (v.id + ',')
        }
        freeze(data).then(response => {
          this.freezeDialogVisible = false
          this.getList()
        }).catch(error => {
          if (error) console.error(error)
        })
      },
      unFreeze() {
        const data = {
          reason: this.reason,
          freezeIds: ''
        }
        for (const v of this.modifyList) {
          data.freezeIds += (v.id + ',')
        }
        unfreeze(data).then(response => {
          this.freezeDialogVisible = false
          this.getList()
        }).catch(error => {
          if (error) console.error(error)
        })
      },
      outStore() {
        const data = {
          path: findPathByModuleCode('pickUpGoods'),
          query: {
            stockList: this.modifyList
          }
        }
        this.$router.push(data)
      },
      transferStore() {
        const data = {
          path: findPathByModuleCode('transferStore'),
          query: {
            stockList: this.modifyList
          }
        }
        this.$router.push(data)
      },
      transferGoods() {
        const data = {
          path: findPathByModuleCode('transferGoods'),
          query: {
            stockList: this.modifyList
          }
        }
        this.$router.push(data)
      },
      machOrder() {
        const data = {
          path: findPathByModuleCode('machOrder'),
          query: {
            stockList: this.modifyList
          }
        }
        this.$router.push(data)
      },
      handleRowClick(row, event, column) {
        // 兼容SHIFT键盘多选事件
        if (this.shiftState && this.selectRow) {
          for (let i = this.findIndex(this.selectRow); i <= this.findIndex(row); i++) {
            this.$refs.maStockTable.toggleRowSelection(this.maStockList[i], true)
          }
        } else {
          this.$refs.maStockTable.toggleRowSelection(row)
        }
        this.selectRow = row
      },
      findIndex(row) {
        for (let i = 0; i < this.maStockList.length; i++) {
          if (this.maStockList[i] === row) {
            return i
          }
        }
      },
      showSockFlow(row, event) {
        const data = {
          path: findPathByModuleCode('stockLog'),
          query: {
            handCode: row.handCode
          }
        }
        this.$router.push(data)
      },
      getTableColumnName(val) {
        if (val.id === 'validWeight2') {
          return '可用净重[' + this.tableHeader.validWeight2 + ']'
        } else if (val.id === 'storeWeight2') {
          return '库存净重[' + this.tableHeader.storeWeight2 + ']'
        } else if (val.id === 'validNum') {
          return '可用数量[' + this.tableHeader.validNum + ']'
        } else {
          return val.name
        }
      },
      addFormItem() {
        this.plusFormArr.push({
          key: Date.now(),
          query: {},
          range: false,
          value: '',
          toValue: ''
        })
      },
      handleDownload() {
        this.downloadLoading = true
        const querys = Object.assign({}, this.listQuery) // 复制原查询参数
        // 拼接外加参数
        if (this.plusFormArr) {
          for (const arr of this.plusFormArr) {
            const name = arr.query.id.replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
            // debugger
            if (arr.query.date) {
              querys['from' + name] = arr.value[0]
              querys['to' + name] = arr.value[1]
            } else {
              if (arr.query.range) {
                querys['from' + name] = arr.value
                if (arr.toValue) {
                  querys['to' + name] = arr.toValue
                }
              } else {
                querys[arr.query.id] = arr.value
              }
            }
          }
        }
        querys.pageNo = 1
        querys.pageSize = 999999
        exportFile(querys).then(response => {
          var blob = new Blob([response], { type: 'application/vnd.ms-excel' })
          var url = URL.createObjectURL(blob)
          window.open(url)
          this.downloadLoading = false
        }).catch(() => {
          this.$message('导出失败')
          this.downloadLoading = false
        })
        // 前端导出
        // this.maStockList.forEach(function(item, index) {
        //   item.index = index + 1
        //   item.position = item.storeName + '' + item.positionRow + '行' + item.positionColumn + '排'
        //   item.lock = item.freezeWeight > 0 || item.selectFlag > 0 ? '已锁定' : '未锁定'
        // })
        // require.ensure([], () => {
        //   // debugger
        //   const { export_json_to_excel } = require('@/vendor/Export2Excel')
        //   const tHeader = []
        //   const filterVal = []
        //   tHeader.push('序号')
        //   filterVal.push('index')
        //   for (const v of this.columnList) {
        //     if (v.id === 'operate') {
        //       continue
        //     } else if (v.id === 'typeId') {
        //       filterVal.push('typeName')
        //     } else if (v.id === 'freezeWeight') {
        //       filterVal.push('lock')
        //     } else {
        //       filterVal.push(v.id)
        //     }
        //     tHeader.push(v.name)
        //   }
        //   const data = this.formatJson(filterVal, this.maStockList)
        //   export_json_to_excel(tHeader, data, '原料库存资料')
        // this.downloadLoading = false
        // })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      }
    }
  }
</script>

<style lang="scss">
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
  .query-range-wight{
    width: 40%;
  }
  .addIcon{
    display: inline-block;
    vertical-align: top;
    margin-top:7px;
    margin-left: 55px;
    margin-bottom: 10px;
  }
  .ml-select{
    display: inline-block;
    vertical-align: top;
    margin-left: 40px;
  }

</style>
