<template>
  <div class="rowSelect-table-wrap">
    <slot name="header"></slot>
    <el-table :data="tableData"
              ref="table"
              stripe
              max-height="545"
              @row-click="handleRowClick"
              @selection-change="handleSelectionChange"
              :row-class-name="tableRowClassName" border
              header-cell-class-name="table-header-bg text-center"
              style="width: 100%;margin-bottom:15px;">
      <el-table-column sortable type="selection" width="50" :selectable="selectable"></el-table-column>
      <el-table-column sortable type="index" label="序号" fixed="left"></el-table-column>
      <el-table-column sortable label="处理状态" prop="mbStatus" fixed="left">
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
      <el-table-column sortable label="锁定" prop="getFreezeWeightLabel">
        <template slot-scope="scope">
          <span>
              <svg-icon icon-class="lock" v-if="scope.row.freezeWeight >0"></svg-icon>
              <svg-icon icon-class="password" class-name="icon-color" v-else-if="scope.row.selectFlag > 0"></svg-icon>
            </span>
        </template>
      </el-table-column>
      <el-table-column sortable label="锁定原因" prop="freezeDes" min-width="120"></el-table-column>
      <el-table-column sortable label="钢卷号" prop="steelCode" min-width="150"></el-table-column>
      <el-table-column sortable label="客户" prop="cuName" min-width="180"></el-table-column>
      <el-table-column sortable label="品名" prop="typeName" min-width="120"></el-table-column>
      <el-table-column sortable label="规格" prop="specName" min-width="120"></el-table-column>
      <el-table-column sortable label="产地" prop="parea" min-width="120"></el-table-column>
      <el-table-column sortable label="材质" prop="grade"></el-table-column>
      <el-table-column sortable :label="'净重['+tableHeader.weight2+']'"
                       prop="weight2"  min-width="100">
      </el-table-column>
      <el-table-column sortable :label="'磅重['+tableHeader.weight1+']'"
                       prop="weight1"  min-width="100">
      </el-table-column>
      <el-table-column sortable :label="'毛重['+tableHeader.weight4+']'"
                       prop="weight4" min-width="100">
      </el-table-column>
      <el-table-column sortable label="数量" prop="num"></el-table-column>
      <el-table-column sortable label="长度" prop="lengthRemark"></el-table-column>
      <el-table-column sortable label="单位" prop="unit"></el-table-column>
      <el-table-column sortable label="行数" prop="positionRow"></el-table-column>
      <el-table-column sortable label="排数" prop="positionColumn"></el-table-column>
      <el-table-column sortable label="外观" prop="showDes" width="100"></el-table-column>
      <el-table-column sortable label="合同号" prop="contractNo" width="150"></el-table-column>
      <el-table-column sortable label="船号" prop="shipNo"></el-table-column>
      <el-table-column sortable label="归档号" prop="guidangNo"></el-table-column>
      <el-table-column sortable label="卷面名称" prop="initCuName"  width="150"></el-table-column>
      <el-table-column sortable label="备注" prop="remark"></el-table-column>
      <el-table-column sortable label="盘点人" prop="creatorName"></el-table-column>
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

  export default {
    name: 'rowSelect-table',
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
        selectionList: [],
        loading: false,
        picList: [],
        dialogVisible: false
      }
    },
    methods: {
      tableRowClassName({ row, rowIndex }) {
        for (let i = 0; i < this.selectionList.length; i++) {
          if (this.selectionList[i].id === row.id) {
            return 'table-select-bgcolor pointer text-center tab-ellipsis'
          }
        }
        return 'pointer text-center tab-ellipsis'
      },
      lookPic(row) {
        const param = {}
        if (this.tabName === 'new') {
          param.checkFlag = true
        }
        param.handCode = row.handCode
        api.checkImage(param).then(response => {
          this.picList = response.stockPics // 获取table 明细
          this.dialogVisible = true
        })
          .catch(error => {
            if (error) console.error(error)
          })
      },
      handleSelectionChange(val) {
        if (val.length) {
          this.$emit('selectionishowBnt', false)
        } else {
          this.$emit('selectionishowBnt', true)
        }
        if (this.tabName === 'new' && val.length > 1 && val[0].custId !== val[val.length - 1].custId) {
          this.$message('不同货主的货物不能同时生成进仓')
          this.$refs.table.toggleRowSelection(val[val.length - 1])
        } else {
          this.selectionList = val
        }
      },
      handleRowClick(row, event, column) {
        this.loading = true
        if (row.mbStatus === 0) {
          this.$refs.table.toggleRowSelection(row)
        }
        if (this.tabName === 'diff') {
          this.selectRow = row
          this.$emit('getDtList')
        }
      },
      selectable(row, index) {
        return row.mbStatus === 0
      }
    }
  }
</script>

<style lang="scss">
  .rowSelect-table-wrap {
    /*.table-header-bg{*/
    /*background: #f5f7fa;*/
    /*}*/

  }
</style>
