import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../../context/LanguageContext';
import { Clock, CheckCircle2, Circle, AlertTriangle, Send } from 'lucide-react';

const ActiveExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang, setLang, t } = useLanguage();
  
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [translatedQuestions, setTranslatedQuestions] = useState([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem(`exam_answers_${id}`);
    return saved ? JSON.parse(saved) : {};
  });
  const [timeLeft, setTimeLeft] = useState(null);
  const [examStarted, setExamStarted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const timerRef = useRef(null);
  const questionRefs = useRef([]);

  // Fetch Exam and Questions
  useEffect(() => {
    const initExam = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch Exam details (we need duration, title, etc. We can get it from the available exams list for now)
        const examsRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/student/exams`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const currentExam = examsRes.data.find(e => e.id === parseInt(id));
        if (currentExam) setExam(currentExam);

        // Fetch Questions
        const qRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/student/exams/${id}/questions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setQuestions(qRes.data);
        setTranslatedQuestions(qRes.data);
        questionRefs.current = qRes.data.map(() => React.createRef());
        
        // Start Timer based on Exam duration or default 30 mins
        setTimeLeft((currentExam?.duration || 30) * 60); 
        setExamStarted(true);
      } catch (err) {
        console.error(err);
        navigate('/student');
      }
    };
    initExam();
  }, [id, navigate]);

  // Anti-Cheat & Refresh Protection
  useEffect(() => {
    if (!examStarted) return;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to leave? Your exam progress will be lost.';
    };

    const handleBlur = () => {
      alert(`Warning: Please do not switch tabs during the exam!`);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('blur', handleBlur);
    };
  }, [examStarted]);

  // Timer Logic
  useEffect(() => {
    if (!examStarted || isSubmitting) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          submitExam(true); // Auto-submit when time is up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [examStarted, isSubmitting]);

  // Translation Logic
  const translateText = async (text, targetLang) => {
    if (targetLang === 'en' || !text) return text;
    try {
      const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
      const data = await res.json();
      return data[0].map(item => item[0]).join('');
    } catch (e) {
      return text;
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

  const handleAnswerChange = (qId, val) => {
    setAnswers(prev => {
      const newAnswers = { ...prev, [qId]: val };
      localStorage.setItem(`exam_answers_${id}`, JSON.stringify(newAnswers));
      return newAnswers;
    });
  };

  const submitExam = async (isAutoSubmit = false) => {
    setIsSubmitting(true);
    setShowConfirmModal(false);
    clearInterval(timerRef.current);
    
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/student/exams/${id}/submit`, { answers }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      // Clear saved answers on successful submit
      localStorage.removeItem(`exam_answers_${id}`);
      
      // Navigate to results page with data
      navigate(`/student/exam/${id}/result`, { 
        state: { 
          score: res.data.score, 
          correctAnswers: res.data.correctAnswers,
          totalQuestions: questions.length,
          isAutoSubmit 
        } 
      });
    } catch (err) {
      alert('Failed to submit exam. Please try again.');
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    if (seconds === null) return '--:--';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const scrollToQuestion = (index) => {
    const el = document.getElementById(`question-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400 font-medium">Preparing your exam...</p>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questions.length;
  const isTimeLow = timeLeft < 60; // Less than 1 minute

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1120] to-[#1E1B4B] flex flex-col font-sans text-white">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 shadow-lg px-6 py-4 flex justify-between items-center transition-all">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white tracking-tight hidden md:block">
            {exam?.title || 'Exam in Progress'}
          </h1>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-1.5 flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Language:</span>
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value)} 
              className="bg-transparent text-white text-sm focus:outline-none appearance-none cursor-pointer"
            >
              <option value="en">English</option>
              <option value="te">Telugu</option>
              <option value="hi">Hindi</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className={`flex items-center gap-2 font-mono text-2xl font-bold px-4 py-2 rounded-xl transition-colors ${isTimeLow ? 'bg-red-500/10 text-red-500 border border-red-500/30 animate-pulse' : 'bg-slate-800/50 text-emerald-400 border border-slate-700'}`}>
            <Clock size={24} className={isTimeLow ? 'text-red-500' : 'text-emerald-500'} />
            {formatTime(timeLeft)}
          </div>
          
          <button 
            onClick={() => setShowConfirmModal(true)}
            disabled={isTranslating || isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#4f52e3] hover:to-[#7c4dec] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#6366F1]/25 active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : <><Send size={18} /> Submit Exam</>}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Background Gradients */}
        <div className="absolute top-0 left-[-10%] w-[50%] h-[50%] rounded-full bg-[#6366F1]/10 blur-[120px] pointer-events-none fixed"></div>
        <div className="absolute bottom-0 right-[-10%] w-[40%] h-[40%] rounded-full bg-[#8B5CF6]/10 blur-[100px] pointer-events-none fixed"></div>

        {/* Questions Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth pb-32">
          <div className="max-w-3xl mx-auto space-y-8" style={{ opacity: isTranslating ? 0.6 : 1, transition: 'opacity 0.3s' }}>
            {translatedQuestions.map((q, idx) => {
              const originalQ = questions.find(oq => oq.id === q.id);
              let options = [];
              let originalOptions = [];
              try { options = JSON.parse(q.options || '[]'); } catch(e){}
              try { originalOptions = JSON.parse(originalQ.options || '[]'); } catch(e){}

              return (
                <div 
                  key={q.id} 
                  id={`question-${idx}`}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all hover:border-white/20"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg border border-indigo-500/30">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="text-lg text-slate-100 font-medium leading-relaxed">
                        {q.text}
                      </h3>
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-2 flex items-center gap-2">
                        <span>{q.type.replace('_', ' ')}</span>
                        <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                        <span>{q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pl-14">
                    {q.type === 'MCQ' && (
                      <div className="grid grid-cols-1 gap-3">
                        {options.map((opt, i) => {
                          const isSelected = answers[q.id] === originalOptions[i];
                          return (
                            <label 
                              key={i} 
                              className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                                isSelected 
                                  ? 'bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
                                  : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                              }`}
                            >
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-indigo-400' : 'border-slate-600'}`}>
                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-indigo-400"></div>}
                              </div>
                              <input 
                                type="radio" 
                                name={`q-${q.id}`} 
                                className="hidden"
                                value={originalOptions[i]} 
                                checked={isSelected}
                                onChange={() => handleAnswerChange(q.id, originalOptions[i])}
                              />
                              <span className={`text-sm md:text-base ${isSelected ? 'text-indigo-100 font-medium' : 'text-slate-300'}`}>
                                {opt}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {q.type === 'SHORT_ANSWER' && (
                      <input 
                        type="text" 
                        className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-all placeholder:text-slate-500 shadow-inner" 
                        placeholder={isTranslating ? "Translating..." : "Type your exact answer here..."}
                        value={answers[q.id] || ''}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      />
                    )}

                    {q.type === 'CODING' && (
                      <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
                        <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                          <span className="text-xs text-slate-500 font-mono ml-2">solution.code</span>
                        </div>
                        <textarea 
                          className="w-full min-h-[200px] bg-transparent p-5 text-slate-300 font-mono text-sm focus:outline-none resize-y" 
                          placeholder={isTranslating ? "Translating..." : "// Write your code here...\n"}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                          spellCheck="false"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side Panel: Question Navigator */}
        <div className="w-80 bg-slate-900/50 backdrop-blur-md border-l border-slate-800 flex flex-col shadow-2xl hidden lg:flex">
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-white font-bold mb-4">Exam Progress</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Answered</span>
              <span className="text-emerald-400 font-bold">{answeredCount} / {totalQuestions}</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-500" 
                style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-4 gap-3">
              {questions.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined && answers[q.id].trim() !== '';
                return (
                  <button
                    key={q.id}
                    onClick={() => scrollToQuestion(idx)}
                    className={`h-12 rounded-xl flex items-center justify-center font-bold text-sm transition-all border ${
                      isAnswered 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' 
                        : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle size={32} className="text-yellow-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Submit Exam?</h3>
              <p className="text-slate-400">
                You have answered <strong className="text-white">{answeredCount}</strong> out of <strong className="text-white">{totalQuestions}</strong> questions. 
                {answeredCount < totalQuestions && " Are you sure you want to submit before finishing?"}
              </p>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors border border-slate-700"
              >
                Return to Exam
              </button>
              <button 
                onClick={() => submitExam(false)}
                className="flex-1 py-3 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#4f52e3] hover:to-[#7c4dec] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#6366F1]/25"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react'; // needed for React.createRef
export default ActiveExam;
