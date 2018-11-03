<template>
  <div>
    <el-row class="form-wrap">
      <el-form :inline="true" size="small" label-width="100px">
        <el-form-item label="单据编号">
          <el-input :value="formData.blno" class="w-199" readonly></el-input>
        </el-form-item>
        <el-form-item label="单据日期">
          <el-input :value="formData.bldate" class="w-199" readonly></el-input>
        </el-form-item>
        <el-form-item label="预计提货时间">
          <el-input :value="formData.timeSectionObj" class="w-199" readonly></el-input>
        </el-form-item>
        <br>
        <el-form-item label="客户">
          <el-input :value="formData.cuName" class="w-199" readonly></el-input>
        </el-form-item>
        <el-form-item label="客户联系">
          <el-input :value="formData.custLinkDes" class="w-199" readonly></el-input>
        </el-form-item>
        <el-form-item label="重卷">
          <el-checkbox :value="formData.repack===1"></el-checkbox>
        </el-form-item>
        <br>
        <el-form-item label="备注">
          <el-input type="textarea" :value="formData.machFlag === 1 ? formData.slitRemark : formData.machFlag === 2 ? formData.cutRemark : ''" class="input-w-694" readonly></el-input>
        </el-form-item>
        <br>
        <el-form-item label="制单人:">
          <span class='itemsClass2'>[{{formData.orderCreatorName}} {{formData.orderCreateTime}}]</span>
        </el-form-item>
        <el-form-item label="修改人:">
          <span class='itemsClass2'>[{{formData.orderEditorName}} {{formData.orderEditTime}}]</span>
        </el-form-item>
        <el-form-item label="审核人:">
          <span class='itemsClass2'>[{{formData.orderCheckerName}} {{formData.orderCheckTime}}]</span>
        </el-form-item>
      </el-form>
    </el-row>

    <el-tabs type="border-card">
      <el-tab-pane label="加工要求">
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
          <el-table-column sortable :label="'计划用料重量['+ tableHeader.machWeight+']'" prop="machWeight" min-width="150"></el-table-column>
          <el-table-column sortable :label="'计划用料数量['+ tableHeader.machNum+']'" prop="machNum" min-width="150"></el-table-column>
          <el-table-column sortable :label="'实际用料重量['+ tableHeader.useWeight+']'" prop="useWeight" min-width="150"></el-table-column>
          <el-table-column sortable :label="'实际卷回重量['+ tableHeader.rollbackWeight+']'" prop="rollbackWeight" min-width="150"></el-table-column>
          <el-table-column sortable label="原卷外观描述" prop="maShowDes" min-width="150"></el-table-column>
          <el-table-column sortable label="原卷备注" prop="maRemark"></el-table-column>
        </el-table>

        <template v-if="formData.machFlag === 1">
          <el-card shadow="always" style="margin-top:15px;">开料规格</el-card>
          <el-table :data="slitSpecList" border header-cell-class-name="table-header-bg text-center" row-class-name="pointer text-center">
            <el-table-column label="序号" type="index" width="50"></el-table-column>
            <el-table-column sortable label="货物编号" prop="handCode"></el-table-column>
            <el-table-column sortable label="分刀" prop="seq"></el-table-column>
            <el-table-column sortable label="本刀重" prop="seqWeight"></el-table-column>
            <el-table-column sortable label="段" prop="sectionNum"></el-table-column>
            <el-table-column sortable label="宽度" prop="width"></el-table-column>
            <el-table-column sortable label="条数" prop="num"></el-table-column>
            <el-table-column sortable label="总条数" prop="numSum"></el-table-column>
            <el-table-column sortable label="重量" prop="weight"></el-table-column>
            <el-table-column sortable label="转平板" prop="toCutNum"></el-table-column>
            <el-table-column sortable label="边料">
              <template slot-scope="scope">
                <el-checkbox :value="scope.row.excessManage"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column sortable label="备注" prop="remark"></el-table-column>
          </el-table>
        </template>
        <template v-if="formData.machFlag === 2">
          <el-card shadow="always" style="margin-top:15px;">
            开料规格
            <!--<span style="padding-left: 50px">0.7x1500 1条 5吨</span>-->
          </el-card>
          <el-table :data="cutSpecList" border header-cell-class-name="table-header-bg text-center" row-class-name="pointer text-center">
            <el-table-column label="序号" type="index" width="50"></el-table-column>
            <el-table-column sortable label="长度" prop="length"></el-table-column>
            <el-table-column sortable label="件数" prop="num"></el-table-column>
            <el-table-column sortable label="包数" prop="packNum"></el-table-column>
            <el-table-column sortable label="重量" prop="weight"></el-table-column>
            <el-table-column sortable label="备注" prop="remark"></el-table-column>
          </el-table>
        </template>
      </el-tab-pane>

      <el-tab-pane label="木架">
        <el-card shadow="always">木架使用明细</el-card>
        <el-table :data="usedBattenDtList" border header-cell-class-name="table-header-bg text-center" row-class-name="pointer text-center">
          <el-table-column label="序号" type="index" width="50"></el-table-column>
          <el-table-column sortable label="规格" prop="shelfSpec"></el-table-column>
          <el-table-column sortable label="类型" prop="shelfType"></el-table-column>
          <el-table-column sortable label="数量" prop="num"></el-table-column>
          <el-table-column sortable label="备注" prop="remark"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import * as api from '@/api/process/machPack/machPack'

  export default {
    name: 'mach-tab',
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
      }
    },
    data() {
      return {
        selectMaterial: null,
        slitSpecList: [],
        cutSpecList: [],
        usedBattenDtList: []
      }
    },
    methods: {
      resRowClick(row) {
        this.selectMaterial = row
        this.getSpecDtList()
      },
      // 木架查询
      getUsedBattenDtList() {
        this.usedBattenDtList = []
        if (this.formData.machOrderId) {
          api.usedBattenDtList({ blid: this.formData.machOrderId }).then((response) => {
            this.usedBattenDtList = response.list
          }).catch(error => {
            if (error) console.error(error)
          })
        }
      },
      // 开料规格查询
      getSpecDtList() {
        this.slitSpecList = []
        this.cutSpecList = []
        const reqData = {
          materialId: this.selectMaterial.id
        }
        api.specDtList(reqData).then((response) => {
          this.slitSpecList = response.slitSpecList
          this.cutSpecList = response.cutSpecList
        }).catch(error => {
          if (error) console.error(error)
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
    created() {
      this.getUsedBattenDtList()
    }
  }
</script>

<style scoped>

</style>
