// token
export function getToken() {
  return sessionStorage.token
}

export function setToken(token) {
  sessionStorage.token = token
  sessionStorage.lastTokenTime = new Date()
  sessionStorage.errorTokenCount = 0
}

export function removeToken() {
  sessionStorage.removeItem('token')
  sessionStorage.removeItem('lastTokenTime')
  sessionStorage.removeItem('errorTokenCount')
}
