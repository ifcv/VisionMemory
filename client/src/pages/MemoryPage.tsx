import React, { useEffect, useState } from 'react';
import { Search, RefreshCw, User } from 'lucide-react';
import api from '../utils/api';

const MemoryPage: React.FC = () => {
  const [memories, setMemories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMemories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/memory');
      setMemories(res.data);
    } catch (err) {
      console.error('Error al cargar la memoria:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  const filteredMemories = memories.filter(m => m.label.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Visual Memory Dashboard</h2>
          <div className="relative w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search visual memories..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 glass-input text-sm"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-slate-400">
          <span>Welcome, User!</span>
          <span>|</span>
          <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
          <span>|</span>
          <button onClick={fetchMemories} className="flex items-center space-x-1.5 hover:text-white transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-2 border-fuchsia-500/30 border-t-fuchsia-500 rounded-full animate-spin"></div>
        </div>
      ) : filteredMemories.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <p className="text-slate-400 text-lg">No memory entries found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMemories.map((mem: any, idx: number) => {
            // Apply special "glow/float" style to the first item to mimic the mockup's highlighted card
            const isHighlighted = idx === 0;

            return (
              <div 
                key={mem._id} 
                className={`flex flex-col p-5 relative overflow-hidden group ${
                  isHighlighted ? 'glass-card-glow z-10 scale-105' : 'glass-card'
                }`}
              >
                {/* Top section: Avatar/Thumbnail & Count */}
                <div className="flex justify-between items-start mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center shadow-inner overflow-hidden border border-white/5">
                    {/* Placeholder for actual thumbnail, using an icon for now */}
                    <User className="w-10 h-10 text-slate-300" />
                  </div>
                  
                  {/* Huge Count */}
                  <div className="text-right">
                    <span className="text-5xl font-black text-gradient-pink leading-none block">
                      {mem.count}
                    </span>
                  </div>
                </div>

                {/* Info section */}
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-white capitalize mb-1">{mem.label}</h3>
                  <p className="text-slate-400 text-sm italic">Seen: {mem.count} {mem.count === 1 ? 'time' : 'times'}</p>
                </div>

                {/* Related labels as pill tags */}
                {mem.relatedLabels && mem.relatedLabels.length > 0 && (
                  <div className="mt-auto flex flex-wrap gap-2">
                    {mem.relatedLabels.slice(0, 3).map((rl: string, i: number) => (
                      <span key={i} className="text-xs text-slate-300 px-2 py-1 bg-white/5 border border-white/10 rounded-md capitalize shadow-sm">
                        [{rl}]
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MemoryPage;
