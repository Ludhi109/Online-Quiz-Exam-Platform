import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, { 
        email, 
        password,
        portalRole: 'ADMIN'
      });
      login(res.data.token, res.data.user);
      navigate('/admin');
    } catch (err) {
      if (!err.response) {
        setError('Network Error: Could not connect to backend. Please check VITE_API_URL in Vercel.');
      } else {
        setError(err.response?.data?.error || 'Invalid credentials');
      }
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@quiz.com');
    setPassword('password123');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <div className="glass-panel" style={{ padding: '2.5rem', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Admin Login Portal</h2>
        {error && <div style={{ color: 'var(--accent-danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="email"
            placeholder="Admin Email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>{t('login')}</button>
        </form>
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button onClick={fillDemoCredentials} style={{ background: 'none', color: 'var(--text-secondary)', textDecoration: 'underline', fontSize: '0.9rem' }}>
            Use Demo Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
