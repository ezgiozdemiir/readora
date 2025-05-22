import { BookCard } from "../../components/book-card/BookCard";
import { useWishlistStore } from "../../store/wishlistStore";

export const Profile: React.FC = () => {
      const wishlist = useWishlistStore((state) => state.wishlist);
return(
    <div>Profile Page Works!
      <div className="cards">
      <h2>My Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        wishlist.map((book) => <BookCard key={book.primary_isbn13} book={book} />)
      )}
    </div></div>
)
}