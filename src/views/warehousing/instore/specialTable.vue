<template>
  <div class="specialTable">
    <el-table :data="usedTableData" @header-click="dealHeaderClick" @row-click="handleRowClick"   @row-dblclick="handleRowDbClick"
              :header-cell-class-name="setHeaderClass" row-class-name="pointer text-center" border stripe highlight-current-row
              height="400" ref="table1">
      <el-table-column label="+" width="70" v-if="isEdit&&model =='normal'">
        <template slot-scope="scope">
          <i class="el-icon-delete" @click="remove(scope.row,scope.$index)"></i>
          <i class="el-icon-picture" @click="dispalyModel(scope.row,scope.$index)"></i>
        </template>
      </el-table-column>
      <el-table-column sortable label="操作" width="70" v-if="!isEdit&&(model =='normal' ||model =='ysh' )">
        <template slot-scope="scope">
          <i class="el-icon-picture" @click="dispalyModel(scope.row,scope.$index)"></i>
        </template>
      </el-table-column>

      <el-table-column sortable label="操作" width="70" v-if="isEdit&&(model ==='yshgd'||model==='check2InStore')">
        <template slot-scope="scope">
          <i class="el-icon-delete" @click="remove(scope.row,scope.$index)"></i>
          <i class="el-icon-picture" @click="dispalyModel(scope.row,scope.$index)"></i>
        </template>
      </el-table-column>
      <el-table-column label="序号" width="50">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="编号" width="140">
        <template slot-scope="scope">
          <el-input v-model="scope.row.handCode" v-if="scope.row.rowFlag==checkRow.rowFlag && isEdit"
                    v-focus:handCode="scope.row.rowFlag==checkRow.rowFlag"
                    @blur="checkHandCode(scope.row)" size="mini" @click.native="selectItem(scope.$index,'handCode')"
                    @keyup.native.f9="copyCol(scope.row,scope.$index,'handCode', $event)"
                    @keyup.native.enter="copy(scope.row,scope.$index)"
                    @keyup.native.38="doFocus(scope.row,scope.$index,'handCode',38)"
                    @keyup.native.40="doFocus(scope.row,scope.$index,'handCode',40)"
                    @keyup.native.37="doFocus(scope.row,scope.$index,'handCode',37)"
                    @keyup.native.39="doFocus(scope.row,scope.$index,'steelCode',39)"
                    @focus="focus($event)"
          >
          </el-input>
          <span v-bind:class="{ 'active': scope.row.confirmFinish === 1&&isEdit, 'red': scope.row.isUsed === 1 }" v-else>{{scope.row.handCode}}</span>
        </template>
      </el-table-column>
          <el-table-column sortable label="钢卷号" width="140" prop="steelCode">
            <template slot-scope="scope">
              <el-input v-model="scope.row.steelCode" v-if="scope.row.rowFlag==checkRow.rowFlag && isEdit" size="mini"
                        maxlength="50"
                        v-focus:steelCode="scope.row.rowFlag===checkRow.rowFlag"
                        @click.native="selectItem(scope.$index,'steelCode')"
                        @keyup.native.f9="copyCol(scope.row,scope.$index,'steelCode')"
                        @keyup.native.enter="copy(scope.row,scope.$index)"
                        @keyup.native.38="doFocus(scope.row,scope.$index,'steelCode',38)"
                        @keyup.native.40="doFocus(scope.row,scope.$index,'steelCode',40)"
                        @keyup.native.37="doFocus(scope.row,scope.$index,'handCode',37)"
                        @keyup.native.39="doFocus(scope.row,scope.$index,'typeId',39)"
                        @focus="focus($event)"
              >
              </el-input>
              <span v-else v-bind:class="{ active: scope.row.confirmFinish==1&&isEdit }">{{scope.row.steelCode}}</span>
            </template>
      </el-table-column>
      <el-table-column sortable label="品名" width="150" prop="typeId">
        <template slot-scope="scope">
          <type-select v-model="scope.row.typeId" v-if="scope.row.rowFlag==checkRow.rowFlag && isEdit"
                       v-focus:typeId="scope.row.rowFlag===checkRow.rowFlag"
                       @click.native="selectItem(scope.$index,'typeId')"
                       @keyup.native.f9="copyCol(scope.row,scope.$index,'typeId')"
                       @keyup.native.enter="copy(scope.row,scope.$index)"
                       @keyup.native.38="doFocus(scope.row,scope.$index,'typeId',38)"
                       @keyup.native.40="doFocus(scope.row,scope.$index,'typeId',40)"
                       @keyup.native.37="doFocus(scope.row,scope.$index,'steelCode',37)"
                       @keyup.native.39="doFocus(scope.row,scope.$index,'specName',39)"
                       @focus.native="focus($event)"
          >

          </type-select>
          <!--<type-select v-model="scope.row.typeId" v-if="scope.row.rowFlag==checkRow.rowFlag"-->
          <!--size="mini"></type-select>-->
          <span v-else v-bind:class="{ active: scope.row.confirmFinish==1&&isEdit }">{{typeNamechange(scope.row.typeId,scope.$index)}}</span>
        </template>
      </el-table-column>



      <el-table-column sortable label="规格" width="140" prop="specName">
        <template slot-scope="scope">
          <el-input v-model="scope.row.specName" @input="formatSpecName(scope.row)"
                    v-if="scope.row.rowFlag==checkRow.rowFlag && isEdit" size="mini"
                    v-focus:specName="scope.row.rowFlag==checkRow.rowFlag"
                    @click.native="selectItem(scope.$index,'specName')"
                    @keyup.native.f9="copyCol(scope.row,scope.$index,'specName')"
                    @keyup.native.enter="copy(scope.row,scope.$index)"
                    @keyup.native.38="doFocus(scope.row,scope.$index,'specName',38)"
                    @keyup.native.40="doFocus(scope.row,scope.$index,'specName',40)"
                    @keyup.native.37="doFocus(scope.row,scope.$index,'typeId',37)"
                    @keyup.native.39="doFocus(scope.row,scope.$index,'parea',39)"
                    @focus="focus($event)"
          >
          </el-input>
          <span v-else v-bind:class="{ active: scope.row.confirmFinish==1&&isEdit }">{{scope.row.specName}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="产地" width="120" prop="parea">
        <template slot-scope="scope">
          <factory-select v-model="scope.row.parea" v-if="scope.row.rowFlag==checkRow.rowFlag && isEdit"
                          size="mini"
                          v-focus:parea="scope.row.rowFlag==checkRow.rowFlag"
                          @click.native="selectItem(scope.$index,'parea')"
                          @keyup.native.f9="copyCol(scope.row,scope.$index,'parea')"
                          @keyup.native.enter="copy(scope.row,scope.$index)"
                          @keyup.native.38="doFocus(scope.row,scope.$index,'parea',38)"
                          @keyup.native.40="doFocus(scope.row,scope.$index,'parea',40)"
                          @keyup.native.37="doFocus(scope.row,scope.$index,'specName',37)"
                          @keyup.native.39="doFocus(scope.row,scope.$index,'grade',39)"
                          @focus.native="focus($event)"
          ></factory-select>
          <span v-else v-bind:class="{ active: scope.row.confirmFinish==1&&isEdit }">{{scope.row.parea}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="材质" width="80" prop="grade">
        <template slot-scope="scope">
          <el-input v-model="scope.row.grade" v-if="scope.row.rowFlag==checkRow.rowFlag && isEdit" size="mini"
                    maxlength="50"
                    v-focus:grade="scope.row.rowFlag==checkRow.rowFlag"
                    @click.native="selectItem(scope.$index,'grade')"
                    @keyup.native.f9="copyCol(scope.row,scope.$index,'grade')"
                    @keyup.native.enter="copy(scope.row,scope.$index)"
                    @keyup.native.38="doFocus(scope.row,scope.$index,'grade',38)"
                    @keyup.native.40="doFocus(scope.row,scope.$index,'grade',40)"
                    @keyup.native.37="doFocus(scope.row,scope.$index,'parea',37)"
                    @keyup.native.39="doFocus(scope.row,scope.$index,'weight2',39)"
                    @focus="focus($event)"
          >
          </el-input>
          <span v-else v-bind:class="{ active: scope.row.confirmFinish==1&&isEdit }">{{scope.row.grade}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable :label="'净重['+ tableHeader.weight2+']'" width="116" prop="weight2">
        <template slot-scope="scope" >
          <number-input decimal="10,3" v-model="scope.row.weight2" v-if="scope.row.rowFlag==checkRow.rowFlag && isEdit"
                        size="mini"
                        v-focus:weight2="scope.row.rowFlag==checkRow.rowFlag"
                        @click.native="selectItem(scope.$index,'weight2')"
                        @keyup.native.f9="copyCol(scope.row,scope.$index,'weight2')"
                        @keyup.native.enter="copy(scope.row,scope.$index)"
                        @keyup.native.38="doFocus(scope.row,scope.$index,'weight2',38)"
                        @keyup.native.40="doFocus(scope.row,scope.$index,'weight2',40)"
                        @keyup.native.37="doFocus(scope.row,scope.$index,'grade',37)"
                        @keyup.native.39="doFocus(scope.row,scope.$index,'weight4',39)"
                        @focus.native="focus($event)"
          >
          </number-input>
          <span v-else v-bind:class="{ active: scope.row.confirmFinish==1&&isEdit }">{{scope.row.weight2}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable :label="'毛重['+ tableHeader.weight4+']'" width="116" prop="weight4">
        <template slot-scope="scope">
          <number-input decimal="10,3" v-model="scope.row.weight4" v-if="scope.row.rowFlag==checkRow.rowFlag && isEdit"
                        size="mini"
                        v-focus:weight4="scope.row.rowFlag==checkRow.rowFlag"
                        @click.native="selectItem(scope.$index,'weight4')"
                        @keyup.native.f9="copyCol(scope.row,scope.$index,'weight4')"
                        @keyup.native.enter="copy(scope.row,scope.$index)"
                        @keyup.native.38="doFocus(scope.row,scope.$index,'weight4',38)"
                        @keyup.native.40="doFocus(scope.row,scope.$index,'weight4',40)"
                        @keyup.native.37="doFocus(scope.row,scope.$index,'weight2',37)"
                        @keyup.native.39="doFocus(scope.row,scope.$index,'weight1',39)"
                        @focus.native="focus($event)"
          >
          </number-input>
          <span v-else v-bind:class="{ active: scope.row.confirmFinish==1&&isEdit }">{{scope.row.weight4}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable :label="'磅重['+ tableHeader.weight1+']'" width="116" prop="weight1">
        <template slot-scope="scope">
          <number-input decimal="10,3" v-model="scope.row.weight1" v-if="scope.row.rowFlag==checkRow.rowFlag && isEdit"
                        size="mini"
                        v-focus:weight1="scope.row.rowFlag==checkRow.rowFlag"
                        @click.native="selectItem(scope.$index,'weight1')"
                        @keyup.native.f9="copyCol(scope.row,scope.$index,'weight1')"
                        @keyup.native.enter="copy(scope.row,scope.$index)"
                        @keyup.native.38="doFocus(scope.row,scope.$index,'weight1',38)"
                        @keyup.native.40="doFocus(scope.row,scope.$index,'weight1',40)"
                        @keyup.native.37="doFocus(scope.row,scope.$index,'weight4',37)"
                        @keyup.native.39="doFocus(scope.row,scope.$index,'num',39)"
                        @focus.native="focus($event)"
          >
          </number-input>
          <span v-else v-bind:class="{ active: scope.row.confirmFinish==1&&isEdit }">{{scope.row.weight1}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable :label="'数量['+tableHeader.num+']'" width="100" prop="num">
        <template slot-scope="scope">
          <number-input decimal="10" v-model="scope.row.num" v-if="scope.row.rowFlag==checkRow.rowFlag && isEdit"
                        size="mini"
                        v-focus:num="scope.row.rowFlag==checkRow.rowFlag"
                        @click.native="selectItem(scope.$index,'num')"
                        @keyup.native.f9="copyCol(scope.row,scope.$index,'num')"
                        @keyup.native.enter="copy(scope.row,scope.$index)"
                        @keyup.native.38="doFocus(scope.row,scope.$index,'num',38)"
                        @keyup.native.40="doFocus(scope.row,scope.$index,'num',40)"
                        @keyup.native.37="doFocus(scope.row,scope.$index,'weight1',37)"
                        @keyup.native.39="doFocus(scope.row,scope.$index,'unit',39)"
                        @focus.native="focus($event)"
          >
          </number-input>
          <span v-else v-bind:class="{ active: scope.row.confirmFinish==1&&isEdit }">{{scope.row.num}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="数量单位" width="100" prop="unit">
        <template slot-scope="scope">
          <unit-select v-model="scope.row.unit" v-if="scope.row.rowFlag==checkRow.rowFlag && isEdit"
                       size="mini"
                       v-focus:unit="scope.row.rowFlag==checkRow.rowFlag"
                       @click.native="selectItem(scope.$index,'unit')"
                       @keyup.native.f9="copyCol(scope.row,scope.$index,'unit')"
                       @keyup.native.enter="copy(scope.row,scope.$index)"
                       @keyup.native.38="doFocus(scope.row,scope.$index,'unit',38)"
                       @keyup.native.40="doFocus(scope.row,scope.$index,'unit',40)"
                       @keyup.native.37="doFocus(scope.row,scope.$index,'num',37)"
                       @keyup.native.39="doFocus(scope.row,scope.$index,'feeCfgId',39)"
                       @focus.native="focus($event)"
          ></unit-select>
          <span v-else v-bind:class="{ active: scope.row.confirmFinish==1&&isEdit }">{{scope.row.unit}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="收费类别" width="140" prop="feeCfgId">
        <template slot-scope="scope">
          <el-select v-model="scope.row.feeCfgId" @change='configNamechange(scope.row.feeCfgId,scope.$index)'
                     v-if="scope.row.rowFlag==checkRow.rowFlag && isEdit" filterable size="mini"
                     v-focus:feeCfgId="scope.row.rowFlag==checkRow.rowFlag"
                     @click.native="selectItem(scope.$index,'feeCfgId')"
                     @keyup.native.f9="copyCol(scope.row,scope.$index,'feeCfgId')"
                     @keyup.native.enter="copy(scope.row,scope.$index)"
                     @keyup.native.38="doFocus(scope.row,scope.$index,'feeCfgId',38)"
                     @keyup.native.40="doFocus(scope.row,scope.$index,'feeCfgId',40)"
                     @keyup.native.37="doFocus(scope.row,scope.$index,'unit',37)"
                     @keyup.native.39="doFocus(scope.row,scope.$index,'positionRow',39)"
                     @focus="focus($event)"
          >
            <el-option v-for="option in filterDisplayItems(feeconfigList)" :key="option.value"
                       :label="option.configName" :value="option.id">
            </el-option>
          </el-select>
          <span v-else v-bind:class="{ active: scope.row.confirmFinish==1&&isEdit }">{{configNamechange(scope.row.feeCfgId,scope.$index)}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="库位号" width="180" >
        <template slot-scope="scope">
          <template v-if="scope.row.rowFlag==checkRow.rowFlag && isEdit">
            <el-input v-model="scope.row.positionRow"  size="mini" style="width: 50px; display:inline-block"
                      maxlength="50"
                      v-focus:positionRow="scope.row.rowFlag==checkRow.rowFlag"
                      @click.native="selectItem(scope.$index,'positionRow')"
                      @keyup.native.f9="copyCol(scope.row,scope.$index,'positionRow')"
                      @keyup.native.enter="copy(scope.row,scope.$index)"
                      @keyup.native.38="doFocus(scope.row,scope.$index,'positionRow',38)"
                      @keyup.native.40="doFocus(scope.row,scope.$index,'positionRow',40)"
                      @keyup.native.37="doFocus(scope.row,scope.$index,'feeCfgId',37)"
                      @keyup.native.39="doFocus(scope.row,scope.$index,'positionColumn',39)"
                      @focus="focus($event)"
                      >
            </el-input>
            <span class="input-txt">行</span>
            <el-input v-model="scope.row.positionColumn"  size="mini" style="width: 50px;display:inline-block"
                      maxlength="50"
                      v-focus:positionColumn="scope.row.rowFlag==checkRow.rowFlag"
                      @click.native="selectItem(scope.$index,'positionColumn')"
                      @keyup.native.f9="copyCol(scope.row,scope.$index,'positionColumn')"
                      @keyup.native.enter="copy(scope.row,scope.$index)"
                      @keyup.native.38="doFocus(scope.row,scope.$index,'positionColumn',38)"
                      @keyup.native.40="doFocus(scope.row,scope.$index,'positionColumn',40)"
                      @keyup.native.37="doFocus(scope.row,scope.$index,'positionRow',37)"
                      @keyup.native.39="doFocus(scope.row,scope.$index,'lengthRemark',39)"
                      @focus="focus($event)"
            >
            </el-input>
            <span class="input-txt">排</span>
          </template>
          <span v-else v-bind:class="{ active: scope.row.confirmFinish==1&&isEdit }">{{scope.row.positionRow}}行 {{scope.row.positionColumn}}排</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="长度" width="140">
        <template slot-scope="scope">
          <el-input v-model="scope.row.lengthRemark" v-if="scope.row.rowFlag==checkRow.rowFlag && isEdit" size="mini"
                    maxlength="50"
                    v-focus:lengthRemark="scope.row.rowFlag==checkRow.rowFlag"
                    @click.native="selectItem(scope.$index,'lengthRemark')"
                    @keyup.native.f9="copyCol(scope.row,scope.$index,'lengthRemark')"
                    @keyup.native.enter="copy(scope.row,scope.$index)"
                    @keyup.native.38="doFocus(scope.row,scope.$index,'lengthRemark',38)"
                    @keyup.native.40="doFocus(scope.row,scope.$index,'lengthRemark',40)"
                    @keyup.native.37="doFocus(scope.row,scope.$index,'positionColumn',37)"
                    @keyup.native.39="doFocus(scope.row,scope.$index,'showDes',39)"
                    @focus="focus($event)"
          >
          </el-input>
          <span v-else v-bind:class="{ active: scope.row.confirmFinish==1&&isEdit }">{{scope.row.lengthRemark}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="外观描述" width="140">
        <template slot-scope="scope">
          <el-input v-model="scope.row.showDes" v-if="scope.row.rowFlag==checkRow.rowFlag && isEdit" size="mini"
                    maxlength="128"
                    v-focus:showDes="scope.row.rowFlag==checkRow.rowFlag"
                    @click.native="selectItem(scope.$index,'showDes')"
                    @keyup.native.f9="copyCol(scope.row,scope.$index,'showDes')"
                    @keyup.native.enter="copy(scope.row,scope.$index)"
                    @keyup.native.38="doFocus(scope.row,scope.$index,'showDes',38)"
                    @keyup.native.40="doFocus(scope.row,scope.$index,'showDes',40)"
                    @keyup.native.37="doFocus(scope.row,scope.$index,'lengthRemark',37)"
                    @keyup.native.39="doFocus(scope.row,scope.$index,'guidangNo',39)"
                    @focus="focus($event)"
          >
          </el-input>
          <span v-else v-bind:class="{ active: scope.row.confirmFinish==1&&isEdit }">{{scope.row.showDes}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="归档号" width="140">
        <template slot-scope="scope">
          <el-input v-model="scope.row.guidangNo" v-if="scope.row.rowFlag==checkRow.rowFlag && isEdit" size="mini"
                    maxlength="50"
                    v-focus:guidangNo="scope.row.rowFlag==checkRow.rowFlag"
                    @click.native="selectItem(scope.$index,'guidangNo')"
                    @keyup.native.f9="copyCol(scope.row,scope.$index,'guidangNo')"
                    @keyup.native.enter="copy(scope.row,scope.$index)"
                    @keyup.native.38="doFocus(scope.row,scope.$index,'guidangNo',38)"
                    @keyup.native.40="doFocus(scope.row,scope.$index,'guidangNo',40)"
                    @keyup.native.37="doFocus(scope.row,scope.$index,'showDes',37)"
                    @keyup.native.39="doFocus(scope.row,scope.$index,'contractNo',39)"
                    @focus="focus($event)"
          >
          </el-input>
          <span v-else v-bind:class="{ active: scope.row.confirmFinish==1&&isEdit }">{{scope.row.guidangNo}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="合同号" width="140">
        <template slot-scope="scope">
          <el-input v-model="scope.row.contractNo" v-if="scope.row.rowFlag==checkRow.rowFlag && isEdit" size="mini"
                    maxlength="50"
                    v-focus:contractNo="scope.row.rowFlag==checkRow.rowFlag"
                    @click.native="selectItem(scope.$index,'contractNo')"
                    @keyup.native.f9="copyCol(scope.row,scope.$index,'contractNo')"
                    @keyup.native.enter="copy(scope.row,scope.$index)"
                    @keyup.native.38="doFocus(scope.row,scope.$index,'contractNo',38)"
                    @keyup.native.40="doFocus(scope.row,scope.$index,'contractNo',40)"
                    @keyup.native.37="doFocus(scope.row,scope.$index,'guidangNo',37)"
                    @keyup.native.39="doFocus(scope.row,scope.$index,'shipNo',39)"
                    @focus="focus($event)"
          >
          </el-input>
          <span v-else v-bind:class="{ active: scope.row.confirmFinish==1&&isEdit }">{{scope.row.contractNo}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="船号" width="140">
        <template slot-scope="scope">
          <el-input v-model="scope.row.shipNo" v-if="scope.row.rowFlag==checkRow.rowFlag && isEdit" size="mini"
                    maxlength="50"
                    v-focus:shipNo="scope.row.rowFlag==checkRow.rowFlag"
                    @click.native="selectItem(scope.$index,'shipNo')"
                    @keyup.native.f9="copyCol(scope.row,scope.$index,'shipNo')"
                    @keyup.native.enter="copy(scope.row,scope.$index)"
                    @keyup.native.38="doFocus(scope.row,scope.$index,'shipNo',38)"
                    @keyup.native.40="doFocus(scope.row,scope.$index,'shipNo',40)"
                    @keyup.native.37="doFocus(scope.row,scope.$index,'contractNo',37)"
                    @keyup.native.39="doFocus(scope.row,scope.$index,'initCuName',39)"
                    @focus="focus($event)"
          >
          </el-input>
          <span v-else v-bind:class="{ active: scope.row.confirmFinish==1&&isEdit }">{{scope.row.shipNo}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="卷面名称" width="140">
        <template slot-scope="scope">
          <el-input v-model="scope.row.initCuName" v-if="scope.row.rowFlag==checkRow.rowFlag && isEdit" size="mini"
                    maxlength="50"
                    v-focus:initCuName="scope.row.rowFlag==checkRow.rowFlag"
                    @click.native="selectItem(scope.$index,'initCuName')"
                    @keyup.native.f9="copyCol(scope.row,scope.$index,'initCuName')"
                    @keyup.native.enter="copy(scope.row,scope.$index)"
                    @keyup.native.38="doFocus(scope.row,scope.$index,'initCuName',38)"
                    @keyup.native.40="doFocus(scope.row,scope.$index,'initCuName',40)"
                    @keyup.native.37="doFocus(scope.row,scope.$index,'shipNo',37)"
                    @keyup.native.39="doFocus(scope.row,scope.$index,'remark',39)"
                    @focus="focus($event)"
          >
          </el-input>
          <span v-else v-bind:class="{ active: scope.row.confirmFinish==1&&isEdit }">{{scope.row.initCuName}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="备注" width="140">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remark" v-if="scope.row.rowFlag==checkRow.rowFlag && isEdit" size="mini"
                    maxlength="255"
                    v-focus:remark="scope.row.rowFlag==checkRow.rowFlag"
                    @click.native="selectItem(scope.$index,'remark')"
                    @keyup.native.f9="copyCol(scope.row,scope.$index,'remark')"
                    @keyup.native.enter="copy(scope.row,scope.$index)"
                    @keyup.native.38="doFocus(scope.row,scope.$index,'remark',38)"
                    @keyup.native.40="doFocus(scope.row,scope.$index,'remark',40)"
                    @keyup.native.37="doFocus(scope.row,scope.$index,'initCuName',37)"
                    @keyup.native.39="doFocus(scope.row,scope.$index,'remark',39)"
                    @focus="focus($event)"
          >
          </el-input>
          <span v-else v-bind:class="{ active: scope.row.confirmFinish==1&&isEdit }">{{scope.row.remark}}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" width="70%">
      <span slot="title" class="dialog-title">
          <el-button type="primary" @click="dialogVisible = false">返 回</el-button>
          <el-button type="primary" v-if="tableIsEdit" @click="nextRow()"
                      :disabled='usedTableData.length<=checkedIndex+1'>下一卷</el-button>
          <el-button type="primary" v-if="tableIsEdit" @click="finish()">完 成</el-button>
      </span>
      <div class="dialog-body">
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <table cellpadding="0" cellspacing="0" border="1" bordercolor="#ccc"
                     align="center" style="border-collapse:collapse; width:100%; text-align:center;line-height:32px; font-size: 12px;"
              >
                <tr>
                  <td>
                    编号
                  </td>
                  <td>
                    <el-input v-model="checkedRow.handCode" v-if="tableIsEdit" @blur="checkHandCode(checkedRow)" size="mini" class="input-w-168"
                              v-focus:handCode="true"
                              @keyup.native.40="doFocus2('typeId')"
                    ></el-input>
                    <span class='center' v-else>{{checkedRow.handCode}}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    品名
                  </td>
                  <td>
                    <type-select v-model="checkedRow.typeId" :disabled="!tableIsEdit" filterable class="input-w-168" size="mini"
                                 v-focus:typeId="true"
                                 @keyup.native.38="doFocus2('handCode')"
                                 @keyup.native.40="doFocus2('steelCode')"
                                 @blur="$event.target.click()"
                    ></type-select>
                  </td>
                </tr>
                <tr>
                  <td>
                    钢卷号
                  </td>
                  <td>
                    <el-input v-model="checkedRow.steelCode" v-if="tableIsEdit" size="mini" maxlength="50" class="input-w-168"
                              v-focus:steelCode="true"
                              @keyup.native.38="doFocus2('typeId')"
                              @keyup.native.40="doFocus2('specName')"
                    ></el-input>
                    <span v-else>{{checkedRow.steelCode}}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    规格
                  </td>
                  <td>
                    <el-input v-model="checkedRow.specName" v-if="tableIsEdit" size="mini" class="input-w-168"
                              v-focus:specName="true"
                              @keyup.native.38="doFocus2('steelCode')"
                              @keyup.native.40="doFocus2('parea')"
                    ></el-input>
                    <span v-else>{{checkedRow.specName}}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    产地
                  </td>
                  <td>
                    <factory-select v-model="checkedRow.parea" :disabled="!tableIsEdit" filterable size="mini" class="input-w-168"
                                    v-focus:parea="true"
                                    @keyup.native.38="doFocus2('specName')"
                                    @keyup.native.40="doFocus2('grade')"
                                    @blur="$event.target.click()"
                    ></factory-select>
                  </td>
                </tr>
                <tr>
                  <td>
                    材质
                  </td>
                  <td>
                    <el-input v-model="checkedRow.grade" v-if="tableIsEdit" size="mini" maxlength="50" class="input-w-168"
                              v-focus:grade="true"
                              @keyup.native.38="doFocus2('parea')"
                              @keyup.native.40="doFocus2('weight2')"
                    ></el-input>
                    <span v-else>{{checkedRow.grade}}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    抄码净重
                  </td>
                  <td>
                    <number-input decimal="10,3" v-model="checkedRow.weight2" v-if="tableIsEdit" size="mini" class="input-w-168"
                                  v-focus:weight2="true"
                                  @keyup.native.38="doFocus2('grade')"
                                  @keyup.native.40="doFocus2('weight4')"
                    ></number-input>
                    <span v-else>{{checkedRow.weight2}}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    抄码毛重
                  </td>
                  <td>
                    <number-input decimal="10,3" v-model="checkedRow.weight4" v-if="tableIsEdit" size="mini" class="input-w-168"
                                  v-focus:weight4="true"
                                  @keyup.native.38="doFocus2('weight2')"
                                  @keyup.native.40="doFocus2('weight1')"
                    ></number-input>
                    <span v-else>{{checkedRow.weight4}}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    过磅净重
                  </td>
                  <td>
                    <number-input decimal="10,3" v-model="checkedRow.weight1" v-if="tableIsEdit" size="mini" class="input-w-168"
                                  v-focus:weight1="true"
                                  @keyup.native.38="doFocus2('weight4')"
                                  @keyup.native.40="doFocus2('num')"
                    ></number-input>
                    <span v-else>{{checkedRow.weight1}}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    数量
                  </td>
                  <td>
                    <number-input decimal="10" v-model="checkedRow.num" v-if="tableIsEdit" size="mini" class="input-w-168"
                                  v-focus:num="true"
                                  @keyup.native.38="doFocus2('weight1')"
                                  @keyup.native.40="doFocus2('feeCfgId')"
                    ></number-input>
                    <span v-else>{{checkedRow.num}}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    收费类别
                  </td>
                  <td>
                    <el-select v-model="checkedRow.feeCfgId" v-if="tableIsEdit" filterable size="mini" class="input-w-168"
                               v-focus:feeCfgId="true"
                               @keyup.native.38="doFocus2('num')"
                               @keyup.native.40="doFocus2('positionRow')"
                               @blur="$event.target.click()"
                    >
                      <el-option v-for="option in filterDisplayItems(feeconfigList)" :key="option.value"
                                 :label="option.configName" :value="option.id">
                      </el-option>
                    </el-select>
                    <span v-else>{{checkedRow.configName}}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    库位号
                  </td>
                  <td>
                    <template v-if="tableIsEdit">
                      <el-input v-model="checkedRow.positionRow"  size="mini" style="width: 50px; display:inline-block" maxlength="50"
                                v-focus:positionRow="true"
                                @keyup.native.38="doFocus2('feeCfgId')"
                                @keyup.native.40="doFocus2('lengthRemark')"
                                @keyup.native.39="doFocus2('positionColumn')"
                      ></el-input>
                      <span class="input-txt">行</span>
                      <el-input v-model="checkedRow.positionColumn"  size="mini" style="width: 50px; display:inline-block" maxlength="50"
                                v-focus:positionColumn="true"
                                @keyup.native.38="doFocus2('feeCfgId')"
                                @keyup.native.40="doFocus2('lengthRemark')"
                                @keyup.native.37="doFocus2('positionRow')"
                      ></el-input>
                      <span class="input-txt">排</span>
                    </template>
                    <span v-else>{{checkedRow.positionRow}}行{{checkedRow.positionColumn}}排</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    长度
                  </td>
                  <td>
                    <el-input v-model="checkedRow.lengthRemark" v-if="tableIsEdit" size="mini" maxlength="50" class="input-w-168"
                              v-focus:lengthRemark="true"
                              @keyup.native.38="doFocus2('positionRow')"
                              @keyup.native.40="doFocus2('showDes')"
                    ></el-input>
                    <span v-else>{{checkedRow.lengthRemark}}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    外观描述
                  </td>
                  <td>
                    <el-input v-model="checkedRow.showDes" v-if="tableIsEdit" size="mini" maxlength="128" class="input-w-168"
                              v-focus:showDes="true"
                              @keyup.native.38="doFocus2('lengthRemark')"
                              @keyup.native.40="doFocus2('guidangNo')"
                    ></el-input>
                    <span v-else>{{checkedRow.showDes}}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    归档号
                  </td>
                  <td>
                    <el-input v-model="checkedRow.guidangNo" v-if="tableIsEdit" size="mini" maxlength="50" class="input-w-168"
                              v-focus:guidangNo="true"
                              @keyup.native.38="doFocus2('showDes')"
                              @keyup.native.40="doFocus2('contractNo')"
                    >
                    </el-input>
                    <span v-else>{{checkedRow.guidangNo}}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    合同号
                  </td>
                  <td>
                    <el-input v-model="checkedRow.contractNo" v-if="tableIsEdit" size="mini" maxlength="50" class="input-w-168"
                              v-focus:contractNo="true"
                              @keyup.native.38="doFocus2('guidangNo')"
                              @keyup.native.40="doFocus2('shipNo')"
                    ></el-input>
                    <span v-else>{{checkedRow.contractNo}}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    船号
                  </td>
                  <td>
                    <el-input v-model="checkedRow.shipNo" v-if="tableIsEdit" size="mini" maxlength="50" class="input-w-168"
                              v-focus:shipNo="true"
                              @keyup.native.38="doFocus2('contractNo')"
                              @keyup.native.40="doFocus2('initCuName')"
                    ></el-input>
                    <span v-else>{{checkedRow.shipNo}}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    卷面名称
                  </td>
                  <td>
                    <el-input v-model="checkedRow.initCuName" v-if="tableIsEdit" size="mini" maxlength="50" class="input-w-168"
                              v-focus:initCuName="true"
                              @keyup.native.38="doFocus2('shipNo')"
                              @keyup.native.40="doFocus2('remark')"
                    ></el-input>
                    <span v-else>{{checkedRow.initCuName}}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    备注
                  </td>
                  <td>
                    <el-input v-model="checkedRow.remark" v-if="tableIsEdit" size="mini" maxlength="255" class="input-w-168"
                              v-focus:remark="true"
                              @keyup.native.38="doFocus2('initCuName')"
                    ></el-input>
                    <span v-else>{{checkedRow.remark}}</span>
                  </td>
                </tr>
              </table>
            </div>
          </el-col>
          <el-col :span="1">
            <div class="grid-content bg-purple-light">

            </div>
          </el-col>
          <el-col :span="15">
            <div class="grid-content bg-purple-light" style="width:100%;overflow:hidden;padding:30px 20px">

              <!-- <image-viewer :images="list" :visible.sync="imgVisable" @click='imgVisable=false'></image-viewer>  -->

              <div class="images" style="height:500px;background-image:none"
                   v-viewer="{inline: true, button: false,title:false, navbar: false,scalable: false,}">
                <img v-for="src in picList" :src="src.picPath" :key="src.picPath" height="200" width="200">
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

    </el-dialog>
  </div>
</template>
<script>
  import * as api from '@/api/warehousing/instore/instore'
  import typeSelect from '@/components/typeSelect'
  import factorySelect from '@/components/factorySelect'
  import unitSelect from '@/components/unitSelect'
  import numberInput from '@/components/numberInput'
  import { findPathByModuleCode } from '@/utils'
  const _ = require('lodash')
  import 'viewerjs/dist/viewer.css'
  import Viewer from 'v-viewer'
  import Vue from 'vue'

  Vue.use(Viewer)

  import { mapGetters } from 'vuex'

  export default {
    directives: {
      'focus': {
        // 指令的定义
        inserted: function(el, binding, vnode) {
          // console.log(vnode.context.selectIndex)
          // console.log(binding.arg)
          /**
           * v-focus:handCode = 'true'
           * binding.arg === handCode
           * vnode.context === this
           * */
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
    props: {
      tableData: Array,
      isEdit: Boolean,
      model: String
    },
    components: {
      typeSelect,
      unitSelect,
      factorySelect,
      numberInput
    },
    data() {
      return {
        displayItems: [
          {
            label: '编号',
            name: 'handCode',
            width: '250',
            display: 'input'
          },
          {
            label: '品名',
            name: 'typeId',
            width: '280',
            display: 'select',
            options: this.typeList
          },
          {
            label: '钢卷号',
            name: 'steelCode',
            width: '250',
            display: 'input'
          },
          {
            label: '规格',
            name: 'specName',
            width: '280',
            display: 'input'
          },
          {
            label: '产地',
            name: 'parea',
            width: '250',
            display: 'selectCd',
            option: []
          },
          {
            label: '材质',
            name: 'grade',
            width: '250',
            display: 'input'
          },
          {
            label: '抄码净重',
            name: 'weight2',
            width: '250',
            display: 'input'
          },
          {
            label: '抄码毛重',
            name: 'weight4',
            width: '250',
            display: 'input'
          },
          {
            label: '过磅净重',
            name: 'weight1',
            width: '250',
            display: 'input'
          },
          {
            label: '数量',
            name: 'num',
            width: '250',
            display: 'input'
          },
          {
            label: '数量单位',
            name: 'unit',
            width: '250',
            display: 'selectN',
            options: [
              {
                id: '卷',
                itemName: '卷'
              },
              {
                id: '条',
                itemName: '条'
              },
              {
                id: '件',
                itemName: '件'
              }
            ]
          },
          {
            label: '收费类别',
            name: 'feeCfgId',
            width: '250',
            display: 'selectFeeconfig',
            option: []
          },
          {
            label: '排数',
            name: 'positionColumn',
            width: '120',
            display: 'input'
          },
          {
            label: '行数',
            name: 'positionRow',
            width: '120',
            display: 'input'
          },
          {
            label: '外观描述',
            name: 'showDes',
            width: '250',
            display: 'input'
          },
          {
            label: '合同号',
            name: 'contractNo',
            width: '250',
            display: 'input'
          },
          {
            label: '船号',
            name: 'shipNo',
            width: '250',
            display: 'input'
          },
          {
            label: '卷面名称',
            name: 'initCuName',
            width: '250',
            display: 'input'
          },
          {
            label: '备注',
            name: 'remark',
            width: '250',
            display: 'input'
          }
        ],
        tmpRow: {},
        checkRow: {},
        selectIndex: 0, // 当前点击时获取的index
        checkedIndex: 0,
        checkedRow: Object,
        dialogVisible: false,
        tableIsEdit: false,
        picList: [
          // require('../../../assets/images/1.png'),
          // require('../../../assets/images/2.png')
        ],
        imgVisable: false,
        rowFlag: 0,
        focusInput: 'handCode' // 焦点控制的input 名
      }
    },
    computed: {
      ...mapGetters([
        'typeList',
        'factoryList', // 产地
        'feeconfigList'
      ]),
      usedTableData: function() {
        return this.tableData
      },
      tableHeader() {
        const temp = {}
        temp.weight2 = this.usedTableData
          .reduce((pre, cur) => {
            return pre + parseFloat(cur.weight2 || 0)
          }, 0).toFixed(3)
        temp.weight1 = this.usedTableData.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight1 || 0)
        }, 0).toFixed(3)
        temp.weight4 = this.usedTableData
          .reduce((pre, cur) => {
            return pre + parseFloat(cur.weight4 || 0)
          }, 0).toFixed(3)
        temp.num = this.usedTableData
          .reduce((pre, cur) => {
            return pre + parseInt(cur.num || 0)
          }, 0)
        return temp
      }
    },
    methods: {
      setHeaderClass({ row, column, rowIndex, columnIndex }) {
        // 设置表头类
        if (columnIndex === 0) {
          if (row[0].label === '+') {
            return 'table-header-bg text-center pointer table-add-icon'
          }
          return 'table-header-bg text-center pointer'
        } else {
          return 'table-header-bg text-center'
        }
      },
      dealHeaderClick(column, event) {
        // +号点击
        // const that = this
        if (column.label === '+') {
          // const obj = {}
          // for (let i = 0; i < that.displayItems.length; i++) {
          //   obj[that.displayItems[i]['name']] = ''
          // }
          // var tableData = this.usedTableData
          // if (tableData.length) { // 如果已经有了 table 数据
          //   // 货物编号的复制处理 尾数为数字结尾的 + 1
          //   var str = tableData[tableData.length - 1]['handCode'].replace(/\d+$/, ($1) => {
          //     if ($1) {
          //       return parseInt($1) + 1
          //     }
          //   })
          //   Object.assign(obj, {
          //     typeId: tableData[tableData.length - 1]['typeId'],
          //     specName: tableData[tableData.length - 1]['specName'],
          //     parea: tableData[tableData.length - 1]['parea'],
          //     grade: tableData[tableData.length - 1]['grade'],
          //     feeCfgId: tableData[tableData.length - 1]['feeCfgId'],
          //     positionRow: tableData[tableData.length - 1]['positionRow'],
          //     positionColumn: tableData[tableData.length - 1]['positionColumn'],
          //     showDes: tableData[tableData.length - 1]['showDes'],
          //     contractNo: tableData[tableData.length - 1]['contractNo'],
          //     shipNo: tableData[tableData.length - 1]['shipNo'],
          //     unit: tableData[tableData.length - 1]['unit'],
          //     handCode: str
          //   })
          // }
          // obj.rowFlag = ++this.rowFlag
          // if (!obj.unit) {
          //   that.$set(obj, 'unit', '卷')
          // }
          // if (!obj.num) {
          //   that.$set(obj, 'num', 1)
          // }
          // this.tableData.push(obj)
          // for (let k = 0; k < this.usedTableData.length; k++) {
          //   this.usedTableData[k]['confirmFinish'] = 0
          // }
          // this.checkRow = this.usedTableData[tableData.length - 1]
          this.copy({})
        }
      },
      handleRowClick(row, event, column) {
        // if (this.isEdit) {
        //   this.displayItems.map((item) => { // 点击时选中的焦点处理
        //     if (item.label === column.label) {
        //       this.focusInput = item.name
        //     }
        //   })
        this.focusInput = ''
        this.checkRow = row
        // }
      },
      handleRowDbClick(row, event, column) {
        if (this.$parent.buttonDisplay === 'seeAudit') { this.toGoodsFlow(row) }
      },
      toGoodsFlow(row) {
        this.$router.push({ path: findPathByModuleCode('stockLog'), query: { handCode: row.handCode }})
      },
      filterDisplayItems(options) {
        //  过滤下拉选项过多
        let filterItems = []
        filterItems = options.slice(0, 15)
        return filterItems
      },
      remove(item, index) {
        // 删除行
        this.$confirm('确认删除该行？', '温馨提示', {
          type: 'warning'
        }).then(() => {
          const rows = this.usedTableData.splice(index, 1)
          if (rows && rows.length > 0) {
            this.$emit('delDetail', rows[0])
          }
        }).catch(() => {})
      },
      selectItem(index, item) {
        this.selectIndex = index // 获取当前点击的 index
      },
      // F9 列复制
      copyCol(item, index, colum, event) {
        const that = this
        if (that.selectIndex < this.usedTableData.length - 1) {
          this.usedTableData[that.selectIndex + 1][colum] = this.usedTableData[that.selectIndex][colum]
          that.selectIndex++
        }
        this.focusInput = colum
        this.checkRow = this.usedTableData[that.selectIndex]
      },
      focus(event) {
        // 聚焦时全选文本
        event.currentTarget.select()
      },
      // 根据上下左右聚焦
      doFocus(item, index, colum, key) {
        // 上 操作
        if ((index > 0) && key === 38) {
          index--
        }
        // 下 操作
        if ((index < this.usedTableData.length - 1) && key === 40) {
          index++
        }
        this.$refs.table1.setCurrentRow(this.usedTableData[index])
        this.selectIndex = index
        this.checkRow = this.usedTableData[index]
        this.focusInput = colum
      },
      // 根据上下左右聚焦
      doFocus2(colum) {
        this.focusInput = colum
      },
      // 行复制
      copy(item, index) {
        const obj = _.cloneDeep(item) // 复制列
        obj.id = ''
        obj.rowFlag = ++this.rowFlag
        // 货物编号的复制处理
        if (!obj.handCode && this.usedTableData.length > 0 && this.usedTableData[this.usedTableData.length - 1].handCode) {
          obj.handCode = this.usedTableData[this.usedTableData.length - 1].handCode
        }
        if (obj.handCode && obj.handCode.search(/\d+$/) !== -1) {
          obj.handCode = obj.handCode.replace(/\d+$/, ($1) => {
            if ($1) {
              const num = parseInt($1) + 1
              const numLength = ('' + num).length
              // 针对 009 +1  数值补0的处理 得出 010
              return Array($1.length > numLength ? $1.length - numLength + 1 || 0 : 0).join(0) + num
            }
          })
        } else {
          obj.handCode = ''
        }

        if (!obj.unit) {
          this.$set(obj, 'unit', '卷')
        }
        if (!obj.num) {
          this.$set(obj, 'num', 1)
        }
        obj.steelCode = ''
        obj.weight1 = ''
        obj.weight2 = ''
        obj.weight4 = ''
        obj.positionColumn = ''
        obj.positionRow = ''
        obj.lengthRemark = ''
        obj.showDes = ''
        obj.remark = ''
        // this.usedTableData.splice(index, 0, obj)
        this.usedTableData.push(obj)
        this.$nextTick(() => {
          this.focusInput = 'handCode'
          this.selectIndex = this.usedTableData.length - 1
          this.checkRow = this.usedTableData[this.usedTableData.length - 1]
          this.$refs.table1.setCurrentRow(this.usedTableData[this.usedTableData.length - 1])
        })
      },
      dispalyModel(row, index) {
        const that = this

        // 模态框切换
        this.checkedIndex = index
        this.checkedRow = row
        this.dialogVisible = true

        if (row.handCode) {
          const param = {
            handCode: row.handCode
          }
          if (this.model === 'check2InStore') {
            param.checkFlag = true
          }
          api.checkimage(param).then(response => {
            that.picList = response.stockPics // 获取table 明细
            // 排序图片
            if (that.picList && that.picList.length > 0) {
              const last = that.picList.pop()
              that.picList.unshift(last)
            }
          })
            .catch(error => {
              if (error) console.error(error)
            })
        }
      },
      finish() {
        this.tableData[this.checkedIndex].confirmFinish = 1
        this.dialogVisible = false
      },
      nextRow() {
        this.tableData[this.checkedIndex].confirmFinish = 1
        // this.checkedRow = this.tableData[this.checkedIndex + 1]
        this.checkedIndex++
        this.dispalyModel(this.tableData[this.checkedIndex], this.checkedIndex)
      },
      typeNamechange(typeId, index) {
        const that = this
        for (let i = 0; i < that.typeList.length; i++) {
          if (that.typeList[i].id === typeId) {
            that.usedTableData[index]['typeName'] = that.typeList[i]['typeName']
            break
          }
        }
        return that.usedTableData[index]['typeName']
      },
      configNamechange(feeCfgId, index) {
        const that = this
        for (let i = 0; i < that.feeconfigList.length; i++) {
          if (that.feeconfigList[i].id === feeCfgId) {
            that.usedTableData[index]['configName'] = that.feeconfigList[i]['configName']
            break
          }
        }
        return that.usedTableData[index]['configName']
      },
      formatSpecName(row) {
        if (row.specName) {
          row.specName = row.specName.replace('*', '×')
        }
      },
      checkHandCode(row) {
        api.check({ id: row.id, handCode: row.handCode }).then(() => {
        }).catch(error => {
          if (error) console.error(error)
          row.handCode = ''
        })
      }
    },
    beforeMount() {
    },
    mounted() {
      const that = this
      if (that.isEdit) {
        // 已审核改单表格可以修改
        that.tableIsEdit = true
      } else {
        if (that.model === 'yshgd') {
          that.tableIsEdit = true
        } else {
          that.tableIsEdit = false
        }
      }
    },
    updated() {
      const that = this
      if (that.isEdit) {
        // 已审核改单表格可以修改
        that.tableIsEdit = true
      } else {
        if (that.model === 'yshgd') {
          that.tableIsEdit = true
        } else {
          that.tableIsEdit = false
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .specialTable {
    // .el-dialog__body {
    //   padding: 0;
    // }
    .dialog-body {
      padding: 20px;
    }
    .center {
      text-align: center;
    }
    .active {
      color: rgb(182, 88, 88);
    }
    .red {
      color: red;
    }
  }
  .input-txt{
    padding:0 5px;
  }
  .table-header-bg{
    font-size: 16px;
    background: #fff !important;
  }
</style>
