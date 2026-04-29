import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../../context/LanguageContext';

const ActiveExam = () => {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [translatedQuestions, setTranslatedQuestions] = useState([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [examStarted, setExamStarted] = useState(false);
  const [cheatWarnings, setCheatWarnings] = useState(0);
  
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    const initExam = async () => {
      try {
        const qRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/student/exams/${id}/questions`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setQuestions(qRes.data);
        setTranslatedQuestions(qRes.data);
        setTimeLeft(30 * 60); 
        setExamStarted(true);
      } catch (err) {
        alert('Failed to load exam');
        navigate('/student');
      }
    };
    initExam();
  }, [id, navigate]);

  const translateText = async (text, targetLang) => {
    if (targetLang === 'en' || !text) return text;
    try {
      const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
      const data = await res.json();
      return data[0].map(item => item[0]).join('');
    } catch (e) {
      console.error('Translation error', e);
      return text; // fallback to original
    }
  };

  useEffect(() => {
    const translateAll = async () => {
      if (!questions.length) return;
      if (lang === 'en') {
        setTranslatedQuestions(questions);
        return;
      }
      
      setIsTranslating(true);
      try {
        const translated = await Promise.all(questions.map(async (q) => {
          const translatedText = await translateText(q.text, lang);
          let translatedOptions = q.options;
          
          try { 
            const options = JSON.parse(q.options || '[]'); 
            if (options.length > 0) {
              const transOpts = await Promise.all(options.map(opt => translateText(opt, lang)));
              translatedOptions = JSON.stringify(transOpts);
            }
          } catch(e) {}
          
          return { ...q, text: translatedText, options: translatedOptions };
        }));
        setTranslatedQuestions(translated);
      } catch (e) {
        console.error(e);
      } finally {
        setIsTranslating(false);
      }
    };
    
    translateAll();
  }, [lang, questions]);

  useEffect(() => {
    if (!examStarted) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const handleBlur = () => {
      setCheatWarnings(prev => {
        const newCount = prev + 1;
        alert(`Warning ${newCount}: Please do not switch tabs during the exam!`);
        return newCount;
      });
    };

    window.addEventListener('blur', handleBlur);

    return () => {
      clearInterval(timerRef.current);
      window.removeEventListener('blur', handleBlur);
    };
  }, [examStarted]);

  const handleSubmit = async () => {
    try {
      clearInterval(timerRef.current);
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/student/exams/${id}/submit`, { answers }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert(`Exam submitted! Your score: ${res.data.score}`);
      navigate('/student');
    } catch (err) {
      alert('Failed to submit exam');
    }
  };

  const handleAnswerChange = (qId, val) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!examStarted) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading exam...</div>;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', flex: 1, maxWidth: '900px', margin: '0 auto', width: '100%' }}>
      <div className="glass-panel" style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: '1rem', zIndex: 10 }}>
        <h3 style={{ margin: 0, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          Exam in Progress
          <select value={lang} onChange={(e) => setLang(e.target.value)} className="input-field" style={{ width: 'auto', padding: '0.25rem 0.5rem', fontSize: '0.9rem' }}>
            <option value="en">English</option>
            <option value="te">తెలుగు</option>
            <option value="hi">हिंदी</option>
          </select>
        </h3>
        
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: timeLeft < 300 ? 'var(--accent-danger)' : 'var(--accent-success)' }}>
          {formatTime(timeLeft)}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', opacity: isTranslating ? 0.5 : 1, transition: 'opacity 0.3s' }}>
        {translatedQuestions.map((q, idx) => {
          let options = [];
          try { options = JSON.parse(q.options || '[]'); } catch(e){}
          // Ensure we map back answers to original options if we are translating options.
          // For simplicity, we just use the translated option as the key, since this is a prototype, 
          // but strictly speaking answers should tie to an ID. Since the backend checks string equality, 
          // we might have an issue submitting translated options. 
          // Let's get the original question's options so we submit the ENGLISH text to the backend.
          const originalQ = questions.find(oq => oq.id === q.id);
          let originalOptions = [];
          try { originalOptions = JSON.parse(originalQ.options || '[]'); } catch(e){}

          return (
            <div key={q.id} className="glass-panel" style={{ padding: '2rem' }}>
              <h4 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', lineHeight: '1.5' }}>{idx + 1}. {q.text} <span style={{ color: 'var(--text-secondary)', fontWeight: 'normal', fontSize: '0.9rem' }}>({q.marks} Marks)</span></h4>
              
              {q.type === 'MCQ' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {options.map((opt, i) => (
                    <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.02)' }}>
                      <input 
                        type="radio" 
                        name={`q-${q.id}`} 
                        value={originalOptions[i]} 
                        checked={answers[q.id] === originalOptions[i]}
                        onChange={() => handleAnswerChange(q.id, originalOptions[i])}
                        style={{ transform: 'scale(1.2)' }}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}

              {q.type === 'SHORT_ANSWER' && (
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder={isTranslating ? "Translating..." : "Type your answer..."}
                  value={answers[q.id] || ''}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                />
              )}

              {q.type === 'CODING' && (
                <textarea 
                  className="input-field" 
                  style={{ minHeight: '150px', fontFamily: 'monospace' }}
                  placeholder={isTranslating ? "Translating..." : "Write your code here..."}
                  value={answers[q.id] || ''}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                />
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
        <button onClick={handleSubmit} className="btn-success" style={{ padding: '1rem 3rem', fontSize: '1.2rem', minWidth: '200px' }} disabled={isTranslating}>
          {isTranslating ? 'Translating...' : t('submit')}
        </button>
      </div>
    </div>
  );
};

export default ActiveExam;
