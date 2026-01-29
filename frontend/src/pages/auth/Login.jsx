import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, ChevronRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Login = () => {
  const navigate = useNavigate();

  // State form (Hanya butuh Email & Password sekarang)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    
    try {
      // 1. Kirim Request ke Backend
      // Buat object Form Data
      const formData = new FormData();
      formData.append('username', email); // Backend OAuth2 bacanya 'username', walau isinya email
      formData.append('password', password);

      const response = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      console.log("Login Sukses:", response.data);

      // 2. Ambil data dari backend (Role didapat otomatis dari sini)
      const { access_token, role, full_name } = response.data;

      // 3. Simpan data sesi
      localStorage.setItem('token', access_token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userName', full_name);

      // 4. Redirect otomatis berdasarkan Role yang didapat dari database
      if (role === 'mahasiswa') {
        navigate('/mahasiswa');
      } else if (role === 'dosen') {
        alert(`Selamat datang Dosen ${full_name}. Dashboard Dosen akan segera hadir.`);
        // navigate('/dosen'); 
      } else if (role === 'kaprodi') {
        alert(`Selamat datang Kaprodi ${full_name}. Dashboard Kaprodi akan segera hadir.`);
        // navigate('/kaprodi');
      } else {
        alert(`Login berhasil sebagai ${role}`);
      }

    } catch (error) {
      console.error("Login Error:", error);
      if (error.response && error.response.status === 401) {
        setErrorMsg('Email atau Password salah.');
      } else {
        setErrorMsg('Gagal terhubung ke server.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-indigo-50"
      >
        <div className="text-center mb-8">
          <div className="bg-indigo-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
            <ShieldCheck className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">ThesisGuard AI</h1>
          <p className="text-slate-500 text-sm mt-2">Sistem Penjaminan Mutu Tugas Akhir</p>
        </div>

        {/* Notifikasi Error */}
        {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 border border-red-100">
                <AlertCircle className="w-4 h-4"/> {errorMsg}
            </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Email Input */}
          <div className="relative">
            <User className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Email (mahasiswa@uin.ac.id)" 
              className="w-full pl-10 p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full pl-10 p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-pulse">Memverifikasi...</span>
            ) : (
              <>
                Masuk Sistem <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          &copy; 2026 Universitas Islam Negeri Syarif Hidayatullah Jakarta
        </div>
      </motion.div>
    </div>
  );
};

export default Login;