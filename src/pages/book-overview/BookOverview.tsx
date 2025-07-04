import { useEffect, useState } from 'react'
import { BookCard } from '../../components/book-card/BookCard'
import './BookOverview.scss'
import type { Book, BookList } from '../../types/types'

const BookOverview: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        fetch('http://localhost:3001/results')
            .then((res) => res.json())
            .then((data: BookList) => {
                const allBooks = data.lists.flatMap(
                    (category) => category.books
                )
                setBooks(allBooks)
                setLoading(false)
                console.log(allBooks)
            })
            .catch((err) => {
                console.error('Fetch failed', err)
                setLoading(false)
            })
    }, [])
    return (
        <div className="cards">
            {loading ? (
                <p className='loading'>Loading books...</p>
            ) : (
                books.map((book) => (
                    <BookCard key={book.primary_isbn13} book={book} />
                ))
            )}
        </div>
    )
}

export default BookOverview
