<template>
  <div>
    <div class="btn-group-container">
        <el-button type="primary" v-if="formData.status === 0" @click="showPdPack">成品打包</el-button>
        <el-button type="primary" v-if="formData.status === 0" @click="showWaste(1)">边料打包</el-button>
        <el-button type="primary" v-if="formData.status === 0" @click="showWaste(2)">头尾板打包</el-button>
        <el-button type="primary" v-if="formData.status === 0" @click="showRollback">卷回打包</el-button>
        <el-button type="primary" @click="showCustomLabelDialog" :disabled="modifyLabel">修改标签</el-button>
        <el-button type="primary" @click="printLabel" :disabled="modifyLabel">标签打印</el-button>
        <span style="padding-left: 20px; font-size: 13px;">
          仓库：<store-select v-model="defaultStoreId" style="width: 120px;"></store-select>
        </span>
        <span style="padding-left: 20px;font-size: 13px;">
          <el-checkbox v-model="printWasteWeight" >打印废料重量</el-checkbox>
        </span>
    </div>

    <el-card shadow="always">
      <div style="float: left">
        成品打包信息
      </div>
      <div style="float: left;padding-left: 50px;font-size: 12px;">
        {{formData.diffWeightString}}<br/>
        {{formData.diffWeight1String}}
      </div>
    </el-card>
    <el-table :data="pdPackList"
              ref="table"
              @selection-change="handleSelectionPdPackChange"
              border header-cell-class-name="table-header-bg text-center"
              stripe max-height="545"
              :row-class-name="tableRowClassName"
               @row-click="handleRowClick">
      <el-table-column sortable type="selection" width="50"></el-table-column>
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column sortable label="操作" width="170">
        <template slot-scope="scope">
          <el-button size="small" :disabled="actionDoing" v-if="formData.status === 0 && scope.row.isValid === 1 && scope.row.isLock === 0 && scope.row.status < 3" @click="unPack(scope.row)">拆包</el-button>
          <el-button size="small" :disabled="actionDoing" v-if="formData.status === 0" @click="showCopyPack(scope.row,1)">复制</el-button>
          <el-button size="small" :disabled="actionDoing" v-if="formData.status === 0 && scope.row.isValid === 1 && scope.row.isLock === 0 && scope.row.status < 3" @click="showUpdatePack(scope.row,1)">修改</el-button>
        </template>
      </el-table-column>
      <el-table-column sortable label="包装编号" prop="blno"></el-table-column>
      <el-table-column sortable label="货物编号" prop="handCodes"></el-table-column>
      <el-table-column sortable label="钢卷号" prop="steelCodes"></el-table-column>
      <el-table-column sortable label="规格" prop="specAllPd" min-width="200"></el-table-column>
      <el-table-column sortable :label="'理算重量['+ pdPackTableHeader.weight+']'" prop="weight" min-width="120"></el-table-column>
      <el-table-column sortable :label="'过磅净重['+ pdPackTableHeader.weight1+']'" prop="weight1" min-width="120"></el-table-column>
      <el-table-column sortable :label="'过磅毛重['+ pdPackTableHeader.weight3+']'" prop="weight3" min-width="120"></el-table-column>
      <el-table-column sortable :label="'木架重['+ pdPackTableHeader.weight6+']'" prop="weight6" min-width="120"></el-table-column>
      <el-table-column sortable label="库位" prop="storeName"></el-table-column>
      <el-table-column sortable label="包装备注" prop="remark"></el-table-column>
    </el-table>

    <template v-if="formData.resType === 1"><!-- 原料 -->
      <el-card shadow="always" style="margin-top:15px;">
        卷回打包信息
      </el-card>
      <el-table :data="maRollbackList" border stripe header-cell-class-name="table-header-bg text-center" row-class-name="pointer text-center tab-ellipsis">
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column sortable label="操作">
          <template slot-scope="scope">
            <el-button size="small" :disabled="actionDoing" v-if="formData.status === 0" @click="deleteRollbackPack(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column sortable label="货物编号" prop="handCode" min-width="120"></el-table-column>
        <el-table-column sortable label="钢卷号" prop="steelCode" min-width="150"></el-table-column>
        <el-table-column sortable label="品名" prop="typeName" min-width="120"></el-table-column>
        <el-table-column sortable label="规格" prop="specName" min-width="200"></el-table-column>
        <el-table-column sortable label="产地" prop="parea"></el-table-column>
        <el-table-column sortable label="材质" prop="grade"></el-table-column>
        <el-table-column sortable :label="'卷回重量['+ maRollbackPackTableHeader.rollbackWeight+']'" prop="rollbackWeight" min-width="120"></el-table-column>
        <el-table-column sortable :label="'数量['+ maRollbackPackTableHeader.rollbackNum+']'" prop="rollbackNum" min-width="120"></el-table-column>
        <el-table-column sortable label="仓库" prop="storeName"></el-table-column>
        <el-table-column sortable label="长度" prop="length"></el-table-column>
      </el-table>
    </template>

    <template v-if="formData.resType === 2"><!-- 成品 -->
      <el-card shadow="always" style="margin-top:15px;">
        卷回打包信息
        <!--<el-button>并包</el-button>-->
      </el-card>
      <el-table :data="pdRollbackList"
                ref="rollbackTable"
                @selection-change="handleSelectionRollbackPdPackChange"
                border stripe header-cell-class-name="table-header-bg text-center"
                :row-class-name="rollbackTableRowClassName"
                @row-click="rollbackHandleRowClick">
        <el-table-column sortable type="selection" width="50"></el-table-column>
        <el-table-column sortable label="操作" width="170">
          <template slot-scope="scope">
            <el-button size="small" :disabled="actionDoing" v-if="formData.status === 0 && scope.row.pdPackIsValid === 1 && scope.row.pdPackIsLock === 0 && scope.row.pdPackStatus < 3" @click="deleteRollbackPack(scope.row)">拆包</el-button>
            <el-button size="small" :disabled="actionDoing" v-if="formData.status === 0" @click="showCopyPack(scope.row,2)">复制</el-button>
            <el-button size="small" :disabled="actionDoing" v-if="formData.status === 0 && scope.row.pdPackIsValid === 1 && scope.row.pdPackIsLock === 0 && scope.row.pdPackStatus < 3" @click="showUpdatePack(scope.row,2)">修改</el-button>
          </template>
        </el-table-column>
        <el-table-column sortable label="包装编号" prop="blno"></el-table-column>
        <el-table-column sortable label="货物编号" prop="handCodes"></el-table-column>
        <el-table-column sortable label="钢卷号" prop="steelCodes"></el-table-column>
        <el-table-column sortable label="规格" prop="specAllPd" min-width="200"></el-table-column>
        <el-table-column sortable :label="'理算重量['+ pdRollbackPackTableHeader.weight+']'" prop="weight" min-width="120"></el-table-column>
        <el-table-column sortable :label="'过磅净重['+ pdRollbackPackTableHeader.weight1+']'" prop="weight1" min-width="120"></el-table-column>
        <el-table-column sortable :label="'过磅毛重['+ pdRollbackPackTableHeader.weight3+']'" prop="weight3" min-width="120"></el-table-column>
        <el-table-column sortable :label="'木架重['+ pdRollbackPackTableHeader.weight6+']'" prop="weight6" min-width="120"></el-table-column>
        <el-table-column sortable label="库位" prop="storeName"></el-table-column>
        <el-table-column sortable label="包装备注" prop="remark"></el-table-column>
      </el-table>
    </template>

    <!-- 成品打包 -->
    <el-dialog :visible.sync="pdPackDialog.visible" width="80%">
      <el-input type="textarea" :value="formData.machFlag === 1 ? formData.slitRemark : formData.machFlag === 2 ? formData.cutRemark : ''" readonly></el-input>
      <el-row style="margin-top: 20px">
          <el-table
            :data="pdPackDialog.selectPdGoodList"
            @header-click="dealPdGoodHeaderClick"
            border stripe
            :header-cell-class-name="setHeaderPointerClass"
            row-class-name="pointer text-center tab-ellipsis"
            ref="pdTable"
            @row-click="handleTableClick"
          >
            <el-table-column sortable label="货物编号">
              <template slot-scope="scope">
                {{scope.row.handCode}}<span v-if="formData.machFlag === 2 && scope.row.mixCut > 0" style="color: red;">（混平）</span>
              </template>
            </el-table-column>
            <el-table-column sortable label="钢卷号" prop="steelCode"></el-table-column>
            <el-table-column sortable label="规格" prop="spec"  min-width="200"></el-table-column>
            <el-table-column sortable label="剩余数量" prop="remainingNum"></el-table-column>
            <el-table-column sortable label="本次数量">
              <template slot-scope="scope">
                <template v-if="scope.row.machFlag === 1">
                  <number-input v-model="scope.row.useNum" decimal="10" :min="0" :max="scope.row.remainingNum" size="mini"
                                v-focus:useNum="scope.row==tmpRow"
                                @keyup.native.38="doFocus(scope.row,scope.$index,'useNum',38,'pdTable')"
                                @keyup.native.40="doFocus(scope.row,scope.$index,'useNum',40,'pdTable')"
                                @focus.native="focus($event)"
                  ></number-input>
                </template>
                <template v-else>
                  <number-input v-model="scope.row.useNum" decimal="10" :min="0" size="mini"
                                v-focus:useNum="scope.row==tmpRow"
                                @keyup.native.38="doFocus(scope.row,scope.$index,'useNum',38,'pdTable')"
                                @keyup.native.40="doFocus(scope.row,scope.$index,'useNum',40,'pdTable')"
                                @focus.native="focus($event)"
                  ></number-input>
                </template>
              </template>
            </el-table-column>
            <el-table-column label="全部添加">
              <template slot-scope="scope">
                <el-button size="small" @click="makePdPack(scope.row,scope.$index)">添加</el-button>
              </template>
            </el-table-column>
          </el-table>
      </el-row>
      <el-row style="margin-top: 20px">
          <el-table
            :data="pdPackDialog.selectPdGoodPackList"
            @header-click="dealPdGoodPackHeaderClick"
            border
            stripe
            :header-cell-class-name="setHeaderPointerClass"
            row-class-name="pointer text-center tab-ellipsis"
            ref='pdPackTable'
            @row-click="handleTableClick"
          >
            <el-table-column label="合并">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.selected"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column sortable label="货物编号" prop="handCodes"></el-table-column>
            <el-table-column sortable label="钢卷号" prop="steelCodes"></el-table-column>
            <el-table-column sortable label="规格" prop="specAllPd"  min-width="200"></el-table-column>
            <el-table-column sortable :label="'理重['+ pdPackDialogTableHeader.weight+']'" prop="weight" min-width="120"></el-table-column>
            <el-table-column sortable :label="'磅重['+ pdPackDialogTableHeader.weight1+']'" prop="weight1" min-width="120"></el-table-column>
            <el-table-column sortable :label="'毛重['+ pdPackDialogTableHeader.weight3+']'" min-width="120">
              <template slot-scope="scope">
                <number-input v-model="scope.row.weight3" decimal="10,3" :min="0" @change="calWeight1(scope.row)" size="mini"
                              v-focus:weight3="scope.row==tmpRow"
                              @keyup.native.38="doFocus(scope.row,scope.$index,'weight3',38,'pdPackTable')"
                              @keyup.native.40="doFocus(scope.row,scope.$index,'weight3',40,'pdPackTable')"
                              @keyup.native.37="doFocus(scope.row,scope.$index,'weight3',37,'pdPackTable')"
                              @keyup.native.39="doFocus(scope.row,scope.$index,'weight6',39,'pdPackTable')"
                              @focus.native="focus($event)"
                ></number-input>
              </template>
            </el-table-column>
            <el-table-column sortable :label="'木架重['+ pdPackDialogTableHeader.weight6+']'" min-width="120">
              <template slot-scope="scope">
                <number-input v-model="scope.row.weight6" decimal="10,3" :min="0" @change="calWeight1(scope.row)" size="mini"
                              v-focus:weight6="scope.row==tmpRow"
                              @keyup.native.38="doFocus(scope.row,scope.$index,'weight6',38,'pdPackTable')"
                              @keyup.native.40="doFocus(scope.row,scope.$index,'weight6',40,'pdPackTable')"
                              @keyup.native.37="doFocus(scope.row,scope.$index,'weight3',37,'pdPackTable')"
                              @keyup.native.39="doFocus(scope.row,scope.$index,'storeId',39,'pdPackTable')"
                              @focus.native="focus($event)"
                ></number-input>
              </template>
            </el-table-column>
            <el-table-column sortable label="仓库">
              <template slot-scope="scope">
                <store-select v-model="scope.row.storeId"
                              v-focus:storeId="scope.row==tmpRow"
                              @keyup.native.38="doFocus(scope.row,scope.$index,'storeId',38,'pdPackTable')"
                              @keyup.native.40="doFocus(scope.row,scope.$index,'storeId',40,'pdPackTable')"
                              @keyup.native.37="doFocus(scope.row,scope.$index,'weight6',37,'pdPackTable')"
                              @keyup.native.39="doFocus(scope.row,scope.$index,'remark',39,'pdPackTable')"
                ></store-select>
              </template>
            </el-table-column>
            <el-table-column sortable label="备注">
              <template slot-scope="scope">
                <el-input v-model="scope.row.remark" @click.native="showPackRemark(scope.row)" readonly
                          v-focus:remark="scope.row==tmpRow"
                          @keyup.native.38="doFocus(scope.row,scope.$index,'remark',38,'pdPackTable')"
                          @keyup.native.40="doFocus(scope.row,scope.$index,'remark',40,'pdPackTable')"
                          @keyup.native.37="doFocus(scope.row,scope.$index,'storeId',37,'pdPackTable')"
                          @keyup.native.39="doFocus(scope.row,scope.$index,'remark',39,'pdPackTable')"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="全部删除">
              <template slot-scope="scope">
                <el-button size="small" @click="deletePdGoodPack(scope.row,scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pdPackDialog.visible = false" icon="el-icon-back">返回</el-button>
        <el-button type="primary" @click="addPdPack" :disabled="actionDoing">保存</el-button>
      </div>
    </el-dialog>

    <!-- 废料打包 -->
    <el-dialog :visible.sync="wasteDialog.visible" width="80%">
      <el-row style="margin-top: 20px">
        <el-table
          :data="wasteDialog.selectPdGoodList"
          @header-click="dealWasteHeaderClick"
          border stripe
          :header-cell-class-name="setHeaderPointerClass"
          row-class-name="pointer text-center tab-ellipsis"
          ref="wasteTable"
          @row-click="handleTableClick"
        >
          <el-table-column sortable label="货物编号" prop="handCode"></el-table-column>
          <el-table-column sortable label="钢卷号" prop="steelCode"></el-table-column>
          <el-table-column sortable label="规格" prop="spec"  min-width="200"></el-table-column>
          <el-table-column sortable label="本次数量">
            <template slot-scope="scope">
              <number-input v-model="scope.row.useNum" decimal="10" :min="0" size="mini"
                            v-focus:useNum="scope.row==tmpRow"
                            @keyup.native.38="doFocus(scope.row,scope.$index,'useNum',38,'wasteTable')"
                            @keyup.native.40="doFocus(scope.row,scope.$index,'useNum',40,'wasteTable')"
                            @keyup.native.37="doFocus(scope.row,scope.$index,'useNum',37,'wasteTable')"
                            @keyup.native.39="doFocus(scope.row,scope.$index,wasteDialog.type === 1?'sideWidth':'tailBoardLength',39,'wasteTable')"
                            @focus="focus($event)"
              ></number-input>
            </template>
          </el-table-column>
          <el-table-column sortable label="边料宽度" v-if="wasteDialog.type === 1">
            <template slot-scope="scope">
              <number-input v-model="scope.row.sideWidth" decimal="10,3" size="mini"
                            v-focus:sideWidth="scope.row==tmpRow"
                            @keyup.native.38="doFocus(scope.row,scope.$index,'sideWidth',38,'wasteTable')"
                            @keyup.native.40="doFocus(scope.row,scope.$index,'sideWidth',40,'wasteTable')"
                            @keyup.native.37="doFocus(scope.row,scope.$index,'useNum',37,'wasteTable')"
                            @keyup.native.39="doFocus(scope.row,scope.$index,'sideWidth',39,'wasteTable')"
                            @focus="focus($event)"
              ></number-input>
            </template>
          </el-table-column>
          <template v-if="wasteDialog.type === 2">
            <el-table-column sortable label="头尾板长度">
              <template slot-scope="scope">
                <number-input v-model="scope.row.tailBoardLength" decimal="10,3" size="mini"
                              v-focus:tailBoardLength="scope.row==tmpRow"
                              @keyup.native.38="doFocus(scope.row,scope.$index,'tailBoardLength',38,'wasteTable')"
                              @keyup.native.40="doFocus(scope.row,scope.$index,'tailBoardLength',40,'wasteTable')"
                              @keyup.native.37="doFocus(scope.row,scope.$index,'useNum',37,'wasteTable')"
                              @keyup.native.39="doFocus(scope.row,scope.$index,'tailBoardLength',39,'wasteTable')"
                              @focus="focus($event)"
                ></number-input>
              </template>
            </el-table-column>
            <el-table-column sortable label="类型">
              <template slot-scope="scope">
                <el-select filterable v-model="scope.row.pdType" placeholder="请选择">
                  <el-option v-for="item in tailBoardTypeArr" :value="item.id" :label="item.name" :key="item.id">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
          </template>
          <el-table-column label="全部添加">
            <template slot-scope="scope">
              <el-button size="small" @click="makeWastePack(scope.row,scope.$index)">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row style="margin-top: 20px">
        <el-table
          :data="wasteDialog.selectPdGoodPackList"
          @header-click="dealWastePackHeaderClick"
          border stripe
          :header-cell-class-name="setHeaderPointerClass"
          row-class-name="pointer text-center tab-ellipsis"
          ref="wastePackTable"
          @row-click="handleTableClick"
        >
          <el-table-column label="合并">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.selected"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column sortable label="货物编号" prop="handCodes"></el-table-column>
          <el-table-column sortable label="钢卷号" prop="steelCodes"></el-table-column>
          <el-table-column sortable label="规格" prop="specAllPd"  min-width="200"></el-table-column>
          <el-table-column sortable :label="'理重['+ wasteDialogTableHeader.weight+']'" prop="weight" min-width="120"></el-table-column>
          <el-table-column sortable :label="'磅重['+ wasteDialogTableHeader.weight1+']'" prop="weight1" min-width="120"></el-table-column>
          <el-table-column sortable :label="'毛重['+ wasteDialogTableHeader.weight3+']'" min-width="120">
            <template slot-scope="scope">
              <number-input v-model="scope.row.weight3" decimal="10,3" :min="0" @change="wasteCalWeight1(scope.row)" size="mini"
                            v-focus:weight3="scope.row==tmpRow"
                            @keyup.native.38="doFocus(scope.row,scope.$index,'weight3',38,'wastePackTable')"
                            @keyup.native.40="doFocus(scope.row,scope.$index,'weight3',40,'wastePackTable')"
                            @keyup.native.37="doFocus(scope.row,scope.$index,'weight3',37,'wastePackTable')"
                            @keyup.native.39="doFocus(scope.row,scope.$index,'weight6',39,'wastePackTable')"
                            @focus.native="focus($event)"
              ></number-input>
            </template>
          </el-table-column>
          <el-table-column sortable :label="'木架重['+ wasteDialogTableHeader.weight6+']'" min-width="120">
            <template slot-scope="scope">
              <number-input v-model="scope.row.weight6" decimal="10,3" :min="0" @change="wasteCalWeight1(scope.row)" size="mini"
                            v-focus:weight6="scope.row==tmpRow"
                            @keyup.native.38="doFocus(scope.row,scope.$index,'weight6',38,'wastePackTable')"
                            @keyup.native.40="doFocus(scope.row,scope.$index,'weight6',40,'wastePackTable')"
                            @keyup.native.37="doFocus(scope.row,scope.$index,'weight3',37,'wastePackTable')"
                            @keyup.native.39="doFocus(scope.row,scope.$index,'storeId',39,'wastePackTable')"
                            @focus.native="focus($event)"
              ></number-input>
            </template>
          </el-table-column>
          <el-table-column sortable label="仓库">
            <template slot-scope="scope">
              <store-select v-model="scope.row.storeId"
                            v-focus:storeId="scope.row==tmpRow"
                            @keyup.native.38="doFocus(scope.row,scope.$index,'storeId',38,'wastePackTable')"
                            @keyup.native.40="doFocus(scope.row,scope.$index,'storeId',40,'wastePackTable')"
                            @keyup.native.37="doFocus(scope.row,scope.$index,'weight6',37,'wastePackTable')"
                            @keyup.native.39="doFocus(scope.row,scope.$index,'remark',39,'wastePackTable')"
              ></store-select>
            </template>
          </el-table-column>
          <el-table-column sortable label="备注">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" @click.native="showPackRemark(scope.row)" readonly
                        v-focus:remark="scope.row==tmpRow"
                        @keyup.native.38="doFocus(scope.row,scope.$index,'remark',38,'wastePackTable')"
                        @keyup.native.40="doFocus(scope.row,scope.$index,'remark',40,'wastePackTable')"
                        @keyup.native.37="doFocus(scope.row,scope.$index,'storeId',37,'wastePackTable')"
                        @keyup.native.39="doFocus(scope.row,scope.$index,'remark',39,'wastePackTable')"
                        @focus.native="focus($event)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="全部删除">
            <template slot-scope="scope">
              <el-button size="small" @click="deleteWastePack(scope.row,scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="wasteDialog.visible = false" icon="el-icon-back">返回</el-button>
        <el-button type="primary" @click="addWastePack" :disabled="actionDoing">保存</el-button>
      </div>
    </el-dialog>

    <!-- 原料卷回打包 -->
    <template v-if="formData.resType === 1">
      <el-dialog :visible.sync="rollbackDialog.visible" width="80%">
        <el-table
          :data="rollbackDialog.selectMaList"
          border stripe
          :header-cell-class-name="setHeaderPointerClass"
          row-class-name="pointer text-center tab-ellipsis"
          ref="maRollbackTable"
          @row-click="handleTableClick"
        >
          <el-table-column sortable label="货物编号" prop="handCode"></el-table-column>
          <el-table-column sortable label="钢卷号" prop="steelCode"></el-table-column>
          <el-table-column sortable label="规格" prop="specName"  min-width="200"></el-table-column>
          <el-table-column sortable label="原料重量" prop="storeWeight"></el-table-column>
          <el-table-column sortable label="原料数量" prop="storeNum"></el-table-column>
          <el-table-column sortable label="计划用料重量" prop="machWeight"></el-table-column>
          <el-table-column sortable label="计划用料数量" prop="machNum"></el-table-column>
          <el-table-column sortable label="卷回重量">
            <template slot-scope="scope">
              <number-input v-model="scope.row.rollbackWeight" decimal="10,3" :min="0" size="mini"
                            v-focus:rollbackWeight="scope.row==tmpRow"
                            @keyup.native.38="doFocus(scope.row,scope.$index,'rollbackWeight',38,'maRollbackTable')"
                            @keyup.native.40="doFocus(scope.row,scope.$index,'rollbackWeight',40,'maRollbackTable')"
                            @keyup.native.37="doFocus(scope.row,scope.$index,'rollbackWeight',37,'maRollbackTable')"
                            @keyup.native.39="doFocus(scope.row,scope.$index,'rollbackNum',39,'maRollbackTable')"
                            @focus.native="focus($event)"
              ></number-input>
            </template>
          </el-table-column>
          <el-table-column sortable label="卷回数量">
            <template slot-scope="scope">
              <number-input v-model="scope.row.rollbackNum" decimal="10" :min="0" size="mini"
                            v-focus:rollbackNum="scope.row==tmpRow"
                            @keyup.native.38="doFocus(scope.row,scope.$index,'rollbackNum',38,'maRollbackTable')"
                            @keyup.native.40="doFocus(scope.row,scope.$index,'rollbackNum',40,'maRollbackTable')"
                            @keyup.native.37="doFocus(scope.row,scope.$index,'rollbackWeight',37,'maRollbackTable')"
                            @keyup.native.39="doFocus(scope.row,scope.$index,'storeId',39,'maRollbackTable')"
                            @focus.native="focus($event)"
              ></number-input>
            </template>
          </el-table-column>
          <el-table-column sortable label="仓库">
            <template slot-scope="scope">
              <store-select v-model="scope.row.storeId"
                            v-focus:storeId="scope.row==tmpRow"
                            @keyup.native.38="doFocus(scope.row,scope.$index,'storeId',38,'maRollbackTable')"
                            @keyup.native.40="doFocus(scope.row,scope.$index,'storeId',40,'maRollbackTable')"
                            @keyup.native.37="doFocus(scope.row,scope.$index,'rollbackNum',37,'maRollbackTable')"
                            @keyup.native.39="doFocus(scope.row,scope.$index,'length',39,'maRollbackTable')"
              ></store-select>
            </template>
          </el-table-column>
          <el-table-column sortable label="长度">
            <template slot-scope="scope">
              <number-input v-model="scope.row.length" decimal="10,3" size="mini"
                            v-focus:length="scope.row==tmpRow"
                            @keyup.native.38="doFocus(scope.row,scope.$index,'length',38,'maRollbackTable')"
                            @keyup.native.40="doFocus(scope.row,scope.$index,'length',40,'maRollbackTable')"
                            @keyup.native.37="doFocus(scope.row,scope.$index,'storeId',37,'maRollbackTable')"
                            @keyup.native.39="doFocus(scope.row,scope.$index,'length',39,'maRollbackTable')"
              ></number-input>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="rollbackDialog.visible = false" icon="el-icon-back">返回</el-button>
          <el-button type="primary" @click="addRollbackMaPack" :disabled="actionDoing">保存</el-button>
        </div>
      </el-dialog>
    </template>

    <!-- 成品卷回打包 -->
    <template v-if="formData.resType === 2">
      <el-dialog :visible.sync="rollbackDialog.visible" width="80%">
        <el-tabs type="card" v-model="rollbackDialog.selectTabId" ref="tabObj">
          <el-tab-pane v-for="item in rollbackDialog.selectPdTabList" :key="item.materialId" :label="item.handCode" :name="item.materialId">
            <el-table
              :data="item.selectList"
              @header-click="dealRollbackPdHeaderClick"
              border stripe
              :header-cell-class-name="setHeaderPointerClass"
              row-class-name="pointer text-center tab-ellipsis"
              ref="pdRollbackTable"
              @row-click="handleTableClick"
            >
              <el-table-column sortable label="货物编号" prop="handCode">
                <template slot-scope="scope">
                  {{scope.row.handCode}}{{scope.row.type === 1 ? '(本次加工剩余)': scope.row.type === 2 ? '(整条)' : ''}}
                </template>
              </el-table-column>
              <el-table-column sortable label="钢卷号" prop="steelCode"></el-table-column>
              <el-table-column sortable label="规格" prop="pdSpecDes"  min-width="200"></el-table-column>
              <el-table-column sortable label="计划用料重量" prop="machWeight" min-width="120"></el-table-column>
              <el-table-column sortable label="计划用料数量" prop="machNum" min-width="120"></el-table-column>
              <el-table-column sortable label="领料重量" prop="weight"></el-table-column>
              <el-table-column sortable label="领料数量" prop="num"></el-table-column>
              <el-table-column sortable label="剩余卷回数量">
                <template slot-scope="scope">
                  <number-input v-model="scope.row.remainingNum" decimal="10" :min="0" size="mini"
                                v-focus:remainingNum="scope.row==tmpRow"
                                @keyup.native.38="doFocus(scope.row,scope.$index,'remainingNum',38,'pdRollbackTable')"
                                @keyup.native.40="doFocus(scope.row,scope.$index,'remainingNum',40,'pdRollbackTable')"
                                @focus.native="focus($event)"
                  ></number-input>
                </template>
              </el-table-column>
              <el-table-column label="全部添加">
                <template slot-scope="scope">
                  <el-button size="small" @click="makeRollbackPdPack(scope.row,scope.$index)">添加</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
        <el-table
          :data="rollbackDialog.selectPdPackList"
          @header-click="dealRollbackPdPackHeaderClick"
          border stripe
          :header-cell-class-name="setHeaderPointerClass"
          row-class-name="pointer text-center tab-ellipsis"
          style="margin-top: 20px"
          ref="pdRollbackPackTable"
        >
          <el-table-column label="合并">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.selected"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column sortable label="货物编号" prop="handCodes"></el-table-column>
          <el-table-column sortable label="钢卷号" prop="steelCodes"></el-table-column>
          <el-table-column sortable label="规格" prop="specAllPd"  min-width="200"></el-table-column>
          <el-table-column sortable :label="'理重['+ rollbackPdDialogTableHeader.weight+']'" prop="weight" min-width="120"></el-table-column>
          <el-table-column sortable :label="'磅重['+ rollbackPdDialogTableHeader.weight1+']'" prop="weight1" min-width="120"></el-table-column>
          <el-table-column sortable :label="'毛重['+ rollbackPdDialogTableHeader.weight3+']'" min-width="120">
            <template slot-scope="scope">
              <number-input v-model="scope.row.weight3" decimal="10,3" :min="0" @change="rollbackCalWeight1(scope.row)" size="mini"
                            v-focus:weight3="scope.row==tmpRow"
                            @keyup.native.38="doFocus(scope.row,scope.$index,'weight3',38,'pdRollbackPackTable')"
                            @keyup.native.40="doFocus(scope.row,scope.$index,'weight3',40,'pdRollbackPackTable')"
                            @keyup.native.37="doFocus(scope.row,scope.$index,'weight3',37,'pdRollbackPackTable')"
                            @keyup.native.39="doFocus(scope.row,scope.$index,'weight6',39,'pdRollbackPackTable')"
                            @focus.native="focus($event)"
              ></number-input>
            </template>
          </el-table-column>
          <el-table-column sortable :label="'木架重['+ rollbackPdDialogTableHeader.weight6+']'" min-width="120">
            <template slot-scope="scope">
              <number-input v-model="scope.row.weight6" decimal="10,3" :min="0" @change="rollbackCalWeight1(scope.row)" size="mini"
                            v-focus:weight6="scope.row==tmpRow"
                            @keyup.native.38="doFocus(scope.row,scope.$index,'weight6',38,'pdRollbackPackTable')"
                            @keyup.native.40="doFocus(scope.row,scope.$index,'weight6',40,'pdRollbackPackTable')"
                            @keyup.native.37="doFocus(scope.row,scope.$index,'weight3',37,'pdRollbackPackTable')"
                            @keyup.native.39="doFocus(scope.row,scope.$index,'storeId',39,'pdRollbackPackTable')"
                            @focus.native="focus($event)"
              ></number-input>
            </template>
          </el-table-column>
          <el-table-column sortable label="仓库">
            <template slot-scope="scope">
              <store-select v-model="scope.row.storeId"
                            v-focus:storeId="scope.row==tmpRow"
                            @keyup.native.38="doFocus(scope.row,scope.$index,'storeId',38,'pdRollbackPackTable')"
                            @keyup.native.40="doFocus(scope.row,scope.$index,'storeId',40,'pdRollbackPackTable')"
                            @keyup.native.37="doFocus(scope.row,scope.$index,'weight6',37,'pdRollbackPackTable')"
                            @keyup.native.39="doFocus(scope.row,scope.$index,'remark',39,'pdRollbackPackTable')"
              ></store-select>
            </template>
          </el-table-column>
          <el-table-column sortable label="备注">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" @click.native="showPackRemark(scope.row)" readonly
                        v-focus:remark="scope.row==tmpRow"
                        @keyup.native.38="doFocus(scope.row,scope.$index,'remark',38,'pdRollbackPackTable')"
                        @keyup.native.40="doFocus(scope.row,scope.$index,'remark',40,'pdRollbackPackTable')"
                        @keyup.native.37="doFocus(scope.row,scope.$index,'storeId',37,'pdRollbackPackTable')"
                        @keyup.native.39="doFocus(scope.row,scope.$index,'remark',39,'pdRollbackPackTable')"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="全部删除">
            <template slot-scope="scope">
              <el-button size="small" @click="deleteRollbackPdPack(scope.row,scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="rollbackDialog.visible = false" icon="el-icon-back">返回</el-button>
          <el-button type="primary" @click="addRollbackPdPack" :disabled="actionDoing">保存</el-button>
        </div>
      </el-dialog>
    </template>

    <!-- 成品打包复制 -->
    <el-dialog :visible.sync="copyPackDialog.visible" width="30%">
      <el-form :inline="true" size="small" label-width="150px">
        <el-form-item label="请输入复制包数">
          <number-input v-model="copyPackDialog.packNum" decimal="10" :min="0"></number-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="copyPackDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="copyPack" :disabled="actionDoing">确定</el-button>
      </div>
    </el-dialog>

    <!-- 成品打包修改 -->
    <el-dialog :visible.sync="updatePackDialog.visible" width="80%">
      <el-row style="margin-top: 20px">
        <el-table
          :data="updatePackDialog.pdPackList"
          border stripe
          :header-cell-class-name="setHeaderPointerClass"
          row-class-name="pointer text-center tab-ellipsis">
          <el-table-column sortable label="包装编号" prop="blno"></el-table-column>
          <el-table-column sortable label="货物编号" prop="handCodes"></el-table-column>
          <el-table-column sortable label="钢卷号" prop="steelCodes"></el-table-column>
          <el-table-column sortable label="规格" prop="specAllPd" min-width="200"></el-table-column>
          <el-table-column sortable label="理算重量" prop="weight" min-width="120"></el-table-column>
          <el-table-column sortable label="过磅净重" prop="weight1" min-width="120"></el-table-column>
          <el-table-column sortable label="过磅毛重" min-width="120">
            <template slot-scope="scope">
              <number-input v-model="scope.row.weight3" decimal="10,3" :min="0" @change="calWeight1(scope.row)" size="mini"></number-input>
            </template>
          </el-table-column>
          <el-table-column sortable label="木架重" min-width="120" >
            <template slot-scope="scope">
              <number-input v-model="scope.row.weight6" decimal="10,3" :min="0" @change="calWeight1(scope.row)" size="mini"></number-input>
            </template>
          </el-table-column>
          <el-table-column sortable label="库位">
            <template slot-scope="scope">
              <store-select v-model="scope.row.storeId"></store-select>
            </template>
          </el-table-column>
          <el-table-column sortable label="包装备注">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" @focus="showPackRemark(scope.row)" readonly></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updatePackDialog.visible = false" icon="el-icon-back">返回</el-button>
        <el-button type="primary" @click="updatePack" :disabled="actionDoing">保存</el-button>
      </div>
    </el-dialog>

    <!-- 标签打印 -->
    <el-dialog title="打印" :visible.sync="pdfViewerDialogVisible" @close="pdfSrc='about:blank'">
      <iframe id="pdfViewer" width="680px" height="600px" :src="pdfSrc"  frameborder="no" border="0"></iframe>
    </el-dialog>

    <!-- 标签修改 -->
    <el-dialog :visible.sync="customLabelDialog.visible" :show-close="false" width="80%">
      <el-row slot="title">
        <el-button type="primary" icon="el-icon-back" @click="customLabelDialog.visible=false">返回</el-button>
        <el-button type="primary" icon="el-icon-printer" @click="printCustomLabel">打印</el-button>
      </el-row>
      <el-row class="form-wrap mb-10">
        <el-form :inline="true" size="small" label-width="80px" >
          <el-form-item label="客户"><el-input v-model="customLabelObj.cuFullName" placeholder="[默认值]" clearable></el-input></el-form-item>
          <el-form-item label="品名"><el-input v-model="customLabelObj.typeName" placeholder="[默认值]" clearable></el-input></el-form-item>
          <el-form-item label="产地"><el-input v-model="customLabelObj.parea" placeholder="[默认值]" clearable></el-input></el-form-item>
          <el-form-item label="材质"><el-input v-model="customLabelObj.grade" placeholder="[默认值]" clearable></el-input></el-form-item>
        </el-form>
      </el-row>
      <el-tabs type="card" v-model="currentPackTabIDX" @tab-click="changePackLabelTab">
        <el-tab-pane v-for="(item,index) in customLabelList" :key="index" :label="item.blno" >
          <el-table :data = "customLabelList[currentPackTabIDX].dts" border stripe header-cell-class-name="table-header-bg text-center">
            <el-table-column sortable  label="原料编号">
              <template slot-scope="scope">
                <el-input v-model="scope.row.maHandCode"></el-input>
              </template>
            </el-table-column>
            <el-table-column sortable  label="成品规格">
              <template slot-scope="scope">
                <el-input v-model="scope.row.pdSpecDes"></el-input>
              </template>
            </el-table-column>
            <el-table-column sortable  label="数量">
              <template slot-scope="scope">
                <el-input v-model="scope.row.num"></el-input>
              </template>
            </el-table-column>
          </el-table>
          <el-row class="mt-10">
            <el-col :span="3">钢卷号：</el-col><el-col :span="6"><el-input  v-model="customLabelList[currentPackTabIDX].steelCodes"></el-input></el-col>
          </el-row>
          <el-row class="mt-10">
            <el-col :span="3">理论重量：</el-col><el-col :span="6"><el-input  v-model="customLabelList[currentPackTabIDX].weight"></el-input></el-col>
          </el-row>
          <el-row class="mt-10">
            <el-col :span="3">过磅净重：</el-col><el-col :span="6"><el-input  v-model="customLabelList[currentPackTabIDX].weight1"></el-input></el-col>
          </el-row>
          <el-row class="mt-10">
            <el-col :span="3">过磅毛重：</el-col><el-col :span="6"><el-input  v-model="customLabelList[currentPackTabIDX].weight3"></el-input></el-col>
          </el-row>
          <el-row class="mt-10">
            <el-col :span="3">木架重量：</el-col><el-col :span="6"><el-input  v-model="customLabelList[currentPackTabIDX].weight6"></el-input></el-col>
          </el-row>
          <el-row class="mt-10">
            <el-col :span="3">包装备注：</el-col><el-col :span="6"><el-input  v-model="customLabelList[currentPackTabIDX].remark"></el-input></el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!-- 包装备注选择 -->
    <el-dialog :visible.sync="packRemarkDialog.visible" v-if='packRemarkDialog.visible' width="30%">
      <pack-remark :selectRow="packRemarkDialog.selectRow"></pack-remark>
    </el-dialog>
  </div>
</template>

<script>
  import storeSelect from '@/components/storeSelect'
  import numberInput from '@/components/numberInput'
  import * as api from '@/api/process/machPack/machPack'
  import packRemark from './packRemark'
  import { copyObject } from '@/utils'
// import * as pdf from 'pdfjs-dist'

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
    name: 'pack-tab',
    props: {
      formData: Object
    },
    components: {
      storeSelect,
      numberInput,
      packRemark
    },
    computed: {
      pdPackTableHeader() {
        const temp = {}
        temp.weight = this.pdPackList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight ? cur.weight : 0)
        }, 0).toFixed(3)
        temp.weight1 = this.pdPackList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight1 ? cur.weight1 : 0)
        }, 0).toFixed(3)
        temp.weight3 = this.pdPackList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight3 ? cur.weight3 : 0)
        }, 0).toFixed(3)
        temp.weight6 = this.pdPackList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight6 ? cur.weight6 : 0)
        }, 0).toFixed(3)
        return temp
      },
      maRollbackPackTableHeader() {
        const temp = {}
        temp.rollbackWeight = this.maRollbackList.reduce((pre, cur) => {
          return pre + parseFloat(cur.rollbackWeight ? cur.rollbackWeight : 0)
        }, 0).toFixed(3)
        temp.rollbackNum = this.maRollbackList.reduce((pre, cur) => {
          return pre + parseInt(cur.rollbackNum ? cur.rollbackNum : 0)
        }, 0)
        return temp
      },
      pdRollbackPackTableHeader() {
        const temp = {}
        temp.weight = this.pdRollbackList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight ? cur.weight : 0)
        }, 0).toFixed(3)
        temp.weight1 = this.pdRollbackList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight1 ? cur.weight1 : 0)
        }, 0).toFixed(3)
        temp.weight3 = this.pdRollbackList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight3 ? cur.weight3 : 0)
        }, 0).toFixed(3)
        temp.weight6 = this.pdRollbackList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight6 ? cur.weight6 : 0)
        }, 0).toFixed(3)
        return temp
      },
      pdPackDialogTableHeader() {
        const temp = {}
        temp.weight = this.pdPackDialog.selectPdGoodPackList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight ? cur.weight : 0)
        }, 0).toFixed(3)
        temp.weight1 = this.pdPackDialog.selectPdGoodPackList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight1 ? cur.weight1 : 0)
        }, 0).toFixed(3)
        temp.weight3 = this.pdPackDialog.selectPdGoodPackList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight3 ? cur.weight3 : 0)
        }, 0).toFixed(3)
        temp.weight6 = this.pdPackDialog.selectPdGoodPackList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight6 ? cur.weight6 : 0)
        }, 0).toFixed(3)
        return temp
      },
      wasteDialogTableHeader() {
        const temp = {}
        temp.weight = this.wasteDialog.selectPdGoodPackList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight ? cur.weight : 0)
        }, 0).toFixed(3)
        temp.weight1 = this.wasteDialog.selectPdGoodPackList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight1 ? cur.weight1 : 0)
        }, 0).toFixed(3)
        temp.weight3 = this.wasteDialog.selectPdGoodPackList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight3 ? cur.weight3 : 0)
        }, 0).toFixed(3)
        temp.weight6 = this.wasteDialog.selectPdGoodPackList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight6 ? cur.weight6 : 0)
        }, 0).toFixed(3)
        return temp
      },
      rollbackPdDialogTableHeader() {
        const temp = {}
        temp.weight = this.rollbackDialog.selectPdPackList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight ? cur.weight : 0)
        }, 0).toFixed(3)
        temp.weight1 = this.rollbackDialog.selectPdPackList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight1 ? cur.weight1 : 0)
        }, 0).toFixed(3)
        temp.weight3 = this.rollbackDialog.selectPdPackList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight3 ? cur.weight3 : 0)
        }, 0).toFixed(3)
        temp.weight6 = this.rollbackDialog.selectPdPackList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight6 ? cur.weight6 : 0)
        }, 0).toFixed(3)
        return temp
      }
    },
    data() {
      return {
        defaultStoreId: this.formData.storeId,
        modifyLabel: true,
        actionDoing: false,
        printWasteWeight: false, // 是否打印废料重量
        pdPackList: [], // 成品打包信息
        selectionPdPackList: [], // 选择成品打包信息
        selectionRollbackPdPackList: [], // 选择卷回打包信息
        maRollbackList: [], // 原料卷回
        pdRollbackList: [], // 成品卷回
        pdPackDialog: {// 成品打包弹出框
          visible: false,
          selectPdGoodList: [], // 成品打包选择货物
          selectPdGoodListTemp: [], // 成品打包选择货物缓存列表（存储页面打包后剩余数量少于0的明细，用于还原显示）
          selectPdGoodPackList: [] // 成品打包生成包装
        },
        wasteDialog: {// 废料打包弹出框
          type: null, // 类型 1边料 2头尾板
          visible: false,
          selectPdGoodList: [], // 废料打包选择货物
          selectPdGoodPackList: [] // 废料打包生成包装
        },
        rollbackDialog: {// 卷回打包弹出框
          visible: false,
          selectMaList: [], // 原料卷回打包选择货物
          selectPdTabList: [], // 成品卷回打包选择货物tabList
          selectPdListTemp: [], // 成品卷回打包选择货物缓存列表（存储页面打包后数量少于0的明细，用于还原显示）
          selectPdPackList: [], // 成品卷回打包生成包装
          selectTabId: ''
        },
        copyPackDialog: {// 包装复制弹出框
          visible: false,
          packId: '',
          packNum: '',
          type: '' // 类型 1成品打包复制 2成品卷回复制
        },
        updatePackDialog: {// 包装修改弹出框
          visible: false,
          pdPackList: []
        },
        packRemarkDialog: {// 包装备注选择弹出框
          visible: false,
          selectRow: null
        },
        customLabelDialog: { // 修改标签
          visible: false
        },
        pdfViewerDialogVisible: false, // 标签打印框
        pdfSrc: 'about:blank',
        customLabelObj: {},
        customLabelList: [], // 自定义标签数组
        currentPackTabIDX: 0, // 当前tab选中包装
        toggleRowSelection: false, // 双击不让选中的标志
        clickTimer: null, // 判断单击双击的计时器
        tmpRow: {}, // 记录临时选中行
        focusInput: '', // 记录当前聚焦列名
        tailBoardTypeArr: [
          { 'id': 4, 'name': '头尾板' },
          { 'id': 5, 'name': '头板' },
          { 'id': 6, 'name': '尾板' },
          { 'id': 7, 'name': '短板' }
        ]
      }
    },
    methods: {
      handleTableClick(row, event, column) {
        this.focusInput = ''
        this.tmpRow = row
      },
      focus(event) {
        // 聚焦时全选文本
        event.currentTarget.select()
      },
      // 根据上下左右聚焦
      doFocus(item, index, colum, key, tableName) {
        // 上 操作
        if ((index > 0) && key === 38) {
          index--
        }

        let list = []
        let pdrollbackindex = -1 // 成品卷回对应table的下标
        switch (tableName) {
          case 'pdTable':
            list = this.pdPackDialog.selectPdGoodList
            if ((index < list.length - 1) && key === 40) { index++ } // 下操作
            this.$refs.pdTable.setCurrentRow(list[index])
            break
          case 'pdPackTable':
            list = this.pdPackDialog.selectPdGoodPackList
            if ((index < list.length - 1) && key === 40) { index++ } // 下操作
            this.$refs.pdPackTable.setCurrentRow(list[index])
            break
          case 'wasteTable':
            list = this.wasteDialog.selectPdGoodList
            if ((index < list.length - 1) && key === 40) { index++ } // 下操作
            this.$refs.wasteTable.setCurrentRow(list[index])
            break
          case 'wastePackTable':
            list = this.wasteDialog.selectPdGoodPackList
            if ((index < list.length - 1) && key === 40) { index++ } // 下操作
            this.$refs.wastePackTable.setCurrentRow(list[index])
            break
          case 'maRollbackTable':
            list = this.rollbackDialog.selectMaList
            if ((index < list.length - 1) && key === 40) { index++ } // 下操作
            this.$refs.maRollbackTable.setCurrentRow(list[index])
            break
          case 'pdRollbackTable':
            for (let i = 0; i < this.rollbackDialog.selectPdTabList.length; i++) {
              if (this.rollbackDialog.selectPdTabList[i].materialId === this.rollbackDialog.selectTabId) {
                list = this.rollbackDialog.selectPdTabList[i].selectList
                pdrollbackindex = i
                break
              }
            }
            if ((index < list.length - 1) && key === 40) { index++ } // 下操作
            this.$refs.pdRollbackTable[pdrollbackindex].setCurrentRow(list[index])
            break
          case 'pdRollbackPackTable':
            list = this.rollbackDialog.selectPdPackList
            if ((index < list.length - 1) && key === 40) { index++ } // 下操作
            this.$refs.pdRollbackPackTable.setCurrentRow(list[index])
            break
        }

        this.tmpRow = list[index]
        this.focusInput = colum
      },
      tableRowClassName({ row, rowIndex }) {
        for (let i = 0; i < this.selectionPdPackList.length; i++) {
          if (this.selectionPdPackList[i].id === row.id) {
            return 'table-select-bgcolor pointer text-center tab-ellipsis'
          }
        }
        return 'pointer text-center tab-ellipsis'
      },
      rollbackTableRowClassName({ row, rowIndex }) {
        for (let i = 0; i < this.selectionRollbackPdPackList.length; i++) {
          if (this.selectionRollbackPdPackList[i].id === row.id) {
            return 'table-select-bgcolor pointer text-center tab-ellipsis'
          }
        }
        return 'pointer text-center tab-ellipsis'
      },
      handleRowClick(row, event, column) {
        clearTimeout(this.clickTimer) // 取消上次延时未执行的方法
        this.clickTimer = setTimeout(() => {
          this.$refs.table.toggleRowSelection(row)
        }, 250)
      },
      rollbackHandleRowClick(row, event, column) {
        clearTimeout(this.clickTimer) // 取消上次延时未执行的方法
        this.clickTimer = setTimeout(() => {
          this.$refs.rollbackTable.toggleRowSelection(row)
        }, 250)
      },
      // 显示成品打包
      showPdPack() {
        this.getSelectPdGoodList()
        this.pdPackDialog.visible = true
      },
      // 选择成品打包查询
      getSelectPdGoodList() {
        this.pdPackDialog.selectPdGoodList = []
        this.pdPackDialog.selectPdGoodListTemp = []
        this.pdPackDialog.selectPdGoodPackList = []
        const reqData = {
          // resType: this.formData.resType,
          machPackId: this.formData.id
        }
        api.selectPdGoodList(reqData).then((response) => {
          this.pdPackDialog.selectPdGoodList = response.list
          for (const item of this.pdPackDialog.selectPdGoodList) {
            this.$set(item, 'useNum', item.remainingNum) // 此处不是用set通知的话，后续变更值时存在渲染显示问题
            item.maxRemainingNum = item.remainingNum
          }
        }).catch(error => {
          if (error) console.error(error)
        })
      },
      // // 选中包装列表
      // currentPackChange(val) {
      //   this.currentPackRow = val
      // },
      // 添加货物打成包装
      makePdPack(row, index) {
        if (!row.useNum || isNaN(row.useNum)) {
          this.$message('请输入本次数量')
          return
        }
        row.remainingNum = parseInt(row.remainingNum) - parseInt(row.useNum)
        const pdGoodPackDt = {
          uuid: row.uuid,
          machDtInfoId: row.machDtInfoId,
          machFlag: row.machFlag, // 1分条 2平直
          goodId: row.goodId,
          handCode: row.handCode,
          steelCode: row.steelCode,
          maSpec: row.maSpec,
          spec: row.spec,
          thickness: row.thickness,
          width: row.width,
          length: row.length,
          num: parseInt(row.useNum),
          toCutNum: row.toCutNum,
          excessManage: row.excessManage,
          materialId: row.materialId
        }
        // 拼接规格
        if (pdGoodPackDt.machFlag === 1) {
          let suffix
          if (pdGoodPackDt.toCutNum > 0) {
            suffix = '（转平直）'
          } else if (pdGoodPackDt.excessManage === 1) {
            suffix = '（边料）'
          } else {
            suffix = ''
          }
          pdGoodPackDt.spec = pdGoodPackDt.thickness + '×' + pdGoodPackDt.width + '×' + pdGoodPackDt.num + '条' + suffix
        } else if (pdGoodPackDt.machFlag === 2) {
          pdGoodPackDt.spec = pdGoodPackDt.thickness + '×' + pdGoodPackDt.width + '×' + pdGoodPackDt.length + '×' + pdGoodPackDt.num + '件'
        }
        row.useNum = ''
        // 分条
        if (row.machFlag === 1) {
          // 理重 = 使用数量 / 总数量 * 总理重
          pdGoodPackDt.weight = parseFloat(pdGoodPackDt.num / row.num * row.weight).toFixed(3)
          if (isNaN(row.remainingNum) || row.remainingNum < 0) {
            this.$message('本次数量不能超过剩余数量')
            return
          }
          // 如果剩余数量等于0,从列表中去除
          if (row.remainingNum === 0) {
            this.pdPackDialog.selectPdGoodList.splice(index, 1)
            // 缓存删除数据
            this.pdPackDialog.selectPdGoodListTemp.push(row)
          }
        } else { // 平直
          if (!row.density || row.density <= 0) {
            row.density = 7.85
          }
          // 计算理重
          pdGoodPackDt.weight = parseFloat(pdGoodPackDt.thickness * pdGoodPackDt.width * pdGoodPackDt.length * pdGoodPackDt.num * row.density / 1000000000).toFixed(3)
          row.remainingNum = row.remainingNum < 0 ? 0 : row.remainingNum
          // 混平情况下剩余数量相同
          for (const item of this.pdPackDialog.selectPdGoodList) {
            if (item.goodId === row.goodId) {
              item.remainingNum = row.remainingNum
            }
          }
        }
        const pdGoodPack = {
          selected: false,
          weight1: '', // 过磅净重
          weight3: '', // 过磅毛重
          weight6: '', // 木架重
          storeId: this.defaultStoreId,
          remark: '',
          dtList: [pdGoodPackDt]
        }
        this.sumPack(pdGoodPack)
        this.pdPackDialog.selectPdGoodPackList.push(pdGoodPack)
      },
      // 删除包装返回货物
      deletePdGoodPack(row, index) {
        // 遍历包装明细
        for (const dt of row.dtList) {
          let isFind = false
          // 匹配货物列表
          for (const pdGood of this.pdPackDialog.selectPdGoodList) {
            if (dt.uuid === pdGood.uuid) {
              // 返还使用数量
              pdGood.remainingNum += dt.num
              if (pdGood.remainingNum > pdGood.maxRemainingNum) {
                pdGood.remainingNum = pdGood.maxRemainingNum
              }
              // 平直(混平)情况下剩余数量相同
              if (dt.machFlag === 2) {
                for (const item of this.pdPackDialog.selectPdGoodList) {
                  if (item.goodId === pdGood.goodId) {
                    item.remainingNum = pdGood.remainingNum
                  }
                }
              }
              isFind = true
            }
          }
          // 若匹配不到，则在缓存中匹配
          if (!isFind) {
            for (let i = 0; i < this.pdPackDialog.selectPdGoodListTemp.length; i++) {
              if (dt.uuid === this.pdPackDialog.selectPdGoodListTemp[i].uuid) {
                this.pdPackDialog.selectPdGoodListTemp[i].remainingNum = dt.num
                this.pdPackDialog.selectPdGoodList.push(this.pdPackDialog.selectPdGoodListTemp[i])
                // 删除缓存
                this.pdPackDialog.selectPdGoodListTemp.splice(i, 1)
                break
              }
            }
          }
        }
        // 从包装打包列表中去除
        this.pdPackDialog.selectPdGoodPackList.splice(index, 1)
      },
      // 成品打包
      addPdPack() {
        if (!this.pdPackDialog.selectPdGoodPackList || this.pdPackDialog.selectPdGoodPackList.length < 1) {
          this.$message('打包明细不能为空')
          return
        }
        for (const item of this.pdPackDialog.selectPdGoodPackList) {
          if (!item.storeId) {
            this.$message('仓库不能为空')
            return
          }
        }
        const reqData = {
          machPackId: this.formData.id,
          machOrderId: this.formData.machOrderId,
          list: this.pdPackDialog.selectPdGoodPackList
        }
        this.actionDoing = true
        api.addPdPack(reqData).then(response => {
          this.$emit('queryMachPackInfo')
          this.getPdPackList()
          this.pdPackDialog.visible = false
          this.actionDoing = false
        }).catch(error => {
          if (error)console.error(error)
          this.actionDoing = false
        })
      },
      // 显示废料打包
      showWaste(type) {
        this.getSelectWasteList()
        this.wasteDialog.type = type
        this.wasteDialog.visible = true
      },
      // 选择废料打包查询
      getSelectWasteList() {
        this.wasteDialog.selectPdGoodList = []
        this.wasteDialog.selectPdGoodPackList = []
        const reqData = {
          // resType: this.formData.resType,
          machPackId: this.formData.id
        }
        api.selectWasteList(reqData).then((response) => {
          const list = response.list
          list.forEach(dt => {
            dt.pdType = this.tailBoardTypeArr[0].id
          })
          this.wasteDialog.selectPdGoodList = list
        }).catch(error => {
          if (error) console.error(error)
        })
      },
      // 打印标签
      printLabel() {
        if (this.selectionPdPackList && this.selectionRollbackPdPackList &&
        this.selectionPdPackList.length + this.selectionRollbackPdPackList.length > 0) {
          const ids = this.selectionPdPackList.map((pack) => pack.id)
          const rollbackIds = this.selectionRollbackPdPackList.map((pack) => pack.pdPackId)
          api.labelPrint({ ids: ids.concat(rollbackIds), printWasteWeight: this.printWasteWeight }).then((response) => {
            // console.log(URL.createObjectURL(response))
            this.pdfSrc = URL.createObjectURL(response)
          })
          this.pdfViewerDialogVisible = true
        }
      },
      // 打印标签
      printCustomLabel() {
        if (this.customLabelList && this.customLabelList.length > 0) {
          // 检查公共字段有无修改
          this.customLabelList.forEach(label => {
            if (this.customLabelObj.cuFullName) {
              label.cuFullName = this.customLabelObj.cuFullName
            }
            if (label.dts) {
              label.dts.forEach(dt => {
                if (this.customLabelObj.typeName) {
                  dt.typeName = this.customLabelObj.typeName
                }
                if (this.customLabelObj.parea) {
                  dt.parea = this.customLabelObj.parea
                }
                if (this.customLabelObj.grade) {
                  dt.grade = this.customLabelObj.grade
                }
              })
            }
          })
          // console.log(this.customLabelList)
          api.labelCustomPrint({ packList: this.customLabelList, printWasteWeight: this.printWasteWeight }).then((response) => {
            // console.log(URL.createObjectURL(response))
            this.pdfSrc = URL.createObjectURL(response)
          })
          this.pdfViewerDialogVisible = true
        }
      },
      // 添加废料打成包装
      makeWastePack(row) {
        if (!row.useNum || isNaN(row.useNum)) {
          this.$message('请输入本次数量')
          return
        }
        const useNum = parseInt(row.useNum)
        if (useNum <= 0) {
          this.$message('本次数量必须大于0')
          return
        }
        const pdGoodPackDt = {
          machDtInfoId: row.machDtInfoId,
          resId: row.resId,
          handCode: row.handCode,
          steelCode: row.steelCode,
          maSpec: row.maSpec,
          thickness: row.thickness,
          num: useNum,
          weight: 0,
          materialId: row.materialId,
          pdType: row.pdType
        }
        // 边料打包
        if (this.wasteDialog.type === 1) {
          if (row.sideWidth) {
            pdGoodPackDt.width = row.sideWidth
            pdGoodPackDt.spec = pdGoodPackDt.thickness + '×' + pdGoodPackDt.width
          } else {
            pdGoodPackDt.spec = pdGoodPackDt.thickness
          }
          pdGoodPackDt.pdType = 3
          pdGoodPackDt.spec += '×' + pdGoodPackDt.num + '条（边料）'
          this.$set(row, 'useNum', '')
          this.$set(row, 'sideWidth', '')
        } else if (this.wasteDialog.type === 2) { // 头尾板打包
          if (!pdGoodPackDt.pdType) {
            this.$message('类型不能为空')
            return
          }
          pdGoodPackDt.width = row.width
          // 当头尾板长度输入时，理论重量 = 厚 * 宽 * 长 * 数量 * 密度
          if (row.tailBoardLength) {
            if (!row.density || row.density <= 0) {
              row.density = 7.85
            }
            pdGoodPackDt.length = row.tailBoardLength
            pdGoodPackDt.weight = parseFloat(pdGoodPackDt.thickness * pdGoodPackDt.width * pdGoodPackDt.length * pdGoodPackDt.num * row.density / 1000000000).toFixed(3)
            pdGoodPackDt.spec = pdGoodPackDt.thickness + '×' + pdGoodPackDt.width + '×' + pdGoodPackDt.length
          } else {
            pdGoodPackDt.spec = pdGoodPackDt.thickness + '×' + pdGoodPackDt.width
          }
          let suffix = ''
          if (pdGoodPackDt.pdType === 4) {
            suffix = '（头尾板）'
          } else if (pdGoodPackDt.pdType === 5) {
            suffix = '（头板）'
          } else if (pdGoodPackDt.pdType === 6) {
            suffix = '（尾板）'
          } else if (pdGoodPackDt.pdType === 7) {
            suffix = '（短板）'
          }
          pdGoodPackDt.spec += '×' + pdGoodPackDt.num + '件' + suffix
          this.$set(row, 'useNum', '')
          this.$set(row, 'tailBoardLength', '')
        } else {
          this.$message('类型错误')
          return
        }
        const pdGoodPack = {
          selected: false,
          weight1: '', // 过磅净重
          weight3: '', // 过磅毛重
          weight6: '', // 木架重
          storeId: this.defaultStoreId,
          remark: '',
          dtList: [pdGoodPackDt]
        }
        this.sumPack(pdGoodPack)
        this.wasteDialog.selectPdGoodPackList.push(pdGoodPack)
      },
      // 删除废料包装返回货物
      deleteWastePack(row, index) {
        // 从包装打包列表中去除
        this.wasteDialog.selectPdGoodPackList.splice(index, 1)
      },
      // 废料打包
      addWastePack() {
        if (!this.wasteDialog.selectPdGoodPackList || this.wasteDialog.selectPdGoodPackList.length < 1) {
          this.$message('打包明细不能为空')
          return
        }
        for (const item of this.wasteDialog.selectPdGoodPackList) {
          if (!item.storeId) {
            this.$message('仓库不能为空')
            return
          }
        }
        const reqData = {
          type: this.wasteDialog.type,
          machPackId: this.formData.id,
          machOrderId: this.formData.machOrderId,
          list: this.wasteDialog.selectPdGoodPackList
        }
        this.actionDoing = true
        api.addWastePack(reqData).then(response => {
          this.$emit('queryMachPackInfo')
          this.getPdPackList()
          this.wasteDialog.visible = false
          this.actionDoing = false
        }).catch(error => {
          if (error)console.error(error)
          this.actionDoing = false
        })
      },
      // 汇总包装字段
      sumPack(pdGoodPack) {
        if (pdGoodPack.dtList) {
          const handCodes = new Set()
          const steelCodes = new Set()
          const specAllMa = new Set()
          const specAllPd = []
          let weight = 0
          let num = 0
          pdGoodPack.dtList.forEach(dt => {
            handCodes.add(dt.handCode)
            steelCodes.add(dt.steelCode)
            specAllMa.add(dt.maSpec)
            specAllPd.push(dt.spec)
            weight += parseFloat(dt.weight)
            num += parseFloat(dt.num)
          })
          pdGoodPack.handCodes = Array.from(handCodes).join(',')
          pdGoodPack.steelCodes = Array.from(steelCodes).join(',')
          pdGoodPack.specAllMa = Array.from(specAllMa).join(',')
          pdGoodPack.specAllPd = Array.from(specAllPd).join(',')
          pdGoodPack.weight = parseFloat(weight).toFixed(3)
          pdGoodPack.num = num
        }
      },
      // 成品打包信息查询
      getPdPackList() {
        this.pdPackList = []
        const reqData = {
          machPackId: this.formData.id
        }
        api.pdPackList(reqData).then((response) => {
          this.pdPackList = response.list
        }).catch(error => {
          if (error) console.error(error)
        })
      },
      // 显示卷回打包
      showRollback() {
        this.getSelectRollbackList()
        this.rollbackDialog.visible = true
      },
      // 选择卷回打包查询
      getSelectRollbackList() {
        this.rollbackDialog.selectMaList = []
        this.rollbackDialog.selectPdTabList = []
        this.rollbackDialog.selectPdListTemp = []
        this.rollbackDialog.selectPdPackList = []
        this.rollbackDialog.selectTabId = ''
        const reqData = {
          // resType: this.formData.resType,
          machPackId: this.formData.id
        }
        api.selectRollbackList(reqData).then((response) => {
          if (response.maList && response.maList.length > 0) {
            for (const ma of response.maList) {
              const temp = Object.assign({}, ma)
              temp.rollbackWeight = parseFloat(parseFloat(ma.storeWeight) - parseFloat(ma.machWeight)).toFixed(3)
              temp.rollbackNum = parseInt(ma.storeNum) - parseInt(ma.machNum)
              if (temp.rollbackNum < 1) {
                temp.rollbackNum = 1
              }
              temp.storeId = this.defaultStoreId
              this.rollbackDialog.selectMaList.push(temp)
            }
          }
          if (response.pdList && response.pdList.length > 0) {
            for (const item of response.pdList) {
              const temp = Object.assign({}, item)
              for (const pd of temp.selectList) {
                pd.remainingNum = parseInt(pd.num) - parseInt(pd.rollbackNum)
              }
              this.rollbackDialog.selectPdTabList.push(temp)
            }
            if (this.rollbackDialog.selectPdTabList.length > 0) {
              this.rollbackDialog.selectTabId = this.rollbackDialog.selectPdTabList[0].materialId
            }
          }
        }).catch(error => {
          if (error) console.error(error)
        })
      },
      // 原料卷回打包
      addRollbackMaPack() {
        if (!this.rollbackDialog.selectMaList || this.rollbackDialog.selectMaList.length < 1) {
          this.$message('打包明细不能为空')
          return
        }
        const maList = []
        for (const item of this.rollbackDialog.selectMaList) {
          if (parseInt(item.rollbackNum) > 0 && parseFloat(item.rollbackWeight) > 0) {
            if (!item.storeId) {
              this.$message('仓库不能为空')
              return
            }
            maList.push(item)
          }
        }
        if (maList.length < 1) {
          this.$message('卷回明细不能为空')
          return
        }
        const reqData = {
          resType: this.formData.resType,
          machPackId: this.formData.id,
          machOrderId: this.formData.machOrderId,
          maList: maList
        }
        this.actionDoing = true
        api.addRollbackPack(reqData).then(response => {
          this.$emit('queryMachPackInfo')
          this.getPdPackList()
          this.getRollbackPackList()
          this.rollbackDialog.visible = false
          this.actionDoing = false
        }).catch(error => {
          if (error)console.error(error)
          this.actionDoing = false
        })
      },
      // 添加成品卷回打成包装
      makeRollbackPdPack(row, index) {
        if (!row.remainingNum || isNaN(row.remainingNum)) {
          this.$message('请输入剩余卷回数量')
          return
        }
        const pdGoodPackDt = {
          selectId: row.id,
          machDtInfoId: row.machDtInfoId,
          materialId: row.materialId,
          pdStockId: row.pdStockId,
          srcMachOrderId: row.srcMachOrderId,
          handCode: row.handCode,
          steelCode: row.steelCode,
          thickness: row.thickness,
          width: row.width,
          length: row.length,
          maSpec: row.maSpec,
          spec: row.pdSpecDes,
          num: parseInt(row.remainingNum),
          type: row.type
        }
        // 整条明细  理重 = 本次卷回数量 / 领料数量 * 领料重量
        if (pdGoodPackDt.type === 2) {
          pdGoodPackDt.weight = parseFloat(pdGoodPackDt.num / row.num * row.weight).toFixed(3)
        } else {
          pdGoodPackDt.weight = 0
        }
        pdGoodPackDt.spec = pdGoodPackDt.thickness + '×' + pdGoodPackDt.width + '×' + pdGoodPackDt.num + '条'
        // 计算已卷回数量
        row.rollbackNum = parseInt(row.rollbackNum) + pdGoodPackDt.num
        // 计算剩余卷回数量
        row.remainingNum = parseInt(row.num) - row.rollbackNum
        if (row.remainingNum < 0) {
          this.$message('卷回数量不能超过领料数量')
          return
        }
        // 如果剩余卷回数量等于0,从列表中去除
        if (row.remainingNum === 0) {
          for (const item of this.rollbackDialog.selectPdTabList) {
            if (item.materialId === row.materialId) {
              item.selectList.splice(index, 1)
              break
            }
          }
          // 缓存删除数据
          this.rollbackDialog.selectPdListTemp.push(row)
        }
        const pdGoodPack = {
          selected: false,
          weight1: '', // 过磅净重
          weight3: '', // 过磅毛重
          weight6: '', // 木架重
          storeId: this.defaultStoreId,
          remark: '',
          dtList: [pdGoodPackDt]
        }
        this.sumPack(pdGoodPack)
        this.rollbackDialog.selectPdPackList.push(pdGoodPack)
      },
      // 删除成品卷回包装返回货物
      deleteRollbackPdPack(row, index) {
        // 遍历包装明细
        for (const dt of row.dtList) {
          let isFind = false
          // 匹配货物列表
          for (const item of this.rollbackDialog.selectPdTabList) {
            for (const pd of item.selectList) {
              if (dt.selectId === pd.id) {
                // 减少已卷回数量
                pd.rollbackNum = parseInt(pd.rollbackNum) - dt.num
                // 重新计算剩余卷回数量
                pd.remainingNum = parseInt(pd.num) - pd.rollbackNum
                isFind = true
                break
              }
            }
          }
          // 若匹配不到，则在缓存中匹配
          if (!isFind) {
            for (let i = 0; i < this.rollbackDialog.selectPdListTemp.length; i++) {
              if (dt.selectId === this.rollbackDialog.selectPdListTemp[i].id) {
                // 减少已卷回数量
                this.rollbackDialog.selectPdListTemp[i].rollbackNum = parseInt(this.rollbackDialog.selectPdListTemp[i].rollbackNum) - dt.num
                // 重新计算剩余卷回数量
                this.rollbackDialog.selectPdListTemp[i].remainingNum = parseInt(this.rollbackDialog.selectPdListTemp[i].num) - this.rollbackDialog.selectPdListTemp[i].rollbackNum
                // 从缓存中恢复
                for (const item of this.rollbackDialog.selectPdTabList) {
                  if (dt.materialId === item.materialId) {
                    item.selectList.push(this.rollbackDialog.selectPdListTemp[i])
                    break
                  }
                }
                // 删除缓存
                this.rollbackDialog.selectPdListTemp.splice(i, 1)
                break
              }
            }
          }
        }
        // 从卷回包装打包列表中去除
        this.rollbackDialog.selectPdPackList.splice(index, 1)
      },
      // 成品卷回打包
      addRollbackPdPack() {
        if (!this.rollbackDialog.selectPdPackList || this.rollbackDialog.selectPdPackList.length < 1) {
          this.$message('打包明细不能为空')
          return
        }
        for (const item of this.rollbackDialog.selectPdPackList) {
          if (!item.storeId) {
            this.$message('仓库不能为空')
            return
          }
        }
        const reqData = {
          resType: this.formData.resType,
          machPackId: this.formData.id,
          machOrderId: this.formData.machOrderId,
          pdList: this.rollbackDialog.selectPdPackList
        }
        this.actionDoing = true
        api.addRollbackPack(reqData).then(response => {
          this.$emit('queryMachPackInfo')
          this.getPdPackList()
          this.getRollbackPackList()
          this.rollbackDialog.visible = false
          this.actionDoing = false
        }).catch(error => {
          if (error)console.error(error)
          this.actionDoing = false
        })
      },
      // 卷回打包信息查询
      getRollbackPackList() {
        this.maRollbackList = []
        this.pdRollbackList = []
        const reqData = {
          // resType: this.formData.resType,
          machPackId: this.formData.id
        }
        api.rollbackPackList(reqData).then((response) => {
          this.maRollbackList = response.maList
          this.pdRollbackList = response.pdList
        }).catch(error => {
          if (error) console.error(error)
        })
      },
      // 删除卷回打包
      deleteRollbackPack(row) {
        const reqData = {
          resType: this.formData.resType,
          rollbackId: row.id
        }
        this.actionDoing = true
        api.deleteRollbackPack(reqData).then(response => {
          this.$emit('queryMachPackInfo')
          this.getPdPackList()
          this.getRollbackPackList()
          this.actionDoing = false
        }).catch(error => {
          if (error)console.error(error)
          this.actionDoing = false
        })
      },
      // 拆包
      unPack(row) {
        const reqData = {
          machPackId: this.formData.id,
          packId: row.id
        }
        this.actionDoing = true
        api.unPack(reqData).then(response => {
          this.$emit('queryMachPackInfo')
          this.getPdPackList()
          this.actionDoing = false
        }).catch(error => {
          if (error)console.error(error)
          this.actionDoing = false
        })
      },
      // 显示复制包装框
      showCopyPack(row, type) {
        if (type === 1) {
          this.copyPackDialog.packId = row.id
        } else if (type === 2) {
          this.copyPackDialog.packId = row.pdPackId
        } else {
          return
        }
        this.copyPackDialog.packNum = ''
        this.copyPackDialog.visible = true
        this.copyPackDialog.type = type
      },
      // 复制包装
      copyPack() {
        const reqData = {
          machPackId: this.formData.id,
          packId: this.copyPackDialog.packId,
          packNum: this.copyPackDialog.packNum,
          type: this.copyPackDialog.type
        }
        if (!reqData.packNum || isNaN(reqData.packNum)) {
          this.$message('请输入数量')
          return
        }
        this.actionDoing = true
        api.copyPack(reqData).then(response => {
          this.$emit('queryMachPackInfo')
          this.getPdPackList()
          this.getRollbackPackList()
          this.copyPackDialog.visible = false
          this.actionDoing = false
        }).catch(error => {
          if (error)console.error(error)
          this.actionDoing = false
        })
      },
      // 显示修改包装框
      showUpdatePack(row, type) {
        const pack = copyObject(row)
        if (type === 1) {
          pack.id = row.id
        } else if (type === 2) {
          pack.id = row.pdPackId
        } else {
          return
        }
        this.updatePackDialog.visible = true
        this.updatePackDialog.pdPackList = [pack]
      },
      // 修改包装
      updatePack() {
        const reqData = {
          machPackId: this.formData.id,
          pdPackList: this.updatePackDialog.pdPackList
        }
        this.actionDoing = true
        api.updatePack(reqData).then(response => {
          this.getPdPackList()
          this.getRollbackPackList()
          this.updatePackDialog.visible = false
          this.actionDoing = false
        }).catch(error => {
          if (error)console.error(error)
          this.actionDoing = false
        })
      },
      // 显示包装备注
      showPackRemark(row) {
        this.packRemarkDialog.selectRow = row
        this.packRemarkDialog.visible = true
      },
      // 并包
      joinPack() {
        if (this.selectionPdPackList.length === 0) {
          this.$message('请选择要合并的包装')
          return
        }
        const packIds = []
        for (let i = 0; i < this.selectionPdPackList.length; i++) {
          packIds.push(this.selectionPdPackList[i].id)
        }
        api.joinPack({ packIds: packIds }).then(response => {
          this.getPdPackList()
        }).catch(error => {
          if (error)console.error(error)
        })
      },
      setHeaderPointerClass({ row, column, rowIndex, columnIndex }) {
        if (column.label === '全部添加' || column.label === '合并' || column.label === '全部删除') {
          return 'table-header-bg text-center pointer table-bnt'
        } else {
          return 'table-header-bg text-center'
        }
      },
      dealPdGoodHeaderClick(column, event) {
        if (column.label === '全部添加') {
          const tempList = copyObject(this.pdPackDialog.selectPdGoodList)
          for (const temp of tempList) {
            for (let i = 0; i < this.pdPackDialog.selectPdGoodList.length; i++) {
              if (temp.uuid === this.pdPackDialog.selectPdGoodList[i].uuid) {
                this.makePdPack(this.pdPackDialog.selectPdGoodList[i], i)
                break
              }
            }
          }
        }
      },
      dealPdGoodPackHeaderClick(column, event) {
        if (column.label === '合并') {
          const newList = []
          const selectList = []
          for (const item of this.pdPackDialog.selectPdGoodPackList) {
            if (item.selected) {
              if (!item.weight || isNaN(item.weight) || parseFloat(item.weight) <= 0) {
                this.$message('理重必须大于0')
                return
              }
              selectList.push(item)
            } else {
              newList.push(item)
            }
          }
          if (selectList.length <= 1) {
            return
          }
          const dtList = []
          let toCutNum = null
          let excessManage = null
          for (const select of selectList) {
            for (const dt of select.dtList) {
              if (toCutNum === null) {
                toCutNum = dt.toCutNum
              }
              if (excessManage === null) {
                excessManage = dt.excessManage
              }
              if ((toCutNum > 0) !== (dt.toCutNum > 0)) {
                this.$message('转平直不能与非转平直合并')
                return
              }
              if ((excessManage > 0) !== (dt.excessManage > 0)) {
                this.$message('边料不能与非边料合并')
                return
              }
              dtList.push(dt)
            }
          }
          const pdGoodPack = {
            selected: false,
            weight1: '', // 过磅净重
            weight3: '', // 过磅毛重
            weight6: '', // 木架重
            storeId: this.defaultStoreId,
            remark: '',
            dtList: dtList
          }
          this.sumPack(pdGoodPack)
          newList.push(pdGoodPack)
          this.pdPackDialog.selectPdGoodPackList = newList
        }
        if (column.label === '全部删除') {
          while (this.pdPackDialog.selectPdGoodPackList.length > 0) {
            this.deletePdGoodPack(this.pdPackDialog.selectPdGoodPackList[0], 0)
          }
        }
      },
      dealWasteHeaderClick(column, event) {
        if (column.label === '全部添加') {
          for (const item of this.wasteDialog.selectPdGoodList) {
            this.makeWastePack(item)
          }
        }
      },
      dealWastePackHeaderClick(column, event) {
        if (column.label === '合并') {
          const newList = []
          const selectList = []
          for (const item of this.wasteDialog.selectPdGoodPackList) {
            if (item.selected) {
              if (!item.weight || isNaN(item.weight) || parseFloat(item.weight) <= 0) {
                this.$message('理重必须大于0')
                return
              }
              selectList.push(item)
            } else {
              newList.push(item)
            }
          }
          if (selectList.length <= 1) {
            return
          }
          const dtList = []
          for (let i = 0; i < selectList.length; i++) {
            dtList.push(...selectList[i].dtList)
          }
          const pdGoodPack = {
            selected: false,
            weight1: '', // 过磅净重
            weight3: '', // 过磅毛重
            weight6: '', // 木架重
            storeId: this.defaultStoreId,
            remark: '',
            dtList: dtList
          }
          this.sumPack(pdGoodPack)
          newList.push(pdGoodPack)
          this.wasteDialog.selectPdGoodPackList = newList
        }
        if (column.label === '全部删除') {
          while (this.wasteDialog.selectPdGoodPackList.length > 0) {
            this.deleteWastePack(this.pdPackDialog.selectPdGoodPackList[0], 0)
          }
        }
      },
      dealRollbackPdHeaderClick(column, event) {
        if (column.label === '全部添加') {
          for (const tab of this.rollbackDialog.selectPdTabList) {
            if (tab.materialId === this.rollbackDialog.selectTabId) {
              const tempList = copyObject(tab.selectList)
              for (const temp of tempList) {
                for (let i = 0; i < tab.selectList.length; i++) {
                  if (temp.selectId === tab.selectList[i].selectId) {
                    this.makeRollbackPdPack(tab.selectList[i], i)
                    break
                  }
                }
              }
            }
          }
        }
      },
      dealRollbackPdPackHeaderClick(column, event) {
        if (column.label === '合并') {
          const newList = []
          const selectList = []
          for (const item of this.rollbackDialog.selectPdPackList) {
            if (item.selected) {
              if (!item.weight || isNaN(item.weight) || parseFloat(item.weight) <= 0) {
                this.$message('理重必须大于0')
                return
              }
              selectList.push(item)
            } else {
              newList.push(item)
            }
          }
          if (selectList.length <= 1) {
            return
          }
          const dtList = []
          for (let i = 0; i < selectList.length; i++) {
            dtList.push(...selectList[i].dtList)
          }
          const pdGoodPack = {
            selected: false,
            weight1: '', // 过磅净重
            weight3: '', // 过磅毛重
            weight6: '', // 木架重
            storeId: this.defaultStoreId,
            remark: '',
            dtList: dtList
          }
          this.sumPack(pdGoodPack)
          newList.push(pdGoodPack)
          this.rollbackDialog.selectPdPackList = newList
        }
        if (column.label === '全部删除') {
          while (this.rollbackDialog.selectPdPackList.length > 0) {
            this.deleteRollbackPdPack(this.rollbackDialog.selectPdPackList[0], 0)
          }
        }
      },
      // 计算磅重
      calWeight1(row) {
        let value
        if (!row.weight3) {
          value = 0
        } else if (!row.weight6) {
          value = row.weight3
        } else {
          value = parseFloat(row.weight3) - parseFloat(row.weight6)
        }
        row.weight1 = parseFloat(value).toFixed(3)
      },
      // 废料计算磅重
      wasteCalWeight1(row) {
        this.calWeight1(row)
        // 包装还未合包前(包装明细数量为1)，如果是边料打包、或头尾板打包的头尾板长度为空，则理论重量默认等于过磅净重
        if (row.dtList && row.dtList.length === 1) {
          if (this.wasteDialog.type === 1 || (this.wasteDialog.type === 2 && !row.dtList[0].length)) {
            row.weight = row.weight1
            row.dtList[0].weight = row.weight
          }
        }
      },
      // 卷回计算磅重
      rollbackCalWeight1(row) {
        this.calWeight1(row)
        // 包装还未合包前(包装明细数量为1)，如果是本次加工剩余，则理论重量默认等于过磅净重
        if (row.dtList && row.dtList.length === 1) {
          if (row.dtList[0].type === 1) {
            row.weight = row.weight1
            row.dtList[0].weight = row.weight
          }
        }
      },
      handleSelectionPdPackChange(val) {
        this.selectionPdPackList = val
        if (this.selectionPdPackList.length + this.selectionRollbackPdPackList.length > 0) {
          this.modifyLabel = false
        } else {
          this.modifyLabel = true
        }
      },
      handleSelectionRollbackPdPackChange(val) {
        this.selectionRollbackPdPackList = val
        if (this.selectionPdPackList.length + this.selectionRollbackPdPackList.length > 0) {
          this.modifyLabel = false
        } else {
          this.modifyLabel = true
        }
      },
      showCustomLabelDialog() {
        if (this.selectionPdPackList && this.selectionRollbackPdPackList &&
          this.selectionPdPackList.length + this.selectionRollbackPdPackList.length > 0) {
          // 复制 选中的包装，避免后续修改导致原包装信息改变
          this.customLabelList = copyObject(this.selectionPdPackList)
          this.customLabelList = this.customLabelList.concat(this.selectionRollbackPdPackList.map(pack => { pack.id = pack.pdPackId; return pack }))
          this.customLabelObj = {
            cuFullName: '',
            typeName: '',
            parea: '',
            grade: ''
          }
          // 获取选定包装的明细信息
          this.customLabelList.forEach((pack) => {
            api.pdPackDtList(pack.id).then(response => {
              this.$set(pack, 'dts', response.list)
            })
          })
          this.customLabelDialog.visible = true
        }
      },
      changePackLabelTab() {
        console.log(this.customLabelList[this.currentPackTabIDX].dts)
      }
    },
    created() {
      this.getPdPackList()
      this.getRollbackPackList()
    }
  }
</script>

<style lang="scss">
 .table-bnt{
   .cell{
     font-weight: 400;
     position: relative;
     z-index: 9;
     &:hover{
        color: #409EFF;
     }
     &::before{
       content: '';
       position: absolute;
       left: 50%;
       margin-left: -40px;
       width: 80px;
       height: 20px;
       background: #fff;
       border: 1px solid #ccc;
       border-radius: 3px;
       z-index: -1;
        &:hover{
          border-color: #c6e2ff;
          background-color: #ecf5ff;
      }
     }
   }
 }
</style>
