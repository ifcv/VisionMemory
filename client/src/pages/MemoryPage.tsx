import React, { useEffect, useState } from 'react';
import { Brain, Trash2, Eye, Link, BarChart3 } from 'lucide-react';
import api from '../utils/api';

const MemoryPage: React.FC = () => {
  const [memories, setMemories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const deleteMemory = async (label: string) => {
    if (!confirm(`¿Eliminar la memoria de "${label}"? Esta acción no se puede deshacer.`)) return;
    try {
      await api.delete(`/api/memory/${label}`);
      setMemories(prev => prev.filter(m => m.label !== label));
    } catch (err) {
      console.error('Error al eliminar:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-3">
          Memoria Visual
        </h1>
        <p className="text-slate-400 text-lg">
          Base de conocimiento acumulada a partir de tus análisis
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-2 border-violet-400/30 border-t-violet-400 rounded-full animate-spin"></div>
        </div>
      ) : memories.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <Brain className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg mb-2">La memoria está vacía</p>
          <p className="text-slate-500">Analiza algunas imágenes para que el sistema empiece a aprender</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {memories.map((mem: any) => (
            <div key={mem._id} className="glass-card rounded-2xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-200 capitalize">{mem.label}</h3>
                    <div className="flex items-center space-x-1 text-slate-500 text-xs">
                      <BarChart3 className="w-3 h-3" />
                      <span>Visto {mem.count} {mem.count === 1 ? 'vez' : 'veces'}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteMemory(mem.label)}
                  className="text-slate-600 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10"
                  title="Eliminar memoria"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Observations */}
              {mem.observations && mem.observations.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-medium mb-2">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Observaciones</span>
                  </div>
                  <ul className="space-y-1.5">
                    {mem.observations.slice(0, 5).map((obs: string, i: number) => (
                      <li key={i} className="text-slate-400 text-sm flex items-start space-x-2">
                        <span className="text-violet-400/60 mt-1.5 flex-shrink-0">•</span>
                        <span className="leading-relaxed">{obs}</span>
                      </li>
                    ))}
                    {mem.observations.length > 5 && (
                      <li className="text-slate-500 text-xs italic">
                        ...y {mem.observations.length - 5} observaciones más
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Related Labels */}
              {mem.relatedLabels && mem.relatedLabels.length > 0 && (
                <div>
                  <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-medium mb-2">
                    <Link className="w-3.5 h-3.5" />
                    <span>Etiquetas relacionadas</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {mem.relatedLabels.map((rl: string, i: number) => (
                      <span key={i} className="badge-related text-xs px-2.5 py-1 rounded-full capitalize">
                        {rl}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemoryPage;
