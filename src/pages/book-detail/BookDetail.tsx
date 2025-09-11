import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import type { Book } from '../../types/types'
import {
    Group,
    Skeleton,
    Textarea,
    Button as MantineButton,
} from '@mantine/core'
import './BookDetail.scss'
import { useAppStore } from '../../store/appStore'
import { useUser } from '../../contexts/UserContext'

const BookDetail: React.FC = () => {
    //routeda kullanılan değişken ismini param olarak girmek zorunlu
    const { productId } = useParams<{ productId: string }>()
    const location = useLocation()
    const stateBook = (location.state as { book?: Book } | null)?.book
    const getBookByIsbn = useAppStore((s) => s.getBookByIsbn)
    const setLists = useAppStore((s) => s.setLists)
    const [book, setBook] = useState<Book | null>(stateBook ?? null)

    //useContext'ten gelen user objesi
    const { user } = useUser()
    const [commentText, setCommentText] = useState('')
    const [comments, setComments] = useState<
        { username: string; text: string }[]
    >([])

    const handleAddComment = () => {
        if (!user) {
            alert('Please login to write a comment')
            return
        }
        if (!commentText.trim()) return

        setComments((prev) => [
            ...prev,
            { username: user.username, text: commentText },
        ])
        setCommentText('')
    }

    //Ekstra fetch işlemi kaldırıldı artık seçilen book store'dan çekiliyor.
    useEffect(() => {
        if (book || !productId) return

        const cached = getBookByIsbn(productId)
        if (cached) {
            setBook(cached)
            return
        }
    }, [book, productId, getBookByIsbn, setLists])

    if (!book) {
        return (
            <div className="outer min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="container max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="picture-element md:col-span-1 flex justify-center">
                        <Skeleton height={240} width={160} radius="md" />
                    </div>
                    <div className="info-element md:col-span-2 space-y-4">
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
            <div className="mt-10">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Comments
                </h3>
                <div className="mb-2 text-sm text-gray-600">
                    <div>
                        Commented by:{' '}
                        <span className="font-medium">{user?.username}</span>
                    </div>
                </div>
                <Textarea
                    placeholder="Comment about this book :)"
                    autosize
                    // minRows={3}
                    // maxRows={6}
                    value={commentText}
                    onChange={(event) =>
                        setCommentText(event.currentTarget.value)
                    }
                />
                <MantineButton
                    className="mt-3"
                    onClick={handleAddComment}
                    disabled={!user}
                >
                    Send Comment
                </MantineButton>
                <ul className="mt-4 space-y-2">
                    {comments.length === 0 && (
                        <li className="text-sm text-gray-500">
                            There is not comment yet.
                        </li>
                    )}
                    {comments.map((c, i) => (
                        <li key={i} className="border rounded p-2">
                            <div className="text-sm text-gray-600 mb-1">
                                {c.username} wrote:
                            </div>
                            <p className="text-gray-800">{c.text}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default BookDetail
