import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import BookOverview from './pages/book-overview/BookOverview'
import { Profile } from './pages/profile/Profile'
import { Login } from './pages/login/Login'
import { SignUp } from './pages/sign-up/SignUp'
import { NotFound } from './pages/not-found/NotFound'
import RootLayout from './RootLayout'
import Home from './pages/home/Home'
import ProtectedRoute from './ProtectedRoute'
const BookDetail = React.lazy(() => import('./pages/book-detail/BookDetail'))

//ROUTER REFACTORING W/MAXIMILLIAN'S REACT VIDEO
//RouteLayout wrapper of the child elements, parent
//Absolute paths --> all routes starts with "/", Relative paths --> begins witout /, only begins '' or 'products' (texts)
//Home is the home page and path:'/' is same as index:true

const router = createBrowserRouter([
    {
        path: '/',
        errorElement: <NotFound />,
        children: [{ index: true, element: <Home /> }],
    },
    {
        element: <RootLayout />,
        children: [
            { path: 'login', element: <Login /> },
            {
                path: '',
                element: <ProtectedRoute />,
                children: [
                    { path: 'profile', element: <Profile /> },
                    { path: 'books', element: <BookOverview /> },
                    { path: 'books/:productId', element: <BookDetail /> },
                    { path: 'sign-up', element: <SignUp /> },
                    {
                        path: '*',
                        element: <NotFound />,
                    },
                ],
            },
        ],
    },
])

const AppRouter: React.FC = () => {
    return <RouterProvider router={router} />
}

export default AppRouter
