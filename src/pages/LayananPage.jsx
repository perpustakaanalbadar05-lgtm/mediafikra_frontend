import { BookOpen, FileText, Sparkles, Award, CheckCircle, ArrowRight, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../services/api';

const services = [
  {
    icon: BookOpen,
    title: 'Penerbitan & Cetak Buku',
    subtitle: 'Dari Naskah ke Buku Cetak Profesional',
    desc: 'Kami menerbitkan berbagai jenis buku — fiksi, non-fiksi, buku ilmiah, dan buku populer. Setiap buku diproses dengan standar editorial tinggi, dilengkapi dengan ISBN resmi, dan siap didistribusikan.',
    process: ['Konsultasi & evaluasi naskah', 'Editing & proofreading', 'Desain layout & cover', 'Percetakan berkualitas', 'Pengiriman & distribusi'],
    color: 'indigo',
    wa: 'Saya ingin menerbitkan buku',
  },
  {
    icon: FileText,
    title: 'Konversi Tugas Akhir → Buku',
    subtitle: 'Ubah Skripsi/Tesis/Disertasi Anda Menjadi Buku',
    desc: 'Karya ilmiah Anda terlalu berharga untuk hanya disimpan di perpustakaan. Kami membantu mengubahnya menjadi buku yang dapat dibaca publik luas dan meningkatkan rekam jejak akademik Anda.',
    process: ['Analisis & penilaian naskah', 'Adaptasi dari format akademik ke buku', 'Editing gaya penulisan', 'Layout & desain cover', 'Penerbitan dengan ISBN'],
    color: 'violet',
    wa: 'Saya ingin konversi tugas akhir menjadi buku',
  },
  {
    icon: Sparkles,
    title: 'Jasa Ghostwriting',
    subtitle: 'Miliki Buku Sendiri, Kami yang Menulis',
    desc: 'Punya ide buku tapi tidak tahu cara menulisnya? Tim ghostwriter profesional kami siap mengubah ide, gagasan, atau kisah Anda menjadi naskah buku yang menarik dan layak terbit.',
    process: ['Wawancara & penggalian ide', 'Penyusunan outline', 'Penulisan naskah bertahap', 'Revisi & penyempurnaan', 'Finalisasi naskah siap terbit'],
    color: 'sky',
    wa: 'Saya ingin menggunakan jasa ghostwriting',
  },
  {
    icon: Award,
    title: 'Penerbitan Jurnal',
    subtitle: 'Publikasi Ilmiah yang Terstandar',
    desc: 'Untuk peneliti dan dosen yang membutuhkan publikasi jurnal ilmiah. Kami menyediakan layanan dari review naskah, editing, proofreading, hingga dukungan penuh proses publikasi.',
    process: ['Review & seleksi naskah', 'Peer review process', 'Editing & proofreading', 'Formatting standar jurnal', 'Publikasi & indexing support'],
    color: 'emerald',
    wa: 'Saya ingin menerbitkan jurnal ilmiah',
  },
];

const colorMap = {
  indigo: { bg: 'bg-indigo-50', icon: 'bg-indigo-700', text: 'text-indigo-700', border: 'border-indigo-100', check: 'text-indigo-500' },
  violet: { bg: 'bg-violet-50', icon: 'bg-violet-700', text: 'text-violet-700', border: 'border-violet-100', check: 'text-violet-500' },
  sky: { bg: 'bg-sky-50', icon: 'bg-sky-600', text: 'text-sky-700', border: 'border-sky-100', check: 'text-sky-500' },
  emerald: { bg: 'bg-emerald-50', icon: 'bg-emerald-700', text: 'text-emerald-700', border: 'border-emerald-100', check: 'text-emerald-500' },
};

export default function LayananPage() {
  const [wa, setWa] = useState('6281234567890');

  useEffect(() => {
    api.get('/settings').then(r => {
      if (r.data.contact_wa) setWa(r.data.contact_wa);
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Layanan Media Fikra</h1>
          <p className="text-slate-500 leading-relaxed">
            Solusi penerbitan dan publikasi terlengkap untuk kebutuhan akademik, profesional, dan personal Anda.
          </p>
        </div>
      </div>

      {/* Services */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
        {services.map((s, i) => {
          const c = colorMap[s.color];
          return (
            <div key={i} className={`bg-white rounded-2xl border ${c.border} overflow-hidden shadow-sm`}>
              <div className={`${c.bg} px-8 py-6 flex items-center gap-4`}>
                <div className={`${c.icon} p-3 rounded-xl`}>
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${c.text}`}>{s.title}</h2>
                  <p className="text-slate-600 text-sm">{s.subtitle}</p>
                </div>
              </div>
              <div className="px-8 py-6 grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-slate-600 leading-relaxed text-sm">{s.desc}</p>
                  <a
                    href={`https://wa.me/${wa}?text=${encodeURIComponent(s.wa)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 mt-4 px-4 py-2 ${c.icon} text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Konsultasi Layanan Ini
                  </a>
                </div>
                <div>
                  <p className="font-semibold text-slate-700 text-sm mb-3">Alur Proses:</p>
                  <ul className="space-y-2">
                    {s.process.map((step, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle className={`w-4 h-4 ${c.check} mt-0.5 shrink-0`} />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="bg-indigo-700 text-white py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">Butuh Bantuan Memilih Layanan?</h2>
          <p className="text-indigo-200 mb-6 text-sm">Konsultasi gratis dengan tim kami dan kami akan merekomendasikan layanan yang paling sesuai untuk Anda.</p>
          <a
            href={`https://wa.me/${wa}?text=Halo Media Fikra, saya ingin konsultasi tentang layanan penerbitan`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Chat WhatsApp Sekarang
          </a>
        </div>
      </div>
    </div>
  );
}
