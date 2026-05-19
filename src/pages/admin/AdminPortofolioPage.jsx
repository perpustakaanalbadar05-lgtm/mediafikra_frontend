import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, BookOpen } from 'lucide-react';
import api from '../../services/api';

const EMPTY = { judul: '', penulis: '', kategori: '', tahun: '', deskripsi: '', cover: null };

export default function AdminPortofolioPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetch = () => api.get('/portfolios').then(r => setItems(r.data)).finally(() => setLoading(false));
  useEffect(() => { fetch(); }, []);

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const base = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace('/api', '');
    return `${base}${path}`;
  };

  const openCreate = () => { setForm(EMPTY); setEditId(null); setShowModal(true); };
  const openEdit = (item) => {
    setForm({ judul: item.judul, penulis: item.penulis, kategori: item.kategori || '', tahun: item.tahun || '', deskripsi: item.deskripsi || '', cover: null });
    setEditId(item.id);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('judul', form.judul);
      formData.append('penulis', form.penulis);
      formData.append('kategori', form.kategori);
      if (form.tahun) formData.append('tahun', form.tahun);
      formData.append('deskripsi', form.deskripsi);
      if (form.cover) formData.append('cover', form.cover);

      if (editId) {
        formData.append('_method', 'PUT');
        await api.post(`/admin/portfolios/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/admin/portfolios', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setShowModal(false);
      fetch();
    } catch (_) {}
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus portofolio ini?')) return;
    await api.delete(`/admin/portfolios/${id}`);
    fetch();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Portofolio Buku</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola koleksi buku yang telah dicetak</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-indigo-700 text-white text-sm font-semibold rounded-xl hover:bg-indigo-800">
          <Plus className="w-4 h-4" /> Tambah
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
        {loading ? Array(5).fill(0).map((_, i) => <div key={i} className="bg-white rounded-2xl border border-slate-100 h-48 animate-pulse" />) :
          items.map(item => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden group">
              <div className="h-36 bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center relative overflow-hidden">
                {item.cover ? (
                  <img src={getImageUrl(item.cover)} alt={item.judul} className="w-full h-full object-cover" />
                ) : (
                  <BookOpen className="w-10 h-10 text-indigo-300" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => openEdit(item)} className="p-1.5 bg-white rounded-lg text-slate-700"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-white rounded-lg text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="p-3">
                <p className="font-semibold text-slate-900 text-xs line-clamp-2">{item.judul}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.penulis}</p>
                <p className="text-xs text-slate-400">{item.tahun}</p>
              </div>
            </div>
          ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">{editId ? 'Edit' : 'Tambah'} Portofolio</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
              {[
                { label: 'Judul Buku *', key: 'judul', req: true },
                { label: 'Penulis *', key: 'penulis', req: true },
                { label: 'Kategori', key: 'kategori', req: false },
                { label: 'Tahun Terbit', key: 'tahun', req: false, type: 'number' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{f.label}</label>
                  <input required={f.req} type={f.type || 'text'} value={form[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cover (Opsional, Max 2MB)</label>
                <input type="file" accept="image/*" onChange={e => setForm({...form, cover: e.target.files[0]})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi</label>
                <textarea value={form.deskripsi} onChange={e => setForm({...form, deskripsi: e.target.value})} rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-slate-200 rounded-xl py-2 text-sm text-slate-600">Batal</button>
                <button type="submit" disabled={saving} className="flex-1 bg-indigo-700 text-white rounded-xl py-2 text-sm font-semibold disabled:opacity-60">
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
