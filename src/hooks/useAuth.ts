import { useCallback, useState } from 'react'

export type AuthUser = {
    email: string
    id: number
    username: string
}

const STORAGE = {
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    user: 'user',
}

function readFromStorage<T = unknown>(key: string): T | null {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    try {
        return JSON.parse(raw)
    } catch {
        return raw as unknown as T
    }
}

function writeToStorage(key: string, value: unknown) {
    if (typeof value === 'string') {
        localStorage.setItem(key, value)
    } else {
        localStorage.setItem(key, JSON.stringify(value))
    }
}

function clearStorage() {
    localStorage.removeItem(STORAGE.accessToken)
    localStorage.removeItem(STORAGE.refreshToken)
    localStorage.removeItem(STORAGE.user)
}

export function useAuth() {
    const [accessToken, setAccessToken] = useState<string | null>(() => {
        const readValue = readFromStorage<string>(STORAGE.accessToken)
        return typeof readValue === 'string' ? readValue : null
    })

    const [refreshToken, setRefreshToken] = useState<string | null>(() => {
        const readValue = readFromStorage<string>(STORAGE.refreshToken)
        return typeof readValue === 'string' ? readValue : null
    })

    const [user, setUser] = useState<AuthUser | null>(() => {
        const readValue = readFromStorage<AuthUser>(STORAGE.user)
        return readValue ?? null
    })

    const isAuthenticated = !!accessToken

    const saveAuth = useCallback(
        (payload: {
            accessToken: string
            refreshToken?: string
            user?: AuthUser
        }) => {
            const { accessToken, refreshToken, user } = payload

            setAccessToken(accessToken)
            writeToStorage(STORAGE.accessToken, accessToken)

            if (typeof refreshToken === 'string') {
                setRefreshToken(refreshToken)
                writeToStorage(STORAGE.refreshToken, refreshToken)
            }
            if (user) {
                setUser(user)
                writeToStorage(STORAGE.user, user)
            }
        },
        []
    )

    const logout = useCallback(() => {
        setAccessToken(null)
        setRefreshToken(null)
        setUser(null)
        clearStorage()
    }, [])

    return {
        user,
        accessToken,
        refreshToken,
        isAuthenticated,
        saveAuth,
        logout,
    }
}
