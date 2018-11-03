<template>
  <div class="menu-wrapper">
    <el-menu class="top-bar-menu" mode="horizontal" >
    <template v-for="item in routes" v-if="!item.hidden&&item.children">


      <el-menu-item v-if="hasOneShowingChildren(item.children) && !item.children[0].children&&!item.alwaysShow"
      :index="item.path+'/'+item.children[0].path" :class="{'submenu-title-noDropdown':!isNest}" :key="item.children[0].name" >
        <router-link  :to="item.path+'/'+item.children[0].path" >
        <div>
          <svg-icon v-if="item.children[0].meta&&item.children[0].meta.icon" :icon-class="item.children[0].meta.icon"></svg-icon>
          <span v-if="item.children[0].meta&&item.children[0].meta.title" slot="title">{{item.children[0].meta.title}}</span>
        </div>
        </router-link>
      </el-menu-item>


      <el-submenu v-else :index="item.name||item.path" :key="item.name">
        <template slot="title">
          <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
          <span v-if="item.meta&&item.meta.title" slot="title">{{item.meta.title}}</span>
        </template>

        <template v-for="child in item.children" v-if="!child.hidden">
          <topbar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0" :routes="[child]" :key="child.path"></topbar-item>
          <el-menu-item v-else-if="child.type === 'report' " :index="item.path+'/'+child.path" @click="showReport(child.path)">
            <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
            <span v-if="child.meta&&child.meta.title" slot="title">{{child.meta.title}}</span>
          </el-menu-item>
          <router-link v-else :to="item.path+'/'+child.path" :key="child.name">
            <el-menu-item :index="item.path+'/'+child.path">
              <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
              <span v-if="child.meta&&child.meta.title" slot="title">{{child.meta.title}}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>

    </template>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'TopbarItem',
  props: {
    routes: {
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    hasOneShowingChildren(children) {
      // 暂时屏蔽
      // const showingChildren = children.filter(item => {
      //   return !item.hidden
      // })
      // if (showingChildren.length === 1) {
      //   return true
      // }
      return false
    },
    showReport(url) {
      console.log('show report ' + url)
      const temp_form = document.createElement('form')
      temp_form.action = url
      temp_form.target = '_blank'
      temp_form.method = 'post'
      temp_form.style.display = 'none'

      const hideInput = document.createElement('input')
      hideInput.type = 'hidden'
      hideInput.name = 'x-token'
      hideInput.value = sessionStorage.token

      temp_form.appendChild(hideInput)

      document.body.appendChild(temp_form)
      temp_form.submit()
      document.body.removeChild(temp_form)
    }
  }
}
</script>
<style lang="scss">
  .menu-wrapper{
    .el-menu{
        background:none ;
        margin-top: 10px;
        margin-bottom: 15px;
    }
    
  }
</style>

