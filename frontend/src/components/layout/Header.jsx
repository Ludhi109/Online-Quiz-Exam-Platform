import { Bell, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = ({ onMenuClick, title = "Dashboard", subtitle = "Overview" }) => {
  const { user } = useAuth();
  
  return (
    <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800">
      <div className="flex items-center gap-4">
        <button 
          className="md:hidden p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors"
          onClick={onMenuClick}
        >
          <Menu size={24} />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{title}</h1>
          <p className="text-sm md:text-base text-slate-400 hidden sm:block">{subtitle}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6">
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors bg-slate-800 rounded-full">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-slate-900"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 md:pl-6 border-l border-slate-800">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
            <p className="text-xs text-indigo-400 capitalize">{user?.role?.toLowerCase() || 'Student'}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
