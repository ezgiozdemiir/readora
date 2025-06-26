import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Book, BookList } from '../../types/types'
import { Group, Skeleton } from '@mantine/core'
import './BookDetail.scss'

const BookDetail: React.FC = () => {
    const { productId } = useParams<{ productId: string }>()
    const [book, setBook] = useState<Book | null>(null)

    useEffect(() => {
        fetch('http://localhost:3001/results')
            .then((res) => res.json())
            .then((data: BookList) => {
                const allBooks = data.lists.flatMap(
                    (category) => category.books
                )
                const found = allBooks.find(
                    (b) => b.primary_isbn13 === productId
                )
                setBook(found ?? null)
            })
    }, [productId])

    if (!book) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 flex justify-center">
                        <Skeleton height={240} width={160} radius="md" />
                    </div>
                    <div className="md:col-span-2 space-y-4">
                        <Skeleton height={32} width="60%" radius="sm" />
                        <Skeleton height={24} width="40%" radius="sm" />
                        <Skeleton height={80} width="100%" radius="sm" />
                        <Group gap="sm">
                            <Skeleton height={36} width={100} radius="xl" />
                            <Skeleton height={36} width={100} radius="xl" />
                            <Skeleton height={36} width={100} radius="xl" />
                        </Group>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 book-detail-root">
            <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6 grid grid-cols-1 md:grid-cols-3 gap-8 main-container">
                <div className="md:col-span-1 flex justify-center image-section">
                    <img
                        src={book.book_image}
                        alt={book.title}
                        className="w-full max-w-xs object-cover rounded-lg shadow"
                    />
                </div>
                <div className="md:col-span-2 flex flex-col justify-between info-section">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {book.title}
                        </h1>
                        <h2 className="text-lg text-gray-600 mb-4">
                            by {book.author}
                        </h2>
                        <p className="text-gray-800 text-base mb-6 whitespace-pre-line">
                            {book.description}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Available At:
                        </h3>
                        <ul className="flex flex-wrap gap-4 buy-links">
                            {book.buy_links.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookDetail
