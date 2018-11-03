/**
 * Created by jiachenpan on 16/11/18.
 */
import store from '../store'

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

/**
 * 通过菜单代码找到对应的路径
 * @param code moduleCode
 * @returns {string}
 */
export function findPathByModuleCode(code) {
  const routers = store.getters.permission_routers
  let path = ''
  for (const index in routers) {
    const route = routers[index]
    if (route.meta && code === route.meta.code) {
      path = route.path
      break
    } else if (route.children) {
      const cRouter = route.children.find(r => {
        return r.meta && code === r.meta.code
      })
      if (cRouter) {
        path = route.path + '/' + cRouter.path
      }
    }
  }
  return path
}

/**
 * 计算两个日期间的天数,包含起止
 * @param startDate
 * @param endDate
 * @returns {number}
 * @constructor
 */
export function GetDateRange(startDate, endDate) {
  const startTime = new Date(Date.parse(startDate.replace(/-/g, '/'))).getTime()
  const endTime = new Date(Date.parse(endDate.replace(/-/g, '/'))).getTime()

  // 计算出相差天数 + 1
  const days = Math.floor((endTime - startTime) / (24 * 3600 * 1000))

  return days
}

/**
 * 将时间字符串转为date
 * @param data
 * @returns {Date}
 */
export function transferDate(data) {
  const start_time = data
  const newTime = start_time.replace(/-/g, '-')
  const transferdate = new Date(newTime)
  return transferdate
}

/**
 * 增加天数
 * @param date
 * @param day
 * @returns {string}
 */
export function dateAdd(date, days) {
  // 增加day
  const newDate = DateAdd('d ', days, date)
  // 处理月份和天
  const month = (newDate.getMonth() + 1) > 9 ? (newDate.getMonth() + 1) : '0' + (newDate.getMonth() + 1)
  const day = newDate.getDate() > 9 ? newDate.getDate() : '0' + newDate.getDate()
  const currentdate = date.getFullYear() + '-' + month + '-' + day
  return currentdate
}

export function DateAdd(interval, number, date) {
  switch (interval) {
    case 'd ': {
      date.setDate(date.getDate() + number)
      return date
    }
    default: {
      date.setDate(date.getDate() + number)
      return date
    }
  }
}

/**
 * 获取当前日期 yyyy-mm-dd
 * @returns {string}
 */
export function getNowFormatDate() {
  const date = new Date()
  const seperator1 = '-'

  let month = date.getMonth() + 1
  let strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  return date.getFullYear() + seperator1 + month + seperator1 + strDate
}

/**
 * 获当前日期时分 yyyy-mm-dd hh:mi
 * @returns {string}
 */
export function getNowFormatMinTime() {
  const date = new Date()
  const seperator1 = '-'
  const seperator2 = ':'
  let month = date.getMonth() + 1
  let hours = date.getHours()
  let minutes = date.getMinutes()
  let strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  if (hours >= 0 && hours <= 9) {
    hours = '0' + hours
  }
  if (minutes >= 0 && minutes <= 9) {
    minutes = '0' + minutes
  }
  return date.getFullYear() + seperator1 + month + seperator1 + strDate +
    ' ' + hours + seperator2 + minutes
}

/**
 * 获取当前的前一个月日期
 * @returns {string}
 */
export function getAdvFormatDate() {
  const date = new Date(new Date() - 60 * 60 * 24 * 1000 * 30)
  let strDate = date.getDate()
  const seperator1 = '-'
  let month = date.getMonth() + 1
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  const currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
  return currentdate
}

/**
 * 日期格式化 dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
 * @param {DateObject, String}
 * @returns {string}
 * */

export const dateFormat = (dateObject, fmt) => {
  const o = {
    'M+': dateObject.getMonth() + 1,
    'd+': dateObject.getDate(),
    'h+': dateObject.getHours(),
    'm+': dateObject.getMinutes(),
    's+': dateObject.getSeconds(),
    'q+': Math.floor((dateObject.getMonth() + 3) / 3),
    'S': dateObject.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (dateObject.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

export function leastWeekDate() {
  const end = new Date()
  const start = new Date()
  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
  const dateArr = [start, end]
  return dateArr
}

export function doPrint(target, url, id) {
  var temp_form = document.createElement('form')
  // temp_form.action = postData.url;
  temp_form.action = url
  temp_form.target = target
  temp_form.method = 'post'
  temp_form.style.display = 'none'
  var hideInput1 = document.createElement('input')
  hideInput1.type = 'hidden'
  hideInput1.name = 'x-token'
  hideInput1.value = sessionStorage.token

  var hideInput2 = document.createElement('input')
  hideInput2.type = 'hidden'
  hideInput2.name = 'billid'
  hideInput2.value = id

  // var hideInput3 = document.createElement("input");
  // hideInput3.type = "hidden";
  // hideInput3.name = "billtype";
  // hideInput3.value = postData.billtype;

  temp_form.appendChild(hideInput1)
  temp_form.appendChild(hideInput2)
  // temp_form.appendChild(hideInput3);
  document.body.appendChild(temp_form)
  temp_form.submit()
  document.body.removeChild(temp_form)
}

export function doBatchPrint(target, url, reportlets) {
  var temp_form = document.createElement('form')
  temp_form.action = url
  temp_form.target = target
  temp_form.method = 'post'
  temp_form.style.display = 'none'
  var hideInput1 = document.createElement('input')
  hideInput1.type = 'hidden'
  hideInput1.name = 'x-token'
  hideInput1.value = sessionStorage.token

  var hideInput2 = document.createElement('input')
  hideInput2.type = 'hidden'
  hideInput2.name = 'reportlets'
  hideInput2.value = reportlets

  temp_form.appendChild(hideInput1)
  temp_form.appendChild(hideInput2)
  document.body.appendChild(temp_form)
  temp_form.submit()
  document.body.removeChild(temp_form)
}

/**
 * 简单复制对象
 * @param obj 原对象
 * @returns {any} 新对象
 */
export function copyObject(obj) {
  return JSON.parse(JSON.stringify(obj))
}

