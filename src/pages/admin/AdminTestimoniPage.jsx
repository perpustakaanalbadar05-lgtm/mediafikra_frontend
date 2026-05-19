import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Star } from 'lucide-react';
import api from '../../services/api';

const EMPTY = { nama: '', jabatan: '', rating: 5, isi_review: '', status_publish: true };

export default function AdminTestimoniPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetch = () => api.get('/admin/testimonials').then(r => setItems(r.data)).finally(() => setLoading(false));
  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setForm(EMPTY); setEditId(null); setError(''); setShowModal(true); };
  const openEdit = (item) => { setForm({ nama: item.nama, jabatan: item.jabatan || '', rating: item.rating, isi_review: item.isi_review, status_publish: item.status_publish }); setEditId(item.id); setError(''); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, rating: Number(form.rating) };
      if (editId) { await api.put(`/admin/testimonials/${editId}`, payload); }
      else { await api.post('/admin/testimonials', payload); }
      setShowModal(false);
      fetch();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan.');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus testimoni ini?')) return;
    await api.delete(`/admin/testimonials/${id}`);
    fetch();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Testimoni</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola review dan testimoni pelanggan</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-indigo-700 text-white text-sm font-semibold rounded-xl hover:bg-indigo-800">
          <Plus className="w-4 h-4" /> Tambah Testimoni
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? Array(3).fill(0).map((_, i) => <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 animate-pulse h-32" />) :
          items.map(item => (
            <div key={item.id} className="bg-white rounded-2xl p-5 border border-slate-100">
              <div className="flex gap-0.5 mb-2">
                {[1,2,3,4,5].map(i => <Star key={i} className={`w-4 h-4 ${i <= item.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />)}
              </div>
              <p className="text-slate-600 text-sm italic line-clamp-3 mb-3">"{item.isi_review}"</p>
              <p className="font-semibold text-slate-900 text-sm">{item.nama}</p>
              {item.jabatan && <p className="text-xs text-slate-500">{item.jabatan}</p>}
              <div className="flex items-center justify-between mt-3">
                <span className={`text-xs px-2 py-0.5 rounded-full ${item.status_publish ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                  {item.status_publish ? 'Publish' : 'Hidden'}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(item)} className="p-1 text-slate-400 hover:text-indigo-700"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-1 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">{editId ? 'Edit Testimoni' : 'Tambah Testimoni'}</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {[{ label: 'Nama *', key: 'nama', type: 'text', req: true }, { label: 'Jabatan/Profesi', key: 'jabatan', type: 'text', req: false }].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{f.label}</label>
                  <input required={f.req} type={f.type} value={form[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Rating (1–5)</label>
                <input type="number" min={1} max={5} value={form.rating} onChange={e => setForm({...form, rating: e.target.value})} className="w-20 px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Isi Review *</label>
                <textarea required value={form.isi_review} onChange={e => setForm({...form, isi_review: e.target.value})} rows={4} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.status_publish} onChange={e => setForm({...form, status_publish: e.target.checked})} className="accent-indigo-600" />
                Publish
              </label>
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
