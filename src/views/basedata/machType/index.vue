<template>
  <div class="app-container calendar-list-container">
   <form-tab :formShow="formShow" :currentRow="formData" :actionStatus="actionStatus" @hideForm="hideForm" @init="init"></form-tab>
    <!-- <div class="filter-container">
      <el-row class="form-wrap">
        <el-form :inline="true" size="small" label-width="80px">

        </el-form>
      </el-row>
    </div> -->
     <el-row class="el-row-middle">
        <el-button class="filter-item" type="primary" v-waves icon="el-icon-plus" @click="handleAdd">新增
        </el-button>
        <el-button class="filter-item" type="primary" v-waves icon="el-icon-edit" :disabled="!isSelectRow"
                    @click="handleUpdate">修改
        </el-button>
        <el-button class="filter-item" type="danger" v-waves icon="el-icon-delete" :disabled="!isSelectRow"
                    @click="handleDelete">删除
        </el-button>
      </el-row>

    <el-table :data="list" element-loading-text="给我一点时间" v-loading="listLoading" border fit highlight-current-row stripe height="545"
              @row-click="handleSelectRow"
              header-cell-class-name="table-header-bg text-center"
              style="width: 100%">
      <el-table-column sortable align="center" label="序号" type="index"></el-table-column>
      <el-table-column sortable align="center" label="加工名称" prop="machName"></el-table-column>
      <el-table-column sortable align="center" label="加工描述" prop="machDes"></el-table-column>
      <el-table-column sortable align="center" label="是否可再加工">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.isConMach === 1" readonly></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" label="是否一体机">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.isMulti === 1" readonly></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" label="单价（元/吨）" prop="price"></el-table-column>
      <el-table-column sortable align="center" label="预计耗时（小时/用料）" prop="timePerNum" min-width="100"></el-table-column>
      <el-table-column sortable align="center" label="是否有效">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.isValid === 1" readonly></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" label="费用一级分类" prop="feeClass1"></el-table-column>
      <el-table-column sortable align="center" label="费用二级分类" prop="feeClass2"></el-table-column>
      <el-table-column sortable align="center" label="费用三级分类" prop="feeClass3"></el-table-column>
      <el-table-column sortable align="center" label="对应费用单编号" prop="noPrefix"></el-table-column>
      <el-table-column sortable align="center" label="备注" prop="remark"></el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handlePageChange"
                     :current-page="queryCondition.pageNo" :page-sizes="[10,20,30, 50]"
                     :page-size="queryCondition.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { list, dtList, del } from '@/api/basedata/machType'
  import waves from '@/directive/waves/index' // 水波纹指令
  import formTab from '@/views/basedata/machType/machTypeForm'
  export default {
    name: 'machType',
    directives: {
      waves
    },
    components: {
      formTab
    },
    data() {
      return {
        isSelectRow: false,
        formShow: false,
        mobileList: [],
        queryCondition: {
          pageNo: 1,
          pageSize: 10
        },
        actionStatus: '',
        list: [],
        dtList: [],
        total: null,
        listLoading: true,
        currentRow: null,
        formData: { machName: '', machDes: '', conMachFlag: false, multiFlag: false, price: '0.0', feeClass1: '', feeClass2: '', feeClass3: '', noPrefix: '', isValid: 1, validFlag: true, remark: '', timePerNum: '0.0', dtList: [] },
        defaultData: {}
      }
    },
    mounted() {
      this.defaultData = JSON.parse(JSON.stringify(this.formData))
      this.init()
      const _this = this
      document.onkeydown = function(e) { // shift事件
        const _key = window.event.keyCode
        if (_key === 13) {
          _this.init()
        }
      }
    },
    methods: {
      init() {
        this.isSelectRow = true
        this.formShow = false
        this.currentRow = {}
        this.queryCondition.pageNo = 1
        this.getList()
      },
      hideForm() {
        this.formShow = false
      },
      getList() {
        this.listLoading = true
        list(this.queryCondition).then(response => {
          this.list = response.machTypes
          this.total = response.dataSize
          this.listLoading = false
          this.isSelectRow = false
        })
      },
      handleAdd() {
        this.actionStatus = 'create'
        this.formData = Object.assign(this.formData, this.defaultData)
        this.formData.dtList = []
        this.formShow = true
      },
      handleUpdate() {
        if (this.currentRow == null) return
        this.listLoading = true
        this.actionStatus = 'update'
        this.currentRow.validFlag = this.currentRow.isValid === 1
        this.currentRow.conMachFlag = this.currentRow.isConMach === 1
        this.currentRow.multiFlag = this.currentRow.isMulti === 1
        this.currentRow.dtDelList = []
        dtList({ machTypeId: this.currentRow.id }).then(response => {
          this.dtList = response.machines
          this.currentRow.dtList = this.dtList
          this.formData = Object.assign(this.formData, this.currentRow)
          const that = this
          this.formData.dtList.forEach(function(dt) {
            that.$set(dt, 'validFlag', dt.canUse === 1)
          })
          this.listLoading = false
          this.formShow = true
        }).catch(() => {
          this.listLoading = false
        })
      },
      handleSelectRow(row) {
        this.currentRow = row
        this.isSelectRow = true
      },
      handleDelete() {
        this.$confirm('此操作将会删除相关数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          del({ id: this.currentRow.id }).then(response => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      handleSizeChange(val) {
        this.queryCondition.pageSize = val
        this.getList()
      },
      handlePageChange(val) {
        this.queryCondition.pageNo = val
        this.getList()
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
