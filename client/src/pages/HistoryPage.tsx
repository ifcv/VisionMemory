import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
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
    return new Date(dateStr).toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="w-full">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-white mb-2">History Log</h2>
        <p className="text-slate-400">Review past image analyses and AI inferences</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-2 border-fuchsia-500/30 border-t-fuchsia-500 rounded-full animate-spin"></div>
        </div>
      ) : analyses.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <p className="text-slate-400 text-lg mb-2">No past analyses found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {analyses.map((analysis: any) => (
              <div key={analysis._id} className="glass-card overflow-hidden group flex flex-col">
                <div className="h-48 overflow-hidden bg-black/40 relative">
                  <img
                    src={`http://localhost:5000${analysis.imagePath}`}
                    alt="Analyzed"
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute top-4 right-4 glass-light px-3 py-1.5 rounded-lg flex items-center space-x-1.5 backdrop-blur-md">
                    <Clock className="w-3.5 h-3.5 text-slate-300" />
                    <span className="text-xs font-semibold text-white">{formatDate(analysis.createdAt)}</span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  {analysis.detectedLabels && analysis.detectedLabels.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {analysis.detectedLabels.slice(0, 3).map((d: any, i: number) => (
                        <span key={i} className="text-xs px-2.5 py-1 rounded-md font-medium bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20">
                          {d.label}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">
                    {analysis.llmResponse}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-12">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-ghost px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-slate-400 text-sm font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-ghost px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HistoryPage;
