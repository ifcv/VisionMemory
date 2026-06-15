import React, { useState, useCallback } from 'react';
import { Upload, Monitor, Share, Trash2, Edit3, Download, Sparkles } from 'lucide-react';
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
      setError(err.response?.data?.message || 'Error al analizar la imagen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Análisis de Imagen</h2>

      {/* Error */}
      {error && (
        <div className="glass-card rounded-xl p-4 mb-8 border-red-500/30 bg-red-500/10">
          <p className="text-red-300 text-center">{error}</p>
        </div>
      )}

      {/* Initial Upload State */}
      {!preview && (
        <div 
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`glass-card rounded-3xl p-16 text-center border-2 border-dashed transition-all cursor-pointer ${
            dragOver ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-white/10 hover:border-fuchsia-500/50'
          }`}
        >
          <input type="file" accept="image/*" onChange={onFileChange} className="hidden" id="file-upload" />
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <Upload className={`w-8 h-8 ${dragOver ? 'text-fuchsia-400' : 'text-slate-400'}`} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Sube una imagen para analizar</h3>
            <p className="text-slate-400">Arrastra una imagen aquí o haz clic para explorar</p>
          </label>
        </div>
      )}

      {/* Loading state or Preview before analysis */}
      {preview && !analysisResult && (
        <div className="flex flex-col items-center space-y-8">
          <div className="rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/10 max-w-2xl w-full relative group">
            <img src={preview} alt="Vista previa" className="w-full h-auto object-cover" />
            {!loading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={onSubmit} className="btn-primary px-8 py-3 rounded-xl font-bold text-white shadow-lg">
                  Iniciar Análisis con IA
                </button>
              </div>
            )}
          </div>
          {loading && (
            <div className="flex items-center space-x-3 text-fuchsia-400">
              <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              <span className="font-medium text-lg tracking-wide">Analizando escena...</span>
            </div>
          )}
        </div>
      )}

      {/* Result UI matching mockup */}
      {analysisResult && (
        <div className="space-y-8">
          {/* Main Image with detections */}
          <div className="flex justify-center">
            <div className="max-w-2xl w-full">
              <ImageCanvas 
                imageUrl={`http://localhost:5000${analysisResult.imagePath}`} 
                detections={analysisResult.detectedLabels || []} 
              />
            </div>
          </div>

          {/* Glowing AI Card */}
          <div className="glass-card-glow p-8 relative overflow-hidden">
            {/* Header row */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
              <h3 className="text-xl font-bold text-white">Análisis de Imagen (AI)</h3>
              <div className="flex space-x-2">
                <button className="p-2 btn-ghost rounded-lg"><Monitor className="w-4 h-4" /></button>
                <button className="p-2 btn-ghost rounded-lg"><Share className="w-4 h-4" /></button>
                <button className="p-2 btn-ghost rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Content row */}
            <div className="space-y-4 mb-8">
              <div className="text-sm">
                <span className="font-bold text-white">Objeto Detectado: </span>
                <span className="text-slate-300">
                  {analysisResult.detectedLabels?.length > 0 
                    ? analysisResult.detectedLabels.map((d:any) => `\`${d.label} (${Math.round(d.confidence*100)}%)\``).join(', ')
                    : 'Ninguno'}
                </span>
              </div>
              
              <div className="text-sm">
                <span className="font-bold text-white">Descripción Detallada (IA): </span>
                <Sparkles className="inline w-3 h-3 text-fuchsia-400 mx-1" />
                <span className="text-slate-300 leading-relaxed">
                  {analysisResult.llmResponse}
                </span>
              </div>
            </div>

            {/* Footer row */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center pt-4 border-t border-white/10 gap-4">
              <div className="text-xs text-slate-500">
                <p>Fecha: {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                <p>Modelo: llama3.2-vision</p>
              </div>
              
              <div className="flex items-center space-x-3 w-full md:w-auto">
                <button className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-5 py-2.5 btn-glow rounded-xl text-sm font-semibold">
                  <Download className="w-4 h-4" />
                  <span>Descargar Reporte</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2.5 btn-ghost rounded-xl text-sm font-medium">
                  <Share className="w-4 h-4" />
                  <span>Compartir</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2.5 btn-ghost rounded-xl text-sm font-medium">
                  <Edit3 className="w-4 h-4" />
                  <span>Editar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
