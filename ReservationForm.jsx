import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { reserveBook } from '../services/api';
import '../styles/ReservationForm.css';

const ReservationForm = ({ bookId, onClose }) => {
  const [reservationDate, setReservationDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reservationDate) {
      toast.error('Please select a reservation date');
      return;
    }

    try {
      setLoading(true);
      await reserveBook(bookId, reservationDate);
      toast.success('Book reserved successfully!');
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to reserve book. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reservation-form-overlay">
      <div className="reservation-form">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h3>Reserve This Book</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="reservationDate">Pickup Date:</label>
            <input
              type="date"
              id="reservationDate"
              value={reservationDate}
              onChange={(e) => setReservationDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Processing...' : 'Confirm Reservation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationForm;