export type BookList = {
    lists: BookCategoryList[]
}

// I have used Union Types for filtering display names of all the categories of books in db.json
export type DisplayName =
    | 'Hardcover Fiction'
    | 'Hardcover Nonfiction'
    | 'Paperback Nonfiction'
    | "Children's Picture Books"
    | "Children's & Young Adult Series"
    | "Children's Middle Grade Hardcover"
    | 'Young Adult Hardcover'
    | 'Paperback Trade Fiction'
    | 'Advice, How-To and Miscellaneous'
    | 'Combined Print & E-Book Fiction'
    | 'Combined Print & E-Book Nonfiction'
    | 'Middle Grade Paperback'
    | 'Young Adult Paperback'
    | 'Mass Market'
    | 'Audio Fiction'
    | 'Audio Nonfiction'
    | 'Business'
    | 'Graphic Books and Manga'

export type BookCategoryList = {
    books: Book[]
    list_id: number
    normal_list_ends_at: number
    display_name: DisplayName
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

export type LoaderData = { lists: BookCategoryList[] }

export type User = { id: number; username: string; email: string }
