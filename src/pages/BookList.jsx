import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { searchBooks, mockSearchBooks } from '../services/api'; // Add mockSearchBooks to the import

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    author: '',
    genre: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        // For development, use mock data
        const data = await mockSearchBooks();
        // For production (uncomment when backend is ready):
        // const data = await searchBooks(searchTerm, filters);
        setBooks(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch books. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBooks();
  }, [searchTerm, filters]);
  

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleBookClick = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  return (
    <div className="book-list-container">
      <h1>Library Catalog</h1>
      <SearchBar onSearch={handleSearch} />
      
      <div className="filters">
        <select name="genre" onChange={handleFilterChange} value={filters.genre}>
          <option value="">All Genres</option>
          <option value="Fiction">Fiction</option>
          <option value="Non-Fiction">Non-Fiction</option>
          <option value="Science">Science</option>
          <option value="History">History</option>
        </select>
        
        <input
          type="text"
          name="author"
          placeholder="Filter by author"
          value={filters.author}
          onChange={handleFilterChange}
        />
      </div>

      {loading && <LoadingSpinner />}
      {error && <div className="error-message">{error}</div>}

      <div className="book-grid">
        {books.map(book => (
          <BookCard 
            key={book.id} 
            book={book} 
            onClick={() => handleBookClick(book.id)} 
          />
        ))}
      </div>

      {books.length === 0 && !loading && (
        <div className="no-results">No books found matching your criteria.</div>
      )}
    </div>
  );
};

export default BookList;