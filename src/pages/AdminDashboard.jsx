import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getAdminStats,
  getAllBooks,
  getAllUsers,
  updateBookStatus,
  updateUserStatus
} from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('stats');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Mock data for development (replace with real API calls when backend is ready)
        const mockStats = {
          totalBooks: 124,
          availableBooks: 87,
          reservedBooks: 37,
          totalUsers: 56,
          activeUsers: 42,
          overdueBooks: 5
        };
        
        const mockBooks = [
          { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', status: 'Available', reservations: 12 },
          { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', status: 'Reserved', reservations: 8 },
          { id: 3, title: '1984', author: 'George Orwell', status: 'Available', reservations: 15 }
        ];
        
        const mockUsers = [
          { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active', booksBorrowed: 2 },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive', booksBorrowed: 0 },
          { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Active', booksBorrowed: 1 }
        ];
        
        setStats(mockStats);
        setBooks(mockBooks);
        setUsers(mockUsers);
        setError(null);
        
        // Uncomment these when your backend is ready:
        // const statsData = await getAdminStats();
        // const booksData = await getAllBooks();
        // const usersData = await getAllUsers();
        // setStats(statsData);
        // setBooks(booksData);
        // setUsers(usersData);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBookStatusChange = async (bookId, newStatus) => {
    try {
      setLoading(true);
      // Mock update for development
      setBooks(books.map(book => 
        book.id === bookId ? { ...book, status: newStatus } : book
      ));
      // Uncomment when backend is ready:
      // await updateBookStatus(bookId, newStatus);
      // const updatedBooks = await getAllBooks();
      // setBooks(updatedBooks);
    } catch (error) {
      setError('Failed to update book status.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserStatusChange = async (userId, newStatus) => {
    try {
      setLoading(true);
      // Mock update for development
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
      // Uncomment when backend is ready:
      // await updateUserStatus(userId, newStatus);
      // const updatedUsers = await getAllUsers();
      // setUsers(updatedUsers);
    } catch (error) {
      setError('Failed to update user status.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="dashboard-tabs">
        <button 
          className={activeTab === 'stats' ? 'active' : ''}
          onClick={() => setActiveTab('stats')}
        >
          Statistics
        </button>
        <button 
          className={activeTab === 'books' ? 'active' : ''}
          onClick={() => setActiveTab('books')}
        >
          Book Management
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
      </div>

      {activeTab === 'stats' && stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Books</h3>
            <p>{stats.totalBooks}</p>
          </div>
          <div className="stat-card">
            <h3>Available Books</h3>
            <p>{stats.availableBooks}</p>
          </div>
          <div className="stat-card">
            <h3>Reserved Books</h3>
            <p>{stats.reservedBooks}</p>
          </div>
          <div className="stat-card">
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Active Users</h3>
            <p>{stats.activeUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Overdue Books</h3>
            <p>{stats.overdueBooks}</p>
          </div>
        </div>
      )}

      {activeTab === 'books' && (
        <div className="management-table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Status</th>
                <th>Reservations</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>
                    <span className={`status ${book.status.toLowerCase()}`}>
                      {book.status}
                    </span>
                  </td>
                  <td>{book.reservations}</td>
                  <td>
                    {book.status === 'Available' ? (
                      <button 
                        onClick={() => handleBookStatusChange(book.id, 'Reserved')}
                        className="action-button mark-reserved"
                      >
                        Mark as Reserved
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleBookStatusChange(book.id, 'Available')}
                        className="action-button mark-available"
                      >
                        Mark as Available
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="management-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Books Borrowed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`status ${user.status.toLowerCase()}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>{user.booksBorrowed}</td>
                  <td>
                    {user.status === 'Active' ? (
                      <button 
                        onClick={() => handleUserStatusChange(user.id, 'Inactive')}
                        className="action-button deactivate"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleUserStatusChange(user.id, 'Active')}
                        className="action-button activate"
                      >
                        Activate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;