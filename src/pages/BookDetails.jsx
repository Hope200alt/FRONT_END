import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReservationForm from '../components/ReservationForm';
import { getBookDetails } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/BookDetails.css';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        // For development, you can use mock data first
        // const data = await mockGetBookDetails(id);
        const data = await getBookDetails(id);
        setBook(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch book details. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleReservationClick = () => {
    setShowReservationForm(true);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;
  if (!book) return <div>Book not found.</div>;

  return (
    <div className="book-details-container">
      <button onClick={() => navigate(-1)} className="back-button">
        &larr; Back to Books
      </button>
      
      <div className="book-details">
        <div className="book-cover-container">
          <img 
            src={book.coverImage || '/images/default-book-cover.jpg'} 
            alt={book.title} 
            className="book-cover"
          />
        </div>
        <div className="book-info">
          <h1>{book.title}</h1>
          <p className="author">by {book.author}</p>
          <div className="meta-info">
            <span className="genre">{book.genre}</span>
            <span className="year">{book.publishedYear}</span>
            <span className="isbn">ISBN: {book.isbn}</span>
          </div>
          <p className="description">{book.description}</p>
          
          <div className="availability">
            <span className={`status ${book.availableCopies > 0 ? 'available' : 'unavailable'}`}>
              {book.availableCopies > 0 ? 'Available' : 'Out of Stock'}
            </span>
            {book.availableCopies > 0 && (
              <span className="copies">{book.availableCopies} copies available</span>
            )}
          </div>

          <button 
            onClick={handleReservationClick}
            disabled={book.availableCopies <= 0}
            className="reserve-btn"
          >
            {book.availableCopies > 0 ? 'Reserve This Book' : 'Not Available'}
          </button>
        </div>
      </div>

      {showReservationForm && (
        <ReservationForm 
          bookId={book.id} 
          onClose={() => setShowReservationForm(false)} 
        />
      )}
    </div>
  );
};

export default BookDetails;