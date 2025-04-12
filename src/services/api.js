const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

export const searchBooks = async (searchTerm = '', filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (searchTerm) queryParams.append('q', searchTerm);
    if (filters.author) queryParams.append('author', filters.author);
    if (filters.genre) queryParams.append('genre', filters.genre);

    const response = await fetch(`${API_BASE_URL}/books?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch books');
    return await response.json();
  } catch (error) {
    console.error('Error searching books:', error);
    throw error;
  }
};

// Mock data for development
export const mockSearchBooks = async () => {
  return [
    {
      id: 1,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      genre: 'Fiction',
      coverImage: 'https://m.media-amazon.com/images/I/71FTb9X6wsL._AC_UF1000,1000_QL80_.jpg'
    },
    {
      id: 2,
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      genre: 'Fiction',
      coverImage: 'https://m.media-amazon.com/images/I/71FxgtFKcQL._AC_UF1000,1000_QL80_.jpg'
    }
  ];
};
// Add these to your existing api.js
export const getBookDetails = async (bookId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${bookId}`);
      if (!response.ok) throw new Error('Failed to fetch book details');
      return await response.json();
    } catch (error) {
      console.error('Error fetching book details:', error);
      throw error;
    }
  };
  
  export const reserveBook = async (bookId, reservationDate) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bookId, reservationDate })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reserve book');
      }
      return await response.json();
    } catch (error) {
      console.error('Error reserving book:', error);
      throw error;
    }
  };
  
  // Mock data for development
  export const mockGetBookDetails = async (bookId) => {
    const books = [
      {
        id: 1,
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        genre: 'Fiction',
        publishedYear: 1925,
        isbn: '9780743273565',
        description: 'The story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
        availableCopies: 3,
        coverImage: 'https://m.media-amazon.com/images/I/71FTb9X6wsL._AC_UF1000,1000_QL80_.jpg'
      },
      {
        id: 2,
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        genre: 'Fiction',
        publishedYear: 1960,
        isbn: '9780061120084',
        description: 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.',
        availableCopies: 0,
        coverImage: 'https://m.media-amazon.com/images/I/71FxgtFKcQL._AC_UF1000,1000_QL80_.jpg'
      }
    ];
    return books.find(book => book.id === parseInt(bookId)) || null;
  };
  // Add these to your existing api.js
export const getUserProfile = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890',
          membershipDate: '2023-01-15',
          reservations: [
            { id: 1, bookTitle: 'The Great Gatsby', date: '2023-05-10', status: 'Completed' },
            { id: 2, bookTitle: 'To Kill a Mockingbird', date: '2023-06-15', status: 'Active' }
          ]
        });
      }, 500);
    });
  };
  
  export const updateUserProfile = async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Profile updated successfully'
        });
      }, 500);
    });
  };
  // Add these to your existing api.js
export const getAdminStats = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalBooks: 124,
          availableBooks: 87,
          reservedBooks: 37,
          totalUsers: 56,
          activeUsers: 42,
          overdueBooks: 5
        });
      }, 500);
    });
  };
  
  export const getAllBooks = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', status: 'Available', reservations: 12 },
          { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', status: 'Reserved', reservations: 8 },
          { id: 3, title: '1984', author: 'George Orwell', status: 'Available', reservations: 15 }
        ]);
      }, 500);
    });
  };
  
  export const getAllUsers = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active', booksBorrowed: 2 },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive', booksBorrowed: 0 },
          { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Active', booksBorrowed: 1 }
        ]);
      }, 500);
    });
  };
  
  export const updateBookStatus = async (bookId, status) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Book status updated' });
      }, 500);
    });
  };
  
  export const updateUserStatus = async (userId, status) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'User status updated' });
      }, 500);
    });
  };
  // Add these to your existing api.js
export const loginUser = async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };
  
  // Mock login for development
  export const mockLogin = async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@example.com' && password === 'admin123') {
          resolve({
            token: 'mock-admin-token-123',
            user: {
              id: 1,
              name: 'Admin User',
              email: 'admin@example.com',
              role: 'admin'
            }
          });
        } else if (email === 'user@example.com' && password === 'user123') {
          resolve({
            token: 'mock-user-token-456',
            user: {
              id: 2,
              name: 'Regular User',
              email: 'user@example.com',
              role: 'user'
            }
          });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  };
  // Add these to your existing api.js
export const registerUser = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };
  
  // Mock registration for development
  export const mockRegister = async (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'User registered successfully'
        });
      }, 500);
    });
  };
  // In api.js
export const getBooks = (useMock = true) => {
    return useMock ? mockSearchBooks() : searchBooks();
  };
