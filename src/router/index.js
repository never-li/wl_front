import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: 'dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      name: 'dashboard',
      component: () =>
          import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'example' }
    }]
  }
]
/*
export const asyncRouterMap = [{
  path: '/warehousing',
  component: Layout,
  redirect: '/warehousing/instore',
  name: '仓储管理',
  meta: { title: '仓储管理', icon: 'example' },
  children: [
    {
      path: 'instore',
      name: 'instore',
      component: () => import('@/views/warehousing/instore/index'),
      meta: { title: '原料进仓管理', icon: 'table' }
    },
    {
      path: 'instoreAdd',
      name: 'instoreAdd',
      hidden: true,
      component: () => import('@/views/warehousing/instore/instoreAdd'),
      meta: { title: '原料进仓新增', icon: 'table' }
    },
    {
      path: 'transferStore',
      name: 'transferStore',
      component: () => import('@/views/warehousing/transferStore/index'),
      meta: { title: '原料转仓管理', icon: 'tree' }
    },
    {
      path: 'transferGoods',
      name: 'transferGoods',
      component: () => import('@/views/warehousing/transferGoods/index'),
      meta: { title: '原料转货管理', icon: 'tree' }
    },
    // ====提货
    {
      path: 'pickUpGoods',
      name: 'pickUpGoods',
      component: () => import('@/views/warehousing/pickUpGoods/index'),
      meta: { title: '原料提货管理', icon: 'tree' }
    },
    // ===库存
    {
      path: 'inventory',
      name: 'inventory',
      component: () => import('@/views/warehousing/stock/maStock/index'),
      meta: { title: '原料库存管理', icon: 'tree' }
    },
    {
      path: 'checkMaStock',
      name: 'checkMaStock',
      component: () => import('@/views/warehousing/stock/checkMaStock/index'),
      meta: { title: '原料库存盘点', icon: 'tree' }
    },
    {
      path: 'stockLook',
      name: 'stockLook',
      hidden: true,
      component: () => import('@/views/warehousing/stock/checkMaStock/check'),
      meta: { title: '原料盘点查看', icon: 'table' }
    },
    {
      path: 'list',
      name: 'list',
      hidden: true,
      component: () => import('@/views/warehousing/stock/checkMaStock/list'),
      meta: { title: '货物列表', icon: 'table' }
    },
    {
      path: 'stockLog',
      name: 'stockLog',
      component: () => import('@/views/warehousing/stockLog/index'),
      meta: { title: '货物流动日志', icon: 'tree' }
    }
  ]
},
{
  path: '/process',
  component: Layout,
  name: '加工管理',
  meta: { title: '加工管理', icon: 'example' },
  children: [
    {
      path: 'machOrder',
      name: 'machOrder',
      component: () => import('@/views/process/mach/index'),
      meta: { title: '加工下单管理', icon: 'form' }
    },
    {
      path: 'machScheduling',
      name: 'machScheduling',
      component: () => import('@/views/process/machScheduling/index'),
      meta: { title: '加工排单管理', icon: 'form' }
    },
    {
      path: 'machPack',
      name: 'machPack',
      component: () => import('@/views/process/machPack/index'),
      meta: { title: '加工打包管理', icon: 'form' }
    },
    {
      path: 'machClearing',
      name: 'machClearing',
      component: () => import('@/views/process/machclearing/index'),
      meta: { title: '加工结算管理', icon: 'form' }
    },
    {
      path: 'pdpack',
      name: 'pdpack',
      component: () => import('@/views/process/pdpack/index'),
      meta: { title: '成品库存管理', icon: 'form' }
    },
    {
      path: 'changepd',
      name: 'changepd',
      component: () => import('@/views/process/changepd/index'),
      meta: { title: '成品转货管理', icon: 'form' }
    },
    {
      path: 'outStorePd',
      name: 'outStorePd',
      component: () => import('@/views/process/outStorePd/index'),
      meta: { title: '成品提货管理', icon: 'form' }
    },
    {
      path: 'pickUpGoodsHd',
      name: 'pickUpGoodsHd',
      component: () => import('@/views/process/pickUpGoodsHd/index'),
      meta: { title: '手工提货管理', icon: 'form' }
    }
  ]
},
{
  path: '/fee',
  component: Layout,
  name: '费用管理',
  meta: { title: '费用管理', icon: 'example' },
  children: [
    {
      path: 'feeRc',
      name: 'feeRc',
      component: () => import('@/views/collectfee/feeRc/index'),
      meta: { title: '应收费用', icon: 'form' }
    },
    {
      path: 'feePy',
      name: 'feePy',
      component: () => import('@/views/collectfee/feePy/index'),
      meta: { title: '应付费用', icon: 'form' }
    }
  ]
},
{
  path: '/report',
  component: Layout,
  name: '报表分析',
  meta: { title: '报表分析', icon: 'example' },
  children: [
    {
      path: 'http://127.0.0.1:8088/bill/ReportServer?reportlet=report/mainstore.cpt',
      type: 1,
      meta: { title: '原料进仓统计', icon: 'form' }
    },
    {
      path: 'efficiency',
      name: 'efficiency',
      component: () => import('@/views/form/index'),
      meta: { title: '效率分析', icon: 'form' }
    },
    {
      path: 'finance',
      name: 'finance',
      component: () => import('@/views/form/index'),
      meta: { title: '财务分析', icon: 'form' }
    }
  ]
},
{
  path: '/fax',
  component: Layout,
  name: '传真管理',
  meta: { title: '传真管理', icon: 'example' },
  children: [
    {
      path: 'faxRc',
      name: 'faxRc',
      component: () => import('@/views/form/index'),
      meta: { title: '传真接收', icon: 'form' }
    }
  ]
},
{
  path: '/setting',
  component: Layout,
  name: '基础设置',
  meta: { title: '基础设置', icon: 'example' },
  children: [
    {
      path: 'feeConfig',
      name: 'feeConfig',
      component: () => import('@/views/basedata/feeConfig/index'),
      meta: { title: '仓储费用', icon: 'form' }
    },
    {
      path: 'roleRight',
      name: 'roleRight',
      component: () => import('@/views/basedata/role/index'),
      meta: { title: '角色权限', icon: 'form' }
    },
    {
      path: 'store',
      name: 'store',
      component: () => import('@/views/basedata/store/index'),
      meta: { title: '仓库资料', icon: 'form' }
    },
    {
      path: 'handCode',
      name: 'handCode',
      component: () => import('@/views/basedata/handCode/index'),
      meta: { title: '货物编码', icon: 'form' }
    },
    {
      path: 'systemCodeManage',
      name: 'systemCodeManage',
      component: () => import('@/views/basedata/systemCode/index'),
      meta: { title: '系统参数', icon: 'form' }
    },
    {
      path: 'sortData',
      name: 'sortData',
      component: () => import('@/views/basedata/sortData/index'),
      meta: { title: '品种资料', icon: 'form' }
    },
    {
      path: 'mobile',
      name: 'mobile',
      component: () => import('@/views/basedata/mobile/index'),
      meta: { title: '手持终端', icon: 'form' }
    },
    {
      path: 'MachFeeConfig',
      name: 'MachFeeConfig',
      component: () => import('@/views/basedata/MachFeeConfig/index'),
      meta: { title: '加工费用', icon: 'form' }
    },
    {
      path: 'feeType',
      name: 'feeType',
      component: () => import('@/views/basedata/feeType/index'),
      meta: { title: '费用类型', icon: 'form' }
    },
    {
      path: 'billType',
      name: 'billType',
      component: () => import('@/views/basedata/billType/index'),
      meta: { title: '业务单据', icon: 'form' }
    },
    {
      path: 'customer',
      name: 'customer',
      component: () => import('@/views/basedata/customer/index'),
      meta: { title: '客户资料', icon: 'form' }
    },
    {
      path: 'customerWczz',
      name: 'customerWczz',
      component: () => import('@/views/basedata/customerWczz/index'),
      meta: { title: '自助账号', icon: 'form' }
    },
    {
      path: 'userConfig',
      name: 'userConfig',
      component: () => import('@/views/basedata/userConfig/index'),
      meta: { title: '用户资料', icon: 'form' }
    },
    {
      path: 'machType',
      name: 'machType',
      component: () => import('@/views/basedata/machType/index'),
      meta: { title: '加工机台', icon: 'form' }
    },
    {
      path: 'factory',
      name: 'factory',
      component: () => import('@/views/basedata/factory/index'),
      meta: { title: '钢厂资料', icon: 'form' }
    },
    {
      path: 'announce',
      name: 'announce',
      component: () => import('@/views/basedata/announce/index'),
      meta: { title: '公告管理', icon: 'form' }
    }
  ]
},

{ path: '*', redirect: '/404', hidden: true }
]
*/

/**
 * 注册菜单试图组件
 * 规则为 viewComponents[组件名] = （） => import(组件路径)
  */
const viewComponents = []
/** 仓储管理 **/
viewComponents['instore'] = () => import('@/views/warehousing/instore/index') // 原料进仓管理
viewComponents['instoreAdd'] = () => import('@/views/warehousing/instore/instoreAdd')// 原料进仓新增
viewComponents['transferStore'] = () => import('@/views/warehousing/transferStore/index')// 原料转仓管理
viewComponents['transferGoods'] = () => import('@/views/warehousing/transferGoods/index')// 原料转货管理
viewComponents['pickUpGoods'] = () => import('@/views/warehousing/pickUpGoods/index')// 原料提货管理
viewComponents['inventory'] = () => import('@/views/warehousing/stock/maStock/index')// 原料库存管理
viewComponents['checkMaStock'] = () => import('@/views/warehousing/stock/checkMaStock/index')// 原料库存盘点
viewComponents['stockLook'] = () => import('@/views/warehousing/stock/checkMaStock/check')// 原料盘点查看
// viewComponents['list'] = () => import('@/views/warehousing/stock/checkMaStock/list')// 货物列表
viewComponents['stockLog'] = () => import('@/views/warehousing/stockLog/index')// 货物流动日志
/** 加工管理 **/
viewComponents['machOrder'] = () => import('@/views/process/mach/index')// 加工下单管理
viewComponents['machScheduling'] = () => import('@/views/process/machScheduling/index')// 加工排单管理
viewComponents['machPack'] = () => import('@/views/process/machPack/index')// 加工打包管理
viewComponents['machClearing'] = () => import('@/views/process/machclearing/index')// 加工结算管理
viewComponents['pdpack'] = () => import('@/views/process/pdpack/index')// 成品库存管理
viewComponents['changepd'] = () => import('@/views/process/changepd/index')// 成品转货管理
viewComponents['outStorePd'] = () => import('@/views/process/outStorePd/index')// 成品提货管理
viewComponents['pickUpGoodsHd'] = () => import('@/views/process/pickUpGoodsHd/index')// 手工提货管理
viewComponents['feeRc'] = () => import('@/views/collectfee/feeRc/index')// 应收费用
viewComponents['feePy'] = () => import('@/views/collectfee/feePy/index')// 应付费用
/** 传真管理 **/
viewComponents['faxreceive'] = () => import('@/views/fax/faxreceive/index')// 传真接收
viewComponents['faxsend'] = () => import('@/views/fax/faxsend/index')// 传真发送
/** 基础设置 **/
viewComponents['feeConfig'] = () => import('@/views/basedata/feeConfig/index')// 仓储费用
viewComponents['roleRight'] = () => import('@/views/basedata/role/index')// 角色权限
viewComponents['store'] = () => import('@/views/basedata/store/index')// 仓库资料
viewComponents['handCode'] = () => import('@/views/basedata/handCode/index')// 货物编码
viewComponents['systemCodeManage'] = () => import('@/views/basedata/systemCode/index')// 系统参数
viewComponents['sortData'] = () => import('@/views/basedata/sortData/index')// 品种资料
viewComponents['mobile'] = () => import('@/views/basedata/mobile/index')// 手持终端
viewComponents['MachFeeConfig'] = () => import('@/views/basedata/MachFeeConfig/index')// 加工费用
viewComponents['feeType'] = () => import('@/views/basedata/feeType/index')// 费用类型
viewComponents['billType'] = () => import('@/views/basedata/billType/index')// 业务单据
viewComponents['customer'] = () => import('@/views/basedata/customer/index')// 客户资料
viewComponents['customerWczz'] = () => import('@/views/basedata/customerWczz/index')// 自助账号
viewComponents['userConfig'] = () => import('@/views/basedata/userConfig/index')// 用户资料
viewComponents['machType'] = () => import('@/views/basedata/machType/index')// 加工机台
viewComponents['factory'] = () => import('@/views/basedata/factory/index')// 钢厂资料
viewComponents['announce'] = () => import('@/views/basedata/announce/index')// 公告管理

/**
 * 根据用户的权限菜单数组 生成对应的菜单
 * @param moduleList
 * @returns {Array}
 */
export function genAsyncRouter(moduleList) {
  const routers = []
  moduleList.forEach(module => {
    const router = {
      path: '/' + module.moduleCode,
      component: Layout,
      name: module.moduleName0,
      meta: { title: module.moduleName0, icon: 'example', code: module.moduleCode }
    }
    if (module.children && module.children.length) {
      router.children = []
      module.children.forEach(cModule => {
        const suRouter = {
          path: cModule.moduleCode,
          name: cModule.moduleCode,
          meta: { title: cModule.moduleName0, icon: 'table', code: cModule.moduleCode }
        }
        // 设置菜单类型
        if (cModule.functionType === 1) {
          suRouter.path = cModule.url
          suRouter.type = 'report'
        } else {
          if (viewComponents[cModule.moduleCode]) {
            suRouter.component = viewComponents[cModule.moduleCode]
          } else {
            suRouter.redirect = '/404'
          }
        }
        // 设置隐藏
        if (cModule.visible === 0) {
          suRouter.hidden = true
        }
        router.children.push(suRouter)
      })
    }
    routers.push(router)
  })
  // 最后加上 404 页面
  routers.push({ path: '*', redirect: '/404', hidden: true })
  return routers
}

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
