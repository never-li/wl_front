<template>
  <div class="stock-table-wrap">
    <slot name="header"></slot>
    <el-table :data="tableData"
              stripe
              max-height="545"
              border highlight-current-row
              header-cell-class-name="table-header-bg text-center"
              row-class-name="pointer text-center tab-ellipsis"
              @row-click="handleRowClick"
              @row-dblclick="handleRowDbClick"
              style="width: 100%;margin-bottom:15px;">
      <el-table-column sortable type="index" label="序号" width="50" fixed="left"></el-table-column>
      <el-table-column sortable label="盘点状态" prop="cstatusName" fixed="left" v-if="tabName==='all'">
        <template slot-scope="scope">
          <span :class="scope.row.cstatusName === '差异' ? 'table-color-red' :
                        scope.row.cstatusName === '少盘' ? 'table-color-green' :
                        scope.row.cstatusName === '多盘' ? 'table-color-blue' : ''
                        ">
            {{scope.row.cstatusName}}
          </span>
        </template>
      </el-table-column>
      <el-table-column sortable label="处理状态" prop="mbStatus" fixed="left" v-if="tabName==='diff'">
        <template slot-scope="scope">
          <span :class="scope.row.mbStatus === 0 ? 'table-color-red' :'table-color-green'">
            {{scope.row.mbStatus===0?'未处理':'已处理'}}
          </span>
        </template>
      </el-table-column>
      <el-table-column sortable label="pic" fixed="left">
      <template slot-scope="scope">
        <!--<span @click="lookPic(scope.row)">图片</span>-->
        <i class="el-icon-picture" @click="lookPic(scope.row)"></i>
      </template>
    </el-table-column>
      <el-table-column sortable label="货物编号" prop="handCode" width="100" fixed="left"></el-table-column>
      <el-table-column sortable label="锁定">
        <template slot-scope="scope">
          <span>
              <svg-icon icon-class="lock" v-if="scope.row.freezeWeight >0"></svg-icon>
              <svg-icon icon-class="password" class-name="icon-color" v-else-if="scope.row.selectFlag > 0"></svg-icon>
            </span>
        </template>
      </el-table-column>
      <el-table-column sortable label="锁定原因" prop="freezeDes" width="120"></el-table-column>
      <el-table-column sortable label="钢卷号" prop="steelCode" width="150"></el-table-column>
      <el-table-column sortable label="客户" prop="cuName" width="180"></el-table-column>
      <el-table-column sortable label="品名" prop="typeName"></el-table-column>
      <el-table-column sortable label="规格" prop="specName"></el-table-column>
      <el-table-column sortable label="产地" prop="parea"></el-table-column>
      <el-table-column sortable label="材质" prop="grade"></el-table-column>
      <el-table-column sortable :label="'净重['+tableHeader.weight2+']'"
                       prop="weight2"  width="160">
      </el-table-column>
      <el-table-column sortable :label="'磅重['+tableHeader.weight1+']'"
                       prop="weight1"  width="160">
      </el-table-column>
      <el-table-column sortable :label="'毛重['+tableHeader.weight4+']'"
                       prop="weight4" width="160">
      </el-table-column>
      <el-table-column sortable label="数量" prop="num"></el-table-column>
      <el-table-column sortable label="长度" prop="lengthRemark"></el-table-column>
      <el-table-column sortable label="单位" prop="unit"></el-table-column>
      <el-table-column sortable label="行数" prop="positionRow"></el-table-column>
      <el-table-column sortable label="排数" prop="positionColumn"></el-table-column>
      <el-table-column sortable label="外观" prop="showDes" width="100"></el-table-column>
      <el-table-column sortable label="合同号" prop="contractNo" width="150"></el-table-column>
      <el-table-column sortable label="船号" prop="shipNo"></el-table-column>
      <el-table-column sortable label="归档号" prop="guidangNo"  width="150"></el-table-column>
      <el-table-column sortable label="卷面名称" prop="initCuName"  width="150"></el-table-column>
      <el-table-column sortable label="备注" prop="remark"></el-table-column>
      <el-table-column sortable label="盘点人" prop="creatorName" width="100"></el-table-column>
      <el-table-column sortable label="盘点时间" prop="createTime" width="160"></el-table-column>
    </el-table>
    <slot name="footer"></slot>

    <el-dialog :visible.sync="dialogVisible" width="70%">
      <span slot="title" class="dialog-title">
          <el-button type="primary" @click="dialogVisible = false">返 回</el-button>
      </span>
      <div class="dialog-body">
        <el-row>
            <div class="grid-content bg-purple-light" style="width:100%;overflow:hidden;padding:30px 20px">
              <div class="images" style="height:500px;background-image:none" v-viewer="{inline: true, button: false,title:false, navbar: false,rotatable: false ,scalable: false,}">
                <img v-for="src in picList" :src="src.picPath" :key="src.picPath" height="200" width="200">
              </div>
            </div>
        </el-row>
      </div>

    </el-dialog>

  </div>
</template>

<script>
  import 'viewerjs/dist/viewer.css'
  import Viewer from 'v-viewer'
  import Vue from 'vue'
  Vue.use(Viewer)
  import * as api from '@/api/warehousing/stock/checkMaStock'
  import { findPathByModuleCode } from '@/utils'
  export default {
    name: 'stock-table',
    props: {
      tableData: Array,
      tabName: String
    },
    computed: {
      tableHeader: function() {
        const temp = {}
        temp.weight4 = this.tableData.reduce((pre, cur) => {
          return pre + cur.weight4
        }, 0)
        temp.weight2 = this.tableData.reduce((pre, cur) => {
          return pre + cur.weight2
        }, 0)
        temp.weight1 = this.tableData.reduce((pre, cur) => {
          return pre + cur.weight1
        }, 0)
        temp.weight1 = temp.weight1.toFixed(3)
        temp.weight2 = temp.weight2.toFixed(3)
        temp.weight4 = temp.weight4.toFixed(3)
        return temp
      }
    },
    data() {
      return {
        selectRow: {},
        picList: [],
        dialogVisible: false
      }
    },
    methods: {
      lookPic(row) {
        const param = {
          handCode: row.handCode
        }
        api.checkImage(param).then(response => {
          this.picList = response.stockPics // 获取table 明细
          this.dialogVisible = true
        })
          .catch(error => {
            if (error) console.error(error)
          })
      },
      handleRowClick(row, event, column) {
        if (this.tabName === 'diff') {
          this.selectRow = row
          this.$emit('getDtList')
        }
      },
      handleRowDbClick(row, event, column) {
        this.toGoodsFlow(row)
      },
      toGoodsFlow(row) {
        this.$router.push({ path: findPathByModuleCode('stockLog'), query: { handCode: row.handCode }})
      }
    }
  }
</script>

<style lang="scss">
  .stock-table-wrap {
    /*.table-header-bg{*/
    /*background: #f5f7fa;*/
    /*}*/
  }
</style>
