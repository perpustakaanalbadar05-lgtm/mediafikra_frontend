import { Phone, Mail, MessageCircle, Share2, ExternalLink, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function KontakPage() {
  const [settings, setSettings] = useState({ contact_wa: '6282332975294', contact_email: 'info@mediafikra.com' });

  useEffect(() => {
    api.get('/settings').then(r => {
      setSettings(prev => ({ ...prev, ...r.data }));
    }).catch(() => {});
  }, []);

  const formattedWa = settings.contact_wa ? `+${settings.contact_wa}` : '+62 812-3456-7890';

  return (
    <div className="min-h-screen bg-slate-50">
      <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="bg-white border-b border-slate-100 py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.h1 variants={fadeInUp} className="text-3xl font-bold text-slate-900 mb-3">Hubungi Kami</motion.h1>
          <motion.p variants={fadeInUp} className="text-slate-500">Kami siap membantu Anda. Hubungi tim kami melalui salah satu kanal di bawah ini.</motion.p>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <motion.a
            variants={fadeInUp}
            href={`https://wa.me/${settings.contact_wa}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-2xl p-6 border border-slate-100 hover:border-green-200 hover:shadow-md transition-all flex items-center gap-4"
          >
            <div className="bg-green-100 p-3.5 rounded-xl group-hover:bg-green-200 transition-colors">
              <MessageCircle className="w-6 h-6 text-green-700" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">WhatsApp CS</p>
              <p className="text-slate-500 text-sm">{formattedWa}</p>
              <p className="text-xs text-green-600 mt-0.5">Respons cepat (jam kerja)</p>
            </div>
          </motion.a>

          <motion.a
            variants={fadeInUp}
            href={`mailto:${settings.contact_email}`}
            className="group bg-white rounded-2xl p-6 border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all flex items-center gap-4"
          >
            <div className="bg-indigo-100 p-3.5 rounded-xl group-hover:bg-indigo-200 transition-colors">
              <Mail className="w-6 h-6 text-indigo-700" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Email</p>
              <p className="text-slate-500 text-sm">{settings.contact_email}</p>
              <p className="text-xs text-indigo-600 mt-0.5">Dibalas dalam 1×24 jam</p>
            </div>
          </motion.a>

          <motion.div variants={fadeInUp} className="bg-white rounded-2xl p-6 border border-slate-100 flex items-center gap-4">
            <div className="bg-slate-100 p-3.5 rounded-xl">
              <Phone className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Telepon</p>
              <p className="text-slate-500 text-sm">{formattedWa}</p>
              <p className="text-xs text-slate-500 mt-0.5">Senin – Jumat, 08.00 – 17.00 WIB</p>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="bg-white rounded-2xl p-6 border border-slate-100 flex items-center gap-4">
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
          </motion.div>
        </motion.div>

        {/* CTA Final */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-indigo-700 rounded-2xl text-white p-10 text-center">
          <h2 className="text-2xl font-bold mb-3">Mulai Konsultasi Sekarang</h2>
          <p className="text-indigo-200 mb-6">Ceritakan proyek buku Anda dan kami akan memberikan solusi terbaik.</p>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={`https://wa.me/${settings.contact_wa}?text=Halo Media Fikra, saya ingin berkonsultasi tentang penerbitan buku.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg shadow-indigo-900/20"
          >
            <MessageCircle className="w-5 h-5" />
            Chat WhatsApp Gratis
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
}
