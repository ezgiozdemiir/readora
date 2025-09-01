import axios, {
    AxiosError,
    AxiosResponse,
    type InternalAxiosRequestConfig,
} from 'axios'
type RetryableRequest = InternalAxiosRequestConfig & { _retry?: boolean }
export const axiosInstance = axios.create({
    baseURL: `http://${window.location.hostname}:4000`,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
})

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const accessToken = localStorage.getItem('accessToken')
        if (accessToken) {
            config.headers = config.headers ?? {}
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetryableRequest | undefined
        if (!originalRequest || !error.response) {
            return Promise.reject(error)
        }

        const status = error.response.status

        if ((status === 401 || status === 403) && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const refreshToken = localStorage.getItem('refreshToken')
                if (!refreshToken) throw new Error('No refresh token')

                const refreshResponse = await axios.post(
                    `http://${window.location.hostname}:4000/token/refresh`,
                    { refreshToken },
                    { headers: { 'Content-Type': 'application/json' } }
                )

                const {
                    accessToken: newaccessToken,
                    refreshToken: newRefreshToken,
                } = (refreshResponse.data ?? {}) as {
                    accessToken: string
                    refreshToken?: string
                }

                if (!newaccessToken)
                    throw new Error('No accessToken in refresh response')

                localStorage.setItem('accessToken', newaccessToken)
                if (newRefreshToken)
                    localStorage.setItem('refreshToken', newRefreshToken)

                originalRequest.headers = originalRequest.headers ?? {}
                originalRequest.headers.Authorization = `Bearer ${newaccessToken}`

                return axiosInstance(originalRequest)
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError)
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)
export default axiosInstance
