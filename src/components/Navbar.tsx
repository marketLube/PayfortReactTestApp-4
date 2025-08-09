import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          PayfortReactTestApp
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-controls="navbarNav"
          aria-expanded={!isCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${!isCollapsed ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/')}`} to="/" onClick={() => setIsCollapsed(true)}>
                <i className="bi bi-house"></i> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/payment-test')}`} to="/payment-test" onClick={() => setIsCollapsed(true)}>
                <i className="bi bi-credit-card"></i> Payment Test
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/order-details')}`} to="/order-details" onClick={() => setIsCollapsed(true)}>
                <i className="bi bi-check-circle"></i> Order Details
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/payment-failed')}`} to="/payment-failed" onClick={() => setIsCollapsed(true)}>
                <i className="bi bi-arrow-clockwise"></i> Payment Retry
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;