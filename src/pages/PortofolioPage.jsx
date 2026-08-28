import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
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

export default function PortofolioPage() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/portfolios')
      .then(r => setPortfolios(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const base = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api$/, '');
    return `${base}${path}`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <motion.div 
        initial="hidden" animate="visible" variants={staggerContainer}
        className="bg-white border-b border-slate-100 py-12"
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h1 variants={fadeInUp} className="text-3xl font-bold text-slate-900 mb-3">Portofolio Buku Cetak</motion.h1>
          <motion.p variants={fadeInUp} className="text-slate-500">Karya-karya yang telah kami bantu wujudkan bersama para penulis</motion.p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {Array(10).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
                <div className="h-52 bg-slate-100" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                  <div className="h-4 bg-slate-100 rounded" />
                  <div className="h-3 bg-slate-100 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial="hidden" animate="visible" variants={staggerContainer}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
          >
            {portfolios.map(p => (
              <motion.div variants={fadeInUp} key={p.id} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="h-52 overflow-hidden bg-gradient-to-br from-indigo-100 via-violet-100 to-purple-100 flex items-center justify-center relative">
                  {p.cover ? (
                    <motion.img 
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      src={getImageUrl(p.cover)} 
                      alt={p.judul} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <BookOpen className="w-12 h-12 text-indigo-300 group-hover:scale-110 transition-transform duration-500" />
                  )}
                </div>
                <div className="p-3">
                  {p.kategori && (
                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{p.kategori}</span>
                  )}
                  <h3 className="font-semibold text-slate-900 text-sm mt-2 mb-0.5 line-clamp-2 group-hover:text-indigo-700 transition-colors">{p.judul}</h3>
                  <p className="text-xs text-slate-500">{p.penulis}</p>
                  {p.tahun && <p className="text-xs text-slate-400 mt-0.5">{p.tahun}</p>}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
