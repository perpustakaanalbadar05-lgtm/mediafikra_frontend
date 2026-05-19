import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import api from '../../services/api';

const EMPTY = { judul: '', isi: '', type: 'promo', status_publish: true, thumbnail: null };

export default function AdminPromoPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchItems = () => {
    api.get('/admin/promos').then(r => setItems(r.data)).finally(() => setLoading(false));
  };
  useEffect(() => { fetchItems(); }, []);

  const openCreate = () => { setForm(EMPTY); setEditId(null); setError(''); setShowModal(true); };
  const openEdit = (item) => {
    setForm({ judul: item.judul, isi: item.isi, type: item.type, status_publish: item.status_publish, thumbnail: null });
    setEditId(item.id);
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
      formData.append('isi', form.isi);
      formData.append('type', form.type);
      formData.append('status_publish', form.status_publish ? 1 : 0);
      if (form.thumbnail) {
        formData.append('thumbnail', form.thumbnail);
      }

      if (editId) {
        formData.append('_method', 'PUT');
        await api.post(`/admin/promos/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/admin/promos', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setShowModal(false);
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus item ini?')) return;
    await api.delete(`/admin/promos/${id}`);
    fetchItems();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Promo &amp; Berita</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola konten promo dan berita terkini</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-indigo-700 text-white text-sm font-semibold rounded-xl hover:bg-indigo-800">
          <Plus className="w-4 h-4" /> Tambah
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-5 py-3 text-left font-semibold text-slate-600">Judul</th>
              <th className="px-5 py-3 text-left font-semibold text-slate-600 hidden sm:table-cell">Tipe</th>
              <th className="px-5 py-3 text-left font-semibold text-slate-600 hidden md:table-cell">Status</th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <tr key={i}><td colSpan={4} className="px-5 py-4"><div className="h-4 bg-slate-100 rounded animate-pulse" /></td></tr>
              ))
            ) : items.length === 0 ? (
              <tr><td colSpan={4} className="px-5 py-8 text-center text-slate-400">Belum ada konten.</td></tr>
            ) : items.map(item => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-5 py-3">
                  <p className="font-medium text-slate-900 line-clamp-1">{item.judul}</p>
                  <p className="text-xs text-slate-500 line-clamp-1">{item.isi}</p>
                </td>
                <td className="px-5 py-3 hidden sm:table-cell">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.type === 'promo' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                    {item.type === 'promo' ? '🔥 Promo' : '📰 Berita'}
                  </span>
                </td>
                <td className="px-5 py-3 hidden md:table-cell">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${item.status_publish ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {item.status_publish ? 'Publish' : 'Draft'}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(item)} className="p-1.5 text-slate-400 hover:text-indigo-700 rounded-lg hover:bg-indigo-50">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">{editId ? 'Edit' : 'Tambah'} Promo/Berita</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
              {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Judul *</label>
                <input required value={form.judul} onChange={e => setForm({...form, judul: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tipe</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="promo">Promo</option>
                  <option value="berita">Berita</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Thumbnail (Opsional, Max 2MB)</label>
                <input type="file" accept="image/*" onChange={e => setForm({...form, thumbnail: e.target.files[0]})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Isi Konten *</label>
                <textarea required value={form.isi} onChange={e => setForm({...form, isi: e.target.value})}
                  rows={5} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.status_publish} onChange={e => setForm({...form, status_publish: e.target.checked})} className="accent-indigo-600" />
                Publish
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-slate-200 rounded-xl py-2 text-sm text-slate-600 hover:bg-slate-50">Batal</button>
                <button type="submit" disabled={saving} className="flex-1 bg-indigo-700 text-white rounded-xl py-2 text-sm font-semibold hover:bg-indigo-800 disabled:opacity-60">
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
