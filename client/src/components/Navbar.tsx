import { Link, useLocation } from 'react-router-dom';
import { Camera, History, Brain } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="glass border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <Brain className="w-8 h-8 text-violet-400 group-hover:text-violet-300 transition-colors" />
            <span className="text-xl font-bold bg-gradient-to-r from-violet-300 to-purple-400 bg-clip-text text-transparent">
              VisionMemory
            </span>
          </Link>
          <div className="flex space-x-1">
            <Link 
              to="/" 
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/') 
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Subir</span>
            </Link>
            <Link 
              to="/history" 
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/history') 
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Historial</span>
            </Link>
            <Link 
              to="/memory" 
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/memory') 
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Brain className="w-4 h-4" />
              <span>Memoria</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
