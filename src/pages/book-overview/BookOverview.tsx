import { useEffect, useState } from 'react'
import { BookCard } from '../../components/book-card/BookCard'
import './BookOverview.scss'
import {
    DisplayName,
    type Book,
    type BookCategoryList,
    type BookList,
} from '../../types/types'

const BookOverview: React.FC = () => {
    const allLabel = "All"
    const [categories, setCategories] = useState<(DisplayName | "All")[]>([])
    const [selectedCategory, setSelectedCategory] =
        useState<DisplayName | "All">()
    const [allCategories, setAllCategories] = useState<BookCategoryList[]>([])
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('http://localhost:3001/results')
            .then((res) => res.json())
            .then((data: BookList) => {
                setAllCategories(data.lists)
                const categoryNames = data.lists.map((cat) => cat.display_name)
                setCategories([allLabel, ...categoryNames])
                setSelectedCategory(allLabel)
                setLoading(false)
            })
            .catch((err) => {
                console.error('Fetch failed', err)
                setLoading(false)
            })
    }, [])

    useEffect(() => {
        if (!selectedCategory) {
            setFilteredBooks([])
            return
        }
        setLoading(true)
       if (selectedCategory === allLabel) {
            const allBooks = allCategories.flatMap(cat => cat.books)
            setFilteredBooks(allBooks)
        } else {
            const category = allCategories.find((cat) => cat.display_name === selectedCategory)
            setFilteredBooks(category ? category.books : [])
        }
        setLoading(false)
    }, [selectedCategory, allCategories])

    return (
        <div className='book-overview'>
            <div className="category-buttons">
                <h3>Filter Book Types: </h3>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={selectedCategory === cat ? 'active' : ''}
                        style={{ margin: '0.5rem', padding: '0.5rem' }}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            <div className="cards">
                {loading ? (
                    <p className="loading">Loading books...</p>
                ) : (
                    filteredBooks.map((book) => (
                        <BookCard key={book.primary_isbn13} book={book} />
                    ))
                )}
            </div>
        </div>
    )
}

export default BookOverview
