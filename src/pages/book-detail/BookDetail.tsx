import React from "react";

type BuyLink = {
  name: string;
  url: string;
};

type Book = {
  title: string;
  description: string;
  author: string;
  book_image: string;
  buy_links: BuyLink[];
};

type Props = {
  book: Book;
};

const BookDetail: React.FC<Props> = ({ book }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Book Cover */}
        <div className="md:col-span-1 flex justify-center">
          <img
            src={book.book_image}
            alt={book.title}
            className="w-full max-w-xs object-cover rounded-lg shadow"
          />
        </div>

        {/* Book Info */}
        <div className="md:col-span-2 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {book.title}
            </h1>
            <h2 className="text-lg text-gray-600 mb-4">by {book.author}</h2>
            <p className="text-gray-800 text-base mb-6 whitespace-pre-line">
              {book.description}
            </p>
          </div>

          {/* Buy Links */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Available At:
            </h3>
            <ul className="flex flex-wrap gap-4">
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
  );
};

export default BookDetail;
