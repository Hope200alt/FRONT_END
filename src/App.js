import React, { useState, useEffect } from 'react';
import BookList from './BookList';
import SearchBar from './SearchBar';
import BookDetails from './BookDetails';
import './App.css';
import UserProfile from './UserProfile';
import Login from './Login';


const App = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const initialBooks = [
      { id: 1, title: "The Hitchhiker's Guide to the Galaxy", author: "Douglas Adams", genre: "Science Fiction", available: true },
      { id: 2, title: "Pride and Prejudice", author: "Jane Austen", genre: "Romance", available: true },
      { id: 3, title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Classic", available: true },
      { id: 4, title: "1984", author: "George Orwell", genre: "Dystopian", available: true },
      { id: 5, title: "The Lord of the Rings", author: "J.R.R. Tolkien", genre: "Fantasy", available: true },
      { id: 6, title: "The Little Prince", author: "Antoine de Saint-Exupéry", genre: "Children's Literature", available: true },
      { id: 7, title: "One Hundred Years of Solitude", author: "Gabriel García Márquez", genre: "Magical Realism", available: true },
      { id: 8, title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Classic", available: true },
      { id: 9, title: "Moby Dick", author: "Herman Melville", genre: "Classic", available: true },
      { id: 10, title: "Jane Eyre", author: "Charlotte Brontë", genre: "Gothic Romance", available: true },
      { id: 11, title: "The Catcher in the Rye", author: "J.D. Salinger", genre: "Coming-of-age", available: true },
      { id: 12, title: "Wuthering Heights", author: "Emily Brontë", genre: "Gothic Romance", available: true },
      { id: 13, title: "The Odyssey", author: "Homer", genre: "Epic Poetry", available: true },
      { id: 14, title: "Frankenstein", author: "Mary Shelley", genre: "Gothic Horror", available: true },
      { id: 15, title: "Dracula", author: "Bram Stoker", genre: "Gothic Horror", available: true },
      
    ];
    setBooks(initialBooks);
  }, []);
  const [loggedInUser, setLoggedInUser] = useState(null);
    const [selectedBook, setSelectedBook] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showReservationDetails, setShowReservationDetails] = useState(false); // New state variable

    useEffect(() => {
        // You can add any initial setup or side effects here
    }, []);

    const handleLogin = (username, password) => {
        // Replace with your actual authentication logic
        if (username === 'testuser' && password === 'password') {
            setLoggedInUser({ id: 1, username: 'testuser' });
        } else {
            alert('Invalid credentials');
        }
    };

    const handleLogout = () => {
        setLoggedInUser(null);
    };

    const handleBookClick = (book) => {
        setSelectedBook(book);
    };

    const handleBackToList = () => {
        setSelectedBook(null);
        setShowReservationDetails(false); // Reset details view when going back
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleReserveBook = (bookId, userId) => {
        const bookToReserve = books.find(book => book.id === bookId);

        if (!bookToReserve) {
            alert("Book not found.");
            return;
        }

        if (!bookToReserve.available) {
            alert("Sorry, this book is currently unavailable.");
            return;
        }

        const alreadyReserved = reservations.some(
            (reservation) => reservation.bookId === bookId
        );

        if (alreadyReserved) {
            alert("This book is already reserved.");
            return;
        }

        const newReservation = {
            bookId: bookId,
            userId: userId,
            reservationDate: new Date(),
            bookTitle: bookToReserve.title, // Include book title in reservation
        };

        setReservations([...reservations, newReservation]);
        setBooks(books.map(book =>
            book.id === bookId ? { ...book, available: false } : book
        ));
        alert("Book reserved successfully!");
        setShowReservationDetails(false); //  Hide book details after successful reservation
    };

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Function to display reservation details
    const displayReservationDetails = (userId) => {
        const userReservations = reservations.filter(reservation => reservation.userId === userId);
        if (userReservations.length === 0) {
            return <p>No reservations found.</p>;
        }

        return (
            <div>
                <h3>Your Reservations:</h3>
                <ul>
                    {userReservations.map((reservation, index) => (
                        <li key={index}>
                            <strong>Book:</strong> {reservation.bookTitle} (Reserved on: {reservation.reservationDate.toLocaleDateString()})
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div className="app-container">
            <h1>Library Management System</h1>
            {loggedInUser ? (
                <>
                    <UserProfile user={loggedInUser} onLogout={handleLogout} />
                    <SearchBar onSearch={handleSearch} />
                    <BookList books={filteredBooks} onBookClick={handleBookClick} />
                    {selectedBook && (
                        <BookDetails
                            book={selectedBook}
                            onBack={handleBackToList}
                            onReserve={handleReserveBook}
                            userId={loggedInUser.id}
                        />
                    )}
                    <button onClick={() => setShowReservationDetails(true)}>View Reservation Details</button>  {/* Button */}
                    {showReservationDetails && (
                        <div>
                            {displayReservationDetails(loggedInUser.id)}
                            <button onClick={() => setShowReservationDetails(false)}>Close Details</button> {/* Close Button */}
                        </div>
                    )}
                </>
            ) : (
                <Login onLogin={handleLogin} />
            )}
        </div>
    );
};

export default App;


