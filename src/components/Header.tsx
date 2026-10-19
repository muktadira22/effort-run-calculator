import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl bg-trail-800 text-white flex items-center justify-center shadow-sm shrink-0"
            aria-hidden="true"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 20h18L14 6l-4 7-3-4-4 11z"
              />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900">
                Trail-to-Road Effort Converter
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-trail-50 text-trail-800 border border-trail-700/20">
                Standar ITRA Km-Effort
              </span>
            </div>
            <p className="text-xs text-slate-600 hidden sm:block">
              Ubah spesifikasi rute trail (Jarak &amp; Elevasi D+) menjadi ekuivalen jarak &amp; waktu
              lari di jalan raya datar.
            </p>
          </div>
        </div>

        <a
          href="#metodologi"
          className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-trail-800 px-3 py-2 rounded-lg hover:bg-stone-100 transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-trail-700/30"
        >
          Cara Hitung &darr;
        </a>
      </div>
    </header>
  );
};
