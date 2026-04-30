import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Award, Target, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';

const ExamResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  
  // If user tries to directly access the result page without submitting, kick them out
  if (!location.state) {
    navigate('/student');
    return null;
  }

  const { score, totalQuestions, correctAnswers, isAutoSubmit } = location.state;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-900/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-2xl relative z-10 animate-fade-in text-center">
        
        {isAutoSubmit && (
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Clock size={16} /> Time ran out! Exam auto-submitted.
          </div>
        )}

        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-10 md:p-14 shadow-2xl">
          
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <CheckCircle2 size={48} className="text-slate-950" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Exam Completed!</h1>
          <p className="text-slate-400 text-lg mb-10">Your submission has been successfully recorded in the system.</p>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-12">
            <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center">
              <Award size={28} className="text-indigo-400 mb-2" />
              <div className="text-sm text-slate-500 font-semibold uppercase tracking-wider mb-1">Total Score</div>
              <div className="text-3xl font-bold text-white">{score}</div>
            </div>
            <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center">
              <CheckCircle2 size={28} className="text-emerald-400 mb-2" />
              <div className="text-sm text-slate-500 font-semibold uppercase tracking-wider mb-1">Correct Answers</div>
              <div className="text-3xl font-bold text-white">{correctAnswers ?? '-'}</div>
            </div>
            <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center col-span-2">
              <Target size={28} className="text-blue-400 mb-2" />
              <div className="text-sm text-slate-500 font-semibold uppercase tracking-wider mb-1">Total Questions</div>
              <div className="text-3xl font-bold text-white">{totalQuestions}</div>
            </div>
          </div>

          <button 
            onClick={() => navigate('/student')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all border border-slate-700 hover:border-slate-600 shadow-lg"
          >
            Return to Dashboard <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamResult;
