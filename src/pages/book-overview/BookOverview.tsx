import { useEffect, useState } from "react"
import { BookCard } from "../../components/book-card/BookCard"
import './BookOverview.css'
import type { Book, BookList } from "../../types/types"


const BookOverview: React.FC = () => {

    const [books, setBooks] = useState<Book[]>([]);

     useEffect(() => {
    fetch("http://localhost:3001/results")
      .then((res) => res.json())
      .then((data: BookList) => {
         const allBooks = data.lists.flatMap((category) => category.books);
        setBooks(allBooks)
        console.log(allBooks)
      });
  }, []);
  return (
    <div className="cards">
      {books.map((book) => (
        <BookCard key={book.title} book={book}/>
      ))}
    </div>

  )}
  
export default BookOverview;