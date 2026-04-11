import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLogin.css';

export default function AdminLogin() {
  const { user, login, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  if (user) return <Navigate to="/admin/dashboard" replace />;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(mapFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) { setError('Zadejte e-mail'); return; }
    setLoading(true);
    try {
      await resetPassword(email);
      setResetSent(true);
      setError('');
    } catch (err) {
      setError(mapFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-card">
        <div className="login-logo">
          <span className="login-logo-a">A</span>RAPRO
        </div>
        <p className="login-subtitle">Správa portfolia</p>

        {resetMode ? (
          <>
            <h2 className="login-title">Obnovit heslo</h2>
            {resetSent ? (
              <p className="login-success">
                E-mail s odkazem byl odeslán. Zkontrolujte schránku.
              </p>
            ) : (
              <form onSubmit={handleReset} className="login-form">
                <div className="login-field">
                  <label>E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@arapro.cz"
                    autoFocus
                    required
                  />
                </div>
                {error && <p className="login-error">{error}</p>}
                <button type="submit" className="login-btn" disabled={loading}>
                  {loading ? <span className="btn-spinner" /> : 'Odeslat odkaz'}
                </button>
              </form>
            )}
            <button
              className="login-link"
              onClick={() => { setResetMode(false); setResetSent(false); setError(''); }}
            >
              ← Zpět na přihlášení
            </button>
          </>
        ) : (
          <>
            <h2 className="login-title">Přihlášení</h2>
            <form onSubmit={handleLogin} className="login-form">
              <div className="login-field">
                <label>E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@arapro.cz"
                  autoFocus
                  required
                />
              </div>
              <div className="login-field">
                <label>Heslo</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              {error && <p className="login-error">{error}</p>}
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? <span className="btn-spinner" /> : 'Přihlásit se'}
              </button>
            </form>
            <button
              className="login-link"
              onClick={() => { setResetMode(true); setError(''); }}
            >
              Zapomenuté heslo?
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function mapFirebaseError(code) {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Nesprávný e-mail nebo heslo.';
    case 'auth/too-many-requests':
      return 'Příliš mnoho pokusů. Zkuste to za chvíli.';
    case 'auth/network-request-failed':
      return 'Chyba sítě. Zkontrolujte připojení.';
    default:
      return 'Přihlášení selhalo. Zkuste to znovu.';
  }
}
