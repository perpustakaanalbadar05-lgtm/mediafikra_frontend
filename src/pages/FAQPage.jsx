import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const faqs = [
  {
    q: 'Berapa lama proses penerbitan buku di Media Fikra?',
    a: 'Proses penerbitan standar umumnya memakan waktu 4-8 minggu setelah naskah diterima, tergantung dari kondisi naskah dan antrian. Kami juga menyediakan layanan ekspres untuk kebutuhan mendesak.',
  },
  {
    q: 'Apa saja syarat naskah yang bisa diterbitkan?',
    a: 'Naskah dapat berupa Word, PDF, atau format lain. Minimal 60 halaman A5 untuk buku cetak. Naskah harus merupakan karya orisinal dan belum pernah diterbitkan oleh penerbit lain. Kami akan melakukan evaluasi awal secara gratis.',
  },
  {
    q: 'Bagaimana cara memesan buku dari katalog?',
    a: 'Cukup masuk ke halaman Katalog, pilih buku yang diinginkan, klik "Beli Sekarang", isi form pemesanan, dan sistem akan mengarahkan Anda ke WhatsApp CS kami dengan data pesanan yang sudah lengkap.',
  },
  {
    q: 'Apakah buku yang diterbitkan mendapatkan ISBN?',
    a: 'Ya, setiap buku yang kami terbitkan akan mendapatkan ISBN resmi dari Perpustakaan Nasional RI. ISBN akan tercantum di cover belakang buku Anda.',
  },
  {
    q: 'Berapa biaya penerbitan buku?',
    a: 'Biaya penerbitan bervariasi tergantung panjang naskah, jumlah cetak, dan spesifikasi buku (cover, kertas, dll). Hubungi tim kami untuk mendapatkan estimasi biaya yang akurat sesuai kebutuhan Anda.',
  },
  {
    q: 'Apakah ada biaya minimal untuk layanan ghostwriting?',
    a: 'Biaya ghostwriting tergantung panjang naskah dan kompleksitas topik. Konsultasi awal kami lakukan secara gratis. Tim kami akan memberikan penawaran setelah memahami kebutuhan Anda.',
  },
  {
    q: 'Bagaimana proses pengiriman buku yang dipesan?',
    a: 'Pengiriman menggunakan jasa ekspedisi terpercaya ke seluruh Indonesia. Biaya pengiriman ditanggung pembeli dan akan dikonfirmasi oleh CS kami. Buku dikemas dengan aman untuk menjaga kualitas.',
  },
  {
    q: 'Apakah saya bisa merevisi naskah setelah proses editing?',
    a: 'Ya, kami menyediakan sesi revisi setelah editing selesai. Umumnya 1-2 kali revisi termasuk dalam paket standar. Revisi tambahan di luar paket dapat dikenakan biaya tambahan.',
  },
];

function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div variants={fadeInUp} className="bg-white rounded-xl border border-slate-100 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-4 flex items-start justify-between gap-4 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="font-semibold text-slate-900 text-sm">{faq.q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className={`w-4 h-4 shrink-0 mt-0.5 ${open ? 'text-indigo-600' : 'text-slate-400'}`} />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5">
              <p className="text-slate-500 text-sm leading-relaxed">{faq.a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="bg-white border-b border-slate-100 py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.h1 variants={fadeInUp} className="text-3xl font-bold text-slate-900 mb-3">Pertanyaan Umum (FAQ)</motion.h1>
          <motion.p variants={fadeInUp} className="text-slate-500">Jawaban atas pertanyaan yang paling sering kami terima dari calon penulis dan pelanggan.</motion.p>
        </div>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-3">
        {faqs.map((faq, i) => <FAQItem key={i} faq={faq} index={i} />)}
      </motion.div>

      <div className="max-w-3xl mx-auto px-4 pb-14">
        <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100 text-center">
          <p className="text-slate-700 font-medium mb-2">Masih punya pertanyaan lain?</p>
          <p className="text-slate-500 text-sm mb-4">Tim kami siap menjawab secara langsung via WhatsApp.</p>
          <a
            href="https://wa.me/6281234567890?text=Halo Media Fikra, saya punya pertanyaan tentang layanan Anda."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-700 text-white text-sm font-semibold rounded-xl hover:bg-indigo-800 transition-colors"
          >
            Tanya via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
