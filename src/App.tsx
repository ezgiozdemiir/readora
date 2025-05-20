import React, { Suspense } from 'react';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/navigation/NavBar';
import BookOverview from './pages/book-overview/BookOverview';
import '@mantine/core/styles.css';
import { Profile } from './pages/profile/Profile';
import { Login } from './pages/login/Login';

const BookDetail = React.lazy(() => import('./pages/book-detail/BookDetail'));

const App: React.FC = () => {
  return (
    <MantineProvider defaultColorScheme="light" >
      <Router>
        <NavBar />
        <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path='/' element={<BookOverview/>} />
          <Route path='/books/:productId' element={<BookDetail/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/login' element={<Login/>}/>
        </Routes>
        </Suspense>
      </Router>
    </MantineProvider>
  );
};

export default App;
