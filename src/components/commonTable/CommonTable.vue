<template>
    <div class="commonTable">
        <!-- <el-button type="primary" :disabled="!itemIsEdit" @click="newAdd()" style="margin-bottom:6px;">新增</el-button> -->
        <el-table :data="tableData" border stripe height="545" style="width: 100%" @header-click="handleHeaderClick">
            <el-table-column sortable v-if="!itemIsEdit" label="" width="1">
                <template :disabled="!itemIsEdit" slot-scope="scope">
                </template>
            </el-table-column>

            <el-table-column sortable v-if="itemIsEdit&&model !='one'" label="+" width="40">
                <template  slot-scope="scope">
                    <i class="el-icon-close" @click="remove(scope.row,scope.$index)"></i>
                </template>
            </el-table-column>

            <el-table-column sortable v-if="model=='one'" label="操作" width="50">
                <template  slot-scope="scope">
                    <i class="el-icon-close" @click="remove(scope.row,scope.$index)"></i>
                </template>
            </el-table-column>

            <el-table-column label="序号" width="80">
                <template slot-scope="scope">
                    {{scope.$index+1}}
                </template>
            </el-table-column>
            <el-table-column sortable v-for="(item,index) in displayItems" :key="index" :label="item.label" :width="item.width" :prop="item.name" sortable>
                <template slot-scope="scope">
                    <el-select :disabled="!itemIsEdit" v-if="item.display =='select'" v-model="scope.row[item.name]" filterable placeholder="请选择" :filter-method="filterMethod" @click.native="selectItem(scope.$index,item.name)" @keyup.native.120="copyCol(scope.row,scope.$index,item.name)" @keyup.native.enter="copy(scope.row,scope.$index)">
                        <el-option v-for="option in filterDisplayItems(item.options)" :key="option.value" :label="option.label" :value="option.value">
                        </el-option>
                    </el-select>

                    <el-date-picker :disabled="!itemIsEdit" v-if="item.display =='date'" value-format="yyyy-MM-dd" v-model="scope.row[item.name]" :data-date="scope.$index" type="date" placeholder="选择日期" @click.native="selectItem(scope.$index,item.name)" @keyup.native.120="copyCol(scope.row,scope.$index,item.name)" @keyup.native.enter="copy(scope.row,scope.$index)">
                    </el-date-picker>

                    <span v-if="item.display =='span'">{{scope.row[item.name]}}</span>

                    <el-input :disabled="!itemIsEdit" v-if="item.display =='input'" v-model="scope.row[item.name]" placeholder="请输入内容" @click.native="selectItem(scope.$index,item.name)" @keyup.native.120="copyCol(scope.row,scope.$index,item.name)" @keyup.native.enter="copy(scope.row,scope.$index)"></el-input>
                </template>
            </el-table-column>

        </el-table>
    </div>
</template>

<script>
const _ = require('lodash')

export default {
  props: {
    displayItems: Array, // 子组间传入 table需要显示的字段
    tableData2: Array,
    isEdit: String,
    model: String
  },
  data() {
    return {
      itemIsEdit: Boolean,
      // tableData: [], //  table 循环的数组
      selectIndex: 0, // 当前点击时获取的index
      queryText: '' // select 下拉输入值
    }
  },
  filters: {
    myCurrency: function(value) {
      return value
    }
  },
  methods: {
    handleHeaderClick(column, event) {
      if (column.label === '+') {
        const that = this
        const obj = {}
        for (let i = 0; i < that.displayItems.length; i++) {
          obj[that.displayItems[i]['name']] = ''
        }
        this.tableData.push(obj)
      }
      console.log(column)
      console.log(event)
    },
    copyCol(item, index, test) {
      const that = this
      if (that.selectIndex < this.tableData.length - 1) {
        this.tableData[that.selectIndex + 1][test] = this.tableData[
          that.selectIndex
        ][test]
        that.selectIndex++
      }
    },
    copy(item, index) {
      const obj = _.cloneDeep(item) // 复制列
      this.tableData.push(obj)
    },
    remove(item, index) {
      this.tableData.splice(index, 1)
    },
    newAdd() {
      const that = this
      const obj = {}
      for (let i = 0; i < that.displayItems.length; i++) {
        obj[that.displayItems[i]['name']] = ''
      }
      this.tableData.push(obj)
    },
    selectItem(index, item) {
      this.selectIndex = index // 获取当前点击的 index
    },
    filterMethod(query) {
      this.queryText = query // 获取下拉 select 输入的值
      console.log(query)
    },
    filterDisplayItems(options) {
      //  过滤下拉选项过多
      let filterItems = []
      if (this.queryText.length > 0) {
        for (
          let index = 0;
          index < options.length && filterItems.length < 2;
          index++
        ) {
          const item = options[index]
          if (item.label.indexOf(this.queryText) !== -1) {
            filterItems.push(item)
          }
        }
      } else {
        filterItems = options.slice(0, 2)
      }
      return filterItems
    }
  },
  mounted() {
    const that = this
    if (that.isEdit === 'add') {
      that.itemIsEdit = true
    } else if (that.isEdit === 'edit') {
      that.itemIsEdit = true
    } else if (that.isEdit === 'see') {
      that.itemIsEdit = false
    } else {
      that.itemIsEdit = false
    }
  },
  computed: {
    tableData: function() {
      const that = this
      const arr = []
      if (that.isEdit === 'add') {
        return arr
      } else if (that.isEdit === 'edit') {
        return that.tableData2
      } else if (that.isEdit === 'see') {
        return that.tableData2
      } else {
        return arr
      }
    }
  }
}
</script>

<style lang="scss" >
.commonTable {
    padding: 8px;
    .el-input__inner {
        width: 210px !important;
    }
    // thead.has-gutter {
    //     tr:nth-of-type(1) {
    //         th:nth-of-type(1) {
    //             text-align: center !important;
    //             font-size: 30px;
    //         }
    //     }
    // }

    td.el-table_1_column_1 {
        .cell:nth-of-type(1) {
            text-align: center !important;
        }
    }
}
</style>
