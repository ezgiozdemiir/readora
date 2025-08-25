import { useMemo, useState } from 'react'
import { BookCard } from '../../components/book-card/BookCard'
import './BookOverview.scss'
import {
    DisplayName,
    type Book,
    type BookCategoryList,
    type LoaderData
} from '../../types/types'
import { useLoaderData, useNavigation } from 'react-router-dom'
// import { AxiosError } from 'axios'

const BookOverview: React.FC = () => {
    const allLabel = 'All'
    const { lists }: LoaderData = useLoaderData()

    const navigation = useNavigation()
    const categories = useMemo<(DisplayName | typeof allLabel)[]>(
        () => [allLabel, ...lists.map((c) => c.display_name as DisplayName)],
        [lists]
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
            return lists.flatMap((cat) => cat.books)
        }
        const cat = lists.find((c) => c.display_name === effectiveSelected)
        return cat ? cat.books : []
    }, [lists, effectiveSelected])

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
