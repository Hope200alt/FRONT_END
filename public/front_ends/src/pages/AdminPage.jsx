// src/Pages/AdminPage.jsx
import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Tabs,
  Tab,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import api from '../services/api';

const AdminPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [reservations, setReservations] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    genre: '',
    isbn: '',
    published_year: '',
    total_copies: 1,
    description: '',
    image_url: '' // include image_url field if needed
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (tabValue === 0) {
          const res = await api.get('/reservations');
          setReservations(res.data);
        } else {
          const res = await api.get('/books');
          setBooks(res.data);
        }
        setError(null);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tabValue]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/reservations/${id}/status`, { status });
      setReservations(
        reservations.map(res => (res.id === id ? { ...res, status } : res))
      );
    } catch (err) {
      setError('Failed to update reservation status');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook(prev => ({
      ...prev,
      [name]:
        name === 'published_year' || name === 'total_copies'
          ? parseInt(value)
          : value
    }));
  };

  const handleAddBook = async () => {
    try {
      await api.post('/books', newBook);
      setOpenDialog(false);
      setNewBook({
        title: '',
        author: '',
        genre: '',
        isbn: '',
        published_year: '',
        total_copies: 1,
        description: '',
        image_url: ''
      });
      // Refresh books list
      const res = await api.get('/books');
      setBooks(res.data);
    } catch (err) {
      setError('Failed to add new book');
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Reservations" />
          <Tab label="Books" />
        </Tabs>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : tabValue === 0 ? (
        <>
          <Typography variant="h6" gutterBottom>
            Manage Reservations
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Book</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Reservation Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell>{reservation.title}</TableCell>
                    <TableCell>{reservation.username}</TableCell>
                    <TableCell>
                      {new Date(reservation.reservation_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{reservation.status}</TableCell>
                    <TableCell>
                      {reservation.status === 'pending' && (
                        <>
                          <Button
                            color="success"
                            size="small"
                            onClick={() => handleStatusChange(reservation.id, 'approved')}
                          >
                            Approve
                          </Button>
                          <Button
                            color="error"
                            size="small"
                            onClick={() => handleStatusChange(reservation.id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">
              Manage Books
            </Typography>
            <Button variant="contained" onClick={() => setOpenDialog(true)}>
              Add New Book
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Author</TableCell>
                  <TableCell>Genre</TableCell>
                  <TableCell>Available</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {books.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.genre}</TableCell>
                    <TableCell>{book.available_copies}</TableCell>
                    <TableCell>{book.total_copies}</TableCell>
                    <TableCell>
                    <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  onClick={async () => {
                    if (
                      window.confirm(
                        `Are you sure you want to delete ${book.title}?`
                      )
                    ) {
                      try {
                        await api.delete(`/books/${book.id}`);
                        setBooks(books.filter((b) => b.id !== book.id));
                      } catch (err) {
                        setError('Failed to delete book');
                      }
                    }
                  }}
                >
                  Delete
                </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Book</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Title"
              name="title"
              value={newBook.title}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Author"
              name="author"
              value={newBook.author}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Genre"
              name="genre"
              value={newBook.genre}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="ISBN"
              name="isbn"
              value={newBook.isbn}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Published Year"
              name="published_year"
              type="number"
              value={newBook.published_year}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Total Copies"
              name="total_copies"
              type="number"
              value={newBook.total_copies}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Description"
              name="description"
              value={newBook.description}
              onChange={handleInputChange}
              multiline
              rows={4}
              fullWidth
            />
            <TextField
              label="Image URL"
              name="image_url"
              value={newBook.image_url}
              onChange={handleInputChange}
              fullWidth
              helperText="Paste the image URL for the book cover"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddBook} variant="contained">Add Book</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPage;