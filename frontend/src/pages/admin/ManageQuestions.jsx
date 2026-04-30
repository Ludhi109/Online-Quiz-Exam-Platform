import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, Plus, Save, Trash2, Edit3, Code, List, FileText } from 'lucide-react';

const ManageQuestions = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [exam, setExam] = useState(null);
  
  // Form States
  const [type, setType] = useState('MCQ');
  const [text, setText] = useState('');
  const [marks, setMarks] = useState(1);
  const [options, setOptions] = useState({ A: '', B: '', C: '', D: '' });
  const [correctAnswer, setCorrectAnswer] = useState('A');
  const [shortAnswer, setShortAnswer] = useState('');
  
  // Coding Form States
  const [inputFormat, setInputFormat] = useState('');
  const [outputFormat, setOutputFormat] = useState('');
  const [sampleInput, setSampleInput] = useState('');
  const [sampleOutput, setSampleOutput] = useState('');

  useEffect(() => {
    fetchQuestions();
    fetchExamDetails();
  }, [examId]);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/exams/${examId}/questions`);
      setQuestions(res.data);
    } catch (error) {
      console.error('Failed to fetch questions', error);
    }
  };

  const fetchExamDetails = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/exams`);
      const currentExam = res.data.find(e => e.id === parseInt(examId));
      if (currentExam) setExam(currentExam);
    } catch (error) {
      console.error('Failed to fetch exam details', error);
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!text.trim()) {
      alert("Question text is required");
      return;
    }

    let payload = { type, text, marks: parseInt(marks) };

    if (type === 'MCQ') {
      if (!options.A || !options.B || !options.C || !options.D) {
        alert("All 4 options must be filled for MCQ.");
        return;
      }
      payload.options = [options.A, options.B, options.C, options.D];
      payload.correctAnswer = options[correctAnswer]; // Map A/B/C/D to actual value
    } else if (type === 'SHORT_ANSWER') {
      if (!shortAnswer.trim()) {
        alert("Correct answer is required for Short Answer.");
        return;
      }
      payload.correctAnswer = shortAnswer;
    } else if (type === 'CODING') {
      if (!sampleInput.trim() || !sampleOutput.trim()) {
        alert("Sample input and output are required for Coding questions.");
        return;
      }
      payload.correctAnswer = sampleOutput; // Usually hidden test cases are used, but we store sampleOutput as correct for basic implementation
      payload.inputFormat = inputFormat;
      payload.outputFormat = outputFormat;
      payload.sampleInput = sampleInput;
      payload.sampleOutput = sampleOutput;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/exams/${examId}/questions`, payload);
      resetForm();
      fetchQuestions();
    } catch (error) {
      console.error('Failed to save question', error);
      alert('Error saving question');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/questions/${id}`);
        fetchQuestions();
      } catch (error) {
        console.error('Failed to delete', error);
      }
    }
  };

  const resetForm = () => {
    setText('');
    setMarks(1);
    setOptions({ A: '', B: '', C: '', D: '' });
    setCorrectAnswer('A');
    setShortAnswer('');
    setInputFormat('');
    setOutputFormat('');
    setSampleInput('');
    setSampleOutput('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <button 
              onClick={() => navigate('/admin')}
              className="flex items-center text-slate-400 hover:text-white transition-colors mb-2 text-sm"
            >
              <ChevronLeft size={16} className="mr-1" /> Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Manage Questions
            </h1>
            <p className="text-slate-400 mt-1">
              {exam ? `Exam: ${exam.title} (${exam.duration} mins)` : 'Loading exam details...'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Question Form */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md sticky top-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Plus size={20} className="text-indigo-400"/> Add Question
              </h2>

              <form onSubmit={handleAddQuestion} className="space-y-5">
                
                {/* Type Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Question Type</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-all appearance-none"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="MCQ">Multiple Choice (MCQ)</option>
                    <option value="SHORT_ANSWER">Short Answer</option>
                    <option value="CODING">Coding Problem</option>
                  </select>
                </div>

                {/* Common Fields */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Question Text *</label>
                  <textarea 
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-all resize-none h-24"
                    placeholder="Enter the question description..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Marks</label>
                  <input 
                    type="number" 
                    min="1"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-all"
                    value={marks}
                    onChange={(e) => setMarks(e.target.value)}
                  />
                </div>

                {/* MCQ Specific Fields */}
                {type === 'MCQ' && (
                  <div className="space-y-4 pt-2 border-t border-slate-800">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Options</label>
                    {['A', 'B', 'C', 'D'].map(opt => (
                      <div key={opt} className="flex items-center gap-3">
                        <span className="text-sm font-bold text-slate-500 w-4">{opt}</span>
                        <input 
                          type="text" 
                          className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-all"
                          placeholder={`Option ${opt}`}
                          value={options[opt]}
                          onChange={(e) => setOptions({...options, [opt]: e.target.value})}
                          required
                        />
                      </div>
                    ))}
                    
                    <div className="pt-2">
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Correct Answer</label>
                      <select 
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-all appearance-none"
                        value={correctAnswer}
                        onChange={(e) => setCorrectAnswer(e.target.value)}
                      >
                        <option value="A">Option A</option>
                        <option value="B">Option B</option>
                        <option value="C">Option C</option>
                        <option value="D">Option D</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Short Answer Specific Fields */}
                {type === 'SHORT_ANSWER' && (
                  <div className="space-y-4 pt-2 border-t border-slate-800">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Correct Answer (Text) *</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-all"
                        placeholder="e.g. Paris"
                        value={shortAnswer}
                        onChange={(e) => setShortAnswer(e.target.value)}
                        required
                      />
                      <p className="text-xs text-slate-500 mt-2">Students must type this exact text to score marks.</p>
                    </div>
                  </div>
                )}

                {/* Coding Specific Fields */}
                {type === 'CODING' && (
                  <div className="space-y-4 pt-2 border-t border-slate-800">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Input Format</label>
                      <textarea 
                        className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 text-sm h-16"
                        placeholder="e.g. First line contains integer N..."
                        value={inputFormat}
                        onChange={(e) => setInputFormat(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Output Format</label>
                      <textarea 
                        className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 text-sm h-16"
                        placeholder="e.g. Print single integer..."
                        value={outputFormat}
                        onChange={(e) => setOutputFormat(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Sample Input *</label>
                        <textarea 
                          className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 font-mono text-xs h-24"
                          placeholder="5"
                          value={sampleInput}
                          onChange={(e) => setSampleInput(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Sample Output *</label>
                        <textarea 
                          className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 font-mono text-xs h-24"
                          placeholder="120"
                          value={sampleOutput}
                          onChange={(e) => setSampleOutput(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-indigo-500/25 active:scale-95 flex items-center justify-center gap-2 mt-4"
                >
                  <Save size={18} /> Save Question
                </button>
              </form>
            </div>
          </div>

          {/* Questions List */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <List size={20} className="text-indigo-400"/> Added Questions ({questions.length})
              </h2>

              <div className="space-y-4">
                {questions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-12 bg-slate-800/30 rounded-xl border border-slate-700/50 border-dashed">
                    <FileText size={48} className="text-slate-600 mb-4" />
                    <p className="font-medium text-slate-400">No questions added yet.</p>
                    <p className="text-sm text-slate-500">Use the form on the left to create the first question.</p>
                  </div>
                ) : (
                  questions.map((q, idx) => (
                    <div key={q.id} className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 hover:border-indigo-500/50 transition-colors group">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="bg-slate-900 text-slate-400 text-xs font-bold px-2.5 py-1 rounded-md border border-slate-700">
                              Q{idx + 1}
                            </span>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                              q.type === 'MCQ' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 
                              q.type === 'CODING' ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' : 
                              'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}>
                              {q.type.replace('_', ' ')}
                            </span>
                            <span className="text-xs text-slate-500">{q.marks} Marks</span>
                          </div>
                          <p className="text-white text-sm font-medium leading-relaxed mb-3">
                            {q.text}
                          </p>
                          
                          {/* Preview Details based on Type */}
                          {q.type === 'MCQ' && q.options && (
                            <div className="grid grid-cols-2 gap-2 mt-3">
                              {JSON.parse(q.options).map((opt, i) => {
                                const isCorrect = opt === q.correctAnswer;
                                return (
                                  <div key={i} className={`px-3 py-2 rounded-lg text-xs border ${isCorrect ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-medium' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>
                                    {String.fromCharCode(65 + i)}. {opt}
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {q.type === 'SHORT_ANSWER' && (
                            <div className="mt-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-lg inline-block">
                              <span className="text-xs text-emerald-500 font-semibold mr-2">Answer:</span>
                              <span className="text-sm text-emerald-300">{q.correctAnswer}</span>
                            </div>
                          )}

                          {q.type === 'CODING' && (
                            <div className="mt-3 grid grid-cols-2 gap-3">
                              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-1">Sample Input</span>
                                <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap">{q.sampleInput}</pre>
                              </div>
                              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-1">Sample Output</span>
                                <pre className="text-xs font-mono text-emerald-400 whitespace-pre-wrap">{q.sampleOutput}</pre>
                              </div>
                            </div>
                          )}

                        </div>
                        
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                            <Edit3 size={16} />
                          </button>
                          <button onClick={() => handleDelete(q.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ManageQuestions;
