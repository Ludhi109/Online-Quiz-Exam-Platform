import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, GraduationCap, Timer, BarChart3, Trophy, ChevronRight } from 'lucide-react';

const LandingPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    if (user && user.role === 'ADMIN') {
      navigate('/admin');
    } else {
      navigate('/admin-login');
    }
  };

  const handleStudentLogin = () => {
    if (user && user.role === 'STUDENT') {
      navigate('/student');
    } else {
      navigate('/student-login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden relative flex flex-col">
      {/* Abstract Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px]"></div>
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-blue-900/10 blur-[100px]"></div>
      </div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-slate-950/70 border-b border-slate-800/60 px-6 py-4 flex justify-between items-center transition-all">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <GraduationCap size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            QuizMaster
          </h1>
        </div>
        <div>
          {user ? (
            <button 
              onClick={logout} 
              className="px-5 py-2 text-sm font-medium rounded-full border border-slate-700 bg-slate-900 hover:bg-slate-800 hover:border-indigo-500 transition-all text-slate-300 hover:text-white"
            >
              Logout
            </button>
          ) : (
            <div className="flex gap-3">
              <button 
                onClick={() => navigate('/register')} 
                className="px-5 py-2 text-sm font-medium rounded-full bg-slate-800 hover:bg-slate-700 transition-all text-white border border-slate-700"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 z-10 relative">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            Next-Gen Assessment Platform
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Welcome to <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              QuizMaster Platform
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Secure, fast, and intelligent online examination system designed to evaluate and empower students anywhere in the world.
          </p>
        </div>

        {/* Two Main Entry Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mb-24">
          
          {/* Admin Card */}
          <div className="group relative bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.2)] overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-bl-full -z-10 group-hover:bg-purple-500/20 transition-colors"></div>
            
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
              <ShieldAlert size={28} className="text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-3">Admin Dashboard</h3>
            <p className="text-slate-400 mb-8 h-12">
              Create and configure exams, manage questions, and track overall student performance analytics.
            </p>
            
            <button 
              onClick={handleAdminLogin}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/25 active:scale-95 group-hover:shadow-purple-500/40"
            >
              Login as Admin <ChevronRight size={20} />
            </button>
          </div>

          {/* Student Card */}
          <div className="group relative bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(6,182,212,0.2)] overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-bl-full -z-10 group-hover:bg-cyan-500/20 transition-colors"></div>
            
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
              <GraduationCap size={28} className="text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-3">Student Dashboard</h3>
            <p className="text-slate-400 mb-8 h-12">
              Take assigned exams securely, view your past results, and check your ranking on the leaderboard.
            </p>
            
            <button 
              onClick={handleStudentLogin}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/25 active:scale-95 group-hover:shadow-cyan-500/40"
            >
              Login as Student <ChevronRight size={20} />
            </button>
          </div>

        </div>

        {/* Feature Highlights Section */}
        <div className="w-full max-w-5xl mt-12 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-white mb-2">Platform Features</h3>
            <p className="text-slate-400">Everything you need for seamless examinations</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-6 flex flex-col items-center text-center hover:bg-slate-800/50 transition-colors">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl mb-4">
                <Timer size={24} />
              </div>
              <h4 className="text-white font-semibold mb-2">Timer-Based Exams</h4>
              <p className="text-sm text-slate-400">Strictly enforced time limits for authentic test conditions.</p>
            </div>
            
            <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-6 flex flex-col items-center text-center hover:bg-slate-800/50 transition-colors">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl mb-4">
                <BarChart3 size={24} />
              </div>
              <h4 className="text-white font-semibold mb-2">Instant Results</h4>
              <p className="text-sm text-slate-400">Automated grading delivers performance metrics instantly.</p>
            </div>
            
            <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-6 flex flex-col items-center text-center hover:bg-slate-800/50 transition-colors">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl mb-4">
                <Trophy size={24} />
              </div>
              <h4 className="text-white font-semibold mb-2">Leaderboard Ranking</h4>
              <p className="text-sm text-slate-400">Gamified competitive ranking for top student performers.</p>
            </div>
          </div>
        </div>

      </main>
      
      {/* Footer */}
      <footer className="py-6 border-t border-slate-800/50 text-center text-slate-500 text-sm z-10">
        &copy; {new Date().getFullYear()} QuizMaster Platform. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
