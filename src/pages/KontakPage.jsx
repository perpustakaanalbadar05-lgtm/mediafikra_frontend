import { Phone, Mail, MessageCircle, Share2, ExternalLink, MapPin } from 'lucide-react';

export default function KontakPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Hubungi Kami</h1>
          <p className="text-slate-500">Kami siap membantu Anda. Hubungi tim kami melalui salah satu kanal di bawah ini.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-2xl p-6 border border-slate-100 hover:border-green-200 hover:shadow-md transition-all flex items-center gap-4"
          >
            <div className="bg-green-100 p-3.5 rounded-xl group-hover:bg-green-200 transition-colors">
              <MessageCircle className="w-6 h-6 text-green-700" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">WhatsApp CS</p>
              <p className="text-slate-500 text-sm">+62 812-3456-7890</p>
              <p className="text-xs text-green-600 mt-0.5">Respons cepat (jam kerja)</p>
            </div>
          </a>

          <a
            href="mailto:info@mediafikra.com"
            className="group bg-white rounded-2xl p-6 border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all flex items-center gap-4"
          >
            <div className="bg-indigo-100 p-3.5 rounded-xl group-hover:bg-indigo-200 transition-colors">
              <Mail className="w-6 h-6 text-indigo-700" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Email</p>
              <p className="text-slate-500 text-sm">info@mediafikra.com</p>
              <p className="text-xs text-indigo-600 mt-0.5">Dibalas dalam 1×24 jam</p>
            </div>
          </a>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 flex items-center gap-4">
            <div className="bg-slate-100 p-3.5 rounded-xl">
              <Phone className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Telepon</p>
              <p className="text-slate-500 text-sm">+62 812-3456-7890</p>
              <p className="text-xs text-slate-500 mt-0.5">Senin – Jumat, 08.00 – 17.00 WIB</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 flex items-center gap-4">
            <div className="bg-slate-100 p-3.5 rounded-xl">
              <MapPin className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Media Sosial</p>
              <div className="flex gap-3 mt-1">
                <a href="#" className="flex items-center gap-1 text-sm text-pink-600 hover:underline"><Share2 className="w-4 h-4" />Instagram</a>
                <a href="#" className="flex items-center gap-1 text-sm text-blue-600 hover:underline"><ExternalLink className="w-4 h-4" />Facebook</a>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="bg-indigo-700 rounded-2xl text-white p-10 text-center">
          <h2 className="text-2xl font-bold mb-3">Mulai Konsultasi Sekarang</h2>
          <p className="text-indigo-200 mb-6">Ceritakan proyek buku Anda dan kami akan memberikan solusi terbaik.</p>
          <a
            href="https://wa.me/6281234567890?text=Halo Media Fikra, saya ingin berkonsultasi tentang penerbitan buku."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Chat WhatsApp Gratis
          </a>
        </div>
      </div>
    </div>
  );
}
