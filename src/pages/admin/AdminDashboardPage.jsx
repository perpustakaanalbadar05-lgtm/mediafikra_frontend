import { useState, useEffect } from 'react';
import { Book, Star, Megaphone, Image, Package, TrendingUp } from 'lucide-react';
import api from '../../services/api';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 flex items-center gap-4">
      <div className={`${color} p-3 rounded-xl`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value ?? '—'}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/admin/books'),
      api.get('/admin/testimonials'),
      api.get('/admin/promos'),
      api.get('/portfolios'),
      api.get('/admin/orders'),
    ]).then(([books, testi, promos, portfolios, orders]) => {
      setStats({
        books: books.data.length,
        testimonials: testi.data.length,
        promos: promos.data.length,
        portfolios: portfolios.data.length,
        orders: orders.data.length,
      });
      setRecentOrders(orders.data.slice(0, 5));
    }).catch(() => {});
  }, []);

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    diproses: 'bg-blue-100 text-blue-700',
    selesai: 'bg-green-100 text-green-700',
    dibatalkan: 'bg-red-100 text-red-700',
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Selamat datang kembali di panel admin Media Fikra.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        <StatCard icon={Book} label="Total Buku" value={stats.books} color="bg-indigo-100 text-indigo-700" />
        <StatCard icon={Package} label="Total Pesanan" value={stats.orders} color="bg-amber-100 text-amber-700" />
        <StatCard icon={Star} label="Testimoni" value={stats.testimonials} color="bg-violet-100 text-violet-700" />
        <StatCard icon={Megaphone} label="Promo & Berita" value={stats.promos} color="bg-sky-100 text-sky-700" />
        <StatCard icon={Image} label="Portofolio" value={stats.portfolios} color="bg-emerald-100 text-emerald-700" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Pesanan Terbaru</h2>
          </div>
          <div className="divide-y divide-slate-50 flex-1">
            {recentOrders.length === 0 ? (
              <p className="text-center text-slate-400 text-sm py-8">Belum ada pesanan.</p>
            ) : (
              recentOrders.map(order => (
                <div key={order.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 text-sm truncate">{order.nama_pembeli}</p>
                    <p className="text-xs text-slate-500 truncate">{order.book?.judul} — {order.qty} eks</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-indigo-700">Rp {order.total?.toLocaleString('id-ID')}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chart Visualization */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col justify-between">
          <div>
            <h2 className="font-semibold text-slate-900 mb-5">Statistik Konten</h2>
            <div className="space-y-4">
              {[
                { label: 'Buku Penerbitan', val: stats.books || 0, color: 'bg-indigo-600', text: 'text-indigo-600' },
                { label: 'Pesanan Buku', val: stats.orders || 0, color: 'bg-amber-500', text: 'text-amber-600' },
                { label: 'Testimonial', val: stats.testimonials || 0, color: 'bg-violet-600', text: 'text-violet-600' },
                { label: 'Promo & Berita', val: stats.promos || 0, color: 'bg-sky-500', text: 'text-sky-600' },
                { label: 'Portofolio Cetak', val: stats.portfolios || 0, color: 'bg-emerald-500', text: 'text-emerald-600' },
              ].map((item, idx) => {
                const maxVal = Math.max(stats.books || 1, stats.orders || 1, stats.testimonials || 1, stats.promos || 1, stats.portfolios || 1, 10);
                const widthPct = Math.min(100, (item.val / maxVal) * 100);
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-600">{item.label}</span>
                      <span className={`${item.text} bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100`}>{item.val} item</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${widthPct}%` }}
                        className={`h-full ${item.color} rounded-full transition-all duration-700 ease-out`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Visualisasi Distribusi Konten</span>
            <span className="flex items-center gap-1 text-indigo-600 font-medium">
              <TrendingUp className="w-3.5 h-3.5 animate-pulse" /> Live System
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
