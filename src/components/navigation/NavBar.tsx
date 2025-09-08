import React, { useEffect, useState } from 'react'
import { Container, Group, Button, Text } from '@mantine/core'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../../assets/Readora.png'
import './NavBar.scss'
import { User } from '../../types/types'

const NavBar: React.FC = () => {
    const [user, setUser] = useState<User | null>(null)
    const navigate = useNavigate()
    const location = useLocation()
    useEffect(() => {
        try {
            const raw = localStorage.getItem('user')
            setUser(raw ? (JSON.parse(raw) as User) : null)
        } catch {
            setUser(null)
        }
    }, [location.pathname])

    const handleLogout = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        setUser(null)
        navigate('/')
    }

    return (
        <Container className="navbar">
            <Group>
                <Link to="/">
                    <img src={logo} alt="readora" />
                </Link>
                <Button
                    component={Link}
                    to="/books"
                    variant="light"
                    color="blue"
                >
                    Books
                </Button>
                <Button
                    component={Link}
                    to="/profile"
                    variant="light"
                    color="blue"
                >
                    Profile
                </Button>
                {!user && (
                    <Button
                        component={Link}
                        to="/login"
                        variant="light"
                        color="blue"
                    >
                        Login
                    </Button>
                )}

                {user && (
                    <>
                        <Button
                            onClick={handleLogout}
                            variant="light"
                            color="red"
                        >
                            Logout
                        </Button>
                        <Text fw={600} size="sm">
                            Welcome {user.username}!
                        </Text>
                    </>
                )}
            </Group>
        </Container>
    )
}

export default NavBar
