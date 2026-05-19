import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, FileText, Award, Star, ChevronRight, MessageCircle, Sparkles, CheckCircle } from 'lucide-react';
import api from '../services/api';

const SERVICES = [
  {
    icon: BookOpen,
    title: 'Penerbitan & Cetak Buku',
    desc: 'Wujudkan karya Anda menjadi buku cetak profesional dengan ISBN resmi dan distribusi nasional.',
    to: '/layanan',
    color: 'bg-indigo-50 text-indigo-700',
  },
  {
    icon: FileText,
    title: 'Konversi Tugas Akhir',
    desc: 'Ubah skripsi, tesis, atau disertasi Anda menjadi buku ilmiah yang layak jual dan diakui.',
    to: '/layanan',
    color: 'bg-violet-50 text-violet-700',
  },
  {
    icon: Sparkles,
    title: 'Jasa Ghostwriting',
    desc: 'Miliki buku sendiri tanpa harus menulis. Tim penulis berpengalaman kami siap membantu.',
    to: '/layanan',
    color: 'bg-sky-50 text-sky-700',
  },
  {
    icon: Award,
    title: 'Penerbitan Jurnal',
    desc: 'Publikasi jurnal ilmiah dengan proses review, editing, dan proofreading yang terstandar.',
    to: '/layanan',
    color: 'bg-emerald-50 text-emerald-700',
  },
];

const STATS = [
  { value: '500+', label: 'Buku Diterbitkan' },
  { value: '300+', label: 'Penulis Dibantu' },
  { value: '50+', label: 'Jurnal Terbit' },
  { value: '8 Th', label: 'Pengalaman' },
];

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`w-4 h-4 ${i <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
      ))}
    </div>
  );
}

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [promos, setPromos] = useState([]);
  const [settings, setSettings] = useState({
    hero_title: 'Wujudkan Karya Tulis Menjadi Buku Profesional',
    hero_subtitle: 'Media Fikra hadir sebagai mitra penerbitan terpercaya untuk dosen, peneliti, mahasiswa, dan penulis.',
    contact_wa: '6281234567890',
  });

  useEffect(() => {
    api.get('/books?featured=1').then(r => setBooks(r.data.slice(0, 4))).catch(() => {});
    api.get('/testimonials').then(r => setTestimonials(r.data.slice(0, 3))).catch(() => {});
    api.get('/promos').then(r => setPromos(r.data.slice(0, 3))).catch(() => {});
    api.get('/settings').then(r => setSettings(prev => ({ ...prev, ...r.data }))).catch(() => {});
  }, []);

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const base = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace('/api', '');
    return `${base}${path}`;
  };

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #6366f1 0%, transparent 50%), radial-gradient(circle at 80% 20%, #818cf8 0%, transparent 40%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-medium rounded-full mb-4 border border-indigo-500/30">
              ✦ Platform Penerbitan Terpercaya
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6" dangerouslySetInnerHTML={{ __html: settings.hero_title }}></h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
              {settings.hero_subtitle}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/katalog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/30"
              >
                Lihat Katalog Buku
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`https://wa.me/${settings.contact_wa}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                Konsultasi via WhatsApp
              </a>
              <Link
                to="/layanan"
                className="inline-flex items-center gap-2 px-6 py-3 text-slate-300 hover:text-white font-medium transition-colors"
              >
                Lihat Layanan <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map(s => (
              <div key={s.label} className="group p-6 rounded-2xl hover:bg-indigo-50 transition-colors">
                <p className="text-4xl font-bold text-indigo-700 mb-1">{s.value}</p>
                <p className="text-sm text-slate-500 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LAYANAN UTAMA ────────────────────────────────────────────────── */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Layanan Utama Kami</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Solusi lengkap penerbitan dan publikasi untuk setiap kebutuhan akademik dan profesional Anda.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map(s => (
              <Link
                key={s.title}
                to={s.to}
                className="group bg-white rounded-2xl p-6 border border-slate-100 hover:border-indigo-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div className={`inline-flex p-3 rounded-xl mb-4 ${s.color}`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-indigo-700 transition-colors">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                <div className="flex items-center gap-1 mt-4 text-indigo-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Pelajari <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── BUKU UNGGULAN ────────────────────────────────────────────────── */}
      {books.length > 0 && (
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Buku Unggulan</h2>
                <p className="text-slate-500">Koleksi buku terbaik pilihan editorial kami</p>
              </div>
              <Link to="/katalog" className="text-indigo-700 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
                Lihat Semua <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {books.map(book => (
                <Link
                  key={book.id}
                  to={`/katalog/${book.id}`}
                  className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="h-48 bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center overflow-hidden relative">
                    {book.cover_image ? (
                      <img src={getImageUrl(book.cover_image)} alt={book.judul} className="w-full h-full object-cover" />
                    ) : (
                      <BookOpen className="w-16 h-16 text-indigo-300" />
                    )}
                  </div>
                  <div className="p-4">
                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{book.kategori}</span>
                    <h3 className="font-semibold text-slate-900 mt-2 mb-1 line-clamp-2 group-hover:text-indigo-700 transition-colors text-sm">{book.judul}</h3>
                    <p className="font-bold text-indigo-700">Rp {book.harga?.toLocaleString('id-ID')}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── TESTIMONI ────────────────────────────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="bg-slate-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Apa Kata Mereka</h2>
              <p className="text-slate-500">Cerita sukses penulis yang telah mempercayai Media Fikra</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map(t => (
                <div key={t.id} className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-md transition-shadow">
                  <StarRating rating={t.rating} />
                  <p className="text-slate-600 text-sm leading-relaxed my-4 italic">"{t.isi_review}"</p>
                  <div className="flex items-center gap-3">
                    {t.foto ? (
                      <img src={getImageUrl(t.foto)} alt={t.nama} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-sm">
                        {t.nama.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{t.nama}</p>
                      <p className="text-xs text-slate-500">{t.jabatan}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/testimoni" className="text-indigo-700 font-medium text-sm flex items-center gap-1 justify-center hover:gap-2 transition-all">
                Lihat Semua Testimoni <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── PROMO/BERITA ─────────────────────────────────────────────────── */}
      {promos.length > 0 && (
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Promo & Berita Terkini</h2>
              <p className="text-slate-500">Penawaran spesial dan informasi terbaru dari Media Fikra</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {promos.map(p => (
                <Link key={p.id} to={`/promo/${p.id}`} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 duration-200">
                  <div className="h-40 bg-gradient-to-br from-slate-100 to-indigo-100 flex items-center justify-center relative overflow-hidden">
                    {p.thumbnail ? (
                      <img src={getImageUrl(p.thumbnail)} alt={p.judul} className="w-full h-full object-cover animate-image" />
                    ) : (
                      <Sparkles className="w-12 h-12 text-indigo-300" />
                    )}
                  </div>
                  <div className="p-5">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.type === 'promo' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                      {p.type === 'promo' ? '🔥 Promo' : '📰 Berita'}
                    </span>
                    <h3 className="font-semibold text-slate-900 mt-2 mb-2 line-clamp-2 group-hover:text-indigo-700 transition-colors text-sm">{p.judul}</h3>
                    <p className="text-sm text-slate-500 line-clamp-3">{p.isi}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA PENUTUP ──────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-indigo-700 to-indigo-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap Mewujudkan Buku Impian Anda?</h2>
          <p className="text-indigo-200 mb-8 text-lg">
            Konsultasi gratis bersama tim editorial kami. Kami siap membantu dari awal hingga buku Anda tercetak.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={`https://wa.me/${settings.contact_wa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              Hubungi via WhatsApp
            </a>
            <Link
              to="/katalog"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
            >
              Lihat Katalog Buku
            </Link>
          </div>
          <div className="flex flex-wrap gap-6 justify-center mt-10 text-indigo-200 text-sm">
            {['Proses Cepat & Profesional', 'ISBN Resmi', 'Kualitas Terjamin', 'Harga Terjangkau'].map(f => (
              <div key={f} className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-indigo-400" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
