import React from 'react';
import '../styles/LoadingSpinner.css';

const LoadingSpinner = ({ small = false }) => {
  return (
    <div className={`loading-spinner ${small ? 'small' : ''}`} />
  );
};

export default LoadingSpinner;