import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { LogOut, LayoutDashboard, BarChart2, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export default function Navbar() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/70 border-b border-slate-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">HabitFlow</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link to="/analytics" className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
                <BarChart2 className="w-4 h-4" />
                Analytics
              </Link>
            </div>

            <div className="flex items-center gap-4 border-l border-slate-800 pl-6">
              <div className="flex flex-col items-end">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Level {profile?.level || 1}</span>
                <span className="text-sm font-medium text-white">{profile?.displayName}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-all"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/auth" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link 
              to="/auth" 
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
