import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function PromoListPage() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('semua'); // 'semua', 'promo', 'berita'

  useEffect(() => {
    setLoading(true);
    const typeQuery = filter !== 'semua' ? `?type=${filter}` : '';
    api.get(`/promos${typeQuery}`)
      .then(r => setPromos(r.data))
      .catch(() => setPromos([]))
      .finally(() => setLoading(false));
  }, [filter]);

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const base = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api$/, '');
    return `${base}${path}`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="bg-white border-b border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 variants={fadeInUp} className="text-3xl font-bold text-slate-900 mb-3">Promo & Berita</motion.h1>
          <motion.p variants={fadeInUp} className="text-slate-500 max-w-xl mx-auto">
            Temukan informasi terbaru, artikel menarik, dan penawaran promo spesial dari Media Fikra.
          </motion.p>

          {/* Filter */}
          <motion.div variants={fadeInUp} className="flex justify-center gap-2 mt-6">
            {['semua', 'promo', 'berita'].map(f => (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all ${
                  filter === f
                    ? 'bg-indigo-700 text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
                }`}
              >
                {f === 'semua' ? 'Semua Info' : f}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
                <div className="h-48 bg-slate-100" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-slate-100 rounded w-1/4" />
                  <div className="h-4 bg-slate-100 rounded" />
                  <div className="h-4 bg-slate-100 rounded w-5/6" />
                  <div className="h-4 bg-slate-100 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : promos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
            <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">Belum ada promo atau berita yang dipublikasikan.</p>
          </div>
        ) : (
          <motion.div 
            variants={staggerContainer} initial="hidden" animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <AnimatePresence>
            {promos.map(p => (
              <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }} key={p.id}>
              <Link
                to={`/promo/${p.id}`}
                className="group block bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 duration-200"
              >
                <div className="h-48 bg-gradient-to-br from-slate-100 to-indigo-100 flex items-center justify-center overflow-hidden relative">
                  {p.thumbnail ? (
                    <img src={getImageUrl(p.thumbnail)} alt={p.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <Sparkles className="w-12 h-12 text-indigo-300" />
                  )}
                </div>
                <div className="p-5">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.type === 'promo' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                    {p.type === 'promo' ? '🔥 Promo' : '📰 Berita'}
                  </span>
                  <h3 className="font-semibold text-slate-900 mt-3 mb-2 line-clamp-2 group-hover:text-indigo-700 transition-colors text-base leading-snug">
                    {p.judul}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-3 mb-4 leading-relaxed">
                    {p.isi}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold group-hover:underline">
                    Baca Selengkapnya
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
              </motion.div>
            ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
