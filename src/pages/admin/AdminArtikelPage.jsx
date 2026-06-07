import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Megaphone, Image as ImageIcon } from 'lucide-react';
import api from '../../services/api';

const EMPTY = { judul: '', isi: '', status_publish: true, type: 'berita' };

export default function AdminArtikelPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [thumbnail, setThumbnail] = useState(null);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchItems = () => api.get('/articles').then(r => setItems(r.data)).finally(() => setLoading(false));
  useEffect(() => { fetchItems(); }, []);

  const openCreate = () => { setForm(EMPTY); setThumbnail(null); setEditId(null); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    fd.append('judul', form.judul);
    fd.append('isi', form.isi);
    fd.append('status_publish', form.status_publish ? '1' : '0');
    fd.append('type', form.type);
    if (thumbnail) fd.append('thumbnail', thumbnail);
    if (editId) fd.append('_method', 'PUT');

    try {
      if (editId) await api.post(`/admin/articles/${editId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' }});
      else await api.post('/admin/articles', fd, { headers: { 'Content-Type': 'multipart/form-data' }});
      setShowModal(false);
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyimpan');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus artikel ini?')) return;
    try {
      await api.delete(`/admin/articles/${id}`);
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus');
    }
  };

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const base = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace('/api', '');
    return `${base}${path}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Artikel Berita</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola artikel dan berita blog</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-indigo-700 text-white text-sm font-semibold rounded-xl hover:bg-indigo-800">
          <Plus className="w-4 h-4" /> Tulis Artikel
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-5 py-3 text-left font-semibold text-slate-600">Artikel</th>
              <th className="px-5 py-3 text-left font-semibold text-slate-600">Tipe</th>
              <th className="px-5 py-3 text-left font-semibold text-slate-600">Status</th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? <tr><td colSpan={4} className="px-5 py-4"><div className="h-4 bg-slate-100 rounded animate-pulse" /></td></tr> :
              items.map(item => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {item.thumbnail ? (
                        <img src={getImageUrl(item.thumbnail)} className="w-12 h-12 rounded-lg object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center"><Megaphone className="w-5 h-5 text-indigo-300" /></div>
                      )}
                      <div>
                        <p className="font-semibold text-slate-900 line-clamp-1">{item.judul}</p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{item.isi}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3"><span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">{item.type}</span></td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${item.status_publish ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                      {item.status_publish ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">{editId ? 'Edit' : 'Tambah'} Artikel</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Judul *</label>
                <input required value={form.judul} onChange={e => setForm({...form, judul: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Isi Artikel *</label>
                <textarea required rows={8} value={form.isi} onChange={e => setForm({...form, isi: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Thumbnail</label>
                  <input type="file" onChange={e => setThumbnail(e.target.files[0])} accept="image/*" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tipe</label>
                  <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                    <option value="berita">Berita</option>
                    <option value="artikel">Artikel Blog</option>
                  </select>
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer mt-2">
                <input type="checkbox" checked={form.status_publish} onChange={e => setForm({...form, status_publish: e.target.checked})} className="accent-indigo-600" />
                Publish Langsung
              </label>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-50 font-medium rounded-xl text-sm">Batal</button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 bg-indigo-700 text-white rounded-xl text-sm font-semibold hover:bg-indigo-800 disabled:opacity-50">
                  {saving ? 'Menyimpan...' : 'Simpan Artikel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
