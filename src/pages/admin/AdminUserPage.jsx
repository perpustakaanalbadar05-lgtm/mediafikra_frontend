import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Users, ShieldAlert } from 'lucide-react';
import api from '../../services/api';

const EMPTY = { name: '', email: '', password: '', role: 'editor', status_aktif: true };

export default function AdminUserPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchItems = () => api.get('/admin/users').then(r => setItems(r.data)).finally(() => setLoading(false));
  useEffect(() => { fetchItems(); }, []);

  const openCreate = () => { setForm(EMPTY); setEditId(null); setError(''); setShowModal(true); };
  const openEdit = (item) => { 
    setForm({ name: item.name, email: item.email, password: '', role: item.role, status_aktif: item.status_aktif }); 
    setEditId(item.id); setError(''); setShowModal(true); 
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      if (editId) await api.put(`/admin/users/${editId}`, form);
      else await api.post('/admin/users', form);
      setShowModal(false);
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan.');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus pengguna ini?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Pengguna</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola akses admin, CS, dan editor</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-indigo-700 text-white text-sm font-semibold rounded-xl hover:bg-indigo-800">
          <Plus className="w-4 h-4" /> Tambah User
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-5 py-3 text-left font-semibold text-slate-600">Pengguna</th>
              <th className="px-5 py-3 text-left font-semibold text-slate-600 hidden md:table-cell">Role</th>
              <th className="px-5 py-3 text-left font-semibold text-slate-600 hidden sm:table-cell">Status</th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? <tr><td colSpan={4} className="px-5 py-4"><div className="h-4 bg-slate-100 rounded animate-pulse" /></td></tr> :
              items.map(item => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-xs shrink-0">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full">{item.role}</span>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${item.status_aktif ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item.status_aktif ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(item)} className="p-1.5 text-slate-400 hover:text-indigo-700 rounded-lg hover:bg-indigo-50"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">{editId ? 'Edit' : 'Tambah'} Pengguna</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">{error}</div>}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
                <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password {editId ? '(Kosongkan jika tidak diubah)' : '*'}</label>
                <input required={!editId} type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Hak Akses (Role)</label>
                <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                  <option value="superadmin">Superadmin</option>
                  <option value="admin">Admin Konten</option>
                  <option value="cs">Customer Service</option>
                  <option value="editor">Editor</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer mt-2">
                <input type="checkbox" checked={form.status_aktif} onChange={e => setForm({...form, status_aktif: e.target.checked})} className="accent-indigo-600" />
                Akun Aktif
              </label>
              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-slate-200 rounded-xl py-2.5 text-sm text-slate-600 hover:bg-slate-50">Batal</button>
                <button type="submit" disabled={saving} className="flex-1 bg-indigo-700 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-indigo-800 disabled:opacity-60">
                  {saving ? 'Menyimpan...' : 'Simpan Pengguna'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
