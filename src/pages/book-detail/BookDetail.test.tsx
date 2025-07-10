import { render, screen } from '@testing-library/react'
import BookDetail from './BookDetail'
import { MantineProvider } from '@mantine/core';

//I have mocked the useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ productId: '123' }),
}))

//I have mocked the fetch data
beforeAll(() => {
  globalThis.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({
        lists: [
          {
            books: [
              {
                author: "Test Yazar",
                book_image: "test.jpg",
                book_image_height: 300,
                book_image_width: 200,
                buy_links: [],
                description: "Test açıklama",
                publisher: "Test",
                title: "Test Kitap",
                primary_isbn13: "123",
              }
            ],
            list_id: 1,
            normal_list_ends_at: 0,
          }
        ]
      }),
    })
  ) as jest.Mock;
});

//error faced fix: 1. tsonfig.app.json -> "erasableSyntaxOnly": false
test('it shows book title and description', async () => {
    //1.render component
  render(
    <MantineProvider>
      <BookDetail />
    </MantineProvider>
  )
    //2.manipulate component or find an element in it
 const headings = await screen.findAllByRole('heading');
  expect(headings).toHaveLength(3);
    //3.what we expect it to do
 expect(headings[0]).toHaveTextContent('Test Kitap');
  expect(screen.getByText('Test açıklama')).toBeInTheDocument();
  });
