<template>
  <div>
    <el-card shadow="always">用料明细</el-card>
    <el-table
      :data="formData.materialList"
      @row-click="resRowClick"
      border header-cell-class-name="table-header-bg text-center"
      stripe max-height="545"
      :row-class-name="tableRowClassName">
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column sortable label="货物编号">
        <template slot-scope="scope">
          {{scope.row.handCode}}<span v-if="formData.machFlag === 2 && scope.row.mixCut > 0" style="color: red;">（混平）</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="钢卷号" prop="steelCode"></el-table-column>
      <el-table-column sortable label="品名" prop="typeName" min-width="120"></el-table-column>
      <el-table-column sortable label="厚度" prop="thickness"></el-table-column>
      <el-table-column sortable label="宽度" prop="width"></el-table-column>
      <el-table-column sortable label="产地" prop="parea"></el-table-column>
      <el-table-column sortable label="材质" prop="grade"></el-table-column>
      <el-table-column sortable :label="'计划用料重量['+ tableHeader.machWeight+']'" prop="machWeight" min-width="140"></el-table-column>
      <el-table-column sortable :label="'计划用料数量['+ tableHeader.machNum+']'" prop="machNum" min-width="120"></el-table-column>
      <el-table-column sortable :label="'实际用料重量['+ tableHeader.useWeight+']'" prop="useWeight" min-width="120"></el-table-column>
      <el-table-column sortable :label="'实际卷回重量['+ tableHeader.rollbackWeight+']'" prop="rollbackWeight" min-width="140"></el-table-column>
      <el-table-column sortable label="原卷外观描述" prop="maShowDes" min-width="120"></el-table-column>
      <el-table-column sortable label="原卷备注" prop="maRemark"></el-table-column>
    </el-table>

    <template v-if="formData.resType === 1">
      <el-card shadow="always" style="margin-top:15px;">原料明细</el-card>
      <el-table :data="maList" border header-cell-class-name="table-header-bg text-center" stripe max-height="545" row-class-name="pointer text-center tab-ellipsis">
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column sortable label="操作">
          <template slot-scope="scope" v-if="formData.status === 0 && scope.row.isValid === 1">
            <el-button size="small" @click="selectGood(scope.row)">领料</el-button>
          </template>
        </el-table-column>
        <el-table-column sortable label="货物编号" prop="handCode" min-width="150"></el-table-column>
        <el-table-column sortable label="钢卷号" prop="steelCode" min-width="100"></el-table-column>
        <el-table-column sortable label="品名" prop="typeName" min-width="120"></el-table-column>
        <el-table-column sortable label="规格" prop="specName" min-width="200"></el-table-column>
        <el-table-column sortable label="产地" prop="parea"></el-table-column>
        <el-table-column sortable label="材质" prop="grade"></el-table-column>
        <el-table-column sortable :label="'净重['+ maTableHeader.weight2+']'" prop="weight2" min-width="120" ></el-table-column>
        <el-table-column sortable :label="'磅重['+ maTableHeader.weight1+']'" prop="weight1" min-width="120" ></el-table-column>
        <el-table-column sortable :label="'毛重['+ maTableHeader.weight4+']'" prop="weight4" min-width="120" ></el-table-column>
        <el-table-column sortable :label="'数量['+ maTableHeader.num+']'" prop="num" min-width="100"></el-table-column>
        <el-table-column sortable label="仓库" prop="storeName"></el-table-column>
        <el-table-column sortable label="长度" prop="lengthRemark"></el-table-column>
        <el-table-column sortable label="单位" prop="unit"></el-table-column>
        <el-table-column sortable label="外观描述" prop="showDes" min-width="100"></el-table-column>
        <el-table-column sortable label="进仓日期" prop="instoreDate" min-width="120"></el-table-column>
        <el-table-column sortable label="合同号" prop="contractNo" min-width="100"></el-table-column>
        <el-table-column sortable label="船号" prop="shipNo"></el-table-column>
        <el-table-column sortable label="备注" prop="remark"></el-table-column>
      </el-table>

      <el-card shadow="always" style="margin-top:15px;">领料明细</el-card>
      <el-table :data="maUseList" border header-cell-class-name="table-header-bg text-center" stripe max-height="545" row-class-name="pointer text-center tab-ellipsis">
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column sortable label="操作">
          <template slot-scope="scope" v-if="formData.status === 0">
            <el-button size="small" @click="cancelGood(scope.row)">取消领料</el-button>
          </template>
        </el-table-column>
        <el-table-column sortable label="货物编号" prop="handCode" min-width="150"></el-table-column>
        <el-table-column sortable label="钢卷号" prop="steelCode" min-width="100"></el-table-column>
        <el-table-column sortable label="品名" prop="typeName" min-width="120"></el-table-column>
        <el-table-column sortable label="规格" prop="specName" min-width="200"></el-table-column>
        <el-table-column sortable label="产地" prop="parea"></el-table-column>
        <el-table-column sortable label="材质" prop="grade"></el-table-column>
        <el-table-column sortable :label="'净重['+ maUseTableHeader.weight2+']'" prop="weight2" min-width="120"></el-table-column>
        <el-table-column sortable :label="'磅重['+ maUseTableHeader.weight1+']'" prop="weight1" min-width="120"></el-table-column>
        <el-table-column sortable :label="'毛重['+ maUseTableHeader.weight4+']'" prop="weight4" min-width="120"></el-table-column>
        <el-table-column sortable :label="'数量['+ maUseTableHeader.num+']'" prop="num" min-width="100"></el-table-column>
        <el-table-column sortable label="仓库" prop="storeName"></el-table-column>
        <el-table-column sortable label="长度" prop="lengthRemark"></el-table-column>
        <el-table-column sortable label="单位" prop="unit"></el-table-column>
        <el-table-column sortable label="外观描述" prop="showDes" min-width="100"></el-table-column>
        <el-table-column sortable label="进仓日期" prop="instoreDate" min-width="120"></el-table-column>
        <el-table-column sortable label="合同号" prop="contractNo" min-width="100"></el-table-column>
        <el-table-column sortable label="船号" prop="shipNo"></el-table-column>
        <el-table-column sortable label="备注" prop="remark"></el-table-column>
      </el-table>
    </template>

    <template v-if="formData.resType === 2">
      <el-card shadow="always" style="margin-top:15px;">成品明细</el-card>
      <el-table :data="pdList" border header-cell-class-name="table-header-bg text-center" row-class-name="pointer text-center tab-ellipsis">
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column sortable label="操作">
          <template slot-scope="scope" v-if="formData.status === 0 && scope.row.isValid === 1">
            <el-button size="small" @click="selectGood(scope.row)" :disabled="actionDoing">领料</el-button>
          </template>
        </el-table-column>
        <el-table-column sortable label="包装编号" prop="blno" min-width="150"></el-table-column>
        <el-table-column sortable label="包装备注" prop="remark" min-width="100"></el-table-column>
        <el-table-column sortable label="货物编号" prop="handCodes" min-width="150"></el-table-column>
        <el-table-column sortable label="钢卷号" prop="steelCodes" min-width="100"></el-table-column>
        <el-table-column sortable label="原料规格组成" prop="specAllMa" min-width="150"></el-table-column>
        <el-table-column sortable label="成品规格组成" prop="specAllPd" min-width="150"></el-table-column>
        <el-table-column sortable :label="'用料理重['+ pdTableHeader.dtWeight+']'" prop="dtWeight" min-width="180"></el-table-column>
        <el-table-column sortable :label="'用料数量['+ pdTableHeader.dtNum+']'" prop="dtNum" min-width="170"></el-table-column>
        <el-table-column sortable :label="'包装理算重量['+ pdTableHeader.weight+']'" prop="weight" min-width="180"></el-table-column>
        <el-table-column sortable :label="'包装过磅净重['+ pdTableHeader.weight1+']'" prop="weight1" min-width="180"></el-table-column>
        <el-table-column sortable :label="'包装过磅毛重['+ pdTableHeader.weight3+']'" prop="weight3" min-width="180"></el-table-column>
        <el-table-column sortable label="加工客户" prop="machCuName" min-width="100"></el-table-column>
        <el-table-column sortable label="库位" prop="storeName"></el-table-column>
        <el-table-column sortable label="包装日期" prop="bldate" min-width="140"></el-table-column>
      </el-table>

      <el-card shadow="always" style="margin-top:15px;">领料明细</el-card>
      <el-table :data="pdUseList" border header-cell-class-name="table-header-bg text-center" row-class-name="pointer text-center tab-ellipsis">
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column sortable label="操作">
          <template slot-scope="scope" v-if="formData.status === 0">
            <el-button size="small" @click="cancelGood(scope.row)" :disabled="actionDoing">取消领料</el-button>
          </template>
        </el-table-column>
        <el-table-column sortable label="包装编号" prop="blno" min-width="150"></el-table-column>
        <el-table-column sortable label="包装备注" prop="remark" min-width="100"></el-table-column>
        <el-table-column sortable label="货物编号" prop="handCodes" min-width="150"></el-table-column>
        <el-table-column sortable label="钢卷号" prop="steelCodes" min-width="100"></el-table-column>
        <el-table-column sortable label="原料规格组成" prop="specAllMa" min-width="150"></el-table-column>
        <el-table-column sortable label="成品规格组成" prop="specAllPd" min-width="150"></el-table-column>
        <el-table-column sortable :label="'用料理重['+ pdUseTableHeader.dtWeight+']'" prop="dtWeight" min-width="180"></el-table-column>
        <el-table-column sortable :label="'用料数量['+ pdUseTableHeader.dtNum+']'" prop="dtNum" min-width="170"></el-table-column>
        <el-table-column sortable :label="'包装理算重量['+ pdUseTableHeader.weight+']'" prop="weight" min-width="180"></el-table-column>
        <el-table-column sortable :label="'包装过磅净重['+ pdUseTableHeader.weight1+']'" prop="weight1" min-width="180"></el-table-column>
        <el-table-column sortable :label="'包装过磅毛重['+ pdUseTableHeader.weight3+']'" prop="weight3" min-width="180"></el-table-column>
        <el-table-column sortable label="加工客户" prop="machCuName" min-width="100"></el-table-column>
        <el-table-column sortable label="库位" prop="storeName"></el-table-column>
        <el-table-column sortable label="包装日期" prop="bldate" min-width="140"></el-table-column>
      </el-table>
    </template>
  </div>
</template>

<script>
  import * as api from '@/api/process/machPack/machPack'

  export default {
    name: 'receive-tab',
    props: {
      formData: Object
    },
    computed: {
      tableHeader() {
        const temp = {}
        if (this.formData.materialList) {
          temp.machWeight = this.formData.materialList.reduce((pre, cur) => {
            return pre + parseFloat(cur.machWeight ? cur.machWeight : 0)
          }, 0).toFixed(3)
          temp.useWeight = this.formData.materialList.reduce((pre, cur) => {
            return pre + parseFloat(cur.useWeight ? cur.useWeight : 0)
          }, 0).toFixed(3)
          temp.rollbackWeight = this.formData.materialList.reduce((pre, cur) => {
            return pre + parseFloat(cur.rollbackWeight ? cur.rollbackWeight : 0)
          }, 0).toFixed(3)
          temp.machNum = this.formData.materialList.reduce((pre, cur) => {
            return pre + parseInt(cur.machNum ? cur.machNum : 0)
          }, 0)
        }
        return temp
      },
      maTableHeader() {
        const temp = {}
        temp.weight1 = this.maList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight1 ? cur.weight1 : 0)
        }, 0).toFixed(3)
        temp.weight2 = this.maList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight2 ? cur.weight2 : 0)
        }, 0).toFixed(3)
        temp.weight4 = this.maList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight4 ? cur.weight4 : 0)
        }, 0).toFixed(3)
        temp.num = this.maList.reduce((pre, cur) => {
          return pre + parseInt(cur.num ? cur.num : 0)
        }, 0)
        return temp
      },
      maUseTableHeader() {
        const temp = {}
        temp.weight1 = this.maUseList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight1 ? cur.weight1 : 0)
        }, 0).toFixed(3)
        temp.weight2 = this.maUseList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight2 ? cur.weight2 : 0)
        }, 0).toFixed(3)
        temp.weight4 = this.maUseList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight4 ? cur.weight4 : 0)
        }, 0).toFixed(3)
        temp.num = this.maUseList.reduce((pre, cur) => {
          return pre + parseInt(cur.num ? cur.num : 0)
        }, 0)
        return temp
      },
      pdTableHeader() {
        const temp = {}
        temp.dtNum = this.pdList.reduce((pre, cur) => {
          return pre + parseInt(cur.dtNum ? cur.dtNum : 0)
        }, 0)
        temp.dtWeight = this.pdList.reduce((pre, cur) => {
          return pre + parseFloat(cur.dtWeight ? cur.dtWeight : 0)
        }, 0).toFixed(3)
        temp.weight = this.pdList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight ? cur.weight : 0)
        }, 0).toFixed(3)
        temp.weight1 = this.pdList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight1 ? cur.weight1 : 0)
        }, 0).toFixed(3)
        temp.weight3 = this.pdList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight3 ? cur.weight3 : 0)
        }, 0).toFixed(3)
        return temp
      },
      pdUseTableHeader() {
        const temp = {}
        temp.dtNum = this.pdUseList.reduce((pre, cur) => {
          return pre + parseInt(cur.dtNum ? cur.dtNum : 0)
        }, 0)
        temp.dtWeight = this.pdUseList.reduce((pre, cur) => {
          return pre + parseFloat(cur.dtWeight ? cur.dtWeight : 0)
        }, 0).toFixed(3)
        temp.weight = this.pdUseList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight ? cur.weight : 0)
        }, 0).toFixed(3)
        temp.weight1 = this.pdUseList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight1 ? cur.weight1 : 0)
        }, 0).toFixed(3)
        temp.weight3 = this.pdUseList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight3 ? cur.weight3 : 0)
        }, 0).toFixed(3)
        return temp
      }
    },
    data() {
      return {
        actionDoing: false,
        selectMaterial: null,
        maList: [],
        maUseList: [],
        pdList: [],
        pdUseList: []
      }
    },
    methods: {
      resRowClick(row) {
        // 领料为原料时不能点击
        if (this.formData.resType === 1) {
          return
        }
        this.selectMaterial = row
        this.getSelectUseList()
        this.getUseList()
      },
      // 选择领料明细查询
      getSelectUseList() {
        this.maList = []
        this.pdList = []
        const reqData = {}
        // 领料为原料时查询所有
        if (this.formData.resType === 1) {
          reqData.machPackId = this.formData.id
        } else {
          reqData.materialId = this.selectMaterial.id
        }
        api.selectUseList(reqData).then((response) => {
          this.maList = response.maList
          this.pdList = response.pdList
        }).catch(error => {
          if (error) console.error(error)
        })
      },
      // 已领料明细查询
      getUseList() {
        this.maUseList = []
        this.pdUseList = []
        const reqData = {}
        // 领料为原料时查询所有
        if (this.formData.resType === 1) {
          reqData.machPackId = this.formData.id
        } else {
          reqData.materialId = this.selectMaterial.id
        }
        api.useList(reqData).then((response) => {
          this.maUseList = response.maUseList
          this.pdUseList = response.pdUseList
        }).catch(error => {
          if (error) console.error(error)
        })
      },
      // 领料
      selectGood(row) {
        const reqData = {
          materialId: row.materialId,
          goodId: row.id
        }
        this.actionDoing = true
        api.selectGood(reqData).then(response => {
          this.$emit('queryMachPackInfo')
          this.getSelectUseList()
          this.getUseList()
          this.actionDoing = false
        }).catch(error => {
          if (error)console.error(error)
          this.actionDoing = false
        })
      },
      // 取消领料
      cancelGood(row) {
        const reqData = {
          resType: this.formData.resType,
          useId: row.id
        }
        this.actionDoing = true
        api.cancelGood(reqData).then(response => {
          this.$emit('queryMachPackInfo')
          this.getSelectUseList()
          this.getUseList()
          this.actionDoing = false
        }).catch(error => {
          if (error)console.error(error)
          this.actionDoing = false
        })
      },
      tableRowClassName({ row, rowIndex }) {
        if (this.selectMaterial) {
          if (this.selectMaterial.id === row.id) {
            return 'table-select-bgcolor pointer text-center tab-ellipsis'
          }
        }
        return 'pointer text-center tab-ellipsis'
      }
    },
    mounted() {
      // 领料为原料时查询所有
      if (this.formData.resType === 1) {
        this.getSelectUseList()
        this.getUseList()
      }
    }
  }
</script>

<style scoped>

</style>
