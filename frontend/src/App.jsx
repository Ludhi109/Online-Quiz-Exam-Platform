import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

// Placeholder Pages
import LandingPage from './pages/LandingPage';
import AdminLogin from './pages/auth/AdminLogin';
import StudentLogin from './pages/auth/StudentLogin';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageQuestions from './pages/admin/ManageQuestions';
import StudentDashboard from './pages/student/StudentDashboard';
import ActiveExam from './pages/student/ActiveExam';
import ExamResult from './pages/student/ExamResult';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/" />;
  return children;
};

// Global Header removed as pages handle their own navigation

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Full Screen Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Full Screen Auth Routes */}
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/student-login" element={<StudentLogin />} />
            <Route path="/register" element={<Register />} />
            
            {/* Dashboard Routes without global Header */}
            <Route path="/admin/*" element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/exams/:examId/questions" element={
              <ProtectedRoute requiredRole="ADMIN">
                <ManageQuestions />
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
            <Route path="/student/exam/:id/result" element={
              <ProtectedRoute requiredRole="STUDENT">
                <ExamResult />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
