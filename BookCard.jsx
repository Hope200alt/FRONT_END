import React from 'react';

const BookCard = ({ book, onClick }) => {
  return (
    <div className="book-card" onClick={onClick}>
      <img 
        src={book.coverImage || '/images/default-book-cover.jpg'} 
        alt={book.title}
      />
      <div className="book-info">
        <h3>{book.title}</h3>
        <p className="author">{book.author}</p>
        <p className="genre">{book.genre}</p>
      </div>
    </div>
  );
};

export default BookCard;