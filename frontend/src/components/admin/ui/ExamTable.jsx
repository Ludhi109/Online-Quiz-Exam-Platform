import { Plus, BarChart2, Trash2, Edit3, Eye, FileText } from 'lucide-react';

const ExamTable = ({ exams, onAddQuestions, onDelete }) => {
  return (
    <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/50 text-slate-400 text-sm border-b border-slate-700">
              <th className="p-4 font-medium">Exam Details</th>
              <th className="p-4 font-medium">Questions</th>
              <th className="p-4 font-medium">Duration</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {exams.map((exam) => (
              <tr key={exam.id} className="hover:bg-slate-700/30 transition-colors group">
                <td className="p-4">
                  <div className="font-semibold text-white">{exam.title}</div>
                  <div className="text-xs text-slate-400 mt-1">ID: {exam.id}</div>
                </td>
                <td className="p-4">
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {exam._count?.questions || 0} Qs
                  </div>
                </td>
                <td className="p-4 text-slate-300">
                  {exam.duration} mins
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onAddQuestions(exam)}
                      className="p-2 text-indigo-400 hover:text-white hover:bg-indigo-500 rounded-lg transition-all"
                      title="Add Questions"
                    >
                      <Plus size={18} />
                    </button>
                    <button 
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition-all"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all"
                      title="Analytics"
                    >
                      <BarChart2 size={18} />
                    </button>
                    <button 
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                      title="Delete"
                      onClick={() => onDelete && onDelete(exam.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {exams.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="p-4 bg-slate-800 rounded-full">
                      <FileText size={32} className="text-slate-500" />
                    </div>
                    <p>No exams available.</p>
                    <p className="text-sm">Create a new exam to get started.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExamTable;
