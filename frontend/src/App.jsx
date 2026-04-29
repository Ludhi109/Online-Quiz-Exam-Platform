import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

// Placeholder Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import ActiveExam from './pages/student/ActiveExam';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/" />;
  return children;
};

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--glass-border)' }}>
      <h2 style={{ color: 'var(--accent-primary)', fontWeight: '700' }}>QuizMaster</h2>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {user ? (
          <button onClick={logout} className="btn-danger">Logout</button>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <a href="/login" className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)' }}>Login</a>
            <a href="/register" className="btn-primary">Register</a>
          </div>
        )}
      </div>
    </header>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Header />
          <main style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/admin/*" element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/student" element={
                <ProtectedRoute requiredRole="STUDENT">
                  <StudentDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/student/exam/:id" element={
                <ProtectedRoute requiredRole="STUDENT">
                  <ActiveExam />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
