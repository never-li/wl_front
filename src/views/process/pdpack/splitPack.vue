<template>
  <div>
    <el-row style="margin-top: 20px">
        <el-table
          :data="pdGoodPackList"
          @header-click="dealPdGoodPackHeaderClick"
          border
          stripe
          :header-cell-class-name="setHeaderPointerClass"
          row-class-name="pointer text-center tab-ellipsis">
          <el-table-column label="合并">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.selected"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="货物编号" prop="handCodes"></el-table-column>
          <el-table-column label="钢卷号" prop="steelCodes"></el-table-column>
          <el-table-column label="规格" prop="specAllPd"  min-width="200"></el-table-column>
          <el-table-column label="数量">
            <template slot-scope="scope">
              <number-input v-if="scope.row.dtList.length === 1" v-model="scope.row.num" @blur.native="updatePackNum(scope.row,scope.$index)" decimal="10" :min="1" :max="scope.row.maxNum" size="mini"></number-input>
              <span v-else>{{scope.row.num}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="'理重['+ pdPackDialogTableHeader.weight+']'" prop="weight" min-width="120"></el-table-column>
          <el-table-column :label="'磅重['+ pdPackDialogTableHeader.weight1+']'" prop="weight1" min-width="120"></el-table-column>
          <el-table-column :label="'毛重['+ pdPackDialogTableHeader.weight3+']'" min-width="120">
            <template slot-scope="scope">
              <number-input v-model="scope.row.weight3" decimal="10,3" :min="0" @change="calWeight1(scope.row)" size="mini"></number-input>
            </template>
          </el-table-column>
          <el-table-column :label="'木架重['+ pdPackDialogTableHeader.weight6+']'" min-width="120">
            <template slot-scope="scope">
              <number-input v-model="scope.row.weight6" decimal="10,3" :min="0" @change="calWeight1(scope.row)" size="mini"></number-input>
            </template>
          </el-table-column>
          <el-table-column label="仓库">
            <template slot-scope="scope">
              <store-select v-model="scope.row.storeId"></store-select>
            </template>
          </el-table-column>
          <el-table-column label="备注">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark"></el-input>
            </template>
          </el-table-column>
        </el-table>
    </el-row>
    <el-row class="footer">
      <el-button type="primary" @click="addSplitPack" :disabled="actionDoing">保存</el-button>
      <el-button @click="returnHome(false)" icon="el-icon-back">返回</el-button>
    </el-row>
  </div>
</template>

<script>
  import storeSelect from '@/components/storeSelect'
  import numberInput from '@/components/numberInput'
  import * as api from '@/api/process/pdpack/pdpack'
  import { copyObject } from '@/utils'

export default {
    name: 'split-pack',
    props: {
      packId: String
    },
    components: {
      storeSelect,
      numberInput
    },
    computed: {
      pdPackDialogTableHeader() {
        const temp = {}
        temp.weight = this.pdGoodPackList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight ? cur.weight : 0)
        }, 0).toFixed(3)
        temp.weight1 = this.pdGoodPackList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight1 ? cur.weight1 : 0)
        }, 0).toFixed(3)
        temp.weight3 = this.pdGoodPackList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight3 ? cur.weight3 : 0)
        }, 0).toFixed(3)
        temp.weight6 = this.pdGoodPackList.reduce((pre, cur) => {
          return pre + parseFloat(cur.weight6 ? cur.weight6 : 0)
        }, 0).toFixed(3)
        return temp
      }
    },
    data() {
      return {
        actionDoing: false,
        pack: {},
        pdGoodPackList: []
      }
    },
    methods: {
      // 分包查询
      getSplitPack() {
        if (!this.packId) {
          return
        }
        this.pdGoodPackList = []
        api.getSplitPack({ packId: this.packId }).then((response) => {
          if (response.pack) {
            this.pack = response.pack
            if (this.pack.dtList && this.pack.dtList.length > 0) {
              for (const item of this.pack.dtList) {
                const pdGoodPackDt = {
                  id: item.id,
                  blid: item.blid,
                  handCode: item.handCode,
                  steelCode: item.steelCode,
                  maSpec: item.maSpec,
                  thickness: item.thickness,
                  width: item.width,
                  length: item.length,
                  weight: item.weight,
                  num: item.num,
                  unit: item.unit,
                  pdSpecDes: item.pdSpecDes,
                  specSuffix: item.specSuffix ? item.specSuffix : ''
                }
                // 拼接规格
                pdGoodPackDt.spec = pdGoodPackDt.pdSpecDes + '×' + pdGoodPackDt.num + pdGoodPackDt.unit + pdGoodPackDt.specSuffix
                const pdGoodPack = {
                  selected: false,
                  weight1: '', // 过磅净重
                  weight3: '', // 过磅毛重
                  weight6: '', // 木架重
                  storeId: this.pack.storeId,
                  remark: this.pack.remark,
                  dtList: [pdGoodPackDt],
                  maxNum: pdGoodPackDt.num,
                  random: Math.random()
                }
                this.sumPack(pdGoodPack)
                this.pdGoodPackList.push(pdGoodPack)
              }
            }
          }
        }).catch(error => {
          if (error) console.error(error)
        })
      },
      // 成品分包
      addSplitPack() {
        if (!this.pdGoodPackList || this.pdGoodPackList.length < 1) {
          this.$message('分包明细不能为空')
          return
        }
        for (const item of this.pdGoodPackList) {
          if (!item.storeId) {
            this.$message('仓库不能为空')
            return
          }
        }
        const reqData = {
          list: this.pdGoodPackList
        }
        this.actionDoing = true
        api.splitPack(reqData).then(() => {
          this.returnHome(true)
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
      // 修改包装数量
      updatePackNum(oldRow, index) {
        const oldNum = oldRow.dtList[0].num
        // 合并后不能修改
        if (!oldRow.dtList || oldRow.dtList.length !== 1) {
          this.$message('合并后不能修改数量')
          oldRow.num = oldNum
          return
        } else if (oldRow.num > oldRow.maxNum) {
          this.$message('包装明细总数量最大为' + oldRow.maxNum)
          oldRow.num = oldNum
          return
        }
        if (oldRow.num < oldNum) { // 如果数量少于旧数量，则添加一行
          const newRow = copyObject(oldRow)
          newRow.random = Math.random()
          // 更新旧行
          const oldDt = oldRow.dtList[0]
          oldDt.num = oldRow.num
          oldDt.spec = oldDt.pdSpecDes + '×' + oldDt.num + oldDt.unit + oldDt.specSuffix
          oldDt.weight = parseFloat(oldDt.num / oldRow.maxNum * oldDt.weight).toFixed(3)
          this.sumPack(oldRow)
          // 添加新行
          const newDt = newRow.dtList[0]
          newDt.num = parseInt(oldNum - oldRow.num)
          newDt.spec = newDt.pdSpecDes + '×' + newDt.num + newDt.unit + newDt.specSuffix
          newDt.weight = parseFloat(newDt.weight - oldDt.weight).toFixed(3)
          this.sumPack(newRow)
          // 紧跟其后添加
          this.pdGoodPackList.splice(index + 1, 0, newRow)
        } else if (oldRow.num > oldNum) { // 如果数量大于旧数量
          let lessNum = parseInt(oldRow.num - oldNum)
          // 更新旧行
          const oldDt = oldRow.dtList[0]
          oldDt.num = oldRow.num
          oldDt.spec = oldDt.pdSpecDes + '×' + oldDt.num + oldDt.unit + oldDt.specSuffix
          oldDt.weight = parseFloat(oldDt.num / oldRow.maxNum * oldDt.weight).toFixed(3)
          this.sumPack(oldRow)
          // 删除其他行的数量
          for (let i = 0; i < this.pdGoodPackList.length; i++) {
            if (lessNum <= 0) {
              continue
            }
            // 跳过合并行
            if (this.pdGoodPackList[i].dtList.length > 1) {
              continue
            }
            // 跳过本行
            if (this.pdGoodPackList[i].random === oldRow.random) {
              continue
            }
            // 跳过非本包装明细行
            if (this.pdGoodPackList[i].dtList[0].id !== oldRow.dtList[0].id) {
              continue
            }
            // 如果需求的数量大于等于该行数量，则删除该行
            if (lessNum >= this.pdGoodPackList[i].num) {
              lessNum = parseInt(lessNum - this.pdGoodPackList[i].num)
              // console.log(1 + ':' + lessNum)
              this.pdGoodPackList.splice(i, 1)
              i = i - 1
            } else { // 少于
              // 更新该行
              const dt = this.pdGoodPackList[i].dtList[0]
              const oldNum = dt.num
              dt.num = parseInt(dt.num - lessNum)
              dt.spec = dt.pdSpecDes + '×' + dt.num + dt.unit + dt.specSuffix
              dt.weight = parseFloat(dt.num / oldNum * dt.weight).toFixed(3)
              this.sumPack(this.pdGoodPackList[i])
              lessNum = 0
            }
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
      setHeaderPointerClass({ row, column, rowIndex, columnIndex }) {
        if (column.label === '合并') {
          return 'table-header-bg text-center pointer table-bnt'
        } else {
          return 'table-header-bg text-center'
        }
      },
      dealPdGoodPackHeaderClick(column, event) {
        if (column.label === '合并') {
          const newList = []
          const selectList = []
          for (const item of this.pdGoodPackList) {
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
          for (const select of selectList) {
            for (const dt of select.dtList) {
              dtList.push(dt)
            }
          }
          const pdGoodPack = {
            selected: false,
            weight1: '', // 过磅净重
            weight3: '', // 过磅毛重
            weight6: '', // 木架重
            storeId: this.pack.storeId,
            remark: '',
            dtList: dtList
          }
          this.sumPack(pdGoodPack)
          newList.push(pdGoodPack)
          this.pdGoodPackList = newList
          // 重新计算所有包装明细的最大数量
          for (const pack of this.pdGoodPackList) {
            // 跳过合并行
            if (pack.dtList.length > 1) {
              continue
            }
            let maxNum = 0
            for (const pack2 of this.pdGoodPackList) {
              // 跳过合并行
              if (pack2.dtList.length > 1) {
                continue
              }
              if (pack.dtList[0].id === pack2.dtList[0].id) {
                maxNum = parseInt(maxNum + pack2.dtList[0].num)
              }
            }
            console.log(maxNum)
            pack.maxNum = maxNum
          }
        }
      },
      returnHome(isRefresh) {
        this.$emit('hideSplitPack', isRefresh)
      }
    },
    mounted() {
      this.getSplitPack()
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
 .footer{
   margin-top: 20px;
   margin-bottom: 5px;
   button{
     float: right;
     margin-right: 10px;
   }
 }
</style>
