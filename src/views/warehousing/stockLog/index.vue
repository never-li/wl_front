<template>
  <div class="app-container">
    <div class="form-wrap">
      <el-form :inline="true" size="small" label-width="80px">
        <el-form-item label="货物编号">
          <el-input v-model="searchItem.handCode" maxlength="20"  @keyup.enter.native="submit"></el-input>
        </el-form-item>
        <el-form-item label="捆包号">
          <el-input v-model="searchItem.steelCode" maxlength="20"></el-input>
        </el-form-item>
<!--        <el-form-item>
          <el-checkbox v-model="searchItem.fuzzySearchTag" :true-label="1" :false-label="0" >模糊</el-checkbox>
        </el-form-item>-->
      </el-form>
    </div>


    <div class="btn-group-container">
      <el-button v-show="!isShow" type="primary" @click="getList" icon="el-icon-refresh">刷新</el-button>
      <el-button v-show="!isShow" :type="isSelectRow?'success':'info'" @click="search" :disabled="!isSelectRow">显示所选货物流动图</el-button>
      <el-button type="primary" v-show="isShow" @click="back" icon="el-icon-back">返回</el-button>
    </div>
    <el-table v-show="!isShow" :data="list" element-loading-text="给我一点时间" v-loading="listLoading" border fit highlight-current-row stripe
      height="545" @current-change="handleCurrentChange" @row-dblclick="handleDblClick"
      header-cell-class-name="table-header-bg text-center"
              style="width: 100%">
      <el-table-column sortable align="center" label="序号" type="index">
      </el-table-column>
      <el-table-column sortable align="center" label="货物编码" prop="handCode"></el-table-column>
      <el-table-column sortable align="center" label="品名" prop="typeName"></el-table-column>
      <el-table-column sortable align="center" label="单据日期" prop="billDate"></el-table-column>
      <el-table-column sortable align="center" label="审核日期" prop="createTime"></el-table-column>
      <el-table-column sortable align="center" label="目标货主" prop="cuName"></el-table-column>
      <el-table-column sortable align="center" label="目标仓库" prop="storeName"></el-table-column>
      <el-table-column sortable align="center" label="备注" prop="remark"></el-table-column>
    </el-table>
    <div v-show='isShow' v-mindbox="mind" id="goodsflow" ></div>
  </div>
</template>

<script>
  import '@/assets/jsmind.css'
  import jsmind from 'jsmind'
  import * as api from '@/api/warehousing/stockLog/index'
  import { findPathByModuleCode } from '@/utils'

  export default {
    activated() {
      const handcode = this.$route.query.handCode
      if (handcode) {
        this.searchItem.handCode = handcode
        this.getList()
      }
    },
    name: 'stockLog',
    directives: {
      mindbox: {
        update: (el, binding) => {
          const options = {
            container: 'goodsflow',
            editable: false,
            theme: 'default'
          }
          const mind = {
            'meta': {
              'name': 'goodsflow',
              'author': 'wcyl-pc',
              'version': '0.2'
            },
            'format': 'node_array',
            'data': []
          }
          document.getElementById('goodsflow').innerHTML = ''
          for (let ii = 0; ii < binding.value.length; ii++) {
            mind.data = binding.value[ii]
            jsmind.show(options, mind)
          }
        }
      }
    },
    data() {
      return {
        list: [],
        mind: [],
        listLoading: false,
        searchItem: {
          handCode: '',
          steelCode: '',
          fuzzySearchTag: 0,
          isSearch: false
        },
        currentRow: null,
        isSelectRow: false,
        isShow: false
      }
    },
    methods: {
      back() {
        this.isShow = false
      },
      getList() {
        if (this.searchItem.handCode === '' && this.searchItem.steelCode === '') {
          this.$message.info('货物编码或钢卷号不能同时为空')
          return
        }
        this.listLoading = true
        const postlist = {
          handCode: this.searchItem.handCode,
          steelCode: this.searchItem.steelCode,
          fuzzySearchTag: this.searchItem.fuzzySearchTag
        }
        api.list(postlist).then(response => {
          this.list = response.stockFlowTrees
          if (this.$route.query.handCode || this.list.length === 1) {
            this.currentRow = this.list[0]
            this.search()
          } else {
            this.mind = []
          }
          this.listLoading = false
        })
      },
      submit() {
        if (this.isShow) {
          this.getList()
        }
      },
      search() {
        this.mind = []
        let loTrees = []
        let laTemp = []
        loTrees = this.currentRow
        loTrees = this.checkTree(loTrees, 0)
        laTemp = laTemp.concat(loTrees)
        this.mind.push(laTemp)
        this.isShow = true
      },
      checkTree(toObj, tnlv) {
        if (tnlv > 100) {
          return false
        }
        let result = []
        let laTemp = []
        let lcHtml = ''
        var url = this.getJumpUrlByBilltype(toObj.bType)
        // 进仓单标题头加上货物编码
        if (toObj.bType === 1) { toObj.billTypeLabel += '(' + this.currentRow.handCode + ')' }
        lcHtml = `<div onclick=\\"location.href='/#${url}?path=home&id=${toObj.billId}'\\"><p class=\\"head\\" >${toObj.billTypeLabel}</p><p><span>${toObj.billNo}</span></p><p><span>${toObj.cuName}</span></p><p><span>规格${toObj.specAll}</span></p><p><span>[${toObj.storeName}]${toObj.weight.toFixed(3)}吨(${toObj.num}${toObj.unit})</span></p></div>`
        if (toObj.parentId !== null) {
          result.push(JSON.parse('{"id": "' + toObj.id + '", "parentid": "' + toObj.parentId + '", "topic": "' + lcHtml + '","direction":"right"}'))
        } else {
          result.push(JSON.parse('{"id": "' + toObj.id + '", "parentid": "root", "isroot":true, "topic": "' + lcHtml + '","direction":"right"}'))
        }
        for (var li = 0; li < toObj.childList.length; li++) {
          laTemp = this.checkTree(toObj.childList[li], tnlv++)
          result = result.concat(laTemp)
        }
        return result
      },
      getJumpUrlByBilltype(billtype) {
        let url = ''
        switch (billtype) {
          case 1 : url = findPathByModuleCode('instore'); break
          case 2 : url = findPathByModuleCode('transferGoods'); break
          case 3 : url = findPathByModuleCode('transferStore'); break
          case 6 : url = findPathByModuleCode('pickUpGoods'); break
          case 7 : url = findPathByModuleCode('outStorePd'); break
          case 28 :
          case 60 :
          case 62 :
          case 61 : url = findPathByModuleCode('machOrder'); break
          case 15 : url = findPathByModuleCode('pdpack'); break
          case 29 : url = findPathByModuleCode('machClearing'); break
          case 30 : url = findPathByModuleCode('changepd'); break
        }
        return url
      },
      handleCurrentChange(val) {
        this.currentRow = val
        this.isSelectRow = true
      },
      handleDblClick(val) {
        this.currentRow = val
        this.isSelectRow = true
        this.search()
      }
    }
  }
</script>

<style lang="scss">
  jmnode {
    padding: 0;
  }

  jmnode p {
    padding: 5px 10px 8px;
    font-size: 12px;
    margin: 0;
  }

  jmnode p.head {
    background: #409EFF;
    color: #fff;
  }
  #goodsflow {
    height: calc(100% - 300px);
    width: 100%;
    min-width: 1200px;
    overflow: auto;
    position: absolute;
    left: 0;
    z-index: 10;
  }


</style>
