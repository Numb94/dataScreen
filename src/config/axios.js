import axios from 'axios'
axios.defaults.timeout = 10000
//返回其他状态吗
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500 // 默认的
}
//跨域请求，允许保存cookie
axios.defaults.withCredentials = true
// NProgress Configuration
NProgress.configure({
  showSpinner: false
})
//HTTPrequest拦截
axios.interceptors.request.use(
  config => {
    const meta = config.meta || {}
    const isToken = meta.isToken === false
    if (getToken() && !isToken) {
      config.headers['access_token'] = '' // 让每个请求携带token--['Authorization']为自定义key 请根据实际情况自行修改
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
//HTTPresponse拦截
axios.interceptors.response.use(
  res => {
    return res
  },
  error => {
    return Promise.reject(new Error(error))
  }
)

export default axios
