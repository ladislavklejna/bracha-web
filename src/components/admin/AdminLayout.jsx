import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="al-root">
      <header className="al-topbar">
        <Link to="/admin/dashboard" className="al-brand">
          <span className="al-brand-accent">A</span>RAPRO
          <span className="al-brand-tag">admin</span>
        </Link>
        <div className="al-topbar-right">
          <span className="al-user-email">{user?.email}</span>
          <button className="al-logout-btn" onClick={handleLogout}>
            Odhlásit
          </button>
        </div>
      </header>
      <main className="al-content">
        <Outlet />
      </main>
    </div>
  );
}
