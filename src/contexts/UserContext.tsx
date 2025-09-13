import React, { createContext, useState, useEffect } from 'react'

type User = {
    username: string
}

type UserContextType = {
    user: User | null
    setUser: (user: User | null) => void
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const raw = localStorage.getItem('user')
        if (raw) {
            try {
                setUser(JSON.parse(raw))
            } catch {
                setUser(null)
            }
        }
    }, [])

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}
