import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Calendar, User, Share2, Facebook, Twitter, Link, MessageCircle } from 'lucide-react';
import api from '../services/api';

export default function PromoDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [promo, setPromo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/promos/${id}`)
      .then(r => setPromo(r.data))
      .catch(() => navigate('/promo'))
      .finally(() => setLoading(false));
  }, [id]);

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const base = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace('/api', '');
    return `${base}${path}`;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
    </div>
  );

  if (!promo) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        {/* Back */}
        <button onClick={() => navigate('/promo')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Promo & Berita
        </button>

        {/* Article Card */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          {/* Cover image / Header */}
          <div className="h-64 sm:h-80 bg-gradient-to-br from-slate-100 to-indigo-100 flex items-center justify-center overflow-hidden relative">
            {promo.thumbnail ? (
              <img src={getImageUrl(promo.thumbnail)} alt={promo.judul} className="w-full h-full object-cover" />
            ) : (
              <Sparkles className="w-16 h-16 text-indigo-300" />
            )}
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-4 ${promo.type === 'promo' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
              {promo.type === 'promo' ? '🔥 Promo Spesial' : '📰 Berita Terbaru'}
            </span>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 leading-tight">
              {promo.judul}
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(promo.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  Admin Media Fikra
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 mr-1 flex items-center gap-1 font-medium"><Share2 className="w-3.5 h-3.5" /> Bagikan:</span>
                <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(promo.judul + ' ' + window.location.href)}`, '_blank')} className="p-1.5 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors" title="WhatsApp">
                  <MessageCircle className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')} className="p-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors" title="Facebook">
                  <Facebook className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(promo.judul)}`, '_blank')} className="p-1.5 bg-sky-50 text-sky-600 rounded-full hover:bg-sky-100 transition-colors" title="Twitter">
                  <Twitter className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Link berhasil disalin!'); }} className="p-1.5 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors" title="Copy Link">
                  <Link className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Main text body */}
            <div className="prose max-w-none text-slate-600 leading-relaxed space-y-4 whitespace-pre-line text-sm sm:text-base">
              {promo.isi}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
