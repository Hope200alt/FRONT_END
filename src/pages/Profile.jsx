import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserProfile } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        // For development, use mock data (replace with real API call when backend is ready)
        const mockUser = {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890',
          membershipDate: '2023-01-15',
          reservations: [
            { id: 1, bookTitle: 'The Great Gatsby', date: '2023-05-10', status: 'Completed' },
            { id: 2, bookTitle: 'To Kill a Mockingbird', date: '2023-06-15', status: 'Active' }
          ]
        };
        setUser(mockUser);
        setFormData({
          name: mockUser.name,
          email: mockUser.email,
          phone: mockUser.phone
        });
        setError(null);
      } catch (err) {
        setError('Failed to load profile. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // For development, mock the update (replace with real API call when backend is ready)
      const updatedUser = { ...user, ...formData };
      setUser(updatedUser);
      setEditMode(false);
      // Uncomment this when your backend is ready:
      // await updateUserProfile(formData);
      // const updatedProfile = await getUserProfile();
      // setUser(updatedProfile);
      // setEditMode(false);
    } catch (error) {
      setError('Failed to update profile. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;
  if (!user) return <div>User not found.</div>;

  return (
    <div className="profile-container">
      <h1>My Profile</h1>
      
      <div className="profile-header">
        {!editMode ? (
          <>
            <h2>{user.name}</h2>
            <button onClick={() => setEditMode(true)} className="edit-button">
              Edit Profile
            </button>
          </>
        ) : (
          <button 
            onClick={() => setEditMode(false)} 
            className="cancel-button"
          >
            Cancel Edit
          </button>
        )}
      </div>

      {editMode ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Full Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className="save-button">
            Save Changes
          </button>
        </form>
      ) : (
        <div className="profile-info">
          <div className="info-item">
            <span className="label">Email:</span>
            <span className="value">{user.email}</span>
          </div>
          <div className="info-item">
            <span className="label">Phone:</span>
            <span className="value">{user.phone || 'Not provided'}</span>
          </div>
          <div className="info-item">
            <span className="label">Member Since:</span>
            <span className="value">
              {new Date(user.membershipDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      )}

      <div className="reservations-section">
        <h3>My Reservations</h3>
        {user.reservations.length > 0 ? (
          <table className="reservations-table">
            <thead>
              <tr>
                <th>Book</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {user.reservations.map(reservation => (
                <tr key={reservation.id}>
                  <td>{reservation.bookTitle}</td>
                  <td>{new Date(reservation.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`status ${reservation.status.toLowerCase()}`}>
                      {reservation.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No reservations found.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;