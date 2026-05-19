import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Calendar, User } from 'lucide-react';
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

            <div className="flex items-center gap-4 text-xs text-slate-400 border-b border-slate-100 pb-5 mb-6">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(promo.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                Admin Media Fikra
              </span>
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
