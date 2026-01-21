import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, ChevronRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Login = () => {
  const navigate = useNavigate();

  // State untuk form input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('mahasiswa'); // (Opsional: Backend kita auto-detect role dari email, tapi visual dropdown tetap bagus)
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      // Simulasi delay network
    setTimeout(() => {
      setLoading(false);
      // Logic redirect sederhana untuk MVP
      if (role === 'mahasiswa') navigate('/mahasiswa');
      else alert(`Dashboard untuk role ${role} belum dibuat di demo ini.`);
    }, 1500);
  } catch (error) {
    setLoading(false);
    setErrorMsg('Login gagal. Periksa email dan password Anda.');
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
          <h1 className="text-2xl font-bold text-slate-900">RAG Tugas Akhir</h1>
          <p className="text-slate-500 text-sm mt-2">Sistem Penjaminan Mutu Tugas Akhir</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Role Selector */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Masuk Sebagai</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
            >
              <option value="mahasiswa">Mahasiswa</option>
              <option value="dosen">Dosen Pembimbing</option>
              <option value="kaprodi">Kaprodi</option>
              <option value="fakultas">Fakultas</option>
              <option value="lpm">LPM (Penjamin Mutu)</option>
              <option value="alii">ALII</option>
            </select>
          </div>

          {/* Username Input */}
          <div className="relative">
            <User className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="NIM / NIP" 
              className="w-full pl-10 p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-pulse">Sedang Verifikasi...</span>
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