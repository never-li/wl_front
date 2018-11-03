<template>
  <div >
    <div style="padding-bottom: 10px;">
      <span>分条成品</span>
      <span class="fz-12">原料总重{{maWeight}}吨 - 成品总重{{pdWeight}}吨 - 卷回总重{{rollBackWeight}}吨 = 重量差异：{{(maWeight-pdWeight-rollBackWeight).toFixed(3)}}吨</span>
    </div>
    <el-table
      :data="slitPdList"
      ref="slitPdTable"
      row-key="id"
      :header-cell-class-name="setHeaderClass"
      border highlight-current-row
      row-class-name="pointer text-center tab-ellipsis"
      stripe
      max-height="500"
    >
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column sortable label="包装编号" prop="blno" min-width="120"></el-table-column>
      <el-table-column sortable label="原料编号" prop="handCodes" min-width="120"></el-table-column>
      <el-table-column sortable label="钢卷号" prop="steelCodes" min-width="150"></el-table-column>
      <el-table-column sortable label="成品规格" prop="specAllPd" min-width="250"></el-table-column>
      <el-table-column sortable :label="'理重['+slitPdTableHeader.weight+']'" prop="weight" min-width="120"></el-table-column>
      <el-table-column sortable :label="'磅重['+slitPdTableHeader.weight1+']'" prop="weight1" min-width="120"></el-table-column>
      <el-table-column sortable label="仓库" prop="storeName"></el-table-column>
      <el-table-column sortable label="加工机台" prop="machineName"></el-table-column>
      <el-table-column sortable label="加工班长" prop="userName"></el-table-column>
      <el-table-column sortable label="包装日期" prop="bldate"></el-table-column>
      <el-table-column sortable label="包装备注" prop="remark"></el-table-column>
    </el-table>
    <div style="padding-bottom: 10px;padding-top: 10px;">
      <span>平直成品</span>
    </div>
    <el-table
      :data="cutPdList"
      ref="cutPdTable"
      row-key="id"
      :header-cell-class-name="setHeaderClass"
      border highlight-current-row stripe
      row-class-name="pointer text-center tab-ellipsis"
      max-height="500"
    >
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column sortable label="包装编号" prop="blno" min-width="120"></el-table-column>
      <el-table-column sortable label="原料编号" prop="handCodes" min-width="120"></el-table-column>
      <el-table-column sortable label="钢卷号" prop="steelCodes" min-width="150"></el-table-column>
      <el-table-column sortable label="成品规格" prop="specAllPd"  min-width="250"></el-table-column>
      <el-table-column sortable :label="'理重['+cutPdTableHeader.weight+']'" prop="weight" min-width="120"></el-table-column>
      <el-table-column sortable :label="'磅重['+cutPdTableHeader.weight1+']'" prop="weight1" min-width="120"></el-table-column>
      <el-table-column sortable label="仓库" prop="storeName"></el-table-column>
      <el-table-column sortable label="加工机台" prop="machineName"></el-table-column>
      <el-table-column sortable label="加工班长" prop="userName"></el-table-column>
      <el-table-column sortable label="包装日期" prop="bldate"></el-table-column>
      <el-table-column sortable label="包装备注" prop="remark"></el-table-column>
    </el-table>
    <div style="padding-bottom: 10px;padding-top: 10px;">
      <span>原料卷回</span>
    </div>
    <el-table
      :data="maRollBackList"
      ref="maRollBackTable"
      row-key="id"
      :header-cell-class-name="setHeaderClass"
      border highlight-current-row stripe
      row-class-name="pointer text-center tab-ellipsis"
      max-height="500"
    >
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column sortable label="货物编号" prop="handCode" min-width="120" ></el-table-column>
      <el-table-column sortable label="钢卷号" prop="steelCode" min-width="120" ></el-table-column>
      <el-table-column sortable label="品名" prop="typeName"></el-table-column>
      <el-table-column sortable label="规格" prop="specName"  min-width="250"></el-table-column>
      <el-table-column sortable label="产地" prop="parea"></el-table-column>
      <el-table-column sortable label="材质" prop="grade"></el-table-column>
      <el-table-column sortable :label="'卷回重量['+maRollBackTableHeader.rollbackWeight+']'" prop="rollbackWeight" min-width="120"></el-table-column>
      <el-table-column sortable :label="'数量['+maRollBackTableHeader.rollbackNum+']'" prop="rollbackNum"></el-table-column>
      <el-table-column sortable label="仓库" prop="storeName"></el-table-column>
      <el-table-column sortable label="长度" prop="length"></el-table-column>
      <el-table-column sortable label="加工机台" prop="machineName"></el-table-column>
      <el-table-column sortable label="加工班长" prop="userName"></el-table-column>
    </el-table>
    <div style="padding-bottom: 10px;padding-top: 10px;">
      <span>成品卷回</span>
    </div>
    <el-table
      :data="pdRollBackList"
      ref="pdRollBackTable"
      row-key="id"
      :header-cell-class-name="setHeaderClass"
      border highlight-current-row stripe
      row-class-name="pointer text-center tab-ellipsis"
      max-height="500"
    >
      <!-- <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column sortable label="包装编号" prop="blno"></el-table-column> -->
      <el-table-column sortable label="货物编号" prop="handCode" min-width="120" ></el-table-column>
      <el-table-column sortable label="钢卷号" prop="steelCode" min-width="150" ></el-table-column>
      <el-table-column sortable label="规格" min-width="250">
        <template slot-scope="scope">
          <span>{{scope.row.pdSpecDes + "×" + scope.row.num + "条"}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable :label="'理重['+pdRollBackTableHeader.weight+']'" prop="weight" min-width="100"></el-table-column>
      <!-- <el-table-column sortable label="磅重" prop="weight1"></el-table-column>
      <el-table-column sortable label="仓库" prop="storeName"></el-table-column>
      <el-table-column sortable label="加工机台" prop="machineName"></el-table-column>
      <el-table-column sortable label="加工班长" prop="userName"></el-table-column>
      <el-table-column sortable label="包装备注" prop="remark"></el-table-column> -->
    </el-table>
  </div>
</template>

<script>
  import { pdview } from '@/api/process/mach/index'

  export default {
    name: 'pdDetail',
    components: {
    },
    props: {
      formData: Object
    },
    computed: {
      maWeight: function() { // 计算原料总重
        var weight = 0.0
        if (this.formData.resList) {
          for (const res of this.formData.resList) {
            if (res.weightFlag === 1) {
              weight += res.weight1
            } else if (res.weightFlag === 2) {
              weight += res.weight2
            }
          }
        }
        return weight.toFixed(3)
      },
      pdWeight: function() { // 计算成品总重
        var weight = 0.0
        for (const slitPd of this.slitPdList) {
          weight += slitPd.weight
        }
        for (const cutPd of this.cutPdList) {
          weight += cutPd.weight
        }
        return weight.toFixed(3)
      },
      rollBackWeight: function() {
        var weight = 0.0
        for (const maRollBack of this.maRollBackList) {
          weight += maRollBack.rollbackWeight
        }
        for (const pdRollBack of this.pdRollBackList) {
          weight += pdRollBack.weight
        }
        return weight.toFixed(3)
      },
      slitPdTableHeader: function() {
        const temp = {}
        temp.weight = this.slitPdList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight)
        }, 0).toFixed(3)
        temp.weight1 = this.slitPdList.reduce((pre, cur) => {
          return pre + (parseFloat(cur.weight1) ? parseFloat(cur.weight1) : 0)
        }, 0).toFixed(3)
        return temp
      },
      cutPdTableHeader: function() {
        const temp = {}
        temp.weight = this.cutPdList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight)
        }, 0).toFixed(3)
        temp.weight1 = this.cutPdList.reduce((pre, cur) => {
          return pre + (parseFloat(cur.weight1) ? parseFloat(cur.weight1) : 0)
        }, 0).toFixed(3)
        return temp
      },
      maRollBackTableHeader: function() {
        const temp = {}
        temp.rollbackWeight = this.maRollBackList.reduce((pre, cur) => {
          return pre + parseFloat(cur.rollbackWeight)
        }, 0).toFixed(3)
        temp.rollbackNum = this.maRollBackList.reduce((pre, cur) => {
          return pre + parseFloat(cur.rollbackNum)
        }, 0).toFixed(0)
        return temp
      },
      pdRollBackTableHeader: function() {
        const temp = {}
        temp.weight = this.pdRollBackList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight)
        }, 0).toFixed(3)
        return temp
      }
    },
    created() {
      this.getPdView()
    },
    data() {
      return {
        slitPdList: [],
        cutPdList: [],
        maRollBackList: [],
        pdRollBackList: []
      }
    },
    methods: {
      setHeaderClass({ row, column, rowIndex, columnIndex }) { // 设置表头类
        if (columnIndex === 0) {
          return 'table-header-bg text-center pointer'
        } else {
          return 'table-header-bg text-center'
        }
      },
      getPdView() {
        pdview({
          id: this.formData.id
        }).then((resp) => {
          this.slitPdList = resp.pdView.slitPdList
          this.cutPdList = resp.pdView.cutPdList
          this.maRollBackList = resp.pdView.maRollBackList
          this.pdRollBackList = resp.pdView.pdRollBackList
        }).catch(error => {
          if (error) console.error(error)
        })
      }
    }
  }
</script>

<style lang="scss">

</style>
