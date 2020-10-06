import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV !== 'production' ? '${url}' : '${url}',
  headers: { 'X-Access-Token': 'foo' },
})

export const request = axiosInstance.request

axiosInstance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  }
)
