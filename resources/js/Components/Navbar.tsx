import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { user, isAuthenticated, logout, hasPermission } = useAuth();

  if (!isAuthenticated) {
    return (
      <nav className="navbar">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/dashboard">PMS</Link>
      </div>
      
      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/projects">Projects</Link>
        
        {hasPermission('manage-users') && (
          <Link to="/users">Users</Link>
        )}
        
        {hasPermission('view-reports') && (
          <Link to="/reports">Reports</Link>
        )}
      </div>

      <div className="nav-user">
        <span>Hello, {user?.name}</span>
        <Link to="/profile">Profile</Link>
        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}