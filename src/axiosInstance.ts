import axios, { type InternalAxiosRequestConfig } from 'axios'

export const axiosInstance = axios.create({
    baseURL: `http://${window.location.hostname}:4000`,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
})

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('authToken')
        if (token) {
            config.headers = config.headers ?? {}
            ;(config.headers as any).Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

export default axiosInstance
