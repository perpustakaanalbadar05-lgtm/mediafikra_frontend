import { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import api from '../services/api';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`w-4 h-4 ${i <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
      ))}
    </div>
  );
}

export default function TestimoniPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/testimonials')
      .then(r => setTestimonials(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const base = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace('/api', '');
    return `${base}${path}`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <motion.div 
        initial="hidden" animate="visible" variants={staggerContainer}
        className="bg-white border-b border-slate-100 py-12"
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h1 variants={fadeInUp} className="text-3xl font-bold text-slate-900 mb-3">Testimoni Pelanggan</motion.h1>
          <motion.p variants={fadeInUp} className="text-slate-500">Cerita nyata dari penulis dan pelanggan yang telah mempercayai Media Fikra</motion.p>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 animate-pulse space-y-3">
                <div className="h-3 bg-slate-100 rounded w-1/2" />
                <div className="h-16 bg-slate-100 rounded" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full" />
                  <div className="space-y-1"><div className="h-3 bg-slate-100 rounded w-24" /><div className="h-2.5 bg-slate-100 rounded w-16" /></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial="hidden" animate="visible" variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {testimonials.map(t => (
              <motion.div variants={fadeInUp} key={t.id} className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative group">
                <Quote className="absolute top-5 right-5 w-8 h-8 text-indigo-100 group-hover:text-indigo-200 transition-colors" />
                <StarRating rating={t.rating} />
                <p className="text-slate-600 text-sm leading-relaxed my-4 italic">&ldquo;{t.isi_review}&rdquo;</p>
                <div className="flex items-center gap-3 mt-auto">
                  {t.foto ? (
                    <img src={getImageUrl(t.foto)} alt={t.nama} className="w-10 h-10 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-sm shrink-0">
                      {t.nama.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{t.nama}</p>
                    {t.jabatan && <p className="text-xs text-slate-500">{t.jabatan}</p>}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
