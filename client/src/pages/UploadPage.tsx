import React, { useState, useCallback } from 'react';
import { Upload, Loader2, Sparkles, Brain, Eye } from 'lucide-react';
import ImageCanvas from '../components/ImageCanvas';
import api from '../utils/api';

const UploadPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setAnalysisResult(null);
    setError(null);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, []);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = () => setDragOver(false);

  const onSubmit = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await api.post('/api/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAnalysisResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al analizar la imagen. Asegúrate de que todos los servicios estén activos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-3">
          Análisis Visual con IA
        </h1>
        <p className="text-slate-400 text-lg">
          Sube una imagen para detectar objetos, analizar la escena y construir memoria visual
        </p>
      </div>

      {/* Upload zone */}
      <div className="glass-card rounded-2xl p-8 mb-8">
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
            dragOver 
              ? 'border-violet-400 bg-violet-500/10' 
              : 'border-white/15 hover:border-white/25 hover:bg-white/5'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className={`w-12 h-12 mx-auto mb-4 transition-colors ${dragOver ? 'text-violet-400' : 'text-slate-500'}`} />
            <p className="text-slate-300 font-medium text-lg mb-1">
              Arrastra una imagen aquí o haz clic para seleccionar
            </p>
            <p className="text-slate-500 text-sm">PNG, JPG, WEBP — máximo 10 MB</p>
          </label>
        </div>

        {/* Preview */}
        {preview && !analysisResult && (
          <div className="mt-6">
            <div className="glass-light rounded-xl overflow-hidden">
              <img src={preview} alt="Vista previa" className="max-h-96 mx-auto" />
            </div>
            <div className="flex justify-center mt-6">
              <button
                onClick={onSubmit}
                disabled={loading}
                className="btn-primary text-white px-8 py-3 rounded-xl font-semibold flex items-center space-x-2 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analizando...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Analizar imagen</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="glass-card rounded-xl p-4 mb-8 border-red-500/30 bg-red-500/10">
          <p className="text-red-300 text-center">{error}</p>
        </div>
      )}

      {/* Results */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Detection canvas */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Eye className="w-5 h-5 text-violet-400" />
              <h2 className="text-xl font-semibold text-slate-200">Detecciones</h2>
              {analysisResult.memoryUsed && (
                <span className="badge-memory text-xs px-2.5 py-1 rounded-full flex items-center space-x-1">
                  <Brain className="w-3 h-3" />
                  <span>Memoria utilizada</span>
                </span>
              )}
            </div>
            <ImageCanvas
              imageUrl={`http://localhost:5000${analysisResult.imagePath}`}
              detections={analysisResult.detectedLabels || []}
            />
            {analysisResult.detectedLabels && analysisResult.detectedLabels.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {analysisResult.detectedLabels.map((d: any, i: number) => (
                  <span key={i} className="badge-label text-xs px-3 py-1.5 rounded-full font-medium">
                    {d.label} — {Math.round(d.confidence * 100)}%
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* LLM Analysis */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-5 h-5 text-violet-400" />
              <h2 className="text-xl font-semibold text-slate-200">Análisis de la IA</h2>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {analysisResult.llmResponse}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
