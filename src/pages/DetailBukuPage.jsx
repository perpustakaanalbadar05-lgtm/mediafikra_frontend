import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft, ShoppingCart, MessageCircle, CheckCircle, Share2, Link, Star } from 'lucide-react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function DetailBukuPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [form, setForm] = useState({ nama_pembeli: '', whatsapp: '', alamat: '', qty: 1, catatan: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Review states
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ reviewer_name: '', rating: '5', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');

  useEffect(() => {
    api.get(`/books/${id}`)
      .then(r => setBook(r.data))
      .catch(() => navigate('/katalog'))
      .finally(() => setLoading(false));
      
      
    fetchReviews();
  }, [id]);

  const fetchReviews = () => {
    api.get(`/reviews?book_id=${id}`).then(r => setReviews(r.data)).catch(() => {});
  };

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

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    setReviewMessage('');
    try {
      await api.post('/reviews', { ...reviewForm, book_id: book.id, rating: Number(reviewForm.rating) });
      setReviewMessage('Terima kasih! Ulasan berhasil dikirim.');
      setReviewForm({ reviewer_name: '', rating: '5', comment: '' });
      fetchReviews();
      setTimeout(() => setReviewMessage(''), 3000);
    } catch (err) {
      setReviewMessage('Gagal mengirim ulasan. Pastikan form diisi dengan benar.');
    } finally {
      setSubmittingReview(false);
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
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog
        </motion.button>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 } }
          }}
          className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/50"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Cover */}
            <motion.div variants={fadeUp} className="h-72 md:h-auto bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center min-h-80 overflow-hidden relative p-8">
              {book.cover_image ? (
                <motion.img 
                  initial={{ scale: 0.8, opacity: 0, rotateY: -20 }}
                  animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  whileHover={{ scale: 1.05 }}
                  src={getImageUrl(book.cover_image)} 
                  alt={book.judul} 
                  className="w-full max-w-sm rounded-xl shadow-2xl object-cover" 
                />
              ) : (
                <BookOpen className="w-24 h-24 text-indigo-300" />
              )}
            </motion.div>

            {/* Info */}
            <motion.div variants={fadeUp} className="p-8 lg:p-12">
              {book.featured && (
                <span className="inline-block bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
                  ⭐ Unggulan
                </span>
              )}
              <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full mb-3 ml-2">
                {book.kategori}
              </span>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">{book.judul}</h1>
              {book.deskripsi && (
                <p className="text-slate-500 text-base leading-relaxed mb-6">{book.deskripsi}</p>
              )}
              
              {book.sinopsis && (
                <div className="mb-8 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" /> Sinopsis Buku:
                  </h3>
                  <div className="text-slate-600 text-sm leading-relaxed max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {book.sinopsis.split('\n').map((line, idx) => (
                      <p key={idx} className="mb-2 last:mb-0">{line}</p>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-5 mb-8">
                <span className="text-4xl font-bold text-indigo-700">
                  Rp {book.harga?.toLocaleString('id-ID')}
                </span>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${book.stok > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                  {book.stok > 0 ? `✓ Tersedia (${book.stok} eks)` : '✗ Stok Habis'}
                </span>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center gap-3 mb-8">
                <span className="text-sm font-medium text-slate-500 flex items-center gap-1.5"><Share2 className="w-4 h-4" /> Bagikan:</span>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent('Cek buku ini: ' + book.judul + ' ' + window.location.href)}`, '_blank')} className="p-2.5 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors" title="Share ke WhatsApp">
                  <MessageCircle className="w-4 h-4" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')} className="p-2.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors" title="Share ke Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(book.judul)}`, '_blank')} className="p-2.5 bg-sky-50 text-sky-600 rounded-full hover:bg-sky-100 transition-colors" title="Share ke Twitter">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Link berhasil disalin!'); }} className="p-2.5 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors" title="Copy Link">
                  <Link className="w-4 h-4" />
                </motion.button>
              </div>

              <AnimatePresence mode="wait">
                {!showCheckout ? (
                  <motion.button
                    key="buy-button"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCheckout(true)}
                    disabled={book.stok === 0}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-indigo-700 text-white font-bold rounded-2xl hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-200"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Beli Sekarang via WhatsApp
                  </motion.button>
                ) : (
                  <motion.form 
                    key="checkout-form"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleSubmit} 
                    className="space-y-4 bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100"
                  >
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-indigo-600" /> Form Pemesanan
                    </h3>
                    {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}
                    <input required value={form.nama_pembeli} onChange={e => setForm({...form, nama_pembeli: e.target.value})}
                      placeholder="Nama Lengkap" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white shadow-sm" />
                    <input required value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})}
                      placeholder="Nomor WhatsApp (contoh: 08123456789)" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white shadow-sm" />
                    <textarea required value={form.alamat} onChange={e => setForm({...form, alamat: e.target.value})}
                      placeholder="Alamat Pengiriman Lengkap" rows={2} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none bg-white shadow-sm" />
                    <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                      <label className="text-sm font-semibold text-slate-700 shrink-0">Jumlah:</label>
                      <input type="number" min={1} max={book.stok} value={form.qty} onChange={e => setForm({...form, qty: e.target.value})}
                        className="w-20 px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-center font-semibold" />
                      <div className="ml-auto text-right">
                        <span className="text-xs text-slate-500 block">Total Harga Buku</span>
                        <strong className="text-indigo-700 text-lg">Rp {total?.toLocaleString('id-ID')}</strong>
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                      <p className="text-sm text-amber-800 font-medium leading-relaxed">
                        ℹ️ <span className="font-bold">Biaya ongkos kirim belum termasuk.</span> Silakan konsultasikan dengan Admin kami melalui WhatsApp terkait pilihan ekspedisi pengiriman dan biayanya.
                      </p>
                    </div>

                    <textarea value={form.catatan} onChange={e => setForm({...form, catatan: e.target.value})} placeholder="Catatan tambahan (opsional)" rows={2} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none bg-white shadow-sm" />
                    
                    <div className="flex gap-3 pt-2">
                      <button type="button" onClick={() => setShowCheckout(false)} className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 font-medium rounded-xl text-sm hover:bg-slate-50 transition-colors">
                        Batal
                      </button>
                      <motion.button whileTap={{ scale: 0.95 }} type="submit" disabled={submitting} className="flex-[2] flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 disabled:opacity-50 transition-colors shadow-md shadow-green-200">
                        <MessageCircle className="w-5 h-5" />
                        {submitting ? 'Memproses...' : 'Lanjut ke WhatsApp'}
                      </motion.button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>

        {/* Reviews Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="mt-10 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-400 fill-amber-400" /> Ulasan Pembaca
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* List Reviews */}
            <div className="space-y-6">
              {reviews.length === 0 ? (
                <p className="text-slate-500 italic">Belum ada ulasan untuk buku ini. Jadilah yang pertama!</p>
              ) : (
                reviews.map(r => (
                  <div key={r.id} className="border-b border-slate-100 pb-5 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-800">{r.reviewer_name}</span>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(i => <Star key={i} className={`w-3.5 h-3.5 ${i <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />)}
                      </div>
                    </div>
                    {r.comment && <p className="text-sm text-slate-600">{r.comment}</p>}
                    <p className="text-xs text-slate-400 mt-2">{new Date(r.created_at).toLocaleDateString('id-ID')}</p>
                  </div>
                ))
              )}
            </div>

            {/* Form Review */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 h-fit">
              <h3 className="font-bold text-slate-800 mb-4">Tulis Ulasan Anda</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {reviewMessage && <p className={`text-sm p-3 rounded-lg ${reviewMessage.includes('Gagal') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{reviewMessage}</p>}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama *</label>
                  <input required value={reviewForm.reviewer_name} onChange={e => setReviewForm({...reviewForm, reviewer_name: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 bg-white outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rating *</label>
                  <select value={reviewForm.rating} onChange={e => setReviewForm({...reviewForm, rating: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 bg-white outline-none">
                    <option value="5">⭐⭐⭐⭐⭐ (5/5) Sangat Bagus</option>
                    <option value="4">⭐⭐⭐⭐ (4/5) Bagus</option>
                    <option value="3">⭐⭐⭐ (3/5) Cukup</option>
                    <option value="2">⭐⭐ (2/5) Kurang</option>
                    <option value="1">⭐ (1/5) Sangat Kurang</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Komentar</label>
                  <textarea value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm, comment: e.target.value})} rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 bg-white outline-none resize-none" />
                </div>
                <button type="submit" disabled={submittingReview} className="w-full py-2.5 bg-indigo-700 text-white rounded-xl text-sm font-semibold hover:bg-indigo-800 disabled:opacity-60 transition-colors">
                  {submittingReview ? 'Mengirim...' : 'Kirim Ulasan'}
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
