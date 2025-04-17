import { useState, useEffect, useCallback } from 'react';
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
  DialogContentText,
  DialogActions,
  TextField,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import { Delete, Edit, CloudUpload } from '@mui/icons-material';
import api from '../services/api';

const AdminPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [reservations, setReservations] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const initialBookState = {
    title: '',
    author: '',
    genre: '',
    isbn: '',
    published_year: '',
    total_copies: 1,
    description: '',
    image_url: ''
  };

  const [newBook, setNewBook] = useState(initialBookState);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const endpoint = tabValue === 0 ? '/reservations' : '/books';
      const res = await api.get(endpoint);
      
      if (tabValue === 0) {
        setReservations(res.data);
      } else {
        setBooks(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data. Please try again later.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [tabValue]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/reservations/${id}/status`, { status });
      setReservations(prev =>
        prev.map(res => (res.id === id ? { ...res, status } : res))
      );
      setSuccess(`Reservation status updated to ${status}`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update reservation status');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook(prev => ({
      ...prev,
      [name]: ['published_year', 'total_copies'].includes(name)
        ? parseInt(value) || 0
        : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setNewBook(prev => ({ ...prev, image_url: '' }));
    }
  };

  const handleSubmitBook = async (isEdit = false) => {
    try {
      const formData = new FormData();
      Object.entries(newBook).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
      
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      const method = isEdit ? 'put' : 'post';
      const url = isEdit ? `/books/${currentBook.id}` : '/books';
      
      await api[method](url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (isEdit) {
        setOpenEditDialog(false);
      } else {
        setOpenDialog(false);
      }
      
      resetForm();
      setSuccess(`Book ${isEdit ? 'updated' : 'added'} successfully!`);
      setTimeout(() => setSuccess(null), 3000);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'add'} book`);
    }
  };

  const handleEditBook = (book) => {
    setCurrentBook(book);
    setNewBook({
      title: book.title,
      author: book.author,
      genre: book.genre,
      isbn: book.isbn || '',
      published_year: book.published_year || '',
      total_copies: book.total_copies,
      description: book.description || '',
      image_url: book.image_url || ''
    });
    setOpenEditDialog(true);
  };

  const handleDeleteBook = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await api.delete(`/books/${id}`);
        setBooks(prev => prev.filter(book => book.id !== id));
        setSuccess('Book deleted successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete book');
      }
    }
  };

  const resetForm = () => {
    setNewBook(initialBookState);
    setSelectedFile(null);
    setPreviewImage(null);
  };

  const renderStatusBadge = (status) => {
    const statusColors = {
      approved: 'success.light',
      rejected: 'error.light',
      pending: 'warning.light'
    };

    return (
      <Box
        sx={{
          display: 'inline-block',
          px: 1,
          borderRadius: 1,
          backgroundColor: statusColors[status] || 'grey.500',
          color: 'common.white'
        }}
      >
        {status}
      </Box>
    );
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

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

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
                    <TableCell>
                      {renderStatusBadge(reservation.status)}
                    </TableCell>
                    <TableCell>
                      {reservation.status === 'pending' && (
                        <>
                          <Button
                            variant="contained"
                            size="small"
                            color="success"
                            sx={{ mr: 1 }}
                            onClick={() => handleStatusChange(reservation.id, 'approved')}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            color="error"
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
            <Button 
              variant="contained" 
              startIcon={<CloudUpload />}
              onClick={() => setOpenDialog(true)}
            >
              Add New Book
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Cover</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Author</TableCell>
                  <TableCell>Genre</TableCell>
                  <TableCell>Available</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {books.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>
                      <Avatar 
                        src={book.image_url || 'https://via.placeholder.com/100x150?text=No+Cover'}
                        variant="square"
                        sx={{ width: 56, height: 80 }}
                      />
                    </TableCell>
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.genre}</TableCell>
                    <TableCell>{book.available_copies}</TableCell>
                    <TableCell>{book.total_copies}</TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton 
                          color="primary"
                          onClick={() => handleEditBook(book)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          color="error"
                          onClick={() => handleDeleteBook(book.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Book Form Dialog */}
      <Dialog 
        open={openDialog || openEditDialog} 
        onClose={() => {
          openDialog ? setOpenDialog(false) : setOpenEditDialog(false);
          resetForm();
        }} 
        fullWidth 
        maxWidth="md"
      >
        <DialogTitle>{openEditDialog ? 'Edit Book' : 'Add New Book'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, pt: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {previewImage ? (
                  <Box
                    component="img"
                    src={previewImage}
                    alt="Preview"
                    sx={{ width: '100%', maxHeight: 300, objectFit: 'contain', mb: 2 }}
                  />
                ) : newBook.image_url ? (
                  <Box
                    component="img"
                    src={newBook.image_url}
                    alt="Preview"
                    sx={{ width: '100%', maxHeight: 300, objectFit: 'contain', mb: 2 }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: 200,
                      bgcolor: 'grey.100',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2
                    }}
                  >
                    <Typography color="text.secondary">No image selected</Typography>
                  </Box>
                )}
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<CloudUpload />}
                >
                  Upload Cover Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
                <DialogContentText sx={{ mt: 1 }}>
                  or paste an image URL below
                </DialogContentText>
              </Box>
            </Box>
            <Box sx={{ flex: 2 }}>
              <TextField
                label="Title"
                name="title"
                value={newBook.title}
                onChange={handleInputChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Author"
                name="author"
                value={newBook.author}
                onChange={handleInputChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Genre"
                name="genre"
                value={newBook.genre}
                onChange={handleInputChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="ISBN"
                name="isbn"
                value={newBook.isbn}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Published Year"
                name="published_year"
                type="number"
                value={newBook.published_year}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Total Copies"
                name="total_copies"
                type="number"
                value={newBook.total_copies}
                onChange={handleInputChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Image URL"
                name="image_url"
                value={newBook.image_url}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
                disabled={!!selectedFile}
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
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            openDialog ? setOpenDialog(false) : setOpenEditDialog(false);
            resetForm();
          }}>
            Cancel
          </Button>
          <Button 
            onClick={() => handleSubmitBook(openEditDialog)} 
            variant="contained"
            disabled={!newBook.title || !newBook.author || !newBook.genre}
          >
            {openEditDialog ? 'Update Book' : 'Add Book'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPage;