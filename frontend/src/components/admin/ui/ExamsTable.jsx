import { Plus, BarChart2, Trash2, Edit3, Eye, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ExamsTable = ({ exams, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-800 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-700/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700/50">
              <th className="p-4 font-semibold">Exam Details</th>
              <th className="p-4 font-semibold">Questions</th>
              <th className="p-4 font-semibold">Duration</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {exams.map((exam) => (
              <tr key={exam.id} className="hover:bg-slate-700/30 transition-colors group">
                <td className="p-4">
                  <div className="font-semibold text-white">{exam.title}</div>
                  <div className="text-xs text-slate-400 mt-1">ID: {exam.id}</div>
                </td>
                <td className="p-4">
                  <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {exam._count?.questions || 0} Qs
                  </div>
                </td>
                <td className="p-4 text-slate-300 text-sm font-medium">
                  {exam.duration} mins
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => navigate(`/admin/exams/${exam.id}/questions`)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-400 hover:text-white hover:bg-indigo-500 rounded-md transition-all border border-transparent hover:border-indigo-400/30"
                      title="Add Questions"
                    >
                      <Plus size={14} /> Questions
                    </button>
                    <button 
                      className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-md transition-all"
                      title="Analytics"
                    >
                      <BarChart2 size={16} />
                    </button>
                    <button 
                      className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-md transition-all"
                      title="Edit"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all"
                      title="Delete"
                      onClick={() => onDelete && onDelete(exam.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {exams.length === 0 && (
              <tr>
                <td colSpan="4" className="p-12 text-center text-slate-400 bg-slate-800/50">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="p-4 bg-slate-700/50 rounded-full">
                      <FileText size={32} className="text-slate-500" />
                    </div>
                    <p className="font-medium text-slate-300">No exams available.</p>
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

export default ExamsTable;
