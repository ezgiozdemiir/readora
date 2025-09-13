import { useCallback, useState } from 'react'
import axios from 'axios'
import axiosInstance from '../axiosInstance'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './useAuth'
import { useUser } from './useUser'

type LoginArgs = {
    username: string
    password: string
    redirectTo?: string | null
}

export function useLoginSubmit() {
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const { saveAuth } = useAuth()
    const { setUser } = useUser()

    const login = useCallback(
        async ({ username, password, redirectTo = '/books' }: LoginArgs) => {
            setError('')
            try {
                const res = await axiosInstance.post('/login', {
                    username: username.trim(),
                    password: password.trim(),
                })

                const { accessToken, refreshToken, user } = res.data
                saveAuth({ accessToken, refreshToken, user })
                setUser(user)

                if (redirectTo) navigate(redirectTo)
            } catch (e) {
                const msg = axios.isAxiosError(e)
                    ? (e.response?.data as any)?.error || 'Login failed'
                    : 'Unknown error occurred!'
                setError(msg)
            }
        },
        [navigate, saveAuth, setUser]
    )

    return { login, error, setError }
}
