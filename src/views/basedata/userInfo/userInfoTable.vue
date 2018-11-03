<template>
  <div>
    <!--基本信息-->
    <el-row class="info-wrap mb10">
      <el-row class="title">基本信息</el-row>
      <el-row class="info">
        <el-form :inline="true">
          <el-form-item label="登陆账号">
            <el-input size="mini"></el-input>
          </el-form-item>
          <el-form-item label="用户名称">
            <el-input size="mini"></el-input>
          </el-form-item>
          <el-form-item label="　　密码">
            <el-input size="mini"></el-input>
          </el-form-item>
          <el-form-item label="移动电话">
            <el-input size="mini"></el-input>
          </el-form-item>
          <el-form-item label="固定电话">
            <el-input size="mini"></el-input>
          </el-form-item>
          <el-form-item label="　　邮箱">
            <el-input size="mini"></el-input>
          </el-form-item>
          <el-form-item label="注册日期">
            <el-date-picker
              v-model="date"
              size="mini"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-radio label="锁定"></el-radio>
          </el-form-item>
          <el-form-item>
            <el-radio label="监管用户"></el-radio>
          </el-form-item>
          <el-form-item label="　　备注">
            <el-input size="mini"></el-input>
          </el-form-item>
        </el-form>
      </el-row>
    </el-row>

    <!--权限设置-->
    <el-row class="info-wrap">
      <el-row class="title mb10">权限设置</el-row>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-table :data="roleList" border stripe>
            <el-table-column sortable label="选择" type="selection"></el-table-column>
            <el-table-column sortable label="权限代码" prop="rolecode"></el-table-column>
            <el-table-column sortable label="权限名称" prop="rolename"></el-table-column>
          </el-table>
        </el-col>

        <!--右侧菜单-->
        <el-col :span="17">
          <el-table border stripe :data="authList" :span-method="objectSpanMethod">
            <el-table-column sortable label="一级菜单" prop="col1" width="120"></el-table-column>
            <el-table-column sortable label="一级菜单" prop="col2" width="120"></el-table-column>
            <el-table-column sortable label="权限集合" prop="col3">
              <template slot-scope="scope">
                <el-checkbox-group>
                  <el-checkbox v-for="item in scope.row.rightList" :disabled="item.isDisabled"
                               :label="item.rightName0" :key="item.id" :value="item.rightCode"
                  ></el-checkbox>
                </el-checkbox-group>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'user-info-table',
    props: {
      roleList: Array,
      authList: Array,
      authRowConbine: Array
    },
    mounted() {
    },
    data() {
      return {
        date: '2018-05-01'
      }
    },
    methods: {
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          const rowCon = this.authRowConbine
          for (let i = 0; i < rowCon.length; i++) {
            if (rowIndex === rowCon[i].rowIndex) {
              return {
                rowspan: rowCon[i].count,
                colspan: 1
              }
            } else {
              return {
                rowspan: 0,
                colspan: 0
              }
            }
          }
          // if (rowIndex % 2 === 0) {
          //   return {
          //     rowspan: 2,
          //     colspan: 1
          //   }
          // } else {
          //   return {
          //     rowspan: 0,
          //     colspan: 0
          //   }
          // }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .info-wrap {
    border: 1px solid #ddd;
    box-shadow: 0px 4px 6px #d9dadc;
    .title {
      border-left: 3px solid #2a3950;
      height: 40px;
      border-bottom: 1px solid #ddd;
      padding-left: 20px;
      line-height: 40px;
      font-size: 12px;
      font-weight: bold;
      color: #323232;
    }
    .info {
      padding: 10px 20px 0 20px;
    }
    .el-date-editor.el-input, .el-date-editor.el-input__inner {
      width: 163px;
    }
    .el-form-item {
      margin-bottom: 0;
    }
  }

  .mb10 {
    margin-bottom: 10px;
  }
</style>
