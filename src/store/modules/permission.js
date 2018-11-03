import { constantRouterMap, genAsyncRouter } from '@/router'
/**
 * 通过菜单码找到对应的菜单
 * @param {Array} moduleList module 数组
 * @param {string} moduleCode 菜单码

function getModule(moduleList, moduleCode) {
  return moduleList.find(module => {
    if (module.moduleCode && module.moduleCode === moduleCode) {
      return true
    }
    return false
  })
} */

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles

function filterAsyncRouter(asyncRouterMap, moduleList) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (route.meta && route.meta.moduleCode) {
      route.meta.title = route.meta.title + '23'
      const moduleCode = route.meta.moduleCode
      const module = getModule(moduleList, moduleCode)
      if (module) {
        if (route.children && route.children.length &&
        module.children && module.children.length) {
          route.children = filterAsyncRouter(route.children, module.children)
        }
        return true
      }
    } else {
      // 没有moduleCode 的菜单不做权限限制
      return true
    }
    return false
  })
  return accessedRouters
}
*/
const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { moduleList } = data.userInfo
        // const accessedRouters = filterAsyncRouter(asyncRouterMap, moduleList)
        // if (accesslevel === 1) {
        //   accessedRouters = asyncRouterMap
        // } else {
        //   accessedRouters = filterAsyncRouter(asyncRouterMap, moduleList)
        // }
        const accessedRouters = genAsyncRouter(moduleList)
        // console.log(accessedRouters)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
