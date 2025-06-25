import { Text } from '@mantine/core';
import { BookCard } from '../../components/book-card/BookCard';
import { useWishlistStore } from '../../store/wishlistStore';
import { useEffect, useState } from 'react';
import "./Profile.scss"

export const Profile: React.FC = () => {
  const setUser = useWishlistStore(state => state.setUser);
  const store = useWishlistStore();
  const wishlist = store.getWishlist();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      setUser(parsed.email);
    }
    setIsReady(true);
  }, [setUser]);

  if (!isReady) return null;

  const isAuthenticated = !!localStorage.getItem('user');

  if (!isAuthenticated) {
    return <Text>Please log in to view your wishlist.</Text>;
  }

  return (
    <div className='profile'>
      <h2>My Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        wishlist.map(book => <BookCard key={book.primary_isbn13} book={book} />)
      )}
    </div>
  );
};
