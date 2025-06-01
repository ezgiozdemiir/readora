import React, { Suspense } from 'react'
import { MantineProvider } from '@mantine/core'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NavBar from './components/navigation/NavBar'
import BookOverview from './pages/book-overview/BookOverview'
import '@mantine/core/styles.css'
import { Profile } from './pages/profile/Profile'
import { Login } from './pages/login/Login'
import { SignUp } from './pages/sign-up/SignUp'
import { NotFound } from './pages/not-found/NotFound'

const BookDetail = React.lazy(() => import('./pages/book-detail/BookDetail'))

const App: React.FC = () => {
    return (
        <MantineProvider defaultColorScheme="light">
            <Router>
                <NavBar />
                <Routes>
                    <Route path="/" element={<BookOverview />} />
                    <Route
                        path="/books/:productId"
                        element={
                            <Suspense
                                fallback={
                                    <div
                                        style={{
                                            padding: '2rem',
                                            fontSize: '1.2rem',
                                        }}
                                    >
                                        Loading book details...
                                    </div>
                                }
                            >
                                <BookDetail />
                            </Suspense>
                        }
                    />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </MantineProvider>
    )
}

export default App
