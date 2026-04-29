import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../../context/LanguageContext';
import AddQuestionModal from '../../components/admin/AddQuestionModal';

const AdminDashboard = () => {
  const [exams, setExams] = useState([]);
  const [newExam, setNewExam] = useState({ title: '', duration: 30 });
  const [selectedExamForQuestion, setSelectedExamForQuestion] = useState(null);
  const { t } = useLanguage();

  const fetchExams = async () => {
    const res = await axios.get('http://localhost:5000/api/admin/exams');
    setExams(res.data);
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleCreateExam = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/admin/exams', {
      title: newExam.title,
      duration: parseInt(newExam.duration)
    });
    setNewExam({ title: '', duration: 30 });
    fetchExams();
  };

  return (
    <>
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-primary)' }}>Manage Exams</h2>
          
          <form onSubmit={handleCreateExam} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <input 
              className="input-field" 
              placeholder="Exam Title" 
              value={newExam.title} 
              onChange={(e) => setNewExam({...newExam, title: e.target.value})} 
              required 
              style={{ flex: 1 }}
            />
            <input 
              type="number" 
              className="input-field" 
              style={{ width: '120px' }} 
              placeholder="Duration (min)" 
              value={newExam.duration} 
              onChange={(e) => setNewExam({...newExam, duration: e.target.value})} 
              required 
            />
            <button type="submit" className="btn-primary">Create</button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {exams.map(exam => (
              <div key={exam.id} style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0 }}>{exam.title}</h3>
                  <small style={{ color: 'var(--text-secondary)' }}>{exam.duration} mins | {exam._count.questions} Questions</small>
                </div>
                <button className="btn-success" onClick={() => setSelectedExamForQuestion(exam)}>Add Q's</button>
              </div>
            ))}
            {exams.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No exams available. Create one above.</p>}
          </div>
        </div>
      </div>

      {selectedExamForQuestion && (
        <AddQuestionModal 
          exam={selectedExamForQuestion} 
          onClose={() => setSelectedExamForQuestion(null)} 
          onQuestionAdded={fetchExams}
        />
      )}
    </>
  );
};

export default AdminDashboard;
