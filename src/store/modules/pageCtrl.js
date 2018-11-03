/**
 * state 中命名名称要与路由中的命名一致
 * */

const pageCtrl = {
  state: {
    pickUpGoods: 'home',
    transferStore: 'home'
  },
  mutations: {
    SET_PICK_UP_GOODS_PAGE: (state, data) => { // 提货管理页面控制器
      state.pickUpGoods = data
    },
    SET_TRANSFER_STORE_PAGE: (state, data) => {
      state.transferStore = data
    },
    INIT_PAGECTRL: (state, moduleName) => { // 初始化页面控制器
      state[moduleName] = 'home'
    }
  }
}

export default pageCtrl
