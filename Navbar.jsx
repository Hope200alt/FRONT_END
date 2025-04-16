import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header>
      <nav className="navbar">
        <Link to="/" className="logo">
          <h1>Library LMS</h1>
        </Link>
        <ul className="nav-links">
          <li><Link to="/books">Browse Books</Link></li>
          <li><Link to="/profile">My Profile</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;