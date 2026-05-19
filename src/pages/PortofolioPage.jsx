import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import api from '../services/api';

export default function PortofolioPage() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/portfolios')
      .then(r => setPortfolios(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Portofolio Buku Cetak</h1>
          <p className="text-slate-500">Karya-karya yang telah kami bantu wujudkan bersama para penulis</p>
        </div>
      </div>

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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {portfolios.map(p => (
              <div key={p.id} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                <div className="h-52 bg-gradient-to-br from-indigo-100 via-violet-100 to-purple-100 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-indigo-300" />
                </div>
                <div className="p-3">
                  {p.kategori && (
                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{p.kategori}</span>
                  )}
                  <h3 className="font-semibold text-slate-900 text-sm mt-2 mb-0.5 line-clamp-2 group-hover:text-indigo-700 transition-colors">{p.judul}</h3>
                  <p className="text-xs text-slate-500">{p.penulis}</p>
                  {p.tahun && <p className="text-xs text-slate-400 mt-0.5">{p.tahun}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
