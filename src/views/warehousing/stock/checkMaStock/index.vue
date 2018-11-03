<template>
  <div class="app-container">
    <!--<home v-show="BUS.path === 'home'" :BUS="BUS" ref="home"></home>-->
    <div class="stock-check" v-show="BUS.path === 'home'">
      <el-row class="form-wrap">
        <el-form :inline="true" size="small" label-width="80px">
          <el-form-item label="单据日期">
            <date-range :is-edit="true" v-model="listQuery.dateArr"></date-range>
          </el-form-item>
          <el-form-item label="仓库">
            <el-select filterable clearable v-model="listQuery.storeId">
              <el-option v-for="item in storeList" :value="item.id" :label="item.storeName" :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单据编号">
            <el-input v-model="listQuery.blno"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <list-status-radio v-model="listQuery.listStatus" @change="handleRadioChange"></list-status-radio>
          </el-form-item>
          <el-form-item label="　">
            <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>

      <el-row class='el-row-header'>
        <el-button type="primary" @click="audit" :disabled="btnDisabled" icon= "el-icon-tickets">处理</el-button>
        <el-button type="primary" @click="back" :disabled="btnDisabled" icon= "el-icon-back">退回</el-button>
        <el-button type="danger" @click="del" :disabled="btnDisabled" icon= "el-icon-delete">删除</el-button>
      </el-row>

      <el-table ref="singleTable"
                v-loading="listLoading"
                row-class-name="pointer"
                :data="list" border highlight-current-row height="545" stripe
                @row-click="rowClick"
                header-cell-class-name="table-header-bg"
                @cell-dblclick="rowDbclick" style="width: 100%;margin-bottom:15px;">
        <el-table-column sortable type="index" width="50" label="序号" header-align="center" align="center">
        </el-table-column>
        <el-table-column sortable prop="blno" label="单据编号" header-align="center" align="center" min-width="160">
        </el-table-column>
        <el-table-column sortable prop="storeName" label="仓库" header-align="center" align="center">
        </el-table-column>
        <el-table-column sortable prop="curStockNum" label="应盘" header-align="center" align="center">
        </el-table-column>
        <el-table-column sortable prop="norNum" label="正常" header-align="center" align="center">
        </el-table-column>
        <el-table-column sortable prop="diffNum" label="差异" header-align="center" align="center">
        </el-table-column>
        <el-table-column sortable prop="lessNum" label="少盘" header-align="center" align="center">
        </el-table-column>
        <el-table-column sortable prop="newNum" label="多盘" header-align="center" align="center">
        </el-table-column>
        <el-table-column sortable label="状态" header-align="center" align="center" min-width="230">
          <template slot-scope="scope">
            <span v-if="scope.row.status > 0" style="color: #008de7;">{{scope.row.stateLabel}}</span>
            <span v-else>{{scope.row.stateLabel}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable prop="createTime" label="单据日期" min-width="150" header-align="center" align="center">
        </el-table-column>
        <el-table-column sortable prop="creatorName" label="制单人" header-align="center" align="center">
        </el-table-column>
      </el-table>

      <div class="block">
        <div style="width:95%;text-align:right">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNo"
                         :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                         :total="total">
          </el-pagination>
        </div>
      </div>

    </div>
    <check v-show="BUS.path === 'check'" :BUS="BUS" ref="checkStock"></check>
  </div>
</template>

<script>
  /**
   * 注意 components 的名字要和控制器的字符串一致
   * */
  // import { mapGetters } from 'vuex'
  // import home from './home' // 主页
  import check from './check'
  import { mapGetters } from 'vuex'
  import dateRange from '@/components/dateRange'
  import customerSelect from '@/components/customerSelect'
  import listStatusRadio from '@/components/listStatusRadio'
  import * as api from '@/api/warehousing/stock/checkMaStock'
  import * as common from '@/utils'

  export default {
    name: 'checkMaStock',
    components: {
      // home,
      check, dateRange, customerSelect, listStatusRadio
    },
    computed: {
      ...mapGetters(['storeList']),
      // tableHeader() {
      //   const temp = {}
      //   temp.weight = this.homeList.reduce((pre, cur) => {
      //     return pre + parseFloat(cur.weightSum)
      //   }, 0).toFixed(3)
      //   temp.num = this.homeList.reduce((pre, cur) => {
      //     return pre + parseFloat(cur.numSum)
      //   }, 0)
      //   temp.amountSum = this.homeList.reduce((pre, cur) => {
      //     return pre + parseFloat(cur.amountSum)
      //   }, 0).toFixed(3)
      //   return temp
      // },
      auditMsg: function() {
        if (this.BUS.selectRow && this.BUS.selectRow.status === 1) {
          return '反审核'
        } else {
          return '审核'
        }
      }
    },
    activated() {
      if (JSON.stringify(this.$route.query) !== '{}') {
        this.BUS.path = this.$route.query.path
        this.$refs.checkStock.getCheckStockList()
      }
    },
    mounted() {
      // 加载组件引用
      // this.BUS.ref = {
      //   home: this.$refs.home,
      //   check: this.$refs.checkStock
      // }
      this.getList()
      const _this = this
      document.onkeydown = function(e) { // shift事件
        const _key = window.event.keyCode
        if (_key === 13) {
          _this.search()
        }
      }
    },
    data() {
      return {
        BUS: { // 共享数据
          path: 'home',
          action: '',
          oldAction: '', // 记录旧action
          showSelectGoods: false, // 货物选择显示
          selectRow: null, // 选择行
          changeView: function(params) {
            if (typeof params === 'string') {
              this.path = params
            } else if (params instanceof Object) {
              this.oldAction = this.action
              Object.assign(this, params)
            }
          }
        },
        total: 0,
        listLoading: false,
        listQuery: {
          pageNo: 1,
          pageSize: 20,
          dateArr: [common.leastWeekDate()[0], common.leastWeekDate()[1]],
          storeId: '',
          blno: '',
          listStatus: 3
        },
        list: [],
        btnDisabled: true
      }
    },
    methods: {
      handleRadioChange(val) {
        this.search()
      },
      getList() {
        if (this.listQuery.dateArr && this.listQuery.dateArr.length > 0) {
          this.listQuery.fromDate = this.listQuery.dateArr[0]
          this.listQuery.toDate = this.listQuery.dateArr[1]
        } else {
          this.listQuery.fromDate = null
          this.listQuery.toDate = null
        }
        this.listLoading = true
        api.list(this.listQuery).then((response) => {
          this.list = response.checkMas
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
      rowClick(row, event, column) {
        this.BUS.selectRow = row
        this.btnDisabled = row.status !== 0
      },
      rowDbclick(row) {
        this.BUS.selectRow = row
        this.BUS.changeView('check')
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.pageNo = val
        this.getList()
      },
      audit() {
        if (!this.BUS.selectRow) {
          this.$message.warning('请选择先选择要处理的行')
          return
        }
        this.$confirm('确认处理该盘点单？', '温馨提示', { type: 'warning' }).then(() => {
          api.audit({ id: this.BUS.selectRow.id }).then(response => {
            this.$notify({
              title: '成功',
              message: '处理成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        })
      },
      back() {
        if (!this.BUS.selectRow) {
          this.$message.warning('请选择先选择要处理的行')
          return
        }
        this.$confirm('确定回退该盘点单？', '温馨提示', { type: 'warning' }).then(() => {
          api.back({ id: this.BUS.selectRow.id }).then(response => {
            this.$notify({
              title: '成功',
              message: '回退成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        })
      },
      del() {
        if (!this.BUS.selectRow) {
          this.$message.warning('请选择先选择要处理的行')
          return
        }
        this.$confirm('确定删除该盘点单?', '提示', { type: 'warning' }).then(() => {
          api.del({ id: this.BUS.selectRow.id }).then(response => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        })
      }
    },
    watch: {
      // 监听页面显示状态变化
      'BUS.path': function(val) {
        // 新增页面
        if (val === 'home') {
          this.getList()
        }
      }
    }
  }
</script>

<style scoped>

</style>
