import { renderHook, act } from '@testing-library/react'
import { useAuth } from './useAuth'
import { User } from '../types/types'

const STORAGE = {
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    user: 'user',
}

const setLocalStorage = (key: string, value: string | User) =>
    localStorage.setItem(
        key,
        typeof value === 'string' ? value : JSON.stringify(value)
    )

describe('useAuth', () => {
    beforeEach(() => {
        localStorage.clear()
        jest.restoreAllMocks()
    })

    test('reads initial values from localStorage', () => {
        const user = { id: 1, email: 'admin@example.com', username: 'admin' }
        setLocalStorage(STORAGE.accessToken, 'AAAA')
        setLocalStorage(STORAGE.refreshToken, 'BBBB')
        setLocalStorage(STORAGE.user, user)

        const { result } = renderHook(() => useAuth())

        expect(result.current.accessToken).toBe('AAAA')
        expect(result.current.refreshToken).toBe('BBBB')
        expect(result.current.user).toEqual(user)
        expect(result.current.isAuthenticated).toBe(true)
    })

    test('saveAuth sets access/refresh/user to state and storage', () => {
        const { result } = renderHook(() => useAuth())
        const payload = {
            accessToken: 'A1',
            refreshToken: 'B1',
            user: { id: 1, email: 'admin@example.com', username: 'admin' },
        }

        act(() => {
            result.current.saveAuth(payload)
        })

        expect(result.current.accessToken).toBe('A1')
        expect(result.current.refreshToken).toBe('B1')
        expect(result.current.user).toEqual(payload.user)
        expect(result.current.isAuthenticated).toBe(true)

        expect(localStorage.getItem(STORAGE.accessToken)).toBe('A1')
        expect(localStorage.getItem(STORAGE.refreshToken)).toBe('B1')
        expect(JSON.parse(localStorage.getItem(STORAGE.user)!)).toEqual(
            payload.user
        )
    })

    test('saveAuth with partial payload does not overwrite refreshToken/user when omitted', () => {
        setLocalStorage(STORAGE.refreshToken, 'OLD_R')
        setLocalStorage(STORAGE.user, {
            id: 1,
            email: 'old@x.com',
            username: 'old',
        })

        const { result } = renderHook(() => useAuth())

        act(() => {
            result.current.saveAuth({ accessToken: 'NEW_A' })
        })

        expect(result.current.accessToken).toBe('NEW_A')
        expect(result.current.refreshToken).toBe('OLD_R')
        expect(result.current.user).toEqual({
            id: 1,
            email: 'old@x.com',
            username: 'old',
        })
        expect(result.current.isAuthenticated).toBe(true)

        expect(localStorage.getItem(STORAGE.accessToken)).toBe('NEW_A')
        expect(localStorage.getItem(STORAGE.refreshToken)).toBe('OLD_R')
        expect(JSON.parse(localStorage.getItem(STORAGE.user)!)).toEqual({
            id: 1,
            email: 'old@x.com',
            username: 'old',
        })
    })

    test('logout clears state and storage', () => {
        setLocalStorage(STORAGE.accessToken, 'TOK')
        setLocalStorage(STORAGE.refreshToken, 'REF')
        setLocalStorage(STORAGE.user, {
            id: 99,
            email: 'x@y.com',
            username: 'name',
        })

        const { result } = renderHook(() => useAuth())

        act(() => {
            result.current.logout()
        })

        expect(result.current.accessToken).toBeNull()
        expect(result.current.refreshToken).toBeNull()
        expect(result.current.user).toBeNull()
        expect(result.current.isAuthenticated).toBe(false)

        expect(localStorage.getItem(STORAGE.accessToken)).toBeNull()
        expect(localStorage.getItem(STORAGE.refreshToken)).toBeNull()
        expect(localStorage.getItem(STORAGE.user)).toBeNull()
    })

    test('isAuthenticated reflects accessToken presence', () => {
        const { result: r1 } = renderHook(() => useAuth())
        expect(r1.current.isAuthenticated).toBe(false)

        act(() => {
            r1.current.saveAuth({ accessToken: 'X' })
        })
        expect(r1.current.isAuthenticated).toBe(true)

        act(() => {
            r1.current.logout()
        })
        expect(r1.current.isAuthenticated).toBe(false)
    })
})
