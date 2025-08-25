import React, { Suspense, useEffect } from 'react'
import { MantineProvider } from '@mantine/core'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom'
import NavBar from './components/navigation/NavBar'
import BookOverview from './pages/book-overview/BookOverview'
import '@mantine/core/styles.css'
import { Profile } from './pages/profile/Profile'
import { Login } from './pages/login/Login'
import { SignUp } from './pages/sign-up/SignUp'
import { NotFound } from './pages/not-found/NotFound'
import { useWishlistStore } from './store/wishlistStore'
import { bookOverviewLoader } from './service/bookOverviewService'
import BookOverviewError from './pages/book-overview/BookOverviewError'

const BookDetail = React.lazy(() => import('./pages/book-detail/BookDetail'))

function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <NavBar />
            {children}
        </>
    )
}

function RouteFallback() {
    return <div style={{ padding: '2rem', fontSize: '1.2rem' }}>Loading…</div>
}

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <RootLayout>
                <BookOverview />
            </RootLayout>
        ),
        loader: bookOverviewLoader,
        errorElement: (
            <RootLayout>
                <BookOverviewError />
            </RootLayout>
        ),
    },
    {
        path: '/books/:productId',
        element: (
            <RootLayout>
                <Suspense fallback={<RouteFallback />}>
                    <BookDetail />
                </Suspense>
            </RootLayout>
        ),
    },
    {
        path: '/profile',
        element: (
            <RootLayout>
                <Profile />
            </RootLayout>
        ),
    },
    {
        path: '/login',
        element: (
            <RootLayout>
                <Login />
            </RootLayout>
        ),
    },
    {
        path: '/sign-up',
        element: (
            <RootLayout>
                <SignUp />
            </RootLayout>
        ),
    },
    {
        path: '*',
        element: (
            <RootLayout>
                <NotFound />
            </RootLayout>
        ),
    },
])

const App: React.FC = () => {
    const setUser = useWishlistStore((state) => state.setUser)
    useEffect(() => {
        const user = localStorage.getItem('user')
        if (user) {
            const parsed = JSON.parse(user)
            setUser(parsed.email)
        }
    }, [setUser])
    return (
        <MantineProvider defaultColorScheme="light">
            <RouterProvider router={router} />
        </MantineProvider>
    )
}

export default App
