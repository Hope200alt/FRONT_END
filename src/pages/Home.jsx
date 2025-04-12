import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero">
        <h1>Welcome to Our Library</h1>
        <p>Discover thousands of books at your fingertips</p>
        <Link to="/books" className="cta-button">Browse Collection</Link>
      </section>
      
      <section className="features">
        <div className="feature-card">
          <i className="fas fa-search"></i>
          <h3>Easy Search</h3>
          <p>Find books by title, author, or genre</p>
        </div>
        <div className="feature-card">
          <i className="fas fa-book"></i>
          <h3>Online Reservation</h3>
          <p>Reserve books from anywhere</p>
        </div>
        <div className="feature-card">
          <i className="fas fa-user"></i>
          <h3>Personal Profile</h3>
          <p>Track your reading history</p>
        </div>
      </section>
    </div>
  );
};

export default Home;