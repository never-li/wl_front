<template>
  <div>
    <!--头部按钮组-->
    <div class="btn-group-container">
      <el-button type="primary" @click="$emit('hideColumnConfig')" icon="el-icon-close">取消</el-button>
      <el-button type="primary" @click="saveColumnConfig" icon="el-icon-check">保存</el-button>
    </div>
    <el-container id="order-hight">
      <el-main>
        <div class="board">
          <Kanban :key="1" class="kanban todo" :list="list1" :options="options" header-text="列选项(可向右拖拽添加)"/>
          <Kanban :key="2" class="kanban done" :list="list2" :options="options" header-text="已选项(可上下拖拽排序)"/>
          <!-- <Kanban :key="3" class="kanban done" :list="list3" :options="options" header-text="Done"/> -->
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import Kanban from '@/components/Kanban'
import { getPdPackColumn, addPdPackColumn } from '@/api/process/pdpack/pdpack'

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
        { name: '锁定', id: 'isLock' },
        { name: '结算状态', id: 'stateLabel' },
        { name: '包装编号', id: 'blno' },
        { name: '包装备注', id: 'remark' },
        { name: '货物编号', id: 'handCodes' },
        { name: '钢卷号', id: 'steelCodes' },
        { name: '客户', id: 'cuName' },
        { name: '原料规格组成', id: 'specAllMa' },
        { name: '成品规格组成', id: 'specAllPd' },
        { name: '理算重量', id: 'weight' },
        { name: '过磅净重', id: 'weight1' },
        { name: '过磅毛重', id: 'weight3' },
        { name: '木架重量', id: 'weight6' },
        { name: '包装数量', id: 'num' },
        { name: '加工客户', id: 'machCuName' },
        { name: '库位', id: 'position' },
        { name: '包装日期', id: 'bldate' },
        { name: '锁定原因', id: 'lockDes' },
        { name: '锁定人', id: 'selUserName' },
        { name: '加工单号', id: 'machBlnoes' }
      ],
      list2: [
      ]
    }
  },
  methods: {
    saveColumnConfig() {
      addPdPackColumn({ 'pdPackColumnList': this.list2 }).then(response => {
        this.$emit('hideColumnConfig')
      }).catch(error => {
        if (error) console.error(error)
      })
    },
    getColumn() {
      getPdPackColumn().then(response => {
        this.list2 = response.pdPackColumnVoList
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
  },
  mounted() {
    var orderHight = document.body.clientHeight
    document.getElementById('order-hight').style.height = (orderHight - 200) + 'px'
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

