import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLaunch = () => {
    if (user) {
      navigate(user.role === 'ADMIN' ? '/admin' : '/student');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, textAlign: 'center' }}>
      <div className="glass-panel" style={{ padding: '4rem', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', background: 'linear-gradient(to right, var(--accent-primary), var(--accent-success))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {t('welcome')}
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          A modern, secure, and intuitive platform for taking and managing examinations.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={handleLaunch} className="btn-primary" style={{ fontSize: '1.2rem', padding: '1rem 2.5rem' }}>
            {t('launch')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
