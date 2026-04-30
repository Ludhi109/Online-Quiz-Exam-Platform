import { FileText, Users, Award } from 'lucide-react';

const DashboardCards = ({ totalExams, activeStudents, averageScore }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Primary Gradient Card */}
      <div className="p-6 rounded-2xl shadow-lg border border-indigo-500/30 relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
        <div className="flex justify-between items-start relative z-10">
          <div>
            <p className="text-sm font-medium mb-1 text-indigo-100">Total Exams</p>
            <h3 className="text-4xl font-bold text-white">{totalExams}</h3>
          </div>
          <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
            <FileText size={24} className="text-white" />
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -right-4 -bottom-4 opacity-20">
          <FileText size={100} />
        </div>
      </div>

      {/* Dark Glass Card 1 */}
      <div className="p-6 rounded-2xl shadow-lg border border-slate-700/50 relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 bg-slate-800 text-slate-300">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
        <div className="flex justify-between items-start relative z-10">
          <div>
            <p className="text-sm font-medium mb-1 text-slate-400">Active Students</p>
            <h3 className="text-4xl font-bold text-white">{activeStudents}</h3>
          </div>
          <div className="p-3 rounded-xl bg-slate-700/50">
            <Users size={24} className="text-indigo-400" />
          </div>
        </div>
      </div>

      {/* Dark Glass Card 2 */}
      <div className="p-6 rounded-2xl shadow-lg border border-slate-700/50 relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 bg-slate-800 text-slate-300">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
        <div className="flex justify-between items-start relative z-10">
          <div>
            <p className="text-sm font-medium mb-1 text-slate-400">Average Score</p>
            <h3 className="text-4xl font-bold text-white">{averageScore}</h3>
          </div>
          <div className="p-3 rounded-xl bg-slate-700/50">
            <Award size={24} className="text-purple-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;
