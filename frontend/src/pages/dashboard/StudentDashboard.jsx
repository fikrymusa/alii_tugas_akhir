import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle, AlertTriangle, BookOpen, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  // Mock Data Status
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, analyzing, done

  const handleUpload = () => {
    setUploadStatus('uploading');
    // Simulasi proses upload & RAG
    setTimeout(() => setUploadStatus('analyzing'), 2000);
    setTimeout(() => setUploadStatus('done'), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Sederhana */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-100">
            <h2 className="font-bold text-indigo-600 text-xl flex items-center gap-2">
                <BookOpen className="w-6 h-6"/> ThesisGuard
            </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
            <div className="p-3 bg-indigo-50 text-indigo-700 rounded-lg font-medium cursor-pointer">Dashboard</div>
            <div className="p-3 text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer">Bimbingan</div>
            <div className="p-3 text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer">Riwayat Revisi</div>
        </nav>
        <div className="p-4 border-t border-slate-100">
            <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors">
                <LogOut className="w-4 h-4" /> Keluar
            </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="mb-8 flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Selamat Datang, Ahmad</h1>
                <p className="text-slate-500">Mahasiswa Teknik Informatika</p>
            </div>
            <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium">
                Status: Bimbingan Bab 1
            </div>
        </header>

        {/* Section Upload & Analisa */}
        <section className="grid md:grid-cols-3 gap-6">
            {/* Upload Card */}
            <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-semibold text-lg mb-4">Upload Draft Tugas Akhir</h3>
                
                <div 
                    onClick={uploadStatus === 'idle' ? handleUpload : null}
                    className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors
                    ${uploadStatus === 'idle' ? 'border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50' : 'border-slate-200 bg-slate-50 cursor-default'}`}
                >
                    {uploadStatus === 'idle' && (
                        <>
                            <div className="bg-indigo-100 p-4 rounded-full mb-4">
                                <UploadCloud className="w-8 h-8 text-indigo-600" />
                            </div>
                            <p className="text-slate-700 font-medium">Klik untuk upload file PDF/Docx</p>
                            <p className="text-slate-400 text-sm mt-1">Maksimal 10MB</p>
                        </>
                    )}

                    {uploadStatus === 'uploading' && (
                        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity }}>
                             <p className="text-indigo-600 font-medium">Mengupload Dokumen...</p>
                        </motion.div>
                    )}

                    {uploadStatus === 'analyzing' && (
                        <div className="text-center">
                             <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-3"></div>
                             <p className="text-indigo-600 font-medium">AI sedang menganalisa konten...</p>
                             <p className="text-slate-400 text-xs mt-1">Mengecek kesesuaian Pedoman & Plagiarisme</p>
                        </div>
                    )}

                    {uploadStatus === 'done' && (
                        <>
                             <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
                             <p className="text-slate-800 font-medium">Analisa Selesai</p>
                             <button onClick={() => setUploadStatus('idle')} className="mt-4 text-sm text-indigo-600 underline">Upload Ulang</button>
                        </>
                    )}
                </div>
            </div>

            {/* Hasil Analisa Cepat (Preview) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-slate-500"/> AI Feedback
                </h3>

                {uploadStatus !== 'done' ? (
                    <div className="text-center py-10 text-slate-400">
                        <p>Belum ada dokumen yang dianalisa.</p>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                        <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                            <div className="flex items-center gap-2 text-red-700 font-medium text-sm mb-1">
                                <AlertTriangle className="w-4 h-4" /> Format Margin
                            </div>
                            <p className="text-red-600 text-xs">Margin kiri terdeteksi 3cm, standar Pedoman UIN adalah 4cm.</p>
                        </div>

                        <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                            <div className="flex items-center gap-2 text-yellow-700 font-medium text-sm mb-1">
                                <AlertTriangle className="w-4 h-4" /> Daftar Pustaka
                            </div>
                            <p className="text-yellow-600 text-xs">2 Sitasi di Bab 1 tidak ditemukan di Daftar Pustaka.</p>
                        </div>

                        <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
                            <div className="flex items-center gap-2 text-green-700 font-medium text-sm mb-1">
                                <CheckCircle className="w-4 h-4" /> Judul
                            </div>
                            <p className="text-green-600 text-xs">Judul sesuai dengan isi dan tidak terindikasi duplikasi mayor.</p>
                        </div>
                        
                        <button className="w-full mt-2 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">Lihat Detail Revisi</button>
                    </motion.div>
                )}
            </div>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;