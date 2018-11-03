<template>
  <div>
    <div v-show="!showSelectGoods">
      <!--头部按钮组-->
      <div class="btn-group-container">
        <!--新增修改-->
        <template v-if="action === 'add' || action === 'update'">
          <el-button type="primary" icon="el-icon-close" @click="returnHome">取消</el-button>
          <el-button type="primary" icon="el-icon-check" @click="saveOrUpdate">保存</el-button>
          <el-button type="primary" icon="el-icon-view" @click="audit">审核</el-button>
          <el-checkbox v-model="checkPrint" class="ml-15">审核打印</el-checkbox>
        </template>

        <!--查看-->
        <template v-if="action === 'view'">
          <el-button type="primary" icon="el-icon-back" @click="returnHome">返回</el-button>
          <template v-if="selectRow && selectRow.status===0">
            <el-button type="primary" icon="el-icon-edit" @click="this.$parent.showUpdate">修改</el-button>
            <el-button type="primary" icon="el-icon-view" @click="audit">审核</el-button>
            <el-checkbox v-model="checkPrint"  class="ml-15">审核打印</el-checkbox>
          </template>
          <template v-if="selectRow && selectRow.status===1">
            <el-button type="primary" icon="el-icon-view" @click="unaudit">反审核</el-button>
            <el-button type='primary' icon="el-icon-printer" @click='printBill'>打印</el-button>
          </template>
        </template>
      </div>

      <!--表单-->
      <common-form :action="action" :formData="formData" :dtList="dtList"></common-form>

      <el-tabs v-model="tabName" type="border-card" @tab-click="tabClick">
        <el-tab-pane label="货物明细" name="first">
          <el-button v-if="action === 'view' && selectRow.status===1" type="primary" icon="el-icon-share"  @click="createSub" class="mb-15" :disabled="RolloverBntStatus">记录转仓</el-button>
          <common-table :action="action" :lockGoods="lockGoods" :formData="formData" :dtList="dtList" :dtDelList="dtDelList" @toggleSelect="toggleSelect" @lockGood="lockGood"  @selectionishowBnt="selectionishowBnt"  ref="commonTable">
          </common-table>
        </el-tab-pane>
        <el-tab-pane label="转仓详情" name="second">
          <el-button v-if="action === 'view' && selectRow.status===1" type="danger" icon="el-icon-delete" @click="delSub" class="mb-15" :disabled="deleteBntStatus">删除转仓</el-button>
          <sub-table :subList="subList" @selectionishowBnt="deleteSelectionishowBnt"  ref="subTable"></sub-table>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!--货物选择-->
    <div v-if="showSelectGoods">
      <select-goods-page @addGoods="addGoods" :formData="formData" @toggleSelect="toggleSelect"></select-goods-page>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import commonForm from './common/commonForm'
  import commonTable from './common/commonTable'
  import selectGoodsPage from './selectGoods'
  import subTable from './common/SubTable'
  import * as api from '@/api/warehousing/transferStore/transferStore'
  import * as common from '@/utils'

  export default {
    name: 'views',
    props: {
      action: String,
      selectRow: Object
    },
    components: {
      commonForm, commonTable, selectGoodsPage, subTable
    },
    data() {
      return {
        showSelectGoods: false, // 货物选择显示
        checkPrint: false,
        tabName: 'first',
        formData: {},
        dtList: [],
        dtDelList: [],
        subList: [],
        lockGoods: [],
        RolloverBntStatus: true, // 转仓按扭状态
        deleteBntStatus: true // 删除按扭状态
      }
    },
    computed: {
      ...mapGetters(['systemparmMap'])
    },
    methods: {
      tabClick(tab, event) {
      },
      // 添加选择的货物
      addGoods(data) {
        console.log(data)
        if (data && data.length > 0) {
          // 本次选择的货物
          const goods = []
          for (let i = 0; i < data.length; i++) {
            // 过滤已存在的货物
            let isFind = false
            for (let j = 0; j < this.dtList.length; j++) {
              if (data[i].id === this.dtList[j].fromStockId) {
                isFind = true
                break
              }
            }
            if (isFind) continue
            const temp = {
              handCode: data[i].handCode,
              steelCode: data[i].steelCode,
              storeId: data[i].storeId,
              storeName: data[i].storeName,
              typeName: data[i].typeName,
              specName: data[i].specName,
              parea: data[i].parea,
              grade: data[i].grade,
              changeStWeight1: data[i].validWeight1,
              changeStWeight2: data[i].validWeight2,
              changeStWeight4: data[i].validWeight4,
              changeStNum: data[i].validNum,
              maxWeight1: data[i].validWeight1,
              maxWeight2: data[i].validWeight2,
              maxWeight4: data[i].validWeight4,
              maxNum: data[i].validNum,
              unit: data[i].unit,
              showDes: data[i].showDes,
              remark: data[i].remark,
              fromStockId: data[i].id,
              positionRow: data[i].positionRow,
              positionColumn: data[i].positionColumn
            }
            // 添加到本次选择goods
            goods.push(temp)
          }
          const stockIds = []
          const stocks = []
          // 判断货物是否为同一仓库货物
          let storeId = this.dtList.length > 0 ? this.dtList[0].storeId : null
          for (const good of goods) {
            if (storeId !== null && storeId !== good.storeId) {
              this.$message.error('请选择同一仓库货物')
              return
            } else if (storeId === null) {
              storeId = good.storeId
            }
            stockIds.push(good.fromStockId)
            stocks.push(good)
          }
          this.dtList.push(...stocks)
          // 转出仓库为空时，默认为第一件货物的仓库
          if (!this.formData.fromStoreId) {
            this.formData.fromStoreId = stocks[0].storeId
          }
          // 锁定本次选择的货物
          this.lockGood(0, stockIds)
          // 将锁定货物添加到lockGoods（用于点击返回按钮时触发解锁操作）
          this.lockGoods.push(...stockIds)
          this.toggleSelect(false)
        } else {
          this.$message.info('请选择货物')
          return
        }
      },
      // 保存
      saveOrUpdate(func, isAudit) {
        this.formData.dtList = this.dtList
        this.formData.dtDelList = this.dtDelList
        if (!this.formData.dtList || this.formData.dtList.length <= 0) {
          this.$message.error('明细不能为空')
          return
        }
        if (this.action === 'add') {
          api.add(this.formData, isAudit).then(response => {
            if (typeof func === 'function') {
              func(response.obj.id)
            } else {
              this.$parent.getList()
              this.returnHome()
            }
          }).catch(error => {
            if (error)console.error(error)
          })
        } else if (this.action === 'update') {
          api.update(this.formData, isAudit).then(response => {
            if (typeof func === 'function') {
              func(response.obj.id)
            } else {
              this.$parent.getList()
              this.returnHome()
            }
          }).catch(error => {
            if (error)console.error(error)
          })
        }
      },
      // 记录转仓
      createSub() {
        if (this.$refs.commonTable.selectionList.length === 0) return
        const dtIds = []
        for (const select of this.$refs.commonTable.selectionList) {
          dtIds.push(select.id)
        }
        const requestData = {
          blid: this.formData.id,
          dtIds: dtIds
        }
        api.createsub(requestData).then(() => {
          this.getDtList()
          this.getSubList()
        }).catch(error => {
          if (error)console.error(error)
        })
      },
      delSub() { // 删除发货
        if (this.$refs.subTable.selectionList.length === 0) return
        this.$confirm('确认删除转仓记录？', '温馨提示', {
          type: 'warning'
        }).then(() => {
          const changeStDtIds = []
          for (const select of this.$refs.subTable.selectionList) {
            changeStDtIds.push(select.changeStDtId)
          }
          const requestData = {
            blid: this.formData.id,
            changeStDtIds: changeStDtIds
          }
          api.deletesub(requestData).then(() => {
            this.getDtList()
            this.getSubList()
          }).catch(error => {
            if (error) console.error(error)
          })
        }).catch(() => {
        })
      },
      // 审核
      audit() {
        const that = this
        if (that.action === 'add' || that.action === 'update') {
          that.saveOrUpdate(function(blid) {
            // 打印
            if (that.checkPrint === true) {
              that.$parent.printBill(blid)
            }
            that.$parent.getList()
            that.returnHome()
          }, true)
        } else {
          that.$parent.audit(that.checkPrint)
        }
      },
      // 反审核
      unaudit() {
        this.$parent.unaudit()
      },
      // 获取转仓明细
      getDtList() {
        api.dtlist(this.formData.id).then(response => {
          this.dtList = response.changeStDts
        }).catch(error => {
          if (error)console.error(error)
        })
      },
      // 获取转货批次
      getSubList() {
        api.sublist(this.formData.id).then(response => {
          this.subList = response.changeSubs
        }).catch(error => {
          if (error)console.error(error)
        })
      },
      // 锁定、解锁货物 revert==0锁定
      lockGood(revert, stockIds) {
        if (stockIds && stockIds.length > 0) {
          const requestData = {
            revert: revert,
            stockIds: stockIds.join(',')
          }
          api.lock(requestData).then(() => {
            // alert(revert)
          }).catch(error => {
            if (error) console.error(error)
          })
        }
      },
      // 返回
      returnHome() {
        // 解锁锁定货物
        this.lockGood(1, this.lockGoods)
        this.$emit('hideView')
      },
      // 显示隐藏选货页面
      toggleSelect(isShow) {
        this.showSelectGoods = isShow
      },
      printBill() {
        // 打印
        this.$parent.printBill(this.formData.id)
      },
      // 记录转仓状态
      selectionishowBnt(val) {
        this.RolloverBntStatus = val
      },
      // 删除转仓状态
      deleteSelectionishowBnt(val) {
        this.deleteBntStatus = val
      }
    },
    created() {
      if (this.systemparmMap.SYSTEMSET && this.systemparmMap.SYSTEMSET.AUDIT_WITH_PRINT) {
        this.checkPrint = this.systemparmMap.SYSTEMSET.AUDIT_WITH_PRINT === '1'
      }
      // 新增页面
      if (this.action === 'add') {
        this.lockGoods = []
        this.dtList = []
        this.subList = []
        this.formData = {
          bldate: common.getNowFormatMinTime()
        }
        if (this.selectRow && this.selectRow.custId && this.selectRow.stockList) { // 从库存管理选货到此新增页面时
          this.formData.custId = this.selectRow.custId
          this.addGoods(this.selectRow.stockList)
        }
      } else if (this.action === 'update' || this.action === 'view') {
        this.lockGoods = []
        this.dtList = []
        this.dtDelList = []
        this.subList = []
        this.formData = JSON.parse(JSON.stringify(this.selectRow))
        this.getDtList()
        this.getSubList()
      }
    }
  }
</script>

<style scoped>

</style>
