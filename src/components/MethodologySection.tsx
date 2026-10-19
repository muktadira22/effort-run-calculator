import React from 'react';
import { ITRA_CATEGORIES } from '../domain/constants';

export const MethodologySection: React.FC = () => {
  return (
    <section
      id="metodologi"
      aria-labelledby="methodology-heading"
      className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-6 mt-8"
    >
      <div className="border-b border-slate-100 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-trail-700">
          Transparansi Perhitungan
        </span>
        <h2 id="methodology-heading" className="text-lg font-bold text-slate-900 mt-0.5">
          Bagaimana Angka Ini Dihitung?
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Kami menggabungkan standar resmi dunia <em>trail running</em> (ITRA) dengan penyesuaian
          teknis permukaan jalur agar Anda tidak terjebak perhitungan mental yang terlalu optimis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1 */}
        <div className="bg-stone-50/80 rounded-xl p-4 border border-slate-200/80 space-y-2">
          <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-trail-800 text-white font-mono text-xs font-bold">
            1
          </div>
          <h3 className="text-sm font-bold text-slate-900">Standar ITRA Km-Effort</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Setiap kenaikan vertikal <strong>100 meter (D+)</strong> dihitung setara dengan tambahan{' '}
            <strong>+1 km jarak lari datar</strong>.
          </p>
          <div className="p-2.5 bg-white rounded-lg border border-slate-200 font-mono text-xs text-slate-800">
            Km-Effort = Jarak (km) + (D+ / 100)
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-stone-50/80 rounded-xl p-4 border border-slate-200/80 space-y-2">
          <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-trail-800 text-white font-mono text-xs font-bold">
            2
          </div>
          <h3 className="text-sm font-bold text-slate-900">Faktor Teknis Medan (Surface)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Rumus ITRA murni tidak membedakan jalur tanah mulus dan jalur batu vulkanik/lumpur. Kami
            menambahkan pengali permukaan:
          </p>
          <ul className="text-xs text-slate-700 font-mono space-y-1 pl-1">
            <li>
              • Runable: <strong>&times;1.00 (+0%)</strong>
            </li>
            <li>
              • Moderate: <strong>&times;1.10 (+10%)</strong>
            </li>
            <li>
              • Technical: <strong>&times;1.20 (+20%)</strong>
            </li>
          </ul>
        </div>

        {/* Card 3 */}
        <div className="bg-stone-50/80 rounded-xl p-4 border border-slate-200/80 space-y-2">
          <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-trail-800 text-white font-mono text-xs font-bold">
            3
          </div>
          <h3 className="text-sm font-bold text-slate-900">Estimasi Waktu &amp; Effective Pace</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Waktu tempuh dihitung dari <em>Adjusted Road Equivalent</em> dikalikan{' '}
            <em>Flat Road Pace</em> Anda, lalu dibagi jarak aktual untuk mendapatkan{' '}
            <em>Effective Trail Pace</em>.
          </p>
          <div className="p-2.5 bg-white rounded-lg border border-slate-200 font-mono text-xs text-slate-800">
            Waktu = Adjusted Km &times; Road Pace
          </div>
        </div>
      </div>

      {/* Tabel Kategori ITRA */}
      <div className="pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Tabel Klasifikasi Kategori Lomba ITRA (Berdasarkan Base Km-Effort)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {ITRA_CATEGORIES.map((cat) => (
            <div
              key={cat.code}
              className="rounded-lg border border-slate-200 bg-stone-50/60 p-2.5 text-center"
            >
              <div className="text-xs font-mono font-extrabold text-trail-800">
                ITRA {cat.code}
              </div>
              <div className="text-[11px] font-mono text-slate-600 mt-0.5">{cat.rangeLabel}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
