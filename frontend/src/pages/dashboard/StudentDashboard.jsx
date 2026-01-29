import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle, AlertTriangle, BookOpen, LogOut, Loader2, Send } from 'lucide-react'; // Tambah icon Send
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const userName = localStorage.getItem('userName') || 'Mahasiswa';

  // State Upload
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // State Chat AI (BARU)
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [isAsking, setIsAsking] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleBoxClick = () => {
    if (uploadStatus === 'idle' || uploadStatus === 'error' || uploadStatus === 'success') {
       fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
        setUploadStatus('error');
        setErrorMessage('Hanya file PDF yang diperbolehkan!');
        return;
    }

    setUploadStatus('uploading');
    setErrorMessage('');
    setAnswer(null); // Reset chat saat upload file baru

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await api.post('/documents/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        setUploadedFile(response.data);
        setUploadStatus('success');
    } catch (error) {
        setUploadStatus('error');
        setErrorMessage(error.response?.data?.detail || 'Gagal mengupload file.');
    }
  };

  // Fungsi Tanya AI (BARU)
  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!question.trim() || !uploadedFile) return;

    setIsAsking(true);
    try {
        const response = await api.post('/chat/ask', {
            document_id: uploadedFile.id,
            question: question
        });
        setAnswer(response.data);
    } catch (error) {
        alert("Gagal bertanya ke AI: " + (error.response?.data?.detail || "Server Error"));
    } finally {
        setIsAsking(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-100">
            <h2 className="font-bold text-indigo-600 text-xl flex items-center gap-2">
                <BookOpen className="w-6 h-6"/> ThesisGuard
            </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
            <div className="p-3 bg-indigo-50 text-indigo-700 rounded-lg font-medium cursor-pointer">Dashboard</div>
            <div className="p-3 text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer">Bimbingan</div>
        </nav>
        <div className="p-4 border-t border-slate-100">
            <button onClick={handleLogout} className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors w-full">
                <LogOut className="w-4 h-4" /> Keluar
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:ml-64">
        <header className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800">Selamat Datang, {userName}</h1>
            <p className="text-slate-500">Mahasiswa Teknik Informatika</p>
        </header>

        <section className="grid md:grid-cols-2 gap-6">
            {/* Kiri: Upload Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-semibold text-lg mb-4">Upload Draft Tugas Akhir</h3>
                <input type="file" ref={fileInputRef} className="hidden" accept="application/pdf" onChange={handleFileChange} />

                <div onClick={handleBoxClick} className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${uploadStatus === 'success' ? 'border-green-200 bg-green-50' : 'border-indigo-100 hover:bg-indigo-50'}`}>
                    {uploadStatus === 'idle' && (
                        <>
                            <UploadCloud className="w-10 h-10 text-indigo-400 mb-3" />
                            <p className="text-slate-600 font-medium">Klik untuk upload PDF</p>
                        </>
                    )}
                    {uploadStatus === 'uploading' && <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />}
                    {uploadStatus === 'success' && (
                        <>
                            <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
                            <p className="text-green-700 font-medium">Dokumen Terupload!</p>
                            <p className="text-xs text-slate-500 mt-1 max-w-xs truncate">{uploadedFile?.filename}</p>
                            <span className="text-xs text-indigo-600 underline mt-2">Ganti File</span>
                        </>
                    )}
                </div>
            </div>

            {/* Kanan: AI Chat Interface (BARU) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[500px]">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-500"/> Tanya Dokumen (AI)
                </h3>

                {/* Area Chat / Jawaban */}
                <div className="flex-1 overflow-y-auto bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100">
                    {!uploadedFile ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
                            <BookOpen className="w-8 h-8 mb-2 opacity-50"/>
                            <p className="text-sm">Silakan upload dokumen dulu <br/> untuk mulai bertanya.</p>
                        </div>
                    ) : !answer ? (
                        <div className="text-center text-slate-500 mt-10">
                            <p className="text-sm font-medium">Dokumen siap!</p>
                            <p className="text-xs mt-1">Tanyakan sesuatu tentang dokumen Anda.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Pertanyaan User */}
                            <div className="flex justify-end">
                                <div className="bg-indigo-600 text-white px-4 py-2 rounded-l-xl rounded-tr-xl text-sm max-w-[80%]">
                                    {question}
                                </div>
                            </div>
                            
                            {/* Jawaban AI */}
                            <div className="flex justify-start">
                                <div className="bg-white border border-slate-200 text-slate-700 px-4 py-3 rounded-r-xl rounded-tl-xl text-sm shadow-sm max-w-[90%]">
                                    <p className="font-semibold text-indigo-600 mb-1">ThesisGuard AI:</p>
                                    <div className="text-slate-700 text-sm leading-relaxed">
                                        <ReactMarkdown
                                            components={{
                                                // Style untuk Bold
                                                strong: ({node, ...props}) => <span className="font-bold text-indigo-700" {...props} />,
                                                // Style untuk List (Poin-poin) agar muncul bullet-nya
                                                ul: ({node, ...props}) => <ul className="list-disc list-outside ml-5 mb-2 space-y-1" {...props} />,
                                                ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-5 mb-2 space-y-1" {...props} />,
                                                // Style untuk Paragraf
                                                p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                                                // Style untuk Link
                                                a: ({node, ...props}) => <a className="text-blue-600 hover:underline" target="_blank" {...props} />,
                                            }}
                                        >
                                            {answer.answer}
                                        </ReactMarkdown>
                                    </div>
                                    
                                    {/* Tampilkan Context/Kutipan (Opsional) */}
                                    <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 italic bg-slate-50 p-2 rounded">
                                        <strong>Sumber dari dokumen:</strong>
                                        {answer.context}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Pertanyaan */}
                <form onSubmit={handleAskAI} className="flex gap-2">
                    <input 
                        type="text" 
                        disabled={!uploadedFile || isAsking}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder={uploadedFile ? "Contoh: Apa rumusan masalahnya?" : "Upload file dulu..."}
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 text-sm"
                    />
                    <button 
                        type="submit" 
                        disabled={!uploadedFile || isAsking || !question.trim()}
                        className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 transition-colors"
                    >
                        {isAsking ? <Loader2 className="w-5 h-5 animate-spin"/> : <Send className="w-5 h-5"/>}
                    </button>
                </form>
            </div>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;