import Cookies from 'js-cookie'
import { changet } from '@/api/login'
import { setToken } from '@/utils/auth'

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus'),
      withoutAnimation: false
    },
    device: 'desktop',
    tokenTimer: null// token刷新定时器
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 1)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SET_TOKEN_TIMER: (state, timer) => {
      state.tokenTimer = timer
    }
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    },
    CloseSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    ToggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    TokenTimer({ commit, state }) {
      if (state.tokenTimer) {
        clearInterval(state.tokenTimer)
      }
      const tokenTimer = setInterval(() => {
        // 上次获取token的时间
        const lastTokenTime = sessionStorage.lastTokenTime
        // 获取token错误次数
        const errorTokenCount = parseInt(sessionStorage.errorTokenCount)
        // 如果错误次数大于等于5，则停止获取
        if (errorTokenCount >= 5) {
          clearInterval(state.tokenTimer)
          return
        }
        // 时间差的毫秒数
        const timeDiffer = new Date().getTime() - new Date(lastTokenTime).getTime()
        // 计算相差分钟数
        const minutes = Math.floor(timeDiffer / (60 * 1000))
        // 时间差大于等于25分钟时，刷新token
        if (minutes >= 25) {
          changet().then(response => {
            setToken(response.token)
          }).catch(() => {
            sessionStorage.errorTokenCount = errorTokenCount + 1
          })
        }
      }, 60 * 1000)
      commit('SET_TOKEN_TIMER', tokenTimer)
    }
  }
}

export default app
