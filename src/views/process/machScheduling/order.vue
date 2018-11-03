<template>
  <div>
    <div>
      <!--头部按钮组-->
      <div class="btn-group-container">
        <template v-if="isEditing">
          <el-button type="primary" @click="cancel">取消</el-button>
          <el-button type="primary" @click="save">保存</el-button>
        </template>
        <template v-else>
          <el-button type="primary" @click="returnHome" icon="el-icon-back">返回</el-button>
          <el-button type="primary" @click="preEdit">修改</el-button>
        </template>
      </div>

      <el-radio style="padding-left: 5px;" v-for="item in machtypeList" v-model="machTypeId" :label="item.id" :key="item.id" :disabled="isEditing">{{item.machName}}</el-radio>
    </div>

    <div style="margin-top: 20px">
      <span style="float: left;width: 30%;">
        <el-table
          :data="machineStatusList"
          @row-click="machineHandleRowClick"
          border
          stripe height="545"
          header-cell-class-name="table-header-bg text-center" :row-class-name="'pointer '+' text-center'+(isEditing?' disableCls':'')">
          <el-table-column sortable label="机台号" prop="machineName"></el-table-column>
          <el-table-column sortable label="状态">
             <template slot-scope="scope">
              <span>{{getStatusName(scope.row.status)}}</span>
            </template>
          </el-table-column>
          <el-table-column sortable label="排队重量" prop="orderWeight"></el-table-column>
        </el-table>
      </span>

      <span style="float: left;width: 70%;padding-left: 20px">
        <el-table id="orderTable" :data="machDtOrderList" row-key="machDtInfoId" border fit highlight-current-row
                  header-cell-class-name="table-header-bg text-center" :row-class-name="'pointer '+' text-center'+(isEditing?'':' disableCls')">
          <el-table-column sortable label="排号" prop="orderNum" width="50"></el-table-column>
          <el-table-column sortable label="作业状态" prop="mbStatusName"></el-table-column>
          <el-table-column sortable label="加工单号" prop="blno"></el-table-column>
          <el-table-column sortable label="客户" prop="cuName"></el-table-column>
          <el-table-column sortable label="重量" prop="useWeight"></el-table-column>
          <el-table-column sortable label="数量" prop="num"></el-table-column>
          <el-table-column sortable label="提货时间" prop="timeSectionObj"></el-table-column>
        </el-table>
      </span>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import * as api from '@/api/process/machScheduling/machScheduling'
  import Sortable from 'sortablejs'

  export default {
    name: 'order',
    computed: {
      ...mapGetters(['machtypeList'])
    },
    data() {
      return {
        machTypeId: null,
        machineStatusList: [],
        machDtOrderList: [],
        sortable: null,
        isEditing: false,
        selectRow: null
      }
    },
    methods: {
      // 返回
      returnHome() {
        this.$emit('hideView')
      },
      getMachineStatusList(machTypeId) {
        this.machDtOrderList = []
        this.machineStatusList = []
        if (machTypeId) {
          api.machineStatusList({ machTypeId: machTypeId }).then((response) => {
            this.machineStatusList = response.list
          }).catch(error => {
            if (error) console.error(error)
          })
        }
      },
      machineHandleRowClick(row) {
        if (this.isEditing) {
          return
        }
        this.selectRow = row
        this.getMachDtOrderList()
      },
      getMachDtOrderList() {
        const reqData = {
          machineId: this.selectRow.id
        }
        api.machDtOrderList(reqData).then((response) => {
          this.machDtOrderList = response.list
        }).catch(error => {
          if (error) console.error(error)
        })
      },
      setSort() {
        const el = document.getElementById('orderTable').getElementsByTagName('tbody')[0]
        this.sortable = Sortable.create(el, {
          disabled: true,
          ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
          setData: function(dataTransfer) {
            dataTransfer.setData('Text', '')
            // to avoid Firefox bug
            // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          },
          onEnd: evt => {
            const targetRow = this.machDtOrderList.splice(evt.oldIndex, 1)[0]
            this.machDtOrderList.splice(evt.newIndex, 0, targetRow)
            // 重排顺序
            for (let i = 0; i < this.machDtOrderList.length; i++) {
              this.machDtOrderList[i].orderNum = i + 1
            }
          }
        })
      },
      getStatusName(status) {
        if (status === 0) {
          return '停机'
        } else if (status === 1) {
          return '空闲'
        } else if (status === 2) {
          return '加工中'
        } else if (status === 3) {
          return '加工中'
        } else {
          return ''
        }
      },
      preEdit() {
        this.isEditing = true
      },
      cancel() {
        this.isEditing = false
        this.getMachDtOrderList()
      },
      save() {
        const reqData = {
          list: this.machDtOrderList
        }
        api.updateOrderNum(reqData).then(response => {
          this.cancel()
        }).catch(error => {
          if (error)console.error(error)
        })
      }
    },
    mounted() {
      this.setSort()
    },
    watch: {
      // 监听加工类型变化
      machTypeId: function(val) {
        if (val) {
          this.getMachineStatusList(val)
        }
      },
      isEditing: function(val) {
        this.sortable.option('disabled', !val)
      }
    }
  }
</script>

<style>
 .disableCls {
   background: #f5f7fa !important;
 }
</style>
