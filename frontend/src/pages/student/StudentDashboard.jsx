import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../../context/LanguageContext';
import { LayoutDashboard, FileText, Trophy, Clock, CheckCircle, Play, Sparkles } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';

const StudentDashboard = () => {
  const [exams, setExams] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeLayoutTab, setActiveLayoutTab] = useState('dashboard');
  const [activeSectionTab, setActiveSectionTab] = useState('dashboard');
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const examsRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/student/exams`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setExams(examsRes.data);

        const leaderRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/student/leaderboard`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setLeaderboard(leaderRes.data);
      } catch (error) {
        console.error("Failed to fetch student data", error);
      }
    };
    fetchData();
  }, []);

  const handleStart = async (examId) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/student/exams/${examId}/start`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      navigate(`/student/exam/${examId}`);
    } catch (error) {
      alert(error.response?.data?.error || 'Cannot start exam');
    }
  };

  const completedExams = exams.filter(exam => exam.attempts?.[0]?.status === 'COMPLETED');

  const menuItems = [
    { id: 'dashboard', label: 'My Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'results', label: 'My Results', icon: <FileText size={20} /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy size={20} /> },
  ];

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeTab={activeLayoutTab}
      setActiveTab={setActiveLayoutTab}
      sidebarTitle="Student Portal"
      headerTitle="Welcome Back!"
      headerSubtitle="Ready to ace your next exam?"
    >
      <div className="animate-fade-in pb-12">
        
        {/* Visual Tabs Section */}
        <div className="flex border-b border-slate-800 mb-8">
          <button 
            onClick={() => setActiveSectionTab('dashboard')}
            className={`px-6 py-3 font-medium text-sm transition-all relative ${
              activeSectionTab === 'dashboard' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Available Exams
            {activeSectionTab === 'dashboard' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)] rounded-t-full"></div>
            )}
          </button>
          <button 
            onClick={() => setActiveSectionTab('results')}
            className={`px-6 py-3 font-medium text-sm transition-all relative ${
              activeSectionTab === 'results' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Past Results
            {activeSectionTab === 'results' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)] rounded-t-full"></div>
            )}
          </button>
        </div>

        {activeSectionTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content: Available Exams */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={20} className="text-indigo-400" />
                <h2 className="text-lg font-bold text-white">Recommended For You</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {exams.map(exam => {
                  const attempt = exam.attempts?.[0];
                  const isCompleted = attempt?.status === 'COMPLETED';
                  
                  return (
                    <div key={exam.id} className="bg-slate-800/80 rounded-2xl border border-slate-700/50 p-6 shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group backdrop-blur-sm flex flex-col h-full">
                      <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
                      
                      <div className="flex-1 relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold text-white leading-tight">{exam.title}</h3>
                          {isCompleted && (
                            <div className="bg-emerald-500/10 text-emerald-400 p-1.5 rounded-full border border-emerald-500/20">
                              <CheckCircle size={16} />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-2 mb-6">
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <Clock size={16} className="text-indigo-400" />
                            <span>{exam.duration} Minutes</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <FileText size={16} className="text-purple-400" />
                            <span>{exam._count?.questions || 0} Questions</span>
                          </div>
                        </div>
                      </div>

                      <div className="relative z-10 mt-auto">
                        {isCompleted ? (
                          <div className="w-full py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 font-medium text-center border border-emerald-500/20 flex items-center justify-center gap-2">
                            <CheckCircle size={18} />
                            <span>Completed</span>
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleStart(exam.id)} 
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
                          >
                            <Play size={18} fill="currentColor" />
                            <span>{t('startExam') || 'Start Exam'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {exams.length === 0 && (
                  <div className="col-span-1 sm:col-span-2 text-center p-12 bg-slate-800/30 rounded-2xl border border-slate-700/50 border-dashed text-slate-400">
                    <FileText size={48} className="mx-auto mb-4 opacity-50 text-indigo-400" />
                    <p>No active exams available.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Content: Leaderboard */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800/80 rounded-2xl border border-slate-700/50 p-6 shadow-lg sticky top-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700/50">
                  <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500 border border-amber-500/20">
                    <Trophy size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-white">Top Performers</h2>
                </div>
                
                <div className="space-y-4">
                  {leaderboard.map((entry, idx) => (
                    <div key={entry.id} className="flex items-center gap-4 group">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border ${
                        idx === 0 ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                        idx === 1 ? 'bg-slate-300/20 text-slate-300 border-slate-400/30' :
                        idx === 2 ? 'bg-amber-700/20 text-amber-600 border-amber-700/30' :
                        'bg-slate-700/50 text-slate-400 border-slate-600'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold truncate ${idx < 3 ? 'text-white' : 'text-slate-300'}`}>
                          {entry.user?.name || 'Anonymous'}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{entry.exam?.title}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-bold text-indigo-400">{entry.score}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">Points</div>
                      </div>
                    </div>
                  ))}
                  {leaderboard.length === 0 && (
                    <div className="text-center py-8 text-slate-500 text-sm">
                      <Trophy size={32} className="mx-auto mb-2 opacity-30" />
                      No leaderboard data yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSectionTab === 'results' && (
          <div className="bg-slate-800/80 rounded-2xl shadow-lg border border-slate-700/50 overflow-hidden backdrop-blur-sm">
            <div className="p-6 border-b border-slate-700/50 flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">
                <CheckCircle size={24} />
              </div>
              <h2 className="text-xl font-bold text-white">My Exam Results</h2>
            </div>
            
            <div className="divide-y divide-slate-700/50">
              {completedExams.map(exam => {
                const attempt = exam.attempts[0];
                return (
                  <div key={exam.id} className="p-6 hover:bg-slate-700/30 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">{exam.title}</h3>
                      <p className="text-sm text-slate-400 flex items-center gap-2">
                        <Clock size={14} />
                        Completed: {new Date(attempt.endTime).toLocaleDateString()} at {new Date(attempt.endTime).toLocaleTimeString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                      <div className="text-center">
                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Score</div>
                        <div className="text-2xl font-black text-emerald-400 leading-none">{attempt.score}</div>
                      </div>
                      
                      <div className="shrink-0">
                        <span className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-xl text-sm font-bold border border-emerald-500/20">
                          <CheckCircle size={16} /> Passed
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {completedExams.length === 0 && (
                <div className="text-center p-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-700/50 mb-4">
                    <FileText size={32} className="text-slate-500" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-300 mb-2">No Results Yet</h3>
                  <p className="text-slate-500 max-w-sm mx-auto">
                    You haven't completed any exams. Return to the dashboard to start an available exam.
                  </p>
                  <button 
                    onClick={() => setActiveSectionTab('dashboard')} 
                    className="mt-6 px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-colors"
                  >
                    Browse Exams
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
