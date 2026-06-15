import React, { useEffect, useState } from 'react';
import { History, Eye, ChevronLeft, ChevronRight, Clock, Tag } from 'lucide-react';
import api from '../utils/api';

const HistoryPage: React.FC = () => {
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAnalyses = async (p: number) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/analyses?page=${p}&limit=6`);
      setAnalyses(res.data.analyses);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Error al cargar el historial:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyses(page);
  }, [page]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-3">
          Historial de Análisis
        </h1>
        <p className="text-slate-400 text-lg">
          Revisa todos los análisis realizados anteriormente
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-2 border-violet-400/30 border-t-violet-400 rounded-full animate-spin"></div>
        </div>
      ) : analyses.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <History className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg mb-2">No hay análisis todavía</p>
          <p className="text-slate-500">Sube tu primera imagen para empezar a construir memoria visual</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyses.map((analysis: any) => (
              <div key={analysis._id} className="glass-card rounded-2xl overflow-hidden group">
                <div className="aspect-video overflow-hidden bg-black/20">
                  <img
                    src={`http://localhost:5000${analysis.imagePath}`}
                    alt="Imagen analizada"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center space-x-2 text-slate-500 text-xs mb-3">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatDate(analysis.createdAt)}</span>
                  </div>

                  {analysis.detectedLabels && analysis.detectedLabels.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {analysis.detectedLabels.slice(0, 4).map((d: any, i: number) => (
                        <span key={i} className="badge-label text-xs px-2 py-1 rounded-full">
                          {d.label}
                        </span>
                      ))}
                      {analysis.detectedLabels.length > 4 && (
                        <span className="badge-related text-xs px-2 py-1 rounded-full">
                          +{analysis.detectedLabels.length - 4} más
                        </span>
                      )}
                    </div>
                  )}

                  <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">
                    {analysis.llmResponse}
                  </p>

                  {analysis.memoryUsed && (
                    <div className="mt-3 flex items-center space-x-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 text-xs font-medium">Memoria utilizada</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-10">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="glass p-2.5 rounded-xl disabled:opacity-30 hover:bg-white/10 transition-all disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-slate-400 text-sm font-medium">
                Página {page} de {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="glass p-2.5 rounded-xl disabled:opacity-30 hover:bg-white/10 transition-all disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HistoryPage;
