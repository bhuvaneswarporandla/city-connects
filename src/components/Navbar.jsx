import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          City Connects
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="navbar-link">Home</Link>

          {user ? (
            <>
              {isAdmin ? (
                <Link to="/admin-dashboard" className="navbar-link">Admin Dashboard</Link>
              ) : (
                <Link to="/user-dashboard" className="navbar-link">Dashboard</Link>
              )}
              <span className="navbar-user">Hello, {user.fullName}</span>
              <button onClick={handleLogout} className="navbar-button">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/register" className="navbar-button-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
