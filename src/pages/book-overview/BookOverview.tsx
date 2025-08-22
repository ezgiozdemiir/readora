import { useEffect, useState } from 'react'
import { BookCard } from '../../components/book-card/BookCard'
import './BookOverview.scss'
import {
    DisplayName,
    type Book,
    type BookCategoryList,
    type BookList,
} from '../../types/types'
import {axiosInstance} from '../../axiosInstance'
import { useNavigate } from 'react-router-dom'

const BookOverview: React.FC = () => {
    const allLabel = "All"
    const [categories, setCategories] = useState<(DisplayName | "All")[]>([])
    const [selectedCategory, setSelectedCategory] =
        useState<DisplayName | "All">()
    const [allCategories, setAllCategories] = useState<BookCategoryList[]>([])
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
    const [loading, setLoading] = useState(true)
      const [error, setError] = useState<string | null>(null);
      const navigate = useNavigate();

useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get('/books');
        if (!alive) return;

        const data = res.data as { lists: BookCategoryList[] };
        setAllCategories(data.lists);

        const names = data.lists.map((c) => c.display_name as DisplayName);
        setCategories([allLabel, ...names]);
        setSelectedCategory(allLabel);
      } catch (e: any) {
        if (e?.response?.status === 401 || e?.response?.status === 403) {
          navigate('/login');
          return;
        }
        setError(e?.response?.data?.error || e?.message || 'Failed to load books');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [navigate]);


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
