import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Megaphone, Calendar, ArrowRight } from 'lucide-react';
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

export default function ArtikelListPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/articles')
      .then(r => setArticles(r.data.filter(a => a.status === 'published')))
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
          <motion.h1 variants={fadeInUp} className="text-3xl font-bold text-slate-900 mb-3">Artikel & Berita</motion.h1>
          <motion.p variants={fadeInUp} className="text-slate-500">Informasi terbaru, tips penulisan, dan berita seputar dunia penerbitan</motion.p>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-100 animate-pulse">
                <div className="h-48 bg-slate-100" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-full" />
                  <div className="h-3 bg-slate-100 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">Belum ada artikel yang dipublikasikan.</p>
          </div>
        ) : (
          <motion.div 
            initial="hidden" animate="visible" variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {articles.map(article => (
                <motion.div variants={fadeInUp} key={article.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                  <div className="h-48 bg-slate-100 relative overflow-hidden">
                    {article.thumbnail ? (
                      <img src={getImageUrl(article.thumbnail)} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-indigo-50"><Megaphone className="w-12 h-12 text-indigo-200" /></div>
                    )}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-indigo-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      {article.type}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-slate-400 text-xs mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(article.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2 hover:text-indigo-600 transition-colors cursor-pointer">
                      <Link to={`/artikel/${article.slug}`}>{article.title}</Link>
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-3 mb-4 flex-1">
                      {article.content}
                    </p>
                    <Link to={`/artikel/${article.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 group mt-auto">
                      Baca Selengkapnya <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
