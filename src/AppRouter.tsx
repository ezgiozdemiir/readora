import React, { Suspense } from 'react';
import {
  createBrowserRouter,
  Outlet,
  redirect,
  RouterProvider,
} from 'react-router-dom';

import NavBar from './components/navigation/NavBar';
import BookOverview from './pages/book-overview/BookOverview';
import { Profile } from './pages/profile/Profile';
import { Login } from './pages/login/Login';
import { SignUp } from './pages/sign-up/SignUp';
import { NotFound } from './pages/not-found/NotFound';
import { bookOverviewLoader } from './service/bookOverviewService';
import BookOverviewError from './pages/book-overview/BookOverviewError';

const BookDetail = React.lazy(() => import('./pages/book-detail/BookDetail'));

function isAuthenticated() {
  const at = localStorage.getItem('authToken');
  const rt = localStorage.getItem('refreshToken');
  return !!(at && rt);
}

async function requireAuth() {
  if (!isAuthenticated()) {
    throw redirect('/login');
  }
  return null;
}

function RootLayout({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <NavBar />
        {children ?? <Outlet />}
    </>
  );
}

function RouteFallback() {
  return <div style={{ padding: '2rem', fontSize: '1.2rem' }}>Loading…</div>;
}

const router = createBrowserRouter([
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
    element: <RootLayout />, 
    loader: requireAuth,          
    children: [
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
    path: '*',
    element: (
      <RootLayout>
        <NotFound />
      </RootLayout>
    ),
  },
]},
{
    path: '*',
    loader: () => redirect('/login'),
  },
]);

const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
