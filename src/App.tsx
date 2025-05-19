import React from 'react';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NavBar from './components/NavBar';
import BookOverview from './pages/book-overview/BookOverview';
import '@mantine/core/styles.css';

const App: React.FC = () => {
  return (
    <MantineProvider defaultColorScheme="light" >
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path='/books' element={<BookOverview/>} />
        </Routes>
      </Router>
    </MantineProvider>
  );
};

export default App;
