from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
import google.generativeai as genai # <--- Library Google
from app.core.config import settings # <--- Ambil API Key
import os

# Konfigurasi Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)

# Folder untuk menyimpan Database Vector (Index AI)
VECTOR_DB_PATH = "faiss_index"

def process_document(file_path: str, doc_id: int):
    print(f"--- Memulai Proses AI untuk Dokumen ID: {doc_id} ---")
    
    # 1. Baca PDF (Extract Text)
    try:
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
        
        print(f"1. Teks berhasil diextract. Panjang karakter: {len(text)}")
    except Exception as e:
        print(f"Error membaca PDF: {e}")
        return False

    # 2. Pecah Teks jadi potongan kecil (Chunks)
    # Agar AI tidak pusing baca satu buku sekaligus
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    chunks = text_splitter.split_text(text)
    print(f"2. Teks dipecah menjadi {len(chunks)} potongan (chunks).")

    # 3. Buat Embeddings (Ubah Teks jadi Vector)
    # Kita pakai model 'all-MiniLM-L6-v2' yang ringan & cepat
    print("3. Sedang membuat Vector Embeddings (ini mungkin agak lama)...")
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    
    # 4. Simpan ke Vector Store (FAISS)
    vector_store = FAISS.from_texts(chunks, embeddings)
    
    # Simpan index secara lokal agar tidak perlu generate ulang terus
    save_path = f"{VECTOR_DB_PATH}_{doc_id}"
    vector_store.save_local(save_path)
    print(f"4. Selesai! Index AI tersimpan di folder: {save_path}")
    
    return True

# ... (Import yang sudah ada biarkan saja)

# Tambahkan fungsi ini di bagian paling bawah file
def search_document(doc_id: int, query: str):
    print(f"--- Mencari jawaban untuk Dokumen ID: {doc_id} ---")
    
    save_path = f"{VECTOR_DB_PATH}_{doc_id}"
    
    # Cek apakah index ada
    if not os.path.exists(save_path):
        return {"answer": "Error: Dokumen belum siap. Tunggu sebentar lagi."}

    # 1. Load Index Vector dari Disk
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    
    # allow_dangerous_deserialization=True diperlukan di versi terbaru karena kita meload file lokal
    vector_store = FAISS.load_local(save_path, embeddings, allow_dangerous_deserialization=True)
    
    # 2. Lakukan Pencarian (Similarity Search)
    # Ambil 4 potongan teks yang paling mirip dengan pertanyaan
    results = vector_store.similarity_search(query, k=4)
    
    # 3. Rapikan Hasil
    context_text = "\n\n".join([doc.page_content for doc in results])
    
    # 2. Suruh Gemini Menjawab (Generation)
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = f"""
        Anda adalah asisten akademik yang cerdas dan membantu mahasiswa skripsi.
        Tugas Anda adalah menjawab pertanyaan pengguna BERDASARKAN konteks dokumen di bawah ini.
        
        ATURAN:
        1. Jawab dengan bahasa Indonesia yang formal, akademis, tapi mudah dipahami.
        2. Gunakan format Markdown (bold, bullet points) agar rapi.
        3. JANGAN mengarang jawaban. Jika info tidak ada di konteks, katakan: "Maaf, informasi tersebut tidak ditemukan dalam dokumen ini."
        4. Di akhir, sebutkan referensi singkat (misal: "Berdasarkan bagian Latar Belakang...").

        KONTEKS DOKUMEN:
        {context_text}

        PERTANYAAN PENGGUNA:
        {query}
        """

        response = model.generate_content(prompt)
        ai_answer = response.text
        
    except Exception as e:
        ai_answer = f"Maaf, AI sedang sibuk. Error: {str(e)}"

    # Return jawaban AI + Context asli (untuk referensi jika perlu)
    return {
        "answer": ai_answer,
        "context": context_text 
    }