<template>
  <div>
    <div>
      <!--头部按钮组-->
      <div class="btn-group-container">
          <el-button type="primary" @click="returnHome" icon="el-icon-back">返回</el-button>
          <el-button type="primary" @click="save" icon= "el-icon-check">保存</el-button>
      </div>
      <el-container id="order-hight">
        <el-main>
          <div style="font-size:12px;">
            提货时间：{{selectRow.timeSectionObj}}
          </div>
          <el-input type="textarea" v-bind:value="selectRow?selectRow.remark:''" readonly placeholder="关联加工单分条和平直备注" style="margin-top: 10px"></el-input>
          <el-table
            ref="machTable"
            :data="machList"
            @row-click="machHandleRowClick"
            border
            stripe height="545"
            header-cell-class-name="table-header-bg text-center" row-class-name="pointer text-center tab-ellipsis"
            style="-moz-user-select:none;margin-top: 20px">
            <el-table-column label="序号" type="index" width="50"></el-table-column>
            <el-table-column sortable label="货物编号" prop="handCode" min-width="120"></el-table-column>
            <el-table-column sortable label="钢卷号" prop="steelCode" min-width="150"></el-table-column>
            <el-table-column sortable label="品名" prop="typeName" min-width="150"></el-table-column>
            <el-table-column sortable label="规格" prop="specAll"></el-table-column>
            <el-table-column sortable label="产地" prop="parea"></el-table-column>
            <el-table-column sortable label="材质" prop="grade"></el-table-column>
            <el-table-column sortable label="开料规格" prop="machSpec" min-width="200"></el-table-column>
            <el-table-column sortable label="重量" prop="useWeight"></el-table-column>
            <el-table-column sortable label="机台">
              <template slot-scope="scope">
                <el-select v-focus:selectMachineId="scope.row==selectRow" v-if="scope.row.machStatus<3" filterable v-model="scope.row.selectMachineId" @keyup.native.f9="copyMachine(scope.row, scope.$index)">
                  <el-option v-for="item in scope.row.machineSelect" :value="item.id" :label="item.machineName" :key="item.id">
                  </el-option>
                </el-select>
                <span v-else>{{scope.row.machineName}}</span>
              </template>
            </el-table-column>
            <el-table-column sortable label="加工状态" prop="mbStatusName"></el-table-column>
            <el-table-column sortable label="排单时间" prop="orderTime"></el-table-column>
            <el-table-column sortable label="排单人" prop="orderUser"></el-table-column>
          </el-table>
          <div style="margin-top: 20px">
            <span style="float: left;width: 30%;">
              <el-table
                :data="machineStatusList"
                @row-click="machineHandleRowClick"
                border
                header-cell-class-name="table-header-bg text-center" row-class-name="pointer text-center"
                style="-moz-user-select:none;">
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
              <el-table
                :data="machDtOrderList"
                border
                header-cell-class-name="table-header-bg text-center" row-class-name="pointer text-center"
                style="-moz-user-select:none;">
                <el-table-column label="序号" type="index" width="50"></el-table-column>
                <el-table-column sortable label="货物编号" prop="handCode"></el-table-column>
                <el-table-column sortable label="钢卷号" prop="steelCode"></el-table-column>
                <el-table-column sortable label="品名" prop="typeName"></el-table-column>
                <el-table-column sortable label="规格" prop="specAll"></el-table-column>
                <el-table-column sortable label="产地" prop="parea"></el-table-column>
                <el-table-column sortable label="材质" prop="grade"></el-table-column>
                <el-table-column sortable label="开料规格" prop="machSpec"></el-table-column>
                <el-table-column sortable label="重量" prop="useWeight"></el-table-column>
                <el-table-column sortable label="机台" prop="machineName"></el-table-column>
                <el-table-column sortable label="加工状态" prop="mbStatusName"></el-table-column>
                <el-table-column sortable label="排单时间" prop="orderTime"></el-table-column>
                <el-table-column sortable label="排单人" prop="orderUserName"></el-table-column>
              </el-table>
            </span>
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import * as api from '@/api/process/machScheduling/machScheduling'

  export default {
    name: 'views',
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
      machSrcList: Array,
      selectRow: Object
    },
    computed: {
      ...mapGetters(['machineList'])
    },
    data() {
      return {
        selectRow: null,
        focusInput: '',
        machList: [],
        machineStatusList: [],
        machDtOrderList: []
      }
    },
    methods: {
      // 返回
      returnHome() {
        this.$emit('hideView')
      },
      machHandleRowClick(row, event, column) {
        this.selectRow = row
        this.machineStatusList = []
        if (row.machTypeId) {
          api.machineStatusList({ machTypeId: row.machTypeId }).then((response) => {
            this.machineStatusList = response.list
          }).catch(error => {
            if (error) console.error(error)
          })
        }
      },
      machineHandleRowClick(row, event, column) {
        this.machDtOrderList = []
        if (row.id) {
          api.machDtOrderList({ machineId: row.id }).then((response) => {
            this.machDtOrderList = response.list
          }).catch(error => {
            if (error) console.error(error)
          })
        }
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
      save() {
        const dtList = []
        for (let i = 0; i < this.machList.length; i++) {
          // if ((((this.machList[i].machineId == null || this.machList[i].machineId === '') || this.machList[i].upStatus === 1 ||
          // this.machList[i].upStatus === 0) && this.machList[i].mbStatusName !== '已完成' &&
          // (this.machList[i].machineIdUp == null || this.machList[i].machineIdUp === '')) || this.machList[i].upStatus === 1) {
          if (this.machList[i].selectMachineId) {
            this.machList[i].machineId = this.machList[i].selectMachineId
            dtList.push(this.machList[i])
          }
        }
        const reqData = {
          id: this.selectRow.id,
          dtList: dtList
        }
        api.update(reqData).then(response => {
          this.$parent.getList()
          this.returnHome()
        }).catch(error => {
          if (error)console.error(error)
        })
      },
      loadData(data) {
        this.machList = JSON.parse(JSON.stringify(data))
      },
      // F9 复制机组
      copyMachine(item, index) {
        if (item.selectMachineId) {
          // 非最后一行
          if (index < this.machList.length - 1) {
            let isFind = false
            const machineList = this.machList[index + 1].machineSelect
            if (machineList) {
              for (const machine of machineList) {
                if (machine.id === item.selectMachineId) {
                  this.$set(this.machList[index + 1], 'selectMachineId', machine.id)
                  isFind = true
                  this.focusInput = 'selectMachineId'
                  this.selectRow = this.machList[index + 1]
                  break
                }
              }
            }
            if (!isFind) {
              this.$message('没有匹配到要复制的机组')
              return
            }
          }
        }
      }
    },
    mounted() {
      var orderHight = document.body.clientHeight
      document.getElementById('order-hight').style.height = (orderHight - 180) + 'px'
      this.loadData(this.machSrcList)
      // 加载机台下拉
      for (let i = 0; i < this.machList.length; i++) {
        // if (this.machList[i].machineId) {
        //   this.machList[i].selectMachineId = this.machList[i].machineId
        // }
        this.$set(this.machList[i], 'machineSelect', [])
        // this.machList[i].machineSelect = []
        if (this.machList[i].machTypeId) {
          for (let j = 0; j < this.machineList.length; j++) {
            // 过滤不可用、停机的机台
            if (this.machineList[j].canUse !== 1 || this.machineList[j].status === 0) {
              continue
            }
            if (this.machList[i].machTypeId === this.machineList[j].machTypeId) {
              this.machList[i].machineSelect.push(this.machineList[j])
            }
          }
          this.machList[i].machineSelect.push({ id: '0', machineName: '取消分配' })
        }
      }
    }
  }
</script>

<style scoped>

</style>
