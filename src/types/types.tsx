export type BookList = {
    lists: BookCategoryList[]
}

export type BookCategoryList = {
    books: Book[]
    list_id: number
    normal_list_ends_at: number
}

export type BuyLink = {
    name: string
    url: string
}

export type Book = {
    author: string
    book_image: string
    book_image_height: number
    book_image_width: number
    buy_links: BuyLink[]
    description: string
    publisher: string
    title: string
    primary_isbn13: string
}
