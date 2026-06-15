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
        {/* User and bell removed as requested */}
      </div>
    </div>
  );
};

export default Sidebar;
