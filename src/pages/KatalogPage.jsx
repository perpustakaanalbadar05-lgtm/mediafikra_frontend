import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BookOpen, Search, Filter, ShoppingCart } from 'lucide-react';
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

const CATEGORIES = ['Semua', 'Akademik', 'Bisnis', 'Pendidikan', 'Hukum', 'Sastra', 'Penulisan', 'Pertanian', 'Teknologi', 'Ekonomi', 'Sejarah'];

export default function KatalogPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [kategori, setKategori] = useState('Semua');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (kategori !== 'Semua') params.kategori = kategori;
    api.get('/books', { params })
      .then(r => setBooks(r.data))
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  }, [search, kategori]);

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const base = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace('/api', '');
    return `${base}${path}`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <motion.div 
        initial="hidden" animate="visible" variants={staggerContainer}
        className="bg-white border-b border-slate-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.h1 variants={fadeInUp} className="text-3xl font-bold text-slate-900 mb-2">Katalog Buku</motion.h1>
          <motion.p variants={fadeInUp} className="text-slate-500">Temukan buku-buku berkualitas dari penulis terpilih Media Fikra</motion.p>

          {/* Search */}
          <motion.div variants={fadeInUp} className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari judul buku..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
          </motion.div>

          {/* Kategori Filter */}
          <motion.div variants={fadeInUp} className="mt-4 flex gap-2 flex-wrap">
            {CATEGORIES.map(k => (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={k}
                onClick={() => setKategori(k)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  kategori === k
                    ? 'bg-indigo-700 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
                }`}
              >
                {k}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Books Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
                <div className="h-48 bg-slate-100" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-slate-100 rounded w-1/3" />
                  <div className="h-4 bg-slate-100 rounded" />
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-5 bg-slate-100 rounded w-1/2 mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : books.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">Tidak ada buku ditemukan.</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={staggerContainer} initial="hidden" animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {books.map(book => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={book.id}
                >
                  <Link
                    to={`/katalog/${book.id}`}
                    className="group block bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                  >
                    <div className="h-48 bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center relative overflow-hidden">
                      {book.cover_image ? (
                        <motion.img 
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.4 }}
                          src={getImageUrl(book.cover_image)} 
                          alt={book.judul} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <BookOpen className="w-16 h-16 text-indigo-300 group-hover:scale-110 transition-transform duration-500" />
                      )}
                      {book.featured && (
                        <span className="absolute top-3 left-3 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full z-10">
                          Unggulan
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                  <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{book.kategori}</span>
                  <h3 className="font-semibold text-slate-900 mt-2 mb-1 line-clamp-2 group-hover:text-indigo-700 transition-colors text-sm">
                    {book.judul}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">{book.deskripsi}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-700">Rp {book.harga?.toLocaleString('id-ID')}</span>
                    <span className={`text-xs ${book.stok > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {book.stok > 0 ? `Stok: ${book.stok}` : 'Habis'}
                    </span>
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
