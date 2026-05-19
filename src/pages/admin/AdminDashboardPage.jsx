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

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-slate-100">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Pesanan Terbaru</h2>
        </div>
        <div className="divide-y divide-slate-50">
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
    </div>
  );
}
