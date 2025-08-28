import React, { useEffect } from 'react';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

import AppRouter from './AppRouter';
import { useWishlistStore } from './store/wishlistStore';

const App: React.FC = () => {
  const setUser = useWishlistStore((state) => state.setUser);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      setUser(parsed.email);
    }
  }, [setUser]);

  return (
    <MantineProvider defaultColorScheme="light">
      <AppRouter />
    </MantineProvider>
  );
};

export default App;
