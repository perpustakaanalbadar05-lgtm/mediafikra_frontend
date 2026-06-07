import { Link, NavLink, useNavigate, Outlet } from 'react-router-dom';
import { BookOpen, LayoutDashboard, Book, Star, Megaphone, Image, Package, LogOut, Menu, X, Users, Settings } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true, roles: ['superadmin', 'admin', 'cs', 'editor'] },
  { to: '/admin/buku', icon: Book, label: 'Buku', roles: ['superadmin', 'editor'] },
  { to: '/admin/kategori', icon: BookOpen, label: 'Kategori', roles: ['superadmin', 'editor'] },
  { to: '/admin/pesanan', icon: Package, label: 'Pesanan', roles: ['superadmin', 'cs'] },
  { to: '/admin/artikel', icon: Megaphone, label: 'Artikel Berita', roles: ['superadmin', 'admin', 'editor'] },
  { to: '/admin/testimoni', icon: Star, label: 'Testimoni', roles: ['superadmin', 'admin'] },
  { to: '/admin/promo', icon: Megaphone, label: 'Promo', roles: ['superadmin', 'admin'] },
  { to: '/admin/portofolio', icon: Image, label: 'Portofolio', roles: ['superadmin', 'admin'] },
  { to: '/admin/pengguna', icon: Users, label: 'Pengguna', roles: ['superadmin'] },
  { to: '/admin/pengaturan', icon: Settings, label: 'Pengaturan', roles: ['superadmin'] },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sideOpen, setSideOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm">Media Fikra</p>
            <p className="text-slate-500 text-xs">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.filter(item => item.roles.includes(user?.role)).map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setSideOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-sm">
            {user?.name?.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <p className="text-slate-500 text-xs truncate">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-slate-400 hover:text-red-400 text-sm transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-60 bg-slate-900 shrink-0">
        <SidebarContent />
      </aside>

      {/* Sidebar Mobile Overlay */}
      {sideOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-60 bg-slate-900">
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setSideOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar mobile */}
        <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSideOpen(true)} className="p-1.5 rounded-lg hover:bg-slate-100">
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          <span className="font-bold text-slate-900 text-sm">Media Fikra Admin</span>
          <div className="w-8" />
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
