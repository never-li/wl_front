<template>
  <div class="app-container">
    <!--头部按钮组-->
    <div class="btn-group-container">
      <el-button type="primary" @click="$emit('hideColumnConfig')">取消</el-button>
      <el-button type="primary" @click="saveColumnConfig">保存</el-button>
    </div>
    <div class="board">
      <Kanban :key="1" class="kanban todo" :list="list1" :options="options" header-text="列选项(可向右拖拽添加)"/>
      <Kanban :key="2" class="kanban done" :list="list2" :options="options" header-text="已选项(可上下拖拽排序)"/>
      <!-- <Kanban :key="3" class="kanban done" :list="list3" :options="options" header-text="Done"/> -->
    </div>
  </div>
</template>
<script>
import Kanban from '@/components/Kanban'
import { getMaStockColumn, addMaStockColumn } from '@/api/warehousing/stock/maStock'

export default {
  name: 'dragKanban-demo',
  components: {
    Kanban
  },
  created() {
    this.getColumn()
  },
  data() {
    return {
      options: {
        group: 'mission'
      },
      list1: [
        { name: '锁定', id: 'freezeWeight' },
        { name: '操作', id: 'operate' },
        { name: '货物编号', id: 'handCode' },
        { name: '钢卷号', id: 'steelCode' },
        { name: '客户', id: 'custId' },
        { name: '品名', id: 'typeId' },
        { name: '规格', id: 'specName' },
        { name: '产地', id: 'parea' },
        { name: '材质', id: 'grade' },
        { name: '可用重量', id: 'validWeight2' },
        { name: '可用数量', id: 'validNum' },
        { name: '抄码净重', id: 'weight2' },
        { name: '抄码毛重', id: 'weight4' },
        { name: '过磅重量', id: 'weight1' },
        { name: '抄码数量', id: 'num' },
        { name: '库位', id: 'position' },
        { name: '长度', id: 'lengthRemark' },
        { name: '单位', id: 'unit' },
        { name: '外观描述', id: 'showDes' },
        { name: '进仓日期', id: 'storeDate' },
        { name: '合同号', id: 'contractNo' },
        { name: '船号', id: 'shipNo' },
        { name: '锁定原因', id: 'freezeDes' },
        { name: '备注', id: 'remark' },
        { name: '锁定人', id: 'selectUserName' }
      ],
      list2: [
      ]
    }
  },
  methods: {
    saveColumnConfig() {
      addMaStockColumn({ 'maStockColumnList': this.list2 }).then(response => {
        this.$emit('hideColumnConfig')
      }).catch(error => {
        if (error) console.error(error)
      })
    },
    getColumn() {
      getMaStockColumn().then(response => {
        this.list2 = response.maStockColumnVoList
        console.log(this.list2)
        for (const v of this.list2) {
          for (let i = 0; i < this.list1.length; i++) {
            if (v.id === this.list1[i].id) {
              v.name = this.list1[i].name
              this.list1.splice(i, 1)
              break
            }
          }
        }
      }).catch(error => {
        if (error) console.error(error)
      })
    }
  }
}
</script>
<style lang="scss">
.board {
  width: 1000px;
  margin-left: 20px;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: flex-start;
}
.kanban {
  &.todo {
    .board-column-header {
      background: #4A9FF9;
    }
  }
  &.working {
    .board-column-header {
      background: #f9944a;
    }
  }
  &.done {
    .board-column-header {
      background: #2ac06d;
    }
  }
}
</style>

