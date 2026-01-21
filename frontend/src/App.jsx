import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import StudentDashboard from './pages/dashboard/StudentDashboard';

// Hapus function App() yang lama (yang ada useState/axios), gunakan yang ini saja:
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/mahasiswa" element={<StudentDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;