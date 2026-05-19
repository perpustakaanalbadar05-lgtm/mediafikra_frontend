import { useState, useEffect } from 'react';
import { Save, Globe } from 'lucide-react';
import api from '../../services/api';

export default function AdminSettingPage() {
  const [settings, setSettings] = useState({
    hero_title: 'Wujudkan Karya Tulis Menjadi Buku Profesional',
    hero_subtitle: 'Media Fikra hadir sebagai mitra penerbitan terpercaya.',
    contact_wa: '6281234567890',
    contact_email: 'info@mediafikra.com',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/settings').then(r => {
      setSettings(prev => ({ ...prev, ...r.data }));
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await api.post('/admin/settings', { settings });
      setMessage('✅ Pengaturan berhasil disimpan!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ Gagal menyimpan pengaturan.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Pengaturan Tampilan</h1>
        <p className="text-slate-500 text-sm mt-1">Ubah teks utama dan informasi kontak website</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-600" />
          <h2 className="font-semibold text-slate-800">Global Settings</h2>
        </div>
        
        <form onSubmit={handleSave} className="p-6 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-800 border-b pb-2 mb-4">Homepage Hero Section</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Headline Utama</label>
                <input value={settings.hero_title || ''} onChange={e => setSettings({...settings, hero_title: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subheadline / Deskripsi</label>
                <textarea value={settings.hero_subtitle || ''} onChange={e => setSettings({...settings, hero_subtitle: e.target.value})}
                  rows={3} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <h3 className="text-sm font-bold text-slate-800 border-b pb-2 mb-4">Informasi Kontak</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor WhatsApp CS (Gunakan 62...)</label>
                <input value={settings.contact_wa || ''} onChange={e => setSettings({...settings, contact_wa: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Email</label>
                <input value={settings.contact_email || ''} onChange={e => setSettings({...settings, contact_email: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-600">{message}</p>
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-700 text-white text-sm font-semibold rounded-xl hover:bg-indigo-800 disabled:opacity-60 transition-colors">
              <Save className="w-4 h-4" />
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
