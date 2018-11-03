import * as commondata from '@/api/commondata'

const user = {
  state: {
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    userInfo: {},
    memberList: [],
    storeList: [],
    factoryList: [],
    typeList: [],
    sortList: [],
    gradeList: [],
    feeconfigList: [],
    bankList: [],
    specList: [],
    userList: [],
    customerList: [],
    machtypeList: [],
    machineList: [],
    feetypeList: [],
    memberGroupList: [],
    systemparmMap: {},
    receivers: [],
    craners: [],
    handors: [],
    packRemarks: []
  },

  mutations: {
    SET_USER_INFO: (state, data) => {
      state.userInfo = data
    },
    SET_MEMBER: (state, data) => {
      state.memberList = data
    },
    SET_STORE: (state, data) => {
      state.storeList = data
    },
    SET_FACTORY: (state, data) => {
      state.factoryList = data
    },
    SET_TYPE: (state, data) => {
      state.typeList = data
    },
    SET_SORT: (state, data) => {
      state.sortList = data
    },
    SET_GRADE: (state, data) => {
      state.gradeList = data
    },
    SET_FEECONFIG: (state, data) => {
      state.feeconfigList = data
    },
    SET_BANK: (state, data) => {
      state.bankList = data
    },
    SET_SPEC: (state, data) => {
      state.specList = data
    },
    SET_USER: (state, data) => {
      state.userList = data
    },
    SET_CUSTOMER: (state, data) => {
      state.customerList = data
    },
    SET_MACHTYPE: (state, data) => {
      state.machtypeList = data
    },
    SET_MACHINE: (state, data) => {
      state.machineList = data
    },
    SET_FEETYPE: (state, data) => {
      state.feetypeList = data
    },
    SET_MEMBERGROUP: (state, data) => {
      state.memberGroupList = data
    },
    SET_SYSTEMPARM: (state, data) => {
      state.systemparmMap = data
    },
    SET_RECEIVERS: (state, data) => {
      state.receivers = data
    },
    SET_CRANERS: (state, data) => {
      state.craners = data
    },
    SET_HANDORS: (state, data) => {
      state.handors = data
    },
    SET_PACKREMARKS: (state, data) => {
      state.packRemarks = data
    }
  },

  actions: {
    // 获取用户信息
    UserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        commondata.userinfo().then(response => {
          commit('SET_USER_INFO', response.userInfo)
          resolve(response)
        }).catch(error => {
          commit('SET_USER_INFO', {})
          reject(error)
        })
      })
    },
    // 获取仓库会员
    Member({ commit, state }) {
      return new Promise((resolve, reject) => {
        commondata.member().then(response => {
          commit('SET_MEMBER', response.memberList)
          resolve()
        }).catch(error => {
          commit('SET_MEMBER', [])
          reject(error)
        })
      })
    },
    // 获取仓库
    Store({ commit, state }) {
      return new Promise((resolve, reject) => {
        commondata.store().then(response => {
          commit('SET_STORE', response.storeList)
          resolve()
        }).catch(error => {
          commit('SET_STORE', [])
          reject(error)
        })
      })
    },
    // 获取钢厂
    Factory({ commit, state }) {
      return new Promise((resolve, reject) => {
        commondata.factory().then(response => {
          commit('SET_FACTORY', response.factoryList)
          resolve()
        }).catch(error => {
          commit('SET_FACTORY', [])
          reject(error)
        })
      })
    },
    // 获取品名
    Type({ commit, state }) {
      return new Promise((resolve, reject) => {
        commondata.type().then(response => {
          commit('SET_TYPE', response.typeList)
          resolve()
        }).catch(error => {
          commit('SET_TYPE', [])
          reject(error)
        })
      })
    },
    // 获取类别
    Sort({ commit, state }) {
      return new Promise((resolve, reject) => {
        commondata.sort().then(response => {
          commit('SET_SORT', response.sortList)
          resolve()
        }).catch(error => {
          commit('SET_SORT', [])
          reject(error)
        })
      })
    },
    // 获取钢号
    Grade({ commit, state }) {
      return new Promise((resolve, reject) => {
        commondata.grade().then(response => {
          commit('SET_GRADE', response.gradeList)
          resolve()
        }).catch(error => {
          commit('SET_GRADE', [])
          reject(error)
        })
      })
    },
    // 获取费用类别
    Feeconfig({ commit, state }) {
      return new Promise((resolve, reject) => {
        commondata.feeconfig().then(response => {
          commit('SET_FEECONFIG', response.feeConfigList)
          resolve()
        }).catch(error => {
          commit('SET_FEECONFIG', [])
          reject(error)
        })
      })
    },
    // 获取银行
    Bank({ commit, state }) {
      return new Promise((resolve, reject) => {
        commondata.bank().then(response => {
          commit('SET_BANK', response.bankList)
          resolve()
        }).catch(error => {
          commit('SET_BANK', [])
          reject(error)
        })
      })
    },
    // 获取规格
    Spec({ commit, state }) {
      return new Promise((resolve, reject) => {
        commondata.spec().then(response => {
          commit('SET_SPEC', response.specList)
          resolve()
        }).catch(error => {
          commit('SET_SPEC', [])
          reject(error)
        })
      })
    },
    // 获取用户
    User({ commit, state }) {
      return new Promise((resolve, reject) => {
        commondata.user().then(response => {
          commit('SET_USER', response.userList)
          resolve()
        }).catch(error => {
          commit('SET_USER', [])
          reject(error)
        })
      })
    },
    // 获取客户
    Customer({ commit, state }) {
      return new Promise((resolve, reject) => {
        commondata.customer().then(response => {
          commit('SET_CUSTOMER', response.customerList)
          resolve()
        }).catch(error => {
          commit('SET_CUSTOMER', [])
          reject(error)
        })
      })
    },
    // 获取加工机台（加工类型）
    Machtype({ commit, state }) {
      return new Promise((resolve, reject) => {
        commondata.machtype().then(response => {
          commit('SET_MACHTYPE', response.machtypeList)
          resolve()
        }).catch(error => {
          commit('SET_MACHTYPE', [])
          reject(error)
        })
      })
    },
    // 获取加工机组
    Machine({ commit, state }) {
      return new Promise((resolve, reject) => {
        commondata.machine().then(response => {
          commit('SET_MACHINE', response.machineList)
          resolve()
        }).catch(error => {
          commit('SET_MACHINE', [])
          reject(error)
        })
      })
    },
    // 获取费用内容
    Feetype({ commit, state }) {
      return new Promise((resolve, reject) => {
        commondata.feetype().then(response => {
          commit('SET_FEETYPE', response.list)
          resolve()
        }).catch(error => {
          commit('SET_FEETYPE', [])
          reject(error)
        })
      })
    },
    // 获取集团
    MemberGroup({ commit, state }) {
      return new Promise((resolve, reject) => {
        commondata.membergroup().then(response => {
          commit('SET_MEMBERGROUP', response.groupList)
          resolve()
        }).catch(error => {
          commit('SET_MEMBERGROUP', [])
          reject(error)
        })
      })
    },
    // 获取全部系统参数
    Systemparm({ commit, state }) {
      return new Promise((resolve, reject) => {
        commondata.systemparm().then(response => {
          commit('SET_SYSTEMPARM', response.systemparmMap)
          resolve()
        }).catch(error => {
          commit('SET_SYSTEMPARM', {})
          reject(error)
        })
      })
    },
    // 获取收发货员
    Receivers({ commit, state }) {
      return new Promise((resolve, reject) => {
        commondata.receivers().then(response => {
          commit('SET_RECEIVERS', response.userList)
          resolve()
        }).catch(error => {
          commit('SET_RECEIVERS', [])
          reject(error)
        })
      })
    },
    // 获取吊机工
    Craners({ commit, state }) {
      return new Promise((resolve, reject) => {
        commondata.craners().then(response => {
          commit('SET_CRANERS', response.craners)
          resolve()
        }).catch(error => {
          commit('SET_CRANERS', [])
          reject(error)
        })
      })
    },
    // 获取装卸工
    Handors({ commit, state }) {
      return new Promise((resolve, reject) => {
        commondata.handors().then(response => {
          commit('SET_HANDORS', response.handors)
          resolve()
        }).catch(error => {
          commit('SET_HANDORS', [])
          reject(error)
        })
      })
    },
    // 获取包装备注
    Packremarks({ commit, state }) {
      return new Promise((resolve, reject) => {
        commondata.packremark().then(response => {
          commit('SET_PACKREMARKS', response.packRemarks)
          resolve()
        }).catch(error => {
          commit('SET_PACKREMARKS', [])
          reject(error)
        })
      })
    }
  }
}

export default user
