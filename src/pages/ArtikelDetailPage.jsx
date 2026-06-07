import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';
import api from '../services/api';
import { motion } from 'framer-motion';

export default function ArtikelDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/articles/${slug}`)
      .then(r => setArticle(r.data))
      .catch(() => navigate('/artikel'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
    </div>
  );

  if (!article) return null;

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const base = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace('/api', '');
    return `${base}${path}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate('/artikel')} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Artikel
        </button>

        <motion.article 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm"
        >
          {article.thumbnail && (
            <div className="w-full h-64 sm:h-96 relative overflow-hidden">
              <img src={getImageUrl(article.thumbnail)} className="w-full h-full object-cover" alt={article.judul} />
            </div>
          )}
          
          <div className="p-8 sm:p-12">
            <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full mb-4">
              {article.type}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 leading-tight">
              {article.judul}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-10 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(article.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                Admin Media Fikra
              </div>
            </div>

            <div className="prose prose-slate prose-indigo max-w-none prose-p:leading-relaxed prose-img:rounded-xl">
              {article.isi.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4 text-slate-700 text-lg">{paragraph}</p>
              ))}
            </div>

            <div className="mt-12 pt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">Bagikan artikel ini:</span>
              <div className="flex gap-2">
                <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(article.judul + ' ' + window.location.href)}`, '_blank')} className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
}
