import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, BookOpen, ToggleLeft, ToggleRight } from 'lucide-react';
import api from '../../services/api';

const EMPTY = { judul: '', deskripsi: '', sinopsis: '', harga: '', stok: '', kategori: '', cover_image: null, featured: false, status_publish: true };

export default function AdminBukuPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchBooks = () => {
    api.get('/admin/books').then(r => setBooks(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchBooks(); }, []);

  const openCreate = () => { setForm(EMPTY); setEditId(null); setError(''); setShowModal(true); };
  const openEdit = (book) => {
    setForm({ judul: book.judul, deskripsi: book.deskripsi || '', sinopsis: book.sinopsis || '', harga: book.harga, stok: book.stok, kategori: book.kategori || '', cover_image: null, featured: book.featured, status_publish: book.status_publish });
    setEditId(book.id);
    setError('');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('judul', form.judul);
      formData.append('deskripsi', form.deskripsi);
      formData.append('sinopsis', form.sinopsis);
      formData.append('harga', form.harga);
      formData.append('stok', form.stok);
      formData.append('kategori', form.kategori);
      formData.append('featured', form.featured ? 1 : 0);
      formData.append('status_publish', form.status_publish ? 1 : 0);
      if (form.cover_image) {
        formData.append('cover_image', form.cover_image);
      }

      if (editId) {
        // Method spoofing for PHP/Laravel put requests with form-data
        formData.append('_method', 'PUT');
        await api.post(`/admin/books/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/admin/books', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setShowModal(false);
      fetchBooks();
    } catch (err) {
      setError(err.response?.data?.message || JSON.stringify(err.response?.data?.errors) || 'Gagal menyimpan.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus buku ini?')) return;
    await api.delete(`/admin/books/${id}`);
    fetchBooks();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Buku</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola katalog buku Media Fikra</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-indigo-700 text-white text-sm font-semibold rounded-xl hover:bg-indigo-800">
          <Plus className="w-4 h-4" /> Tambah Buku
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-5 py-3 text-left font-semibold text-slate-600">Buku</th>
              <th className="px-5 py-3 text-left font-semibold text-slate-600 hidden md:table-cell">Kategori</th>
              <th className="px-5 py-3 text-left font-semibold text-slate-600">Harga</th>
              <th className="px-5 py-3 text-left font-semibold text-slate-600 hidden sm:table-cell">Stok</th>
              <th className="px-5 py-3 text-left font-semibold text-slate-600 hidden lg:table-cell">Status</th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-5 py-4"><div className="h-4 bg-slate-100 rounded animate-pulse" /></td></tr>
              ))
            ) : books.map(book => (
              <tr key={book.id} className="hover:bg-slate-50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-10 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 truncate">{book.judul}</p>
                      {book.featured && <span className="text-xs text-amber-600">⭐ Unggulan</span>}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-slate-500 hidden md:table-cell">{book.kategori}</td>
                <td className="px-5 py-3 font-semibold text-indigo-700">Rp {book.harga?.toLocaleString('id-ID')}</td>
                <td className="px-5 py-3 text-slate-600 hidden sm:table-cell">{book.stok}</td>
                <td className="px-5 py-3 hidden lg:table-cell">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${book.status_publish ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {book.status_publish ? 'Publish' : 'Draft'}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(book)} className="p-1.5 text-slate-400 hover:text-indigo-700 rounded-lg hover:bg-indigo-50">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(book.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">{editId ? 'Edit Buku' : 'Tambah Buku'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
              {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
              {[
                { label: 'Judul Buku *', key: 'judul', type: 'text', required: true },
                { label: 'Kategori', key: 'kategori', type: 'text' },
                { label: 'Harga (Rp) *', key: 'harga', type: 'number', required: true },
                { label: 'Stok *', key: 'stok', type: 'number', required: true },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{f.label}</label>
                  <input
                    type={f.type}
                    required={f.required}
                    value={form[f.key]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cover Image (Opsional, Max 2MB)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setForm({ ...form, cover_image: e.target.files[0] })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Singkat</label>
                <textarea value={form.deskripsi} onChange={e => setForm({ ...form, deskripsi: e.target.value })}
                  rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sinopsis Lengkap</label>
                <textarea value={form.sinopsis} onChange={e => setForm({ ...form, sinopsis: e.target.value })}
                  rows={5} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="accent-indigo-600" />
                  Unggulan
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.status_publish} onChange={e => setForm({ ...form, status_publish: e.target.checked })} className="accent-indigo-600" />
                  Publish
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50">Batal</button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-indigo-700 text-white rounded-xl text-sm font-semibold hover:bg-indigo-800 disabled:opacity-60">
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
