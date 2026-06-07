import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BookOpen, Menu, X } from 'lucide-react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
  { to: '/', label: 'Beranda' },
  { to: '/layanan', label: 'Layanan' },
  { to: '/katalog', label: 'Katalog' },
  { to: '/portofolio', label: 'Portofolio' },
  { to: '/testimoni', label: 'Testimoni' },
  { to: '/promo', label: 'Promo' },
  { to: '/tentang', label: 'Tentang' },
  { to: '/kontak', label: 'Kontak' },
  { to: '/faq', label: 'FAQ' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [wa, setWa] = useState('6282332975294');

  useEffect(() => {
    api.get('/settings').then(r => {
      if (r.data.contact_wa) setWa(r.data.contact_wa);
    }).catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 font-bold text-xl text-slate-900 hover:text-indigo-700 transition-colors">
            <div className="bg-indigo-700 p-1.5 rounded-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            Media Fikra
          </Link>
 
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                       ? 'text-indigo-700 bg-indigo-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
 
          {/* CTA */}
          <div className="hidden md:block">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={`https://wa.me/${wa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-700 text-white text-sm font-medium rounded-lg hover:bg-indigo-800 transition-colors shadow-sm shadow-indigo-200"
            >
              Konsultasi Gratis
            </motion.a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <AnimatePresence mode="wait">
              {open ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1 overflow-hidden"
          >
            {links.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? 'text-indigo-700 bg-indigo-50' : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <a
              href={`https://wa.me/${wa}`}
              className="block mt-2 text-center px-4 py-2 bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors hover:bg-indigo-800"
            >
              Konsultasi Gratis
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
