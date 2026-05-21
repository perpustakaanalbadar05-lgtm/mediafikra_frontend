import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft, ShoppingCart, MessageCircle, CheckCircle, Share2, Facebook, Twitter, Link } from 'lucide-react';
import api from '../services/api';

export default function DetailBukuPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [form, setForm] = useState({ nama_pembeli: '', whatsapp: '', alamat: '', qty: 1, catatan: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/books/${id}`)
      .then(r => setBook(r.data))
      .catch(() => navigate('/katalog'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await api.post('/orders', { ...form, buku_id: book.id, qty: Number(form.qty) });
      window.open(res.data.whatsapp_url, '_blank');
      setShowCheckout(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
    </div>
  );

  if (!book) return null;

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const base = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace('/api', '');
    return `${base}${path}`;
  };

  const total = book.harga * form.qty;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog
        </button>

        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Cover */}
            <div className="h-72 md:h-auto bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center min-h-64 overflow-hidden relative">
              {book.cover_image ? (
                <img src={getImageUrl(book.cover_image)} alt={book.judul} className="w-full h-full object-cover" />
              ) : (
                <BookOpen className="w-24 h-24 text-indigo-300" />
              )}
            </div>

            {/* Info */}
            <div className="p-8">
              {book.featured && (
                <span className="inline-block bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full mb-3">
                  ⭐ Unggulan
                </span>
              )}
              <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-full mb-3">
                {book.kategori}
              </span>
              <h1 className="text-2xl font-bold text-slate-900 mb-3">{book.judul}</h1>
              {book.deskripsi && (
                <p className="text-slate-500 text-sm leading-relaxed mb-4">{book.deskripsi}</p>
              )}
              
              {book.sinopsis && (
                <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 mb-2">Sinopsis Buku:</h3>
                  <div className="text-slate-600 text-sm leading-relaxed">
                    {book.sinopsis.split('\n').map((line, idx) => (
                      <p key={idx} className="mb-2 last:mb-0">{line}</p>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-indigo-700">
                  Rp {book.harga?.toLocaleString('id-ID')}
                </span>
                <span className={`text-sm font-medium ${book.stok > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {book.stok > 0 ? `✓ Tersedia (${book.stok} eks)` : '✗ Stok Habis'}
                </span>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm text-slate-500 flex items-center gap-1"><Share2 className="w-4 h-4" /> Bagikan:</span>
                <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent('Cek buku ini: ' + book.judul + ' ' + window.location.href)}`, '_blank')} className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors" title="Share ke WhatsApp">
                  <MessageCircle className="w-4 h-4" />
                </button>
                <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')} className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors" title="Share ke Facebook">
                  <Facebook className="w-4 h-4" />
                </button>
                <button onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(book.judul)}`, '_blank')} className="p-2 bg-sky-50 text-sky-600 rounded-full hover:bg-sky-100 transition-colors" title="Share ke Twitter">
                  <Twitter className="w-4 h-4" />
                </button>
                <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Link berhasil disalin!'); }} className="p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors" title="Copy Link">
                  <Link className="w-4 h-4" />
                </button>
              </div>

              {!showCheckout ? (
                <button
                  onClick={() => setShowCheckout(true)}
                  disabled={book.stok === 0}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-700 text-white font-semibold rounded-xl hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Beli Sekarang
                </button>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-semibold text-slate-900">Form Pemesanan</h3>
                  {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
                  <input required value={form.nama_pembeli} onChange={e => setForm({...form, nama_pembeli: e.target.value})}
                    placeholder="Nama Lengkap" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                  <input required value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})}
                    placeholder="Nomor WhatsApp (contoh: 08123456789)" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                  <textarea required value={form.alamat} onChange={e => setForm({...form, alamat: e.target.value})}
                    placeholder="Alamat Pengiriman Lengkap" rows={2} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-slate-700 shrink-0">Jumlah:</label>
                    <input type="number" min={1} max={book.stok} value={form.qty} onChange={e => setForm({...form, qty: e.target.value})}
                      className="w-20 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                    <span className="text-sm text-slate-500">Total: <strong className="text-indigo-700">Rp {total?.toLocaleString('id-ID')}</strong></span>
                  </div>
                  <textarea value={form.catatan} onChange={e => setForm({...form, catatan: e.target.value})}
                    placeholder="Catatan tambahan (opsional)" rows={2} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setShowCheckout(false)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm hover:bg-slate-50">
                      Batal
                    </button>
                    <button type="submit" disabled={submitting} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 disabled:opacity-50">
                      <MessageCircle className="w-4 h-4" />
                      {submitting ? 'Memproses...' : 'Lanjut ke WhatsApp'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
