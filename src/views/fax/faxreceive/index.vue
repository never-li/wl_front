<template>
  <div class="app-container">
    <div v-show="action==='home'">
    <div class="form-wrap" >
      <el-form :inline="true" size="small" label-width="80px">
        <el-row>
        <el-form-item label="单据日期">
          <date-range :is-edit="true" v-model="dateArr"></date-range>
        </el-form-item>
        <el-form-item label="客户">
          <customer-select v-model="searchItem.custId"></customer-select>
        </el-form-item>
        <el-form-item label="传真号">
          <el-input v-model="searchItem.cuTel" class="input-w-168"></el-input>
        </el-form-item>
          <el-form-item label="" class="search_label">
        <el-button  type="primary" @click="search" size="mini" icon="el-icon-search">查询</el-button>
            </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="业务类型">
            <el-radio-group v-model="searchItem.faxType" @change="handleRadioChange">
              <el-radio v-for="item in faxTypeList" :label="item.label" :key="item.label">{{item.name}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="处理状态">
            <el-radio-group v-model="searchItem.isDo" @change="handleRadioChange">
              <el-radio v-for="item in isDoList" :label="item.label" :key="item.label">{{item.name}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
      </el-form>
    </div>


    <el-table :data="list" element-loading-text="给我一点时间" v-loading="listLoading" border fit highlight-current-row stripe height="545"
              @current-change="handleCurrentChange" @row-click="showImgDialog" header-cell-class-name="table-header-bg text-center"
              style="width: 100%">
      <el-table-column sortable align="center" label="序号" type="index">
      </el-table-column>
      <el-table-column sortable align="center" label="客户" prop="cuName"></el-table-column>
      <el-table-column sortable align="center" label="传真号" prop="cuTel"></el-table-column>
      <el-table-column sortable align="center" label="页数" prop="cuTel"></el-table-column>
      <el-table-column sortable align="center" label="业务类型" prop="faxType">
        <template slot-scope="scope">
          <span v-if="scope.row.faxType == 0" >其它</span>
          <span v-else-if="scope.row.faxType == 1">加工</span>
          <span v-else-if="scope.row.faxType == 2">提货</span>
          <span v-else >转货</span>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" label="传真接收时间" prop="endTime"></el-table-column>
      <el-table-column sortable align="center" label="处理人" prop="doUserName"></el-table-column>
      <el-table-column sortable align="center" label="处理状态" prop="isDo">
        <template slot-scope="scope">
          <span v-if="scope.row.isDo == 0" >未处理</span>
          <span v-else style="color:#008de7;">已处理</span>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" label="微信推送状态" prop="wxPushType"></el-table-column>
      <el-table-column sortable align="center" label="备注" prop="remark"></el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handlePageChange"
                     :current-page="searchItem.pageNo" :page-sizes="[10,20,30, 50]" :page-size="searchItem.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%" :fullscreen="1==1"  >
      <el-form label-position="right" :inline="true" ref="dataForm"
               label-width="130px">
        <el-row style="background:#f2f2f2;padding:10px 20px;">
          <el-button v-show="currentRow&&currentRow.isDo == 0" type="primary" @click="deal" >确认处理</el-button>
          <el-button  v-show="currentRow&&currentRow.isDo == 1" type="primary" @click="undeal" >撤销处理</el-button>
          <el-button  type="primary" @click="printImg">打印</el-button>
        </el-row>
        <el-row>
          <el-form-item label="业务类型">
            <el-radio-group v-model="formParam.faxType" :disabled="currentRow==null||currentRow.isDo==1">
              <el-radio v-for="item in faxTypeList" :label="item.label" :key="item.label">{{item.name}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="办单处理" >
            <el-checkbox-group v-model="formParam.billType" :disabled="currentRow==null||currentRow.isDo==1">
              <el-checkbox v-for="item in billTypeList" :label="item.label" :key="item.label" >{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="备注" >
              <el-input type="textarea" v-model="formParam.remark" style="width:600px;" :disabled="currentRow==null||currentRow.isDo==1"></el-input>
          </el-form-item>
          <hr>
        </el-row>
        <el-row>
          <div class="images" style="height:500px;background-image:none"
               v-viewer="{inline: true, button: false,title:false, navbar: false,rotatable: false ,scalable: false,}">
            <img v-for="src in picList" :src="src.picPath" :key="src.picPath" height="200" width="200">
          </div>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
  </span>
    </el-dialog>
    </div>
    <!--打印用到的隐藏域-->
    <div style="display: none">
      <div id="printArea">
        <img v-for="src in picList" :src="src.picPath" :key="src.picPath">
      </div>
    </div>


    <views v-if="action=='views'" :currentRow="currentRow" @jump="jump" :picList="picList"></views>
  </div>
</template>

<script>
  import * as api from '@/api/fax/faxreceive/faxreceive'
  import * as common from '@/utils'
  import dateRange from '@/components/dateRange'
  import customerSelect from '@/components/customerSelect'
  import views from './views'
  import 'viewerjs/dist/viewer.css'
  import Viewer from 'v-viewer'
  import Vue from 'vue'
  import { findPathByModuleCode } from '@/utils'

Vue.use(Viewer)

  export default {
    name: 'faxreceive',
    components: {
      dateRange,
      customerSelect,
      views
    },
    data() {
      return {
        list: [],
        listLoading: false,
        dateArr: [common.leastWeekDate()[0], common.leastWeekDate()[1]],
        faxTypeList: [
          { 'label': 3, 'name': '转货' },
          { 'label': 1, 'name': '加工' },
          { 'label': 2, 'name': '提货' },
          { 'label': 0, 'name': '其它' },
          { 'label': '', 'name': '全部' }
        ],
        isDoList: [
          { 'label': 0, 'name': '未处理' },
          { 'label': 1, 'name': '已处理' },
          { 'label': '', 'name': '全部' }
        ],
        searchItem: {
          custId: '',
          cuTel: '',
          faxType: '',
          pageSize: 10,
          pageNo: 1,
          isDo: '',
          fromEndTime: '',
          toEndTime: ''
        },
        billTypeList: [
          { 'label': 2, 'name': '原料转货' },
          { 'label': 6, 'name': '原料提货' },
          { 'label': '28-1', 'name': '原料加工' },
          { 'label': 30, 'name': '成品转货' },
          { 'label': 7, 'name': '成品提货' },
          { 'label': '28-2', 'name': '成品加工' }
        ],
        formParam: {
          billType: [],
          remark: '',
          faxType: 3
        },
        picList: [],
        currentRow: null,
        isSelectRow: false,
        total: 0,
        dialogVisible: false,
        dialogTitle: '传真处理',
        defaultData: null,
        doType: 0,
        action: 'home',
        clickTime: 0,
        diff: 0
      }
    },
    mounted() {
      this.defaultData = JSON.parse(JSON.stringify(this.formParam))
      this.getList()
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
      jump(action) {
        if (action === 'views') {
          this.showFaxImg(this.currentRow.id, this.currentRow.pageSize)
        }
        this.action = action
      },
      deal() {
        api.updateIsDo(this.currentRow.id, 1, this.formParam.remark, this.formParam.faxType).then(res => {
          this.dialogVisible = false
          this.$notify({
            title: '成功',
            message: '处理成功',
            type: 'success',
            duration: 2000
          })
          // 跳转勾选的办单页面
          this.handleBill()
          this.getList()
        })
      },
      undeal() {
        api.updateIsDo(this.currentRow.id, 0, null, null).then(res => {
          this.dialogVisible = false
          this.$notify({
            title: '成功',
            message: '撤销处理成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      },
      // 弹出框与视图组件显示页作单双击事件兼容处理(通过点击时间差来判断单击或双击)
      showImgDialog() {
        const tmp = this
        setTimeout(function() {
          if ((tmp.diff === 0 || tmp.diff > 500) && tmp.action !== 'views') {
            tmp.clickTime = 0
            tmp.diff = 0
            tmp.showFaxImg(tmp.currentRow.id, tmp.currentRow.pageSize)
            tmp.formParam.remark = tmp.currentRow.remark
            tmp.formParam.faxType = tmp.currentRow.faxType
            tmp.dialogVisible = true
          }
        }, 500)

        const now = new Date().getTime()
        if (this.clickTime === 0) {
          this.clickTime = now
          // console.log(now + '---' + this.clickTime + '---' + this.diff)
        } else {
          this.diff = now - this.clickTime
          // console.log(now + '---' + this.clickTime + '---' + this.diff)
          if (this.diff > 0 && this.diff < 500) {
            this.clickTime = 0
            this.diff = 0
            this.jump('views')
            return
          }
        }
      },
      showFaxImg(faxId, pageSize) {
        this.picList = []
        for (let i = 1; i <= pageSize; i++) {
          api.getImg(faxId, i).then(res => {
            this.picList.push({ 'picPath': window.URL.createObjectURL(res) })
          })
        }
      },
      search() {
        this.searchItem.pageNo = 1
        this.getList()
      },
      getList() {
        this.listLoading = true
        this.searchItem.fromEndTime = this.dateArr[0]
        this.searchItem.toEndTime = this.dateArr[1]
        api.list(this.searchItem).then(response => {
          this.list = response.faxReceives
          this.total = response.dataSize
          this.listLoading = false
        })
      },
      handleCurrentChange(val) {
        this.currentRow = val
        this.isSelectRow = true
      },
      handleSizeChange(val) {
        this.searchItem.pageSize = val
        this.getList()
      },
      handlePageChange(val) {
        this.searchItem.pageNo = val
        this.getList()
      },
      handleBill() {
        this.formParam.billType.forEach((item, index) => {
          const data = {
            path: this.getPathByBillType(item),
            query: {
              custId: this.currentRow.custId,
              faxType: this.formParam.faxType,
              faxId: this.currentRow.id,
              // 由于原料加工和成品加工合拼在同一页面，跳转时需要用该变量区分
              type: item === '28-1' ? 'ma' : item === '28-2' ? 'pd' : ''
            }
          }
          // 延时执行防止事件堵塞（600毫秒是根据实际测试得出的最佳响应时间）
          const tmp = this
          setTimeout(function() {
            tmp.$router.push(data)
          }, 600 * index)
        })
      },
      getPathByBillType(billType) {
        let path = ''
        switch (billType) {
          case 2: path = findPathByModuleCode('transferGoods'); break // 原料转货
          case 6: path = findPathByModuleCode('pickUpGoods'); break // 原料提货
          case '28-1': path = findPathByModuleCode('machOrder'); break // 原料加工
          case 30: path = findPathByModuleCode('changepd'); break // 成品转货
          case 7: path = findPathByModuleCode('outStorePd'); break // 成品提货
          case '28-2': path = findPathByModuleCode('machOrder'); break // 成品加工
          default: console.log('路径获取异常！未知单据类型')
        }
        return path
      },
      // 打印图片
      printImg() {
        const printArea = document.getElementById('printArea')
        document.body.innerHTML = printArea.innerHTML
        window.print()
        // 页面内容已经改变，只能重新加载
        window.location.reload()
      }
    }
  }
</script>

<style lang="scss">

  .el-dialog__body{
    padding:0;
  }

</style>
