import { CheckCircle, Target, Eye, Heart, Users, BookOpen, Award } from 'lucide-react';

const keunggulan = [
  { icon: Award, title: 'Editorial Profesional', desc: 'Tim editor berpengalaman yang memastikan kualitas naskah Anda sebelum cetak.' },
  { icon: CheckCircle, title: 'ISBN Resmi', desc: 'Setiap buku mendapat ISBN resmi dari Perpustakaan Nasional RI.' },
  { icon: Users, title: 'Layanan Personal', desc: 'Pendampingan penuh dari konsultasi awal hingga buku Anda selesai dicetak.' },
  { icon: BookOpen, title: 'Kualitas Cetak Premium', desc: 'Menggunakan mesin cetak dan bahan berkualitas untuk hasil yang memuaskan.' },
];

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Tentang Media Fikra</h1>
          <p className="text-indigo-200 text-lg leading-relaxed">
            Platform penerbitan dan publikasi profesional yang telah membantu ratusan penulis mewujudkan karya mereka.
          </p>
        </div>
      </div>

      {/* Profil */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-600 leading-relaxed text-base">
            <strong className="text-slate-900">Media Fikra</strong> adalah platform penerbitan buku dan layanan publikasi yang berdiri dengan visi memudahkan setiap orang untuk berbagi ilmu dan ide melalui tulisan. Kami hadir untuk menjadi jembatan antara penulis — baik penulis pemula maupun akademisi senior — dengan pembaca di seluruh Indonesia.
          </p>
          <p className="text-slate-600 leading-relaxed text-base mt-4">
            Dengan pengalaman lebih dari 8 tahun, kami telah membantu lebih dari 300 penulis menerbitkan karya mereka, mulai dari buku akademik, buku bisnis, buku populer, hingga konversi tugas akhir menjadi buku yang layak jual. Setiap karya yang kami terbitkan melewati proses editorial yang ketat untuk memastikan kualitas terbaik.
          </p>
        </div>

        {/* Visi & Misi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
            <div className="flex items-center gap-3 mb-3">
              <Eye className="w-5 h-5 text-indigo-700" />
              <h2 className="font-bold text-slate-900">Visi</h2>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Menjadi platform penerbitan terdepan di Indonesia yang memberdayakan penulis lokal untuk berbagi karya dan ilmu pengetahuan kepada khalayak luas.
            </p>
          </div>
          <div className="bg-violet-50 rounded-2xl p-6 border border-violet-100">
            <div className="flex items-center gap-3 mb-3">
              <Target className="w-5 h-5 text-violet-700" />
              <h2 className="font-bold text-slate-900">Misi</h2>
            </div>
            <ul className="text-slate-600 text-sm space-y-1.5">
              <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />Menyediakan layanan penerbitan yang profesional dan terjangkau</li>
              <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />Mendukung penulis lokal dalam berkarya dan berbagi ilmu</li>
              <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />Meningkatkan kualitas literasi di Indonesia</li>
            </ul>
          </div>
        </div>

        {/* Keunggulan */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Mengapa Pilih Media Fikra?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {keunggulan.map(k => (
              <div key={k.title} className="flex gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="bg-indigo-100 p-2.5 rounded-xl h-fit">
                  <k.icon className="w-5 h-5 text-indigo-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{k.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{k.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
