import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Book, BookCategoryList } from '../types/types'

type WishlistState = {
    currentUserEmail: string | null
    allWishlists: Record<string, Book[]>
    toggleWishlist: (book: Book) => void
    isInWishlist: (isbn: string) => boolean
    getWishlist: () => Book[]
    setUser: (email: string | null) => void
}

type BooksState = {
    lists: BookCategoryList[]
    lastFetchedAt: number | null
    setLists: (lists: BookCategoryList[]) => void
    getBookByIsbn: (isbn: string) => Book | null
    clearBooks: () => void
}

type AppState = WishlistState & BooksState

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            currentUserEmail: null,
            allWishlists: {},
            toggleWishlist: (book: Book) => {
                const email = get().currentUserEmail
                if (!email) return

                const allWishlists = { ...get().allWishlists }
                const userWishlist = allWishlists[email] || []
                const exists = userWishlist.find(
                    (item) => item.primary_isbn13 === book.primary_isbn13
                )

                if (exists) {
                    allWishlists[email] = userWishlist.filter(
                        (item) => item.primary_isbn13 !== book.primary_isbn13
                    )
                } else {
                    allWishlists[email] = [...userWishlist, book]
                }

                set({ allWishlists })
            },
            isInWishlist: (isbn: string) => {
                const email = get().currentUserEmail
                if (!email) return false
                const userWishlist = get().allWishlists[email] || []
                return userWishlist.some((item) => item.primary_isbn13 === isbn)
            },
            getWishlist: () => {
                const email = get().currentUserEmail
                return email ? get().allWishlists[email] || [] : []
            },

            setUser: (email: string | null) => {
                set({ currentUserEmail: email })
            },
            lists: [],
            lastFetchedAt: null,

            setLists: (lists) => set({ lists }),

            getBookByIsbn: (isbn) => {
                const all = get().lists.flatMap((l) => l.books)
                return all.find((b) => b.primary_isbn13 === isbn) ?? null
            },
            clearBooks: () => set({ lists: [], lastFetchedAt: null }),
        }),
        {
            name: 'app-storage',
        }
    )
)
