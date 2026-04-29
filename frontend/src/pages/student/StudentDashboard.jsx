import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../../context/LanguageContext';
import { LayoutDashboard, FileText, Trophy, Clock, CheckCircle } from 'lucide-react';

const StudentDashboard = () => {
  const [exams, setExams] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const examsRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/student/exams`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setExams(examsRes.data);

      const leaderRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/student/leaderboard`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setLeaderboard(leaderRes.data);
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

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: activeTab === 'dashboard' ? 'var(--accent-primary)' : 'transparent', color: activeTab === 'dashboard' ? 'white' : 'var(--text-secondary)', border: activeTab === 'dashboard' ? 'none' : '1px solid var(--glass-border)' }}
        >
          <LayoutDashboard size={18} /> Dashboard
        </button>
        <button 
          onClick={() => setActiveTab('results')}
          className={activeTab === 'results' ? 'btn-primary' : 'btn-secondary'}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: activeTab === 'results' ? 'var(--accent-primary)' : 'transparent', color: activeTab === 'results' ? 'white' : 'var(--text-secondary)', border: activeTab === 'results' ? 'none' : '1px solid var(--glass-border)' }}
        >
          <FileText size={18} /> My Results
        </button>
      </div>

      {activeTab === 'dashboard' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LayoutDashboard size={24} /> Available Exams
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {exams.map(exam => {
                const attempt = exam.attempts?.[0];
                const isCompleted = attempt?.status === 'COMPLETED';
                return (
                  <div key={exam.id} style={{ background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--glass-border)' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{exam.title}</h3>
                      <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14}/> {exam.duration} mins</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><FileText size={14}/> {exam._count.questions} Questions</span>
                      </div>
                    </div>
                    <div>
                      {isCompleted ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-success)', fontWeight: 'bold', background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem 1rem', borderRadius: '4px' }}>
                          <CheckCircle size={18} /> Completed
                        </div>
                      ) : (
                        <button onClick={() => handleStart(exam.id)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {t('startExam')}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              {exams.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No active exams available.</p>}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-warning)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Trophy size={24} /> Leaderboard
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {leaderboard.map((entry, idx) => (
                <div key={entry.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', borderLeft: idx < 3 ? `4px solid var(--accent-warning)` : '4px solid transparent' }}>
                  <div>
                    <strong style={{ color: idx < 3 ? 'var(--accent-warning)' : 'white', fontSize: '1.1rem' }}>#{idx + 1} {entry.user.name}</strong>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{entry.exam.title}</div>
                  </div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--accent-primary)' }}>{entry.score} pts</div>
                </div>
              ))}
              {leaderboard.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No leaderboard data yet.</p>}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'results' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={24} /> My Exam Results
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {completedExams.map(exam => {
              const attempt = exam.attempts[0];
              return (
                <div key={exam.id} style={{ background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: '8px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', alignItems: 'center', border: '1px solid var(--glass-border)' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{exam.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
                      Completed on: {new Date(attempt.endTime).toLocaleDateString()} at {new Date(attempt.endTime).toLocaleTimeString()}
                    </p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Score Obtained</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-success)' }}>{attempt.score}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                      <CheckCircle size={16} /> Completed
                    </span>
                  </div>
                </div>
              );
            })}
            {completedExams.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                <FileText size={48} style={{ opacity: 0.5, margin: '0 auto 1rem auto' }} />
                <p>You haven't completed any exams yet.</p>
                <button onClick={() => setActiveTab('dashboard')} className="btn-primary" style={{ marginTop: '1rem' }}>Browse Exams</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
