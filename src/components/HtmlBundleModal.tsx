import React, { useState } from 'react';
import {
  Check,
  Code2,
  Copy,
  Download,
  FileCode,
  Github,
  Globe,
  X,
} from 'lucide-react';
import { generateStandaloneHtmlBundle } from '../utils/generateHtmlBundle';

interface HtmlBundleModalProps {
  onClose: () => void;
}

export const HtmlBundleModal: React.FC<HtmlBundleModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const htmlContent = generateStandaloneHtmlBundle();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(htmlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'toko-kopi-mergan.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-stone-200 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-scale-up">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900">
                Kode HTML Standalone Siap Pakai &amp; Download
              </h2>
              <p className="text-xs text-stone-500">
                File tunggal (.html) lengkap dengan Firebase Config, seluruh akun, dan form terintegrasi.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="p-4 bg-white border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-stone-700">
            <span className="px-2.5 py-1 rounded-md bg-stone-100 text-amber-800 font-mono font-bold border border-stone-200">
              toko-kopi-mergan.html
            </span>
            <span className="text-stone-300">•</span>
            <span>{(htmlContent.length / 1024).toFixed(1)} KB</span>
            <span className="text-stone-300">•</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> Siap Online di GitHub Pages
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer border ${
                copied
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-300'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Kode HTML'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download File HTML (.html)</span>
            </button>
          </div>
        </div>

        {/* Quick Guide */}
        <div className="px-5 py-3 bg-stone-50 border-b border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-700">
          <div className="flex items-start space-x-2">
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
              1
            </span>
            <p>
              <b>Buka Langsung:</b> Cukup download dan klik ganda file di PC/Laptop untuk langsung berjalan offline di browser.
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
              2
            </span>
            <p>
              <b>GitHub Pages:</b> Upload file ini dengan nama <code>index.html</code> ke repositori GitHub untuk web hosting.
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
              3
            </span>
            <p>
              <b>Firebase Hosting:</b> Letakkan di folder <code>public/index.html</code> lalu jalankan <code>firebase deploy</code>.
            </p>
          </div>
        </div>

        {/* Code Preview Box */}
        <div className="flex-1 p-4 overflow-y-auto bg-stone-900 font-mono text-xs text-stone-200">
          <pre className="whitespace-pre-wrap leading-relaxed select-all">
            {htmlContent}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <span className="text-xs text-stone-500 flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-amber-600" />
            <span>Format HTML5 mandiri, tanpa perlu instalasi npm build</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-stone-900 hover:bg-black text-white text-xs font-bold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
