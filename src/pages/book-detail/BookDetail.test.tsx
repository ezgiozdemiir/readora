import { render, screen } from '@testing-library/react'
import BookDetail from './BookDetail'
import { MantineProvider } from '@mantine/core'
import { MemoryRouter } from 'react-router-dom'
import { UserProvider } from '../../contexts/UserContext'

//I have mocked the useParams
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({ productId: '9781649378514' }),
}))

const mockBook = {
    primary_isbn13: '9781649378514',
    title: 'Test Kitap Başlığı',
    description: 'Test Açıklama',
    author: 'Test Yazar',
    book_image: 'test.jpg',
    buy_links: [],
}

//I have mocked the zustand
jest.mock('../../store/appStore', () => ({
    useAppStore: (sel: any) =>
        sel({
            getBookByIsbn: (isbn: string) => (isbn ? mockBook : undefined),
            setLists: jest.fn(),
        }),
}))

//error faced fix: 1. tsonfig.app.json -> "erasableSyntaxOnly": false
test('it shows book title and description', async () => {
    //1.render component
    render(
        <MantineProvider>
            <MemoryRouter>
                <UserProvider>
                    <BookDetail />
                </UserProvider>
            </MemoryRouter>
        </MantineProvider>
    )
    //2.manipulate component or find an element in it
    expect(await screen.findByText(/Test Kitap Başlığı/i)).toBeInTheDocument()
    expect(screen.getByText(/Test Açıklama/i)).toBeInTheDocument()
    expect(screen.getByText(/Test Yazar/i)).toBeInTheDocument()
})
