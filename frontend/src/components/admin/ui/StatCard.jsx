const StatCard = ({ title, value, icon, gradient = false }) => {
  return (
    <div className={`p-6 rounded-2xl shadow-lg border border-slate-700/50 relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 ${
      gradient ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white' : 'bg-slate-800 text-slate-300'
    }`}>
      {/* Decorative background glow */}
      {!gradient && (
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
      )}
      
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className={`text-sm font-medium mb-1 ${gradient ? 'text-indigo-100' : 'text-slate-400'}`}>
            {title}
          </p>
          <h3 className={`text-3xl font-bold ${gradient ? 'text-white' : 'text-white'}`}>
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl ${gradient ? 'bg-white/20' : 'bg-slate-700/50'}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
