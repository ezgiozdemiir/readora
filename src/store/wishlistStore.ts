import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Book } from '../types/types'

type WishlistState = {
    wishlist: Book[]
    toggleWishlist: (book: Book) => void
    isInWishlist: (isbn: string) => boolean
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            wishlist: [],
            toggleWishlist: (book: Book) => {
                const { wishlist } = get()
                const exists = wishlist.find(
                    (item) => item.primary_isbn13 === book.primary_isbn13
                )
                if (exists) {
                    set({
                        wishlist: wishlist.filter(
                            (item) =>
                                item.primary_isbn13 !== book.primary_isbn13
                        ),
                    })
                } else {
                    set({ wishlist: [...wishlist, book] })
                }
            },
            isInWishlist: (isbn: string) => {
                return get().wishlist.some(
                    (item) => item.primary_isbn13 === isbn
                )
            },
        }),
        {
            name: 'wishlist-storage',
        }
    )
)
