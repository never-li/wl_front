<template>
  <div v-show="formShow" class="add-machTypeForm">
    <div class="filter-container">
      <el-row class="form-wrap">
        <el-form :inline="true" size="small">
          <el-form-item>
            <el-button class="filter-item" style="margin-left: 10px;"
                       @click="() => actionStatus==='create' ? createData() : updateData()" type="primary"
                       icon="el-icon-edit-outline">保存
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCancel" type="primary"
                       icon="el-icon-edit-outline">取消
            </el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </div>
    <el-form :rules="rules" ref="dataForm" :model="machTypeInfo" label-position="right" label-width="150px" size="small"
             style='width: 100%'>
      <el-row :gutter="20">
        <el-col :span="5">
          <el-form-item label="加工名称：" prop="machName">
            <el-input v-model="machTypeInfo.machName" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="加工描述：">
            <el-input v-model="machTypeInfo.machDes"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="是否可再加工：">
            <el-checkbox v-model="machTypeInfo.conMachFlag"></el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="5">
          <el-form-item label="费用一级分类：">
            <el-input v-model="machTypeInfo.feeClass1"  maxlength="15"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="费用二级分类：">
            <el-input v-model="machTypeInfo.feeClass2" maxlength="15"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="费用三级分类：">
            <el-input v-model="machTypeInfo.feeClass3" maxlength="15"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="5">
          <el-form-item label="单价（元/吨）：" prop="price">
            <!--<el-input v-model.number="machTypeInfo.price" type="number" ></el-input>-->
            <number-input v-model="machTypeInfo.price" decimal="10,2"></number-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="对应费用单编号：">
            <el-input v-model="machTypeInfo.noPrefix" maxlength="10"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="是否有效：">
            <el-checkbox v-model="machTypeInfo.validFlag"></el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="5">
          <el-form-item label="预计耗时（小时/用料）：" prop="timePerNum">
            <el-input v-model.number="machTypeInfo.timePerNum" type="number" min="0.1"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="备注：">
            <el-input v-model="machTypeInfo.remark" maxlength="200" placeholder="200字以内"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="是否一体机：">
            <el-checkbox v-model="machTypeInfo.multiFlag"></el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>


      <el-row class="el-row-middle">
        <el-button class="filter-item" type="primary" v-waves icon="el-icon-plus" @click="handleAddDt">新增</el-button>
      </el-row>
      <el-table :data="machTypeInfo.dtList" border fit highlight-current-row style="width: 100%" header-cell-class-name="table-header-bg text-center" height="400">
        <el-table-column sortable align="center" label="序号" type="index"></el-table-column>
        <el-table-column sortable align="center" label="加工机组">
          <template slot-scope="scope">
            <el-input v-model.trim="scope.row.machineName"></el-input>
          </template>
        </el-table-column>
        <!--<el-table-column sortable align="center" label="长度范围(mm)" min-width="90">-->
          <!--<template slot-scope="scope">-->
            <!--<el-input v-model="scope.row.lengthRange"></el-input>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column sortable align="center" label="宽度范围(mm)" min-width="90">-->
          <!--<template slot-scope="scope">-->
            <!--<el-input v-model="scope.row.widthRange"></el-input>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column sortable align="center" label="厚度范围(mm)" min-width="90">-->
          <!--<template slot-scope="scope">-->
            <!--<el-input v-model="scope.row.thickRange"></el-input>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column sortable align="center" label="精度范围(mm)" min-width="90">-->
          <!--<template slot-scope="scope">-->
            <!--<el-input v-model="scope.row.accuracyRange"></el-input>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column sortable align="center" label="成品长度范围(mm)" min-width="90">-->
          <!--<template slot-scope="scope">-->
            <!--<el-input v-model="scope.row.pdLengthRange"></el-input>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column sortable align="center" label="原料最大重量(T)">
          <template slot-scope="scope">
            <el-input v-model="scope.row.maMaxWeight"></el-input>
          </template>
        </el-table-column>
        <el-table-column sortable align="center" label="卷取最大重量(T)">
          <template slot-scope="scope">
            <el-input v-model="scope.row.rollMaxWeight"></el-input>
          </template>
        </el-table-column>
        <el-table-column sortable align="center" label="指定品种">
          <template slot-scope="scope">
            <el-select v-model="scope.row.specifiedType" placeholder="请选择">
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.typeName"
                :value="item.typeName">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column sortable align="center" label="所在仓库">
          <template slot-scope="scope">
            <el-select v-model="scope.row.storeId" placeholder="请选择">
              <el-option
                v-for="item in storeList"
                :key="item.id"
                :label="item.storeName"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column sortable align="center" label="手持设备名称">
          <template slot-scope="scope">
            <el-select v-model="scope.row.mobileImei" placeholder="请选择">
              <el-option
                v-for="item in mobileList"
                :key="item.id"
                :label="item.mbName"
                :value="item.imei">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column sortable align="center" label="默认标签打印机">
          <template slot-scope="scope">
            <el-input v-model="scope.row.printerIp"></el-input>
          </template>
        </el-table-column>
        <el-table-column sortable align="center" label="是否有效">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.validFlag"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column sortable align="center" label="备注">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark"></el-input>
          </template>
        </el-table-column>
        <el-table-column sortable align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="danger" @click="handleDeleteDt(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>
<script>
  import numberInput from '@/components/numberInput'
  import { add, update, mobileList } from '@/api/basedata/machType'
  import { mapGetters } from 'vuex'
  import waves from '@/directive/waves/index' // 水波纹指令
  export default {
    components: {
      numberInput
    },
    props: {
      formShow: Boolean,
      currentRow: Object,
      actionStatus: ''
    },
    name: 'machTypeForm',
    directives: {
      waves
    },
    computed: {
      ...mapGetters([
        'typeList', 'storeList' // 品名,仓库
      ])
    },
    data() {
      return {
        machTypeInfo: { machName: '', machDes: '', conMachFlag: false, multiFlag: false, price: '0.0', feeClass1: '', feeClass2: '', feeClass3: '', noPrefix: '', isValid: 1, validFlag: true, remark: '', timePerNum: '0.0', dtList: [] },
        rules: {
          machName: [{ required: true, message: '请输入加工名称', trigger: 'blur' }]/*,
          timePerNum: [{ type: 'number', message: '请输入数字', trigger: 'blur' }],
          price: [{ type: 'number', message: '请输入数字', trigger: 'blur' }]*/
        },
        mobileList: []
      }
    },
    created() {
      this.getMobileList()
    },
    methods: {
      handleCancel() {
        this.$emit('hideForm')
      },
      createData() {
        if (this.checkDtData()) {
          return
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            add(this.machTypeInfo).then(response => {
              this.$notify({
                title: '成功',
                message: '新增成功',
                type: 'success',
                duration: 2000
              })
              this.$emit('init')
            }).catch(error => {
              if (error) console.error(error)
            })
          }
        })
      },
      updateData() {
        if (this.checkDtData()) {
          return
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            update(this.machTypeInfo).then(response => {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              this.$emit('init')
            }).catch(error => {
              if (error) console.error(error)
            })
          }
        })
      },
      checkDtData() {
        this.machTypeInfo.isValid = this.machTypeInfo.validFlag ? 1 : 0
        this.machTypeInfo.isMulti = this.machTypeInfo.multiFlag ? 1 : 0
        this.machTypeInfo.isConMach = this.machTypeInfo.conMachFlag ? 1 : 0
        if (this.machTypeInfo.price === '') {
          this.machTypeInfo.price = '0.0'
        }
        if (this.machTypeInfo.timePerNum === '') {
          this.machTypeInfo.timePerNum = '0.0'
        }
        let emptyFlag = false
        this.machTypeInfo.dtList.forEach(function(dt) {
          if (!dt.storeId) {
            emptyFlag = true
          }
          dt.canUse = dt.validFlag ? 1 : 0
        })
        if (emptyFlag) {
          this.$message.warning('所在仓库不能为空')
        }
        return emptyFlag
      },
      getMobileList() {
        mobileList().then(response => {
          this.mobileList = response.mobiles
        })
      },
      handleDeleteDt(right) {
        const index = this.machTypeInfo.dtList.indexOf(right)
        if (this.actionStatus === 'update' && this.machTypeInfo.dtList[index].id) {
          this.machTypeInfo.dtDelList.push({ id: this.machTypeInfo.dtList[index].id })
        }
        this.machTypeInfo.dtList.splice(index, 1)
      },
      handleAddDt() {
        this.machTypeInfo.dtList.push({ id: '', machineName: '', lengthRange: '', widthRange: '', thickRange: '', accuracyRange: '', validFlag: true, storeId: '', mobileImei: '', printerIp: '', rollMaxWeight: '', maMaxWeight: '', specifiedType: '', remark: '', pdLengthRange: '' })
      }
    },
    watch: {
      // checkedValid: function(val) {
      //   this.formParam.isValid = val ? 1 : 0
      // },
      // checkedSelf: function(val) {
      //   this.formParam.isSelfService = val ? 1 : 0
      // },
      formShow: function(val) {
        this.$refs.dataForm.clearValidate()
        this.machTypeInfo = Object.assign(this.machTypeInfo, this.currentRow)
        // if (this.type === 1) {
        //   Object.assign(this.formParam, this.currentRow)
        //   // 设置复选框为当前实际状态
        //   this.checkedValid = this.formParam.isValid === 1
        //   this.checkedSelf = this.formParam.isSelfService === 1
        // } else {
        //   Object.assign(this.formParam, this.defaultData)
        //   // 设置复选框为默认状态
        //   this.checkedValid = true
        //   this.checkedSelf = false
        //   this.formParam.creater = this.userInfo.name
        //   this.formParam.createTime = this.getNowFormatDate()
        // }
      }
    }
  }
</script>
<style lang="scss" scoped>
.add-machTypeForm{
  position: absolute;
  width:100%;
  height:750px;
  background: white;
  z-index: 10;
  left:0;
  top:110px;
  overflow: hidden;
}
</style>

