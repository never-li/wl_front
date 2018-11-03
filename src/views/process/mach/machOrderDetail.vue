<template>
  <div >
    <div style="padding-bottom: 10px;">
      用料明细
      <el-button type="primary" size="mini" :disabled="!isAllowCopySlit()" @click="copySLit">分条复制</el-button>
    </div>
    <el-table
      :data="formData.resList"
      ref="resTable"
      key="resTable"
      row-key="stockId"
      @header-click="resTableHeaderClick"
      @row-click="resTableRowClick"
      :header-cell-class-name="setHeaderClass"
      border highlight-current-row
      row-class-name="pointer text-center tab-ellipsis"
      stripe max-height="300"
    >
      <el-table-column label="+" width="50" v-if="action === 'add' || action === 'update'" fixed>
        <template slot-scope="scope">
          <i class="el-icon-delete" @click="deleteRes(scope.$index,scope.row)"></i>
        </template>
      </el-table-column>
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column sortable label="货物编号" prop="handCode" min-width="120"></el-table-column>
      <el-table-column sortable label="钢卷号" prop="steelCode" min-width="150"></el-table-column>
      <el-table-column sortable label="品名" prop="typeName" min-width="150"></el-table-column>
      <el-table-column sortable label="厚度" prop="thickness"></el-table-column>
      <el-table-column sortable label="宽度" prop="width"></el-table-column>
      <el-table-column sortable label="产地" prop="parea"></el-table-column>
      <el-table-column sortable label="材质" prop="grade"></el-table-column>
      <el-table-column sortable :label="(formData.resType===1?'抄码重':'理重')+'['+ resDetailTableHeader.weight2+']'" prop="weight2" min-width="140"></el-table-column>
      <el-table-column sortable :label="'过磅重['+ resDetailTableHeader.weight1+']'" prop="weight1" v-if="formData.resType===1" min-width="140"></el-table-column>
      <el-table-column sortable label="重量方式" v-if="formData.resType===1" min-width="100">
        <template slot-scope="scope">
          <el-select v-model="scope.row.weightFlag"
                     v-if="isEdit(scope)" @change="resWeightFlagChange(scope.row)"
                     filterable size="mini">
            <el-option v-for="item in weightCalc"
                       :value="item.value"
                       :label="item.label"
                       :key="item.value">
            </el-option>
          </el-select>
          <span v-else>
            {{
              scope.row.weightFlag === 1 ? '抄码磅重' :
              scope.row.weightFlag === 2 ? '抄码净重' : ''
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column sortable :label="'数量['+ resDetailTableHeader.num+']'" min-width="120">
        <template slot-scope="scope">
          <el-input v-model.number="scope.row.num"
                    :max="scope.row.storeNum"
                    @blur="resNumChange(scope.row)"
                    v-if="isEdit(scope)"
                    size="mini">
          </el-input>
          <span v-else>{{scope.row.num}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable :label="'用料计划['+ resDetailTableHeader.machWeight+']'" prop="machWeight" min-width="140"></el-table-column>
      <el-table-column sortable :label="'实际用料['+ resDetailTableHeader.useWeight+']'" prop="useWeight" min-width="140"></el-table-column>
      <el-table-column sortable :label="'卷回['+ resDetailTableHeader.rollbackWeight+']'" prop="rollbackWeight" min-width="140"></el-table-column>
      <el-table-column sortable label="加工单价" min-width="100">
        <template slot-scope="scope">
          <el-input v-model.number="scope.row.machPrice"
                    :max="scope.row.storeNum"
                    v-if="isEdit(scope)"
                    size="mini">
          </el-input>
          <span v-else>{{scope.row.machPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="仓库" v-if="formData.resType===1">
        <template slot-scope="scope">
          <span>{{scope.row.storeName + (scope.row.position?scope.row.position:"")}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="原卷外观描述" prop="maShowDes" width="120"></el-table-column>
      <el-table-column sortable label="原卷备注" prop="maRemark" min-width="100"></el-table-column>
      <el-table-column sortable label="分条开料" min-width="100">
        <template slot-scope="scope">
          {{
            scope.row.slitStatus === 0 ? '待加工' :
            scope.row.slitStatus === 1 ? '待加工' :
            scope.row.slitStatus === 2 ? '加工中' :
            scope.row.slitStatus === 3 ? '加工完成' : ''
          }}
        </template>
      </el-table-column>
      <el-table-column sortable label="平板开料" prop="grade" min-width="100">
        <template slot-scope="scope">
          {{
            scope.row.cutStatus === 0 ? '待加工' :
            scope.row.cutStatus === 1 ? '待加工' :
            scope.row.cutStatus === 2 ? '加工中' :
            scope.row.cutStatus === 3 ? '加工完成' : ''
          }}
        </template>
      </el-table-column>
    </el-table>
    <div style="padding-bottom: 10px;padding-top: 10px;">
      <span>分条排刀明细</span>
      <mach-type-select v-model="formData.machTypeId" :isConMach="1" @machTypeChange="machTypeChange"></mach-type-select>
      <el-checkbox v-model="currentRes.allowUltraWide" v-if="currentRes.slitList && currentRes.slitStatus<=1" @change="changeAllowUltraWide">超宽处理</el-checkbox>
    </div>
    <el-table
      :data="currentRes.slitList"
      ref="slitTable"
      key="slitTable"
      row-key="stockId"
      @row-click="slitTableRowClick"
      :header-cell-class-name="setHeaderClass"
      stripe
      border highlight-current-row
      row-class-name="pointer text-center"
      max-height="500"
      :span-method="arraySpanMethod"
    >
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column label="货物编号" prop="handCode" width="120"></el-table-column>
      <el-table-column label="分刀">
        <template slot-scope="scope">
          <el-input v-model="scope.row.seq"
                    v-if="isEdit(scope) && currentRes.slitStatus<=1"
                    @blur="slitSeqChange(scope.row)"
                    size="mini" @keyup.46.native="slitSeqDelete(scope.row)"
                    v-focus:seq="scope.row == tmpRow"
                    @keyup.native.38="doFocus(scope.row,scope.$index,'seq',38)"
                    @keyup.native.40="doFocus(scope.row,scope.$index,'seq',40)"
                    @keyup.native.37="doFocus(scope.row,scope.$index,'seq',37)"
                    @keyup.native.39="doFocus(scope.row,scope.$index,'seqWeight',39)"
                    @focus="focus($event)"
          >
          </el-input>
          <span v-else>{{scope.row.seq}}</span>
        </template>
      </el-table-column>
      <el-table-column label="本刀重">
        <template slot-scope="scope">
          <el-input v-model="scope.row.seqWeight"
                    v-if="isEdit(scope) && currentRes.slitStatus<=1"
                    :disabled="scope.row.seq=='卷回板'"
                    @blur="slitSeqWeightChange(scope.row)"
                    size="mini" @keyup.46.native="slitSeqDelete(scope.row)"
                    v-focus:seqWeight="scope.row == tmpRow"
                    @keyup.native.38="doFocus(scope.row,scope.$index,'seqWeight',38)"
                    @keyup.native.40="doFocus(scope.row,scope.$index,'seqWeight',40)"
                    @keyup.native.37="doFocus(scope.row,scope.$index,'seq',37)"
                    @keyup.native.39="doFocus(scope.row,scope.$index,'sectionNum',39)"
                    @focus="focus($event)"
          >
          </el-input>
          <span v-else>{{scope.row.seqWeight}}</span>
        </template>
      </el-table-column>
      <el-table-column label="段">
        <template slot-scope="scope">
          <el-input v-model="scope.row.sectionNum"
                    v-if="isEdit(scope) && currentRes.slitStatus<=1"
                    :disabled="scope.row.seq=='卷回板'"
                    @blur="sectionNumChange(scope.row)"
                    size="mini" @keyup.46.native="slitSeqDelete(scope.row)"
                    v-focus:sectionNum="scope.row == tmpRow"
                    @keyup.native.38="doFocus(scope.row,scope.$index,'sectionNum',38)"
                    @keyup.native.40="doFocus(scope.row,scope.$index,'sectionNum',40)"
                    @keyup.native.37="doFocus(scope.row,scope.$index,'seqWeight',37)"
                    @keyup.native.39="doFocus(scope.row,scope.$index,currentRes.allowUltraWide?'maxWidth':'width',39)"
                    @focus="focus($event)"
          >
          </el-input>
          <span v-else>{{scope.row.sectionNum}}</span>
        </template>
      </el-table-column>
      <el-table-column label="超宽宽度" v-if="currentRes.allowUltraWide">
        <template slot-scope="scope">
          <el-input v-model="scope.row.maxWidth"
                    v-if="isEdit(scope) && currentRes.slitStatus<=1"
                    :disabled="scope.row.seq=='卷回板'"
                    @blur="maxWidthChange(scope.row)"
                    size="mini" @keyup.46.native="slitSeqDelete(scope.row)"
                    v-focus:maxWidth="scope.row == tmpRow"
                    @keyup.native.38="doFocus(scope.row,scope.$index,'maxWidth',38)"
                    @keyup.native.40="doFocus(scope.row,scope.$index,'maxWidth',40)"
                    @keyup.native.37="doFocus(scope.row,scope.$index,'sectionNum',37)"
                    @keyup.native.39="doFocus(scope.row,scope.$index,'width',39)"
                    @focus="focus($event)"
          >
          </el-input>
          <span v-else>{{scope.row.maxWidth}}</span>
        </template>
      </el-table-column>
      <el-table-column label="宽度" prop="width">
        <template slot-scope="scope">
          <el-input v-model="scope.row.width"
                    v-if="isEdit(scope) && currentRes.slitStatus<=1"
                    :disabled="scope.row.seq=='卷回板'"
                    @blur="slitWidthChange(scope.row)"
                    size="mini" @keyup.46.native="slitSeqDelete(scope.row)"
                    v-focus:width="scope.row == tmpRow"
                    @keyup.native.38="doFocus(scope.row,scope.$index,'width',38)"
                    @keyup.native.40="doFocus(scope.row,scope.$index,'width',40)"
                    @keyup.native.37="doFocus(scope.row,scope.$index,currentRes.allowUltraWide?'maxWidth':'sectionNum',37)"
                    @keyup.native.39="doFocus(scope.row,scope.$index,'num',39)"
                    @focus="focus($event)"
          >
          </el-input>
          <span v-else>{{scope.row.width}}</span>
        </template>
      </el-table-column>
      <el-table-column label="条数">
        <template slot-scope="scope">
          <el-input v-model="scope.row.num"
                    v-if="isEdit(scope) && currentRes.slitStatus<=1"
                    :disabled="scope.row.seq=='卷回板'"
                    @blur="slitNumChange(scope.row)"
                    size="mini" @keyup.46.native="slitSeqDelete(scope.row)"
                    v-focus:num="scope.row == tmpRow"
                    @keyup.native.38="doFocus(scope.row,scope.$index,'num',38)"
                    @keyup.native.40="doFocus(scope.row,scope.$index,'num',40)"
                    @keyup.native.37="doFocus(scope.row,scope.$index,'width',37)"
                    @keyup.native.39="doFocus(scope.row,scope.$index,'toCutNum',39)"
                    @focus="focus($event)"
          >
          </el-input>
          <span v-else>{{scope.row.num}}</span>
        </template>
      </el-table-column>
      <el-table-column label="总条数">
        <template slot-scope="scope">
          <span>{{scope.row.num * scope.row.sectionNum * currentRes.num}}</span>
        </template>
      </el-table-column>
      <el-table-column label="重量" prop="weight"></el-table-column>
      <el-table-column label="转平板">
        <template slot-scope="scope">
          <el-input v-model="scope.row.toCutNum"
                    v-if="isEdit(scope)"
                    @blur="toCutNumChange(scope.row)"
                    :disabled="scope.row.seq=='卷回板' || scope.row.excessManage"
                    size="mini" @keyup.46.native="slitSeqDelete(scope.row)"
                    v-focus:toCutNum="scope.row == tmpRow"
                    @keyup.native.38="doFocus(scope.row,scope.$index,'toCutNum',38)"
                    @keyup.native.40="doFocus(scope.row,scope.$index,'toCutNum',40)"
                    @keyup.native.37="doFocus(scope.row,scope.$index,'num',37)"
                    @keyup.native.39="doFocus(scope.row,scope.$index,'remark',39)"
                    @focus="focus($event)"
          >
          </el-input>
          <span v-else>{{scope.row.toCutNum}}</span>
        </template>
      </el-table-column>
      <el-table-column label="混平">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.mixCut" false-label="0" true-label="1"
            :disabled="!isEdit(scope) || !parseInt(scope.row.toCutNum)
                || scope.row.seq=='卷回板' || formData.repack==1 || scope.row.excessManage"
            @change="mixCutChange(scope.row)">
          </el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="边料" prop="grade">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.excessManage"
            :disabled="!isEdit(scope) || scope.row.seq=='卷回板' || formData.repack==1
                || currentRes.slitStatus>1 || scope.row.toCutNum>0">
          </el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="先平直" prop="grade">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.cutToSlit"
            :disabled="!isEdit(scope) || !parseInt(scope.row.toCutNum) || scope.row.seq=='卷回板' || formData.repack===1
                || scope.row.width!=currentRes.width || parseInt(scope.row.toCutNum)!=scope.row.num * scope.row.sectionNum * currentRes.num
                || scope.row.excessManage">
          </el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remark"
                    v-if="isEdit(scope)"
                    size="mini"
                    v-focus:remark="scope.row == tmpRow"
                    @keyup.native.38="doFocus(scope.row,scope.$index,'remark',38)"
                    @keyup.native.40="doFocus(scope.row,scope.$index,'remark',40)"
                    @keyup.native.37="doFocus(scope.row,scope.$index,'toCutNum',37)"
                    @keyup.native.39="doFocus(scope.row,scope.$index,'remark',39)"
                    @focus="focus($event)"
          >
          </el-input>
          <span v-else>{{scope.row.remark}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding-bottom: 10px;padding-top: 10px;">
      <span>平直开料明细</span>
      <mach-type-select v-model="formData.cutMachTypeId" :isConMach="0" :disabled="formData.isMulti==1"></mach-type-select>
      <span v-show="currentCut.thickness">{{currentCut.thickness}}×{{currentCut.width}} {{currentCut.num}}条 {{currentCut.weight}}吨</span>
      <!-- <el-button type="primary" size="mini" @click="addcutDtManual">手工新增</el-button> -->
    </div>
    <el-table
      :data="currentCut.cutDtList"
      ref="cutTable"
      key="cutTable"
      row-key="stockId"
      :header-cell-class-name="setHeaderClass"
      @row-click="cutTableClick"
      stripe
      border highlight-current-row
      row-class-name="pointer text-center"
      max-height="500"
    >
      <el-table-column label="序号" type="index" width="100"></el-table-column>
      <el-table-column sortable label="长度">
        <template slot-scope="scope">
          <el-input v-model="scope.row.length"
                    v-if="isEdit(scope)"
                    @blur="cutDtLengthChange(scope.row)"
                    size="mini"
                    v-focus:length="scope.row == tmpRow"
                    @keyup.native.38="doFocus2(scope.row,scope.$index,'length',38,'cutTable')"
                    @keyup.native.40="doFocus2(scope.row,scope.$index,'length',40,'cutTable')"
                    @keyup.native.39="doFocus2(scope.row,scope.$index,'num',39,'cutTable')"
                    @focus="focus($event)"
          >
          </el-input>
          <span v-else>{{scope.row.length}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="件数">
        <template slot-scope="scope">
          <el-input v-model="scope.row.num"
                    v-if="isEdit(scope)"
                    @blur="cutDtNumChange(scope.row)"
                    size="mini"
                    v-focus:num="scope.row == tmpRow"
                    @keyup.native.38="doFocus2(scope.row,scope.$index,'num',38,'cutTable')"
                    @keyup.native.40="doFocus2(scope.row,scope.$index,'num',40,'cutTable')"
                    @keyup.native.37="doFocus2(scope.row,scope.$index,'length',37,'cutTable')"
                    @keyup.native.39="doFocus2(scope.row,scope.$index,'packNum',39,'cutTable')"
                    @focus="focus($event)"
          >
          </el-input>
          <span v-else>{{scope.row.num}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="包数">
        <template slot-scope="scope">
          <el-input v-model="scope.row.packNum"
                    v-if="isEdit(scope)"
                    size="mini"
                    v-focus:packNum="scope.row == tmpRow"
                    @keyup.native.38="doFocus2(scope.row,scope.$index,'packNum',38,'cutTable')"
                    @keyup.native.40="doFocus2(scope.row,scope.$index,'packNum',40,'cutTable')"
                    @keyup.native.37="doFocus2(scope.row,scope.$index,'num',37,'cutTable')"
                    @keyup.native.39="doFocus2(scope.row,scope.$index,'remark',39,'cutTable')"
                    @focus="focus($event)"
          >
          </el-input>
          <span v-else>{{scope.row.packNum}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="重量" prop="weight"></el-table-column>
      <el-table-column sortable label="备注">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remark"
                    v-if="isEdit(scope)"
                    size="mini"
                    v-focus:remark="scope.row == tmpRow"
                    @keyup.native.38="doFocus2(scope.row,scope.$index,'remark',38,'cutTable')"
                    @keyup.native.40="doFocus2(scope.row,scope.$index,'remark',40,'cutTable')"
                    @keyup.native.37="doFocus2(scope.row,scope.$index,'packNum',37,'cutTable')"
                    @keyup.native.39="doFocus2(scope.row,scope.$index,'remark',39,'cutTable')"
                    @focus="focus($event)"
          >
          </el-input>
          <span v-else>{{scope.row.remark}}</span>
        </template>
      </el-table-column>
    </el-table>
    <span v-if="currentCut.cutDtManualList && currentCut.cutDtManualList.length>0">
      <el-table
        :data="currentCut.cutDtManualList"
        ref="cutManualTable"
        key="cutManualTable"
        row-key="stockId"
        :header-cell-class-name="setHeaderClass"
        stripe
        :show-header="false"
        border
        :highlight-current-row="false"
        row-class-name="pointer text-center"
        max-height="500"
        style="padding-top: 10px;"
        @row-click="cutTableClick"
      >
        <el-table-column width="100">
          <template slot-scope="scope">
            <el-button type="primary" @click="addCutDtManual" icon="el-icon-plus" size="mini"></el-button>
            <el-button type="danger" @click="deleteCutDtManual(scope.$index)" icon="el-icon-minus" size="mini" v-if="currentCut.cutDtManualList.length>1"></el-button>
          </template>
        </el-table-column>
        <el-table-column sortable label="长度">
          <template slot-scope="scope">
            <el-input v-model="scope.row.length"
                      v-if="isEdit(scope)"
                      @blur="calManualWeight(scope.row)"
                      size="mini"
                      v-focus:length="scope.row == tmpRow"
                      @keyup.native.38="doFocus2(scope.row,scope.$index,'length',38,'cutManualTable')"
                      @keyup.native.40="doFocus2(scope.row,scope.$index,'length',40,'cutManualTable')"
                      @keyup.native.39="doFocus2(scope.row,scope.$index,'num',39,'cutManualTable')"
                      @focus="focus($event)"
            >
            </el-input>
            <span v-else>{{scope.row.length}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable label="件数">
          <template slot-scope="scope">
            <el-input v-model="scope.row.num"
                      @blur="calManualWeight(scope.row)"
                      v-if="isEdit(scope)"
                      size="mini"
                      v-focus:num="scope.row == tmpRow"
                      @keyup.native.38="doFocus2(scope.row,scope.$index,'num',38,'cutManualTable')"
                      @keyup.native.40="doFocus2(scope.row,scope.$index,'num',40,'cutManualTable')"
                      @keyup.native.37="doFocus2(scope.row,scope.$index,'length',37,'cutManualTable')"
                      @keyup.native.39="doFocus2(scope.row,scope.$index,'packNum',39,'cutManualTable')"
                      @focus="focus($event)"
            >
            </el-input>
            <span v-else>{{scope.row.num}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable label="包数">
          <template slot-scope="scope">
            <el-input v-model="scope.row.packNum"
                      v-if="isEdit(scope)"
                      size="mini"
                      v-focus:packNum="scope.row == tmpRow"
                      @keyup.native.38="doFocus2(scope.row,scope.$index,'packNum',38,'cutManualTable')"
                      @keyup.native.40="doFocus2(scope.row,scope.$index,'packNum',40,'cutManualTable')"
                      @keyup.native.37="doFocus2(scope.row,scope.$index,'num',37,'cutManualTable')"
                      @keyup.native.39="doFocus2(scope.row,scope.$index,'remark',39,'cutManualTable')"
                      @focus="focus($event)"
            >
            </el-input>
            <span v-else>{{scope.row.packNum}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable label="重量" prop="weight"></el-table-column>
        <el-table-column sortable label="备注">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark"
                      v-if="isEdit(scope)"
                      size="mini"
                      v-focus:remark="scope.row == tmpRow"
                      @keyup.native.38="doFocus2(scope.row,scope.$index,'remark',38,'cutManualTable')"
                      @keyup.native.40="doFocus2(scope.row,scope.$index,'remark',40,'cutManualTable')"
                      @keyup.native.37="doFocus2(scope.row,scope.$index,'packNum',37,'cutManualTable')"
                      @focus="focus($event)"
            >
            </el-input>
            <span v-else>{{scope.row.remark}}</span>
          </template>
        </el-table-column>
      </el-table>
    </span>


  </div>
</template>

<script>
  import { lock } from '@/api/warehousing/pickUpGoods/index'
  import machTypeSelect from '@/components/machTypeSelect'
  import { findPathByModuleCode } from '@/utils'

export default {
    directives: {
      'focus': {
      // 指令的定义
        inserted: function(el, binding, vnode) {
          if (binding.value) {
            if (binding.arg === vnode.context.focusInput) {
              if (el.children[0]) { // 存在子节点 el-input 的情况下
                if (el.children[0].children.length > 0) {
                  el.children[0].children[0].focus()
                  el.children[0].children[0].select()
                } else {
                  el.children[0].focus()
                  el.children[0].select()
                }
              } else { // 不存在子节点 number-input 的情况下
                el.focus()
                el.select()
              }
            }
          }
        },
        update: function(el, binding, vnode) {
          if (binding.value) {
            if (binding.arg === vnode.context.focusInput) {
              if (el.children[0]) { // 存在子节点 el-input 的情况下
                if (el.children[0].children.length > 0) {
                  el.children[0].children[0].focus()
                } else {
                  el.children[0].focus()
                }
              } else { // 不存在子节点 number-input 的情况下
                el.focus()
              }
            }
          }
        }
      }
    },
    name: 'machOrderDetail',
    components: {
      machTypeSelect
    },
    props: {
      formData: Object,
      action: String
    },
    computed: {
      resDetailTableHeader() {
        const temp = {}
        temp.weight1 = this.formData.resList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight1 ? cur.weight1 : 0)
        }, 0).toFixed(3)
        temp.weight2 = this.formData.resList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight2 ? cur.weight2 : 0)
        }, 0).toFixed(3)
        temp.useWeight = this.formData.resList.reduce((pre, cur) => {
          return pre + parseFloat(cur.useWeight ? cur.useWeight : 0)
        }, 0).toFixed(3)
        temp.machWeight = this.formData.resList.reduce((pre, cur) => {
          return pre + parseFloat(cur.machWeight ? cur.machWeight : 0)
        }, 0).toFixed(3)
        temp.rollbackWeight = this.formData.resList.reduce((pre, cur) => {
          return pre + parseFloat(cur.rollbackWeight ? cur.rollbackWeight : 0)
        }, 0).toFixed(3)
        temp.num = this.formData.resList.reduce((pre, cur) => {
          return pre + parseFloat(cur.num ? cur.num : 0)
        }, 0)
        return temp
      }
    },
    data() {
      return {
        focusInput: 'seq',
        currentRes: {}, // 当前选中资源
        currentCut: {}, // 当前选中平直数据
        weightCalc: [
          { label: '抄码净重', value: 2 },
          { label: '抄码磅重', value: 1 }
        ],
        resIdx: -1, // 当前选中的资源的位数
        tmpRow: {}
      }
    },
    methods: {
      focus(event) {
        event.currentTarget.select()
      },
      // 根据上下左右聚焦
      doFocus(item, index, colum, key) {
        if (key === 37 || key === 39) {
          if (colum === 'maxWidth' || colum === 'sectionNum') {
            for (let i = 0; i < this.currentRes.slitList.length; i++) {
              if (this.currentRes.slitList[i].seqId === item.seqId) {
                this.tmpRow = this.currentRes.slitList[i]
                this.focusInput = colum
                this.$refs.slitTable.setCurrentRow(this.currentRes.slitList[i])
                return
              }
            }
          }
        }
        // 上 操作
        if ((index > 0) && key === 38) {
          // 合并输入框按 上 键处理
          if (colum === 'maxWidth' || colum === 'sectionNum' || colum === 'seq' || colum === 'seqWeight') {
            for (let i = 0; i < this.currentRes.slitList.length; i++) {
              if (this.currentRes.slitList[i].seqId === item.seqId) {
                for (let j = i; j >= 0; j--) {
                  if (this.currentRes.slitList[j].seqId !== item.seqId) {
                    for (let k = 0; k < this.currentRes.slitList.length; k++) {
                      if (this.currentRes.slitList[k].seqId === this.currentRes.slitList[j].seqId) {
                        this.tmpRow = this.currentRes.slitList[k]
                        this.focusInput = colum
                        this.$refs.slitTable.setCurrentRow(this.currentRes.slitList[k])
                        return
                      }
                    }
                  }
                }
              }
            }
          }
          index-- // 常规输入框处理
        }
        // 下 操作
        if ((index < this.currentRes.slitList.length - 1) && key === 40) {
          // 合并输入框按 下 键处理
          if (colum === 'maxWidth' || colum === 'sectionNum' || colum === 'seq' || colum === 'seqWeight') {
            for (let i = 0; i < this.currentRes.slitList.length; i++) {
              if (this.currentRes.slitList[i].seqId === item.seqId) {
                for (let j = i; j < this.currentRes.slitList.length; j++) {
                  if (this.currentRes.slitList[j].seqId !== item.seqId) {
                    this.tmpRow = this.currentRes.slitList[j]
                    this.focusInput = colum
                    this.$refs.slitTable.setCurrentRow(this.currentRes.slitList[j])
                    return
                  }
                }
              }
            }
          }
          index++ // 常规输入框处理
        }

        this.$refs.slitTable.setCurrentRow(this.currentRes.slitList[index])
        this.tmpRow = this.currentRes.slitList[index]
        this.focusInput = colum
      },
      doFocus2(item, index, colum, key, table) {
        // table 字段用于跨表聚焦
        let list = []
        if (table === 'cutTable') {
          if (key === 40 && (this.currentCut.cutDtList.length - 1) === index) {
            list = this.currentCut.cutDtManualList
            index = -1
          } else {
            list = this.currentCut.cutDtList
          }
        } else if (table === 'cutManualTable') {
          if (key === 38 && index === 0) {
            list = this.currentCut.cutDtList
            index = this.currentCut.cutDtList.length
          } else {
            list = this.currentCut.cutDtManualList
          }
        }
        if ((index > 0) && key === 38) {
          index--
        }
        if ((index < list.length - 1) && key === 40) {
          index++
        }
        this.$refs.cutTable.setCurrentRow(list[index])
        this.tmpRow = list[index]
        this.focusInput = colum
      },
      setHeaderClass({ row, column, rowIndex, columnIndex }) { // 设置表头类
        if (columnIndex === 0) {
          if (row[0].label === '+') {
            return 'table-header-bg text-center pointer table-add-icon'
          }
          return 'table-header-bg text-center pointer tab-ellipsis'
        } else {
          return 'table-header-bg text-center tab-ellipsis'
        }
      },
      isEdit(scope) { // 是否为可编辑状态
        if (this.action === 'add' || this.action === 'update') {
          if (this.currentRes.clearingId || this.currentRes.cutStatus > 1) { // 已结算或者平直加工中或加工完成无法修改
            return false
          }
          return true
        } else {
          return false
        }
      },
      deleteRes(index, row) {
        this.$confirm('确认删除该行？', '温馨提示', { type: 'warning' }).then(() => {
          this.formData.resList.splice(index, 1)
          if (row.id) {
            this.formData.resDelList.push(row.id)
          }
          this.currentRes = {}
          this.currentCut = {}
          // 货物解锁
          lock({
            revert: 1,
            stockIds: row.stockId
          })
        })
      },
      // calcTableHeader(obj, attrList) { // 计算表格头数据
      //   attrList.map((attr) => {
      //     obj[attr] = this.tableData.reduce((pre, cur) => {
      //       return pre + parseFloat(cur[attr])
      //     }, 0).toFixed(3)
      //   })
      // },
      resTableHeaderClick(column, event) { // 点击表头
        if (column.label === '+') {
          if (!this.formData.custId || this.formData.custId === '') {
            this.$alert('货主不能为空', '提示', {
              confirmButtonText: '确定'
            })
            return
          }
          this.$emit('showSelectGoods')
        }
      },
      resTableRowClick(row, event, column) { // 用料重量选中时调用
        this.currentRes = row
        if (this.currentRes.slitList.length === 0) {
          this.resetSlitDt(this.currentRes)
        }
        for (let i = 0; i < this.formData.resList.length; i++) {
          const v = this.formData.resList[i]
          if (v === this.currentRes) {
            this.resIdx = i
          }
        }
        this.currentCut = {}
      },
      resWeightFlagChange(res) { // 用料的重量方式修改时调用
        this.resetSlitDt(res)
      },
      resNumChange(res) { // 用料的数量修改时调用
        if (!res.num || res.num > res.storeNum) {
          res.num = res.storeNum
        }
        const weight1 = parseFloat((res.storeWeight1 / res.storeNum * res.num).toFixed(3))
        const weight2 = parseFloat((res.storeWeight2 / res.storeNum * res.num).toFixed(3))
        if (parseFloat(res.weight1) !== weight1 || parseFloat(res.weight2) !== weight2) {
          res.weight1 = weight1
          res.weight2 = weight2
          this.resetSlitDt(res)
        }
      },
      resetSlitDt(res) { // 重制分条开料信息
        res.slitList = []
        const slitDt = {
          seq: 'A', // 分刀
          seqWeight: parseFloat((res.weightFlag === 2 ? parseFloat(res.weight2) : parseFloat(res.weight1)).toFixed(3)), // 本刀重
          seqId: this.getUUID(), // 用于记录分刀之间的唯一性
          sectionNum: 1, // 段
          width: res.width, // 宽度
          num: 1, // 数量（条数）
          toCutNum: undefined, // 转平直数
          mixCut: 0, // 混平：0否，1是
          remark: '', // 备注
          excessManage: false, // 余料处理,false表示不是余料,true表示余料
          cutId: '', // 平直加工明细id
          weight: parseFloat((res.weightFlag === 1 ? parseFloat(res.weight1) : parseFloat(res.weight2)).toFixed(3)), // 重量
          maxWidth: res.width, // 分刀最大宽度
          cutToSlit: false, // 是否允许先平后分,true:允许,false:不允许
          handCode: res.handCode, // 货物编号
          maxSeqWeight: parseFloat((res.weightFlag === 1 ? parseFloat(res.weight1) : parseFloat(res.weight2)).toFixed(3)), // 本刀最大重量，（用户修改本刀中时，方便计算该刀最大的重量)
          idx: 1
        }
        res.slitList.push(slitDt)
      },
      slitTableRowClick(row, event, column) { // 分条开料明细选中时调用
        this.focusInput = ''
        if (row.cutId) {
          for (const v of this.formData.cutList) {
            if (v.id === row.cutId) { // 找到对应的转平直数据
              this.currentCut = v
              if (this.action === 'add' || this.action === 'update') {
                if (!this.currentCut.cutDtManualList || this.currentCut.cutDtManualList.length === 0) {
                  this.currentCut.cutDtManualList = [{
                    idx: '',
                    length: 0,
                    num: 0,
                    packNum: 0,
                    remark: '',
                    weight: 0,
                    maxWeight: '' // 用于计算最大重量
                  }]
                }
              }
            }
          }
        } else {
          this.currentCut = {}
        }
        this.tmpRow = row
      },
      cutTableClick(row, event, column) {
        this.focusInput = ''
        this.tmpRow = row
      },
      slitSeqChange(slitDt) {
        for (const v of this.currentRes.slitList) {
          if (v.seqId !== slitDt.seqId && v.seq === slitDt.seq) {
            this.$message.warning('分刀名称不能相同')
          }
        }
      },
      slitSeqDelete(slitDt) {
        if (slitDt.seq === '卷回板' || this.currentRes.slitList.length === 1) {
          return
        }
        const seqId = slitDt.seqId
        const seqWeight = parseFloat(slitDt.seqWeight)
        for (var i = this.currentRes.slitList.length - 1; i >= 0; i--) {
          const v = this.currentRes.slitList[i]
          if (v.seqId === seqId) {
            this.currentRes.slitList.splice(i, 1)
          }
        }
        if (this.currentRes.slitList.length === 0 || this.currentRes.slitList[this.currentRes.slitList.length - 1].seq !== '卷回板') {
          const temp = {
            seq: '卷回板', // 分刀
            seqWeight: seqWeight, // 本刀重
            seqId: this.getUUID(), // 用于记录分刀之间的唯一性
            sectionNum: 1, // 段
            width: this.currentRes.width, // 宽度
            num: 1, // 数量（条数）
            toCutNum: undefined, // 转平直数
            mixCut: 0, // 混平：0否，1是
            remark: '', // 备注
            excessManage: false, // 余料处理,false表示不是余料,true表示余料
            cutId: '', // 平直加工明细id
            weight: seqWeight, // 重量
            maxWidth: this.currentRes.width, // 分刀最大宽度
            cutToSlit: false, // 是否允许先平后分,true:允许,false:不允许
            handCode: this.currentRes.handCode, // 货物编号
            maxSeqWeight: seqWeight, // 本刀最大重量，（用户修改本刀中时，方便计算该刀最大的重量)
            idx: this.currentRes.slitList.length + 1
          }
          this.currentRes.slitList.push(temp)
        } else {
          const lastSlitDt = this.currentRes.slitList[this.currentRes.slitList.length - 1]
          lastSlitDt.seqWeight = parseFloat((parseFloat(lastSlitDt.seqWeight) + parseFloat(seqWeight)).toFixed(3))
          lastSlitDt.weight = parseFloat((parseFloat(lastSlitDt.weight) + parseFloat(seqWeight)).toFixed(3))
        }
        this.resetSlitIdx()
        this.resetSlitMaxSeqWeight()
        this.againCalCut() // 重新计算平直信息
      },
      resetSlitMaxSeqWeight() {
        var maxSeqWeight = parseFloat((this.currentRes.weightFlag === 2 ? parseFloat(this.currentRes.weight2) : parseFloat(this.currentRes.weight1)).toFixed(3))
        var seqWeight = 0
        var seqId = ''
        for (const v of this.currentRes.slitList) {
          if (seqId !== v.seqId) {
            if (v.seqId !== '') {
              maxSeqWeight = maxSeqWeight - seqWeight
            }
            seqId = v.seqId
            v.maxSeqWeight = maxSeqWeight
            seqWeight = v.weight
          } else {
            v.maxSeqWeight = maxSeqWeight
          }
        }
      },
      slitSeqWeightChange(slitDt) { // 修改本刀重
        if (!slitDt.seqWeight || parseFloat(slitDt.seqWeight) < 0) {
          slitDt.seqWeight = 0.0
        }
        if (parseFloat(slitDt.seqWeight) <= parseFloat(slitDt.maxSeqWeight)) {
          // 修改本刀的刀重
          for (const v of this.currentRes.slitList) {
            if (v.seqId === slitDt.seqId) {
              v.seqWeight = slitDt.seqWeight
            }
          }
          // 重新计算分刀重量
          var seqMaxSeqWeight = (this.currentRes.weightFlag === 1 ? parseFloat(this.currentRes.weight1) : parseFloat(this.currentRes.weight2)).toFixed(3)
          var useSeqWeight = this.currentRes.slitList[0].seqWeight
          var seqId = this.currentRes.slitList[0].seqId
          for (const v of this.currentRes.slitList) {
            if (v.seqId === seqId) {
              v.maxSeqWeight = seqMaxSeqWeight
              v.seqWeight = useSeqWeight
            } else {
              seqId = v.seqId
              if (parseFloat((seqMaxSeqWeight - useSeqWeight).toFixed(3)) <= 0) {
                this.currentRes.slitList.splice(v.idx - 1, this.currentRes.slitList.length)
                // 重新计算所有分条的重量
                this.resetSlitWeight(this.currentRes)
                this.againCalCut() // 重新计算平直信息
                return
              } else {
                if (v.seq === '卷回板') {
                  continue
                }
                seqMaxSeqWeight = parseFloat((seqMaxSeqWeight - useSeqWeight).toFixed(3))
                if (v.seqWeight > seqMaxSeqWeight) { // 本刀中大于本刀最大重量，则需要重制本刀重
                  v.seqWeight = seqMaxSeqWeight
                }
                useSeqWeight = v.seqWeight
                v.maxSeqWeight = seqMaxSeqWeight
              }
            }
          }
          // 如果最大重量还有剩余 则生成一条卷回板数据
          seqMaxSeqWeight = parseFloat((seqMaxSeqWeight - useSeqWeight).toFixed(3))
          if (seqMaxSeqWeight > 0) {
            const lastSlitDt = this.currentRes.slitList[this.currentRes.slitList.length - 1]
            if (lastSlitDt.seq === '卷回板') { // 判断最后一条是不是卷回板
              lastSlitDt.seqWeight = seqMaxSeqWeight
              lastSlitDt.weight = seqMaxSeqWeight
              lastSlitDt.maxSeqWeight = seqMaxSeqWeight
            } else {
              const temp = {
                seq: '卷回板', // 分刀
                seqWeight: seqMaxSeqWeight, // 本刀重
                seqId: this.getUUID(), // 用于记录分刀之间的唯一性
                sectionNum: 1, // 段
                width: this.currentRes.width, // 宽度
                num: 1, // 数量（条数）
                toCutNum: undefined, // 转平直数
                mixCut: 0, // 混平：0否，1是
                remark: '', // 备注
                excessManage: false, // 余料处理,false表示不是余料,true表示余料
                cutId: '', // 平直加工明细id
                weight: seqMaxSeqWeight, // 重量
                maxWidth: this.currentRes.width, // 分刀最大宽度
                cutToSlit: false, // 是否允许先平后分,true:允许,false:不允许
                handCode: this.currentRes.handCode, // 货物编号
                maxSeqWeight: seqMaxSeqWeight, // 本刀最大重量，（用户修改本刀中时，方便计算该刀最大的重量)
                idx: this.currentRes.slitList.length + 1
              }
              this.currentRes.slitList.push(temp)
            }
          }
          // 重新计算所有分条的重量
          this.resetSlitWeight(this.currentRes)
          this.againCalCut() // 重新计算平直信息
        } else {
          this.$message.warning('重量不能大于' + slitDt.maxSeqWeight)
          // slitDt.seqWeight = slitDt.maxSeqWeight
          // slitDt.weight = slitDt.maxSeqWeight
        }
      },
      sectionNumChange(slitDt) { // 段数修改时调用
        if (!slitDt.sectionNum || parseInt(slitDt.sectionNum) < 0) {
          slitDt.sectionNum = 0
        }
        if (slitDt.sectionNum !== 1) {
          slitDt.cutToSlit = false
        }
        for (const v of this.currentRes.slitList) {
          if (v.seqId === slitDt.seqId) {
            v.sectionNum = slitDt.sectionNum
          }
        }
      },
      maxWidthChange(slitDt) { // 最大宽度修改时调用
        if (!slitDt.maxWidth || slitDt.maxWidth < this.currentRes.width) {
          slitDt.maxWidth = this.currentRes.width
        }
        // 重新计算每条分条明细的最大宽度
        var maxWidth = slitDt.maxWidth - (slitDt.width * slitDt.num)
        var idx = -1
        for (let i = slitDt.idx; i < this.currentRes.slitList.length; i++) {
          const v = this.currentRes.slitList[i]
          if (slitDt.seqId === v.seqId) {
            v.maxWidth = maxWidth
            if (v.maxWidth < v.width * v.num) {
              v.width = parseFloat((v.maxWidth / v.num).toFixed(2))
            }
            maxWidth = maxWidth - (v.width * v.num)
            idx = v.idx
          }
        }
        if (idx !== -1 && maxWidth > 0) {
          const lastSlitDt = this.currentRes.slitList[idx - 1]
          lastSlitDt.width = (parseFloat(lastSlitDt.width) + parseFloat(maxWidth)).toFixed(0)
        }
        this.resetSlitWeight(this.currentRes)
        this.againCalCut() // 重新计算平直信息
      },
      slitWidthChange(slitDt) {
        if (slitDt.width !== this.currentRes.width) {
          slitDt.cutToSlit = false
        }
        if (!slitDt.width) {
          this.$message.warning('请填写宽度')
          return
        }
        if (slitDt.width * slitDt.num >= slitDt.maxWidth) {
          if (slitDt.width * slitDt.num > slitDt.maxWidth) {
            this.$message.warning('宽度总和不能大于' + slitDt.maxWidth)
          }
          slitDt.width = parseFloat((slitDt.maxWidth / slitDt.num).toFixed(2))
          // slitDt.weight = (slitDt.width / this.currentRes.width * slitDt.seqWeight).toFixed(3)
          for (var i = this.currentRes.slitList.length - 1; i >= slitDt.idx; i--) {
            const v = this.currentRes.slitList[i]
            if (v.seqId === slitDt.seqId) {
              this.currentRes.slitList.splice(i, 1)
            }
          }
          this.resetSlitIdx() // 重新计算下标
          this.resetSlitWeight(this.currentRes) // 重新计算所有分条的重量
        } else if (slitDt.width * slitDt.num < slitDt.maxWidth) {
          this.againCalMaxWidth(slitDt)
          this.resetSlitIdx() // 重新计算下标
        }
        this.againCalCut()
      },
      slitNumChange(slitDt) {
        if (!parseInt(slitDt.num)) {
          slitDt.num = 1
        } else {
          slitDt.num = parseInt(slitDt.num)
        }
        if (slitDt.num !== 1) {
          slitDt.cutToSlit = false
        }
        if (slitDt.width * slitDt.num >= slitDt.maxWidth) {
          if (slitDt.width * slitDt.num > slitDt.maxWidth) {
            this.$message.warning('宽度总和不能大于' + slitDt.maxWidth)
          }
          slitDt.num = parseInt((slitDt.maxWidth / slitDt.width).toFixed(0))
          for (var i = this.currentRes.slitList.length - 1; i >= slitDt.idx; i--) {
            const v = this.currentRes.slitList[i]
            if (v.seqId === slitDt.seqId) {
              this.currentRes.slitList.splice(i, 1)
            }
          }
          this.resetSlitIdx() // 重新计算下标
          this.resetSlitWeight(this.currentRes) // 重新计算所有分条的重量
        } else if (slitDt.width * slitDt.num < slitDt.maxWidth) {
          this.againCalMaxWidth(slitDt)
        }
      },
      againCalMaxWidth(slitDt) {
        // 计算本条分条的重量
        // slitDt.weight = (slitDt.width / this.currentRes.width * slitDt.seqWeight).toFixed(3)
        var idx = -1
        var maxWidth = parseFloat((slitDt.maxWidth - (slitDt.width * slitDt.num)).toFixed(2))
        for (let i = slitDt.idx; i < this.currentRes.slitList.length; i++) {
          const v = this.currentRes.slitList[i]
          if (v.seqId === slitDt.seqId) {
            v.maxWidth = maxWidth
            if (v.maxWidth < v.width * v.num) {
              v.width = parseFloat((v.maxWidth / v.num).toFixed(2))
            }
            // v.weight = (v.width / this.currentRes.width * v.seqWeight).toFixed(3)
            maxWidth = maxWidth - (v.width * v.num)
            idx = v.idx
          }
        }
        if (idx !== -1) {
          if (maxWidth <= 0) { // 检测是否存在宽度为0的数据
            for (let j = this.currentRes.slitList.length - 1; j >= slitDt.idx; j--) {
              const v = this.currentRes.slitList[j]
              if (v.seqId === slitDt.seqId && v.maxWidth <= 0) {
                this.currentRes.slitList.splice(j, 1)
              }
            }
            this.resetSlitIdx() // 重新计算下标
          } else { // 把剩下的宽度加到最后一条
            const lastSlitDt = this.currentRes.slitList[idx - 1]
            lastSlitDt.width = (parseFloat(lastSlitDt.width) + (parseFloat(maxWidth) / parseFloat(lastSlitDt.num))).toFixed(2)
            // lastSlitDt.weight = (lastSlitDt.width / this.currentRes.width * lastSlitDt.seqWeight).toFixed(3)
          }
        } else {
          // 自动生成下一跳分条信息
          const temp = {
            seq: slitDt.seq, // 分刀
            seqWeight: slitDt.seqWeight, // 本刀重
            seqId: slitDt.seqId, // 用于记录分刀之间的唯一性
            sectionNum: slitDt.sectionNum, // 段
            width: parseFloat((slitDt.maxWidth - slitDt.width).toFixed(2)), // 宽度
            num: 1, // 数量（条数）
            toCutNum: undefined, // 转平直数
            mixCut: 0, // 混平：0否，1是
            remark: '', // 备注
            excessManage: false, // 余料处理,false表示不是余料,true表示余料
            cutId: '', // 平直加工明细id
            weight: 0, // 重量
            maxWidth: maxWidth, // 分刀最大宽度
            cutToSlit: false, // 是否允许先平后分,true:允许,false:不允许
            handCode: this.currentRes.handCode, // 货物编号
            maxSeqWeight: slitDt.maxSeqWeight, // 本刀最大重量，（用户修改本刀中时，方便计算该刀最大的重量)
            idx: slitDt.idx + 1
          }
          // temp.weight = (temp.width / this.currentRes.width * temp.seqWeight).toFixed(3)
          this.currentRes.slitList.splice(slitDt.idx, 0, temp)
          this.resetSlitIdx() // 重新计算下标
        }
        this.resetSlitWeight(this.currentRes) // 重新计算所有分条的重量
        this.againCalCut() // 重新计算平直信息
      },
      resetSlitIdx() { // 重新设置排序字段
        var idx = 1
        for (const v of this.currentRes.slitList) {
          v.idx = idx
          idx++
        }
      },
      resetSlitWeight(res) { // 重新计算分条宽度对应的重量
        var seqId = ''
        var maxWidth
        for (var i = 0; i < res.slitList.length; i++) {
          const v = res.slitList[i]
          if (seqId !== v.seqId) {
            seqId = v.seqId
            maxWidth = v.maxWidth
          }
          v.weight = Math.floor((v.width * v.num / maxWidth * v.seqWeight) * 1000) / 1000
        }
        // 计算分到最后一条的精度计算
        seqId = ''
        var seqWeight = 0
        for (var j = 0; j < res.slitList.length; j++) {
          const v = res.slitList[j]
          if (seqId !== v.seqId) {
            if (seqId !== '') {
              const front = res.slitList[j - 1]
              front.weight = parseFloat((front.seqWeight - (seqWeight - front.weight)).toFixed(3))
            }
            seqId = v.seqId
            seqWeight = v.weight
          } else {
            seqWeight += v.weight
          }
        }
        if (res.slitList.length > 0) {
          const last = res.slitList[res.slitList.length - 1]
          last.weight = (last.seqWeight - (seqWeight - last.weight)).toFixed(3)
        }
      },
      toCutNumChange(slitDt) { // 转平直数修改时调用
        if (!slitDt.toCutNum || !parseInt(slitDt.toCutNum)) {
          if (slitDt.cutId) {
            for (let i = 0; i < this.formData.cutList.length; i++) {
              if (this.formData.cutList[i].id === slitDt.cutId) { // 找到对应的转平直数据并删除
                this.formData.cutList.splice(i, 1)
                this.currentCut = {}
                break
              }
            }
          }
          slitDt.cutId = ''
          slitDt.mixCut = 0
          return
        }
        slitDt.toCutNum = parseInt(slitDt.toCutNum)
        if (slitDt.toCutNum !== this.currentRes.num * slitDt.sectionNum * slitDt.num) {
          slitDt.cutToSlit = false
        }
        if (slitDt.toCutNum) { // 存在转平直数
          const totalNum = slitDt.num * slitDt.sectionNum * this.currentRes.num // 总条数
          if (slitDt.toCutNum > totalNum) { // 大于总条数
            slitDt.toCutNum = totalNum
          }
          if (slitDt.cutId) { // 已存在平直开料信息
            this.againCalCut()
          } else { // 不存在平直开料信息
            const cut = {
              id: this.getUUID(),
              thickness: this.currentRes.thickness, // 厚度
              width: slitDt.width, // 宽度
              weight: parseFloat((slitDt.weight / totalNum * slitDt.toCutNum).toFixed(3)), // 重量
              num: slitDt.toCutNum, // 数量
              cutDtList: [{ // 平直开料明细
                idx: 1,
                length: 0,
                num: 0,
                packNum: 0,
                remark: '',
                weight: parseFloat((slitDt.weight / totalNum * slitDt.toCutNum).toFixed(3)),
                maxWeight: parseFloat((slitDt.weight / totalNum * slitDt.toCutNum).toFixed(3)) // 用于计算最大重量
              }],
              cutDtManualList: [{
                idx: '',
                length: 0,
                num: 0,
                packNum: 0,
                remark: '',
                weight: 0,
                maxWeight: '' // 用于计算最大重量
              }]
            }
            slitDt.cutId = cut.id
            this.formData.cutList.push(cut)
          }
        }
        this.slitTableRowClick(slitDt)
      },
      mixCutChange(slitDt) {
        if (parseInt(slitDt.mixCut) === 1) {
          const thickness = this.currentRes.thickness
          const width = slitDt.width
          for (const res of this.formData.resList) {
            if (parseFloat(res.thickness) === parseFloat(thickness)) {
              for (const sdt of res.slitList) {
                if (sdt.toCutNum > 0 && parseInt(sdt.mixCut) === 1 && parseFloat(sdt.width) === parseFloat(width)) {
                  sdt.cutId = slitDt.cutId
                }
              }
            }
          }
          this.againCalCut() // 重新计算平直信息(因为原本的混平信息需要重新计算)
        } else {
          if (slitDt.cutId) { // 存在由混平变为非混平
            const totalNum = slitDt.num * slitDt.sectionNum * this.currentRes.num // 总条数
            const cut = {
              id: this.getUUID(),
              thickness: this.currentRes.thickness, // 厚度
              width: slitDt.width, // 宽度
              weight: (slitDt.weight / totalNum * slitDt.toCutNum).toFixed(3), // 重量
              num: slitDt.toCutNum, // 数量
              cutDtList: [{ // 平直开料明细
                idx: 1,
                length: 0,
                num: 0,
                packNum: 0,
                remark: '',
                weight: parseFloat((slitDt.weight / totalNum * slitDt.toCutNum).toFixed(3)),
                maxWeight: parseFloat((slitDt.weight / totalNum * slitDt.toCutNum).toFixed(3)) // 用于计算最大重量
              }],
              cutDtManualList: [{
                idx: '',
                length: 0,
                num: 0,
                packNum: 0,
                remark: '',
                weight: 0,
                maxWeight: '' // 用于计算最大重量
              }]
            }
            slitDt.cutId = cut.id
            this.formData.cutList.push(cut)
            this.againCalCut() // 重新计算平直信息(因为原本的混平信息需要重新计算)
          }
        }
      },
      againCalCut() { // 重新计算平直数据
        for (var i = this.formData.cutList.length - 1; i >= 0; i--) {
          const cut = this.formData.cutList[i]
          var cutWeight = 0.0
          var cutNum = 0
          var width = 0
          for (const res of this.formData.resList) {
            for (const slitDt of res.slitList) {
              if (cut.id === slitDt.cutId) {
                const totalNum = slitDt.num * slitDt.sectionNum * res.num // 总条数
                cutWeight += (slitDt.weight / totalNum * slitDt.toCutNum)
                cutNum += slitDt.toCutNum
                width = slitDt.width
              }
            }
          }
          cutWeight = parseFloat(cutWeight.toFixed(3))
          cutNum = parseInt(cutNum.toFixed(0))
          if (parseFloat(cutWeight) === 0 || parseFloat(cutNum) === 0) {
            this.formData.cutList.splice(i, 1) // 删除该平直信息
          } else if (parseFloat(cut.weight) !== parseFloat(cutWeight) || parseInt(cut.num) !== parseInt(cutNum)) { // 若平直总重量 或者 总数量不相等时，重制平直开料信息
            cut.width = width
            cut.weight = cutWeight
            cut.num = cutNum
            cut.cutDtList = [{ // 平直开料明细
              idx: 1,
              length: 0,
              num: 0,
              packNum: 0,
              remark: '',
              weight: cutWeight,
              maxWeight: cutWeight
            }]
            cut.cutDtManualList = [{
              idx: '',
              length: 0,
              num: 0,
              packNum: 0,
              remark: '',
              weight: 0,
              maxWeight: '' // 用于计算最大重量
            }]
          }
        }
      },
      cutDtLengthChange(cutDt) { // 平直长度修改 自动计算件数
        if (parseFloat(cutDt.length)) {
          if (!parseFloat(cutDt.num)) {
            const num = parseInt((cutDt.weight / cutDt.length / this.currentCut.width / this.currentCut.thickness / this.currentRes.density * 1e9).toFixed(0)) // 公式: 开料件数=重量/长度/宽度/厚度/密度(默认7.85)*1000,000,000
            cutDt.num = num
          }
        } else {
          cutDt.length = 0
          this.$message.warning('请输入长度')
        }
      },
      cutDtNumChange(cutDt) {
        if (!cutDt.length) {
          cutDt.num = 0
          return
        }
        var weight = parseFloat((cutDt.length * this.currentCut.width * this.currentCut.thickness * this.currentRes.density / 1000000000 * cutDt.num).toFixed(3))
        // 后面目的是为了解决当时计算件数的精度问题 导致重量计算错误
        const num = parseInt((cutDt.maxWeight / cutDt.length / this.currentCut.width / this.currentCut.thickness / this.currentRes.density * 1e9).toFixed(0)) // 公式: 开料件数=重量/长度/宽度/厚度/密度(默认7.85)*1000,000,000
        if (parseInt(cutDt.num) >= parseInt(num)) {
          weight = cutDt.maxWeight
        }
        // ---
        if (parseFloat(weight) > parseFloat(cutDt.maxWeight)) {
          weight = cutDt.maxWeight
        }
        if (parseFloat(weight) <= parseFloat(cutDt.maxWeight) && parseFloat(cutDt.weight) !== parseFloat(weight)) {
          const nextMaxWeight = parseFloat((cutDt.maxWeight - weight).toFixed(3))
          cutDt.weight = weight // 设置计算出来的重量
          this.currentCut.cutDtList.splice(cutDt.idx, this.currentCut.cutDtList.length - cutDt.idx) // 删除后面所有平直开料明细
          if (nextMaxWeight > 0) {
            const newCutDt = {
              idx: cutDt.idx + 1,
              length: 0,
              num: 0,
              packNum: 0,
              remark: '',
              weight: nextMaxWeight,
              maxWeight: nextMaxWeight // 用于计算最大重量
            }
            this.currentCut.cutDtList.push(newCutDt)
          }
        }
      },
      toGoodsFlow(row) {
        this.$router.push({ path: findPathByModuleCode('stockLog'), query: { handCode: row.handCode }})
      },
      getUUID() {
        var uuid = require('node-uuid')
        return uuid.v1().replace(/\-/g, '')
      },
      arraySpanMethod({ row, column, rowIndex, columnIndex }) { // 分条行合并
        var firstIdx = -1
        if (columnIndex === 2 || columnIndex === 3 || columnIndex === 4 || (this.currentRes.allowUltraWide && columnIndex === 5)) {
          var length = 0
          for (const v of this.currentRes.slitList) {
            if (v.seqId === row.seqId) {
              length++
              if (firstIdx === -1) {
                firstIdx = v.idx
              }
            }
          }
          if (row.idx === firstIdx) {
            return { rowspan: length, colspan: 1 }
          } else {
            return { rowspan: 0, colspan: 0 }
          }
        }
      },
      machTypeChange(machType) {
        if (machType.isMulti === 1) {
          this.formData.multiMachTypeId = machType.id
          this.formData.slitMachTypeId = ''
          this.formData.cutMachTypeId = ''
          this.formData.isMulti = 1
        } else {
          this.formData.isMulti = 0
          this.formData.multiMachTypeId = ''
          this.formData.slitMachTypeId = machType.id
        }
      },
      isAllowCopySlit() {
        // 校验当前分条是否只分一刀,分多刀不能复制
        if (this.currentRes.allowUltraWide) {
          return false
        }
        if (!this.currentRes.slitList) {
          return false
        }
        var seq = ''
        for (const slitDt of this.currentRes.slitList) {
          if (!seq) {
            seq = slitDt.seq
          }
          if (seq !== slitDt.seq) {
            return false
          }
        }
        // 校验后面是否相同规格的数据
        if (this.resIdx === this.formData.resList.length - 1) {
          return false
        }
        for (let i = this.resIdx + 1; i < this.formData.resList.length; i++) {
          const v = this.formData.resList[i]
          if (parseFloat(v.thickness) === parseFloat(this.currentRes.thickness) && parseFloat(v.width) === parseFloat(this.currentRes.width)) {
            return true
          }
        }
        return false
      },
      copySLit() {
        for (let i = this.resIdx + 1; i < this.formData.resList.length; i++) {
          const v = this.formData.resList[i]
          if (v.thickness === this.currentRes.thickness && v.width === this.currentRes.width) {
            const slitList = []
            const seqId = this.getUUID()
            for (const slitDt of this.currentRes.slitList) {
              const temp = {
                seq: slitDt.seq, // 分刀
                seqWeight: 0, // 本刀重
                seqId: seqId, // 用于记录分刀之间的唯一性
                sectionNum: slitDt.sectionNum, // 段
                width: slitDt.width, // 宽度
                num: slitDt.num, // 数量（条数）
                toCutNum: undefined, // 转平直数
                mixCut: 0, // 混平：0否，1是
                remark: slitDt.remark, // 备注
                excessManage: false, // 余料处理,false表示不是余料,true表示余料
                cutId: '', // 平直加工明细id
                weight: 0, // 重量
                maxWidth: slitDt.maxWidth, // 分刀最大宽度
                cutToSlit: false, // 是否允许先平后分,true:允许,false:不允许
                handCode: v.handCode, // 货物编号
                maxSeqWeight: slitDt.maxSeqWeight, // 本刀最大重量，（用户修改本刀中时，方便计算该刀最大的重量)
                idx: slitDt.idx
              }
              if (v.weightFlag === 1) {
                temp.seqWeight = v.weight1
              } else if (v.weightFlag === 2) {
                temp.seqWeight = v.weight2
              }
              slitList.push(temp)
            }
            v.slitList = slitList
            this.resetSlitWeight(v)
          }
        }
        this.againCalCut() // 重新计算平直信息
      },
      changeAllowUltraWide() {
        if (!this.currentRes.allowUltraWide) {
          var seqId = ''
          for (const slitDt of this.currentRes.slitList) {
            if (seqId !== slitDt.seqId) {
              seqId = slitDt.seqId
              slitDt.maxWidth = this.currentRes.width
              this.slitWidthChange(slitDt)
            }
          }
        }
      },
      addCutDtManual() {
        const newCutDt = {
          idx: '',
          length: 0,
          num: 0,
          packNum: 0,
          remark: '',
          weight: 0,
          maxWeight: '' // 用于计算最大重量
        }
        this.currentCut.cutDtManualList.push(newCutDt)
      },
      deleteCutDtManual(index) {
        this.currentCut.cutDtManualList.splice(index, 1)
      },
      calManualWeight(cutDt) { // 计算手工平直对应的重量
        if (!cutDt.length) {
          return
        }
        if (!cutDt.num) {
          return
        }
        cutDt.weight = parseFloat((cutDt.length * this.currentCut.width * this.currentCut.thickness * this.currentRes.density / 1000000000 * cutDt.num).toFixed(3))
      }
    }
  }
</script>

<style lang="scss">

</style>
