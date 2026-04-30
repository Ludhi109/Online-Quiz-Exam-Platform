import { Bell } from 'lucide-react';

const TopHeader = () => {
  return (
    <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-slate-400">Manage your exams and track student performance</p>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
          <Bell size={24} />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-slate-900"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-6 border-l border-slate-800">
          <div className="text-right">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-indigo-400">Administrator</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
            A
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
