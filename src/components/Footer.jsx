import { Link } from 'react-router-dom';
import { BookOpen, Phone, Mail, Share2, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <BookOpen className="w-4 h-4" />
              </div>
              Media Fikra
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Platform penerbitan dan publikasi profesional. Kami membantu Anda mewujudkan karya tulis menjadi buku berkualitas.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-indigo-700 transition-colors">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-indigo-700 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Layanan</h3>
            <ul className="space-y-2 text-sm">
              {['Penerbitan Buku', 'Konversi Tugas Akhir', 'Ghostwriting', 'Penerbitan Jurnal'].map(s => (
                <li key={s}><Link to="/layanan" className="hover:text-white transition-colors">{s}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Kontak</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>+62 812-3456-7890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>info@mediafikra.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs">
          <p>© {new Date().getFullYear()} Media Fikra. Hak Cipta Dilindungi.</p>
          <Link to="/admin/login" className="text-slate-600 hover:text-slate-400 transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
