import { useState, useEffect } from 'react';
import { Package, Eye } from 'lucide-react';
import api from '../../services/api';

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  diproses: 'bg-blue-100 text-blue-700',
  selesai: 'bg-green-100 text-green-700',
  dibatalkan: 'bg-red-100 text-red-700',
};

export default function AdminPesananPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/admin/orders').then(r => setOrders(r.data)).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/admin/orders/${id}/status`, { status });
    setOrders(o => o.map(x => x.id === id ? { ...x, status } : x));
    if (selected?.id === id) setSelected(s => ({ ...s, status }));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Manajemen Pesanan</h1>
        <p className="text-slate-500 text-sm mt-1">Pantau dan kelola pesanan yang masuk</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-5 py-3 text-left font-semibold text-slate-600">Pembeli</th>
              <th className="px-5 py-3 text-left font-semibold text-slate-600 hidden md:table-cell">Buku</th>
              <th className="px-5 py-3 text-left font-semibold text-slate-600">Total</th>
              <th className="px-5 py-3 text-left font-semibold text-slate-600 hidden sm:table-cell">Status</th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <tr key={i}><td colSpan={5} className="px-5 py-4"><div className="h-4 bg-slate-100 rounded animate-pulse" /></td></tr>
              ))
            ) : orders.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-400">Belum ada pesanan.</td></tr>
            ) : orders.map(o => (
              <tr key={o.id} className="hover:bg-slate-50">
                <td className="px-5 py-3">
                  <p className="font-medium text-slate-900">{o.nama_pembeli}</p>
                  <p className="text-xs text-slate-400">{o.whatsapp}</p>
                </td>
                <td className="px-5 py-3 text-slate-500 hidden md:table-cell">{o.book?.judul} ({o.qty} eks)</td>
                <td className="px-5 py-3 font-semibold text-indigo-700">Rp {o.total?.toLocaleString('id-ID')}</td>
                <td className="px-5 py-3 hidden sm:table-cell">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[o.status]}`}>{o.status}</span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => setSelected(o)} className="p-1.5 text-slate-400 hover:text-indigo-700 rounded-lg hover:bg-indigo-50">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">Detail Pesanan #{selected.id}</h2>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>
            <div className="px-6 py-5 space-y-3 text-sm">
              <div><span className="font-medium text-slate-700">Pembeli:</span> <span className="text-slate-600">{selected.nama_pembeli}</span></div>
              <div><span className="font-medium text-slate-700">WhatsApp:</span> <span className="text-slate-600">{selected.whatsapp}</span></div>
              <div><span className="font-medium text-slate-700">Buku:</span> <span className="text-slate-600">{selected.book?.judul}</span></div>
              <div><span className="font-medium text-slate-700">Jumlah:</span> <span className="text-slate-600">{selected.qty} eks</span></div>
              <div><span className="font-medium text-slate-700">Total:</span> <span className="font-bold text-indigo-700">Rp {selected.total?.toLocaleString('id-ID')}</span></div>
              <div><span className="font-medium text-slate-700">Alamat:</span> <span className="text-slate-600">{selected.alamat}</span></div>
              {selected.catatan && <div><span className="font-medium text-slate-700">Catatan:</span> <span className="text-slate-600">{selected.catatan}</span></div>}
              <div className="pt-2">
                <p className="font-medium text-slate-700 mb-2">Update Status:</p>
                <div className="flex flex-wrap gap-2">
                  {['pending', 'diproses', 'selesai', 'dibatalkan'].map(s => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected.id, s)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${selected.status === s ? statusColors[s] + ' border-transparent' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
