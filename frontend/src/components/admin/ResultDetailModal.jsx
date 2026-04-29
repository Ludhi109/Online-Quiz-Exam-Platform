import { useState, useEffect } from 'react';
import axios from 'axios';

const ResultDetailModal = ({ result, onClose }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/admin/exams/${result.examId}/questions`);
        setQuestions(res.data);
      } catch (error) {
        console.error('Failed to fetch questions', error);
      } finally {
        setLoading(false);
      }
    };
    if (result) fetchQuestions();
  }, [result]);

  if (!result) return null;

  let studentAnswers = {};
  try {
    studentAnswers = JSON.parse(result.answers || '{}');
  } catch (e) {}

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', 
      justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div className="glass-panel" style={{ 
        width: '90%', maxWidth: '800px', maxHeight: '90vh', 
        overflowY: 'auto', padding: '2rem', position: 'relative'
      }}>
        <button 
          onClick={onClose} 
          className="btn-danger" 
          style={{ position: 'absolute', top: '1rem', right: '1rem' }}
        >
          Close
        </button>
        
        <h2 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>
          Result Details: {result.user.name}
        </h2>
        <div style={{ marginBottom: '2rem', display: 'flex', gap: '2rem', color: 'var(--text-secondary)' }}>
          <span><strong>Exam:</strong> {result.exam.title}</span>
          <span><strong>Score:</strong> <span style={{ color: 'var(--accent-success)' }}>{result.score} Marks</span></span>
        </div>

        {loading ? (
          <p>Loading questions...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {questions.map((q, idx) => {
              const studentAnswer = studentAnswers[q.id] || 'Not answered';
              const isCorrect = studentAnswer.toLowerCase() === q.correctAnswer.toLowerCase();
              
              return (
                <div key={q.id} style={{ 
                  background: 'var(--bg-tertiary)', padding: '1.5rem', 
                  borderRadius: '8px', borderLeft: `4px solid ${isCorrect ? 'var(--accent-success)' : 'var(--accent-danger)'}`
                }}>
                  <h4 style={{ marginBottom: '0.5rem' }}>Q{idx + 1}. {q.text}</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.95rem' }}>
                    <div>
                      <strong>Student Answer: </strong>
                      <span style={{ color: isCorrect ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                        {studentAnswer}
                      </span>
                    </div>
                    <div>
                      <strong>Correct Answer: </strong>
                      <span style={{ color: 'var(--accent-success)' }}>{q.correctAnswer}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultDetailModal;
