import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Camera, History, Brain, LayoutDashboard, Settings, FolderOpen, Image as ImageIcon, Search, Bell } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 flex flex-col glass border-r border-white/5 h-screen sticky top-0 shrink-0">
      <div className="p-8 flex flex-col items-center">
        <div className="relative mb-2">
          {/* Logo Glow */}
          <div className="absolute inset-0 bg-fuchsia-500 blur-xl opacity-40 rounded-full"></div>
          <Brain className="w-12 h-12 text-fuchsia-400 relative z-10" />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-fuchsia-400 to-purple-500 bg-clip-text text-transparent">
          VisionMemory
        </h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        <Link 
          to="/" 
          className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            isActive('/') 
              ? 'sidebar-link-active' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <Camera className="w-5 h-5" />
          <span>Upload</span>
        </Link>
        <Link 
          to="/history" 
          className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            isActive('/history') 
              ? 'sidebar-link-active' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <History className="w-5 h-5" />
          <span>History Log</span>
        </Link>
        <Link 
          to="/memory" 
          className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            isActive('/memory') 
              ? 'sidebar-link-active' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <Brain className="w-5 h-5" />
          <span>Memory Dashboard</span>
        </Link>
        
        {/* Mock Links to match image */}
        <div className="pt-6 pb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          More
        </div>
        <a href="#" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all">
          <FolderOpen className="w-5 h-5" />
          <span>Projects</span>
        </a>
        <a href="#" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all">
          <ImageIcon className="w-5 h-5" />
          <span>Gallery</span>
        </a>
        <a href="#" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </a>
      </nav>
    </div>
  );
};

export const Topbar = () => {
  return (
    <div className="flex justify-between items-center px-10 py-6">
      <div className="relative w-96">
        <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 transform -translate-y-1/2" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="w-full pl-12 pr-4 py-2.5 glass-input text-sm placeholder-slate-500"
        />
      </div>
      <div className="flex items-center space-x-6">
        <button className="relative text-slate-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-pink-500 rounded-full"></span>
        </button>
        <div className="flex items-center space-x-3 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-purple-500/30">
            DF
          </div>
          <span className="text-sm font-medium text-slate-200">Diego Fernández</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
