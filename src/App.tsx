import React from 'react';
import { MantineProvider } from '@mantine/core'; // Import MantineProvider
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NavBar from './components/NavBar';

const App: React.FC = () => {
  return (
    <MantineProvider  >
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
};

export default App;
