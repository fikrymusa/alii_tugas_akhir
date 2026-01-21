# AI PDF-RAG: Sistem Analisis Dokumen Pintar (Tugas Akhir)

Sistem berbasis kecerdasan buatan (AI) yang dirancang untuk membantu ekstraksi informasi dan tanya jawab (Q&A) berbasis dokumen PDF menggunakan metode **Retrieval-Augmented Generation (RAG)**.

## 🚀 Fitur Utama

- **Upload PDF**: Antarmuka unggahan dokumen yang intuitif.
- **Text Extraction**: Ekstraksi teks otomatis dari file PDF untuk diproses oleh sistem.
- **AI RAG (Retrieval Augmented Generation)**:
  - Pencarian informasi kontekstual dari dokumen.
  - Chatbot interaktif yang menjawab berdasarkan isi dokumen yang diunggah.
  - Meminimalisir halusinasi AI dengan referensi data nyata.
- **Vector Database**: Penyimpanan cerdas (embeddings) untuk pencarian dokumen yang cepat dan akurat.

## 🛠️ Arsitektur & Teknologi

### Frontend

- **Framework**: React.js (Vite)
- **Styling**: Vanilla CSS / Tailwind CSS
- **State Management**: React Hooks / Context API

### Backend (Saran)

- **Language**: Python 3.x
- **Framework**: FastAPI / Flask
- **AI Framework**: LangChain / LlamaIndex
- **Embeddings**: OpenAI / Gemini / HuggingFace
- **Vector Store**: ChromaDB / FAISS / Pinecone

## 📦 Instalasi

### 1. Prasyarat

- Node.js & npm
- Python 3.10+
- AI API Key (OpenAI/Gemini)

### 2. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Setup Backend (Jika Ada)

```bash
cd backend
pip install -r requirements.txt
python main.py
```

## 📖 Cara Penggunaan

1. Jalankan aplikasi frontend dan backend.
2. Unggah file PDF melalui dashboard.
3. Tunggu proses ekstraksi dan _vectorizing_ selesai.
4. Masukkan pertanyaan pada kolom chat yang tersedia.
5. AI akan menjawab berdasarkan konten PDF tersebut.

## 📄 Struktur Proyek

- `frontend/`: Source code aplikasi web (React).
- `backend/`: API server dan logika RAG (Python).
- `docs/`: Dokumentasi teknis Tugas Akhir.

---

ALII UIN Jakarta 2026
