import { useEffect, useMemo, useState } from 'react'
import { BookCard } from '../../components/book-card/BookCard'
import './BookOverview.scss'
import {
    BookCategoryList,
    DisplayName,
    type Book,
} from '../../types/types'
import { useNavigation } from 'react-router-dom'
import { bookOverviewLoader } from '../../service/bookOverviewService'

const BookOverview: React.FC = () => {
    const [books, setBooks] = useState<BookCategoryList[]>([])

    useEffect(() => {
         (async () => {
            try {
                const data = await bookOverviewLoader()
                setBooks(data.lists)
            } catch (error) {
                console.error("An error occured!")
            }
        })();
      
    }, [])

    const allLabel = 'All'

    const navigation = useNavigation()

    const categories = useMemo<(DisplayName | typeof allLabel)[]>(
        () => [allLabel, ...books.map((c) => c.display_name as DisplayName)],
        [books]
    )

    const [selectedCategory, setSelectedCategory] = useState<
        DisplayName | typeof allLabel
    >(allLabel)

    const effectiveSelected = useMemo<DisplayName | typeof allLabel>(() => {
        return categories.includes(selectedCategory)
            ? selectedCategory
            : allLabel
    }, [categories, selectedCategory])

    const filteredBooks = useMemo<Book[]>(() => {
        if (effectiveSelected === allLabel) {
            return books.flatMap((cat) => cat.books)
        }
        const cat = books.find((c) => c.display_name === effectiveSelected)
        return cat ? cat.books : []
    }, [books, effectiveSelected])

    const isRouting = navigation.state === 'loading'

    return (
        <div className="book-overview">
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
                {isRouting ? (
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
