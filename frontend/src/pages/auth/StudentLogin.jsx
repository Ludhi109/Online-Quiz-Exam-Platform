import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, ArrowLeft } from 'lucide-react';

const StudentLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, { 
        email, 
        password,
        portalRole: 'STUDENT'
      });
      login(res.data.token, res.data.user);
      navigate('/student');
    } catch (err) {
      if (!err.response) {
        setError('Network Error: Could not connect to backend.');
      } else {
        setError(err.response?.data?.error || 'Invalid credentials');
      }
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('student@quiz.com');
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden p-6">
      {/* Background blobs */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[100px] pointer-events-none"></div>

      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800 backdrop-blur-sm"
      >
        <ArrowLeft size={16} /> Back to Home
      </button>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20">
              <GraduationCap size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Student Portal</h2>
            <p className="text-slate-400 text-center">Login to take your exams</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Student Email</label>
              <input
                type="email"
                placeholder="student@quiz.com"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/25 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? 'Signing in...' : 'Sign In as Student'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center flex flex-col gap-3">
            <p className="text-sm text-slate-400">
              Don't have an account? <a href="/register" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium ml-1">Register here</a>
            </p>
            <button 
              onClick={fillDemoCredentials} 
              className="text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors underline decoration-slate-700 hover:decoration-cyan-400 underline-offset-4 mt-2"
            >
              Click here to use Demo Student Credentials
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
