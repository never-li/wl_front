import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import NProgress from 'nprogress'
import store from '../store'
import * as auth from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 60000 // 请求超时时间
})
// request拦截器
service.interceptors.request.use(config => {
  store.dispatch('addLoadingDiv')
  const token = auth.getToken()
  if (token) {
    config.headers['x-access-token'] = token // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
     * returnCode为非0是抛错 可结合自己业务进行修改
     */
    NProgress.start()
    const res = response.data
    if (response.config.responseType === 'blob') {
      NProgress.done()
      store.dispatch('delLoadingDiv')
      return res
    }
    if (res.returnCode === 0) {
      NProgress.done()
      store.dispatch('delLoadingDiv')
      return res
    } else {
      NProgress.done()
      store.dispatch('delLoadingDiv')
      if (res.returnCode === 401) { // 401:Token 过期;
        MessageBox.alert(res.returnMsg, '提示', {
          confirmButtonText: '确定',
          callback: () => {
            auth.removeToken()
            location.reload()// 为了重新实例化vue-router对象 避免bug
          }
        })
      } else {
        Message({
          message: res.returnMsg,
          type: 'error',
          duration: 5 * 1000
        })
      }
      return Promise.reject()
    }
  },
  error => {
    store.dispatch('delAllLoadingDiv')
    console.log('err' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
