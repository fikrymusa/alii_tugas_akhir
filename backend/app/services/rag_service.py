from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings # <--- Update import library embedding
from langchain_community.vectorstores import FAISS
from google import genai # <--- Library Baru Google
from app.core.config import settings
import os

# Folder Database Vector
VECTOR_DB_PATH = "faiss_index"

def process_document(file_path: str, doc_id: int):
    print(f"--- Memulai Proses AI untuk Dokumen ID: {doc_id} ---")
    try:
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
    except Exception as e:
        print(f"Error membaca PDF: {e}")
        return False

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_text(text)
    
    # Gunakan model embedding yang sama
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    vector_store = FAISS.from_texts(chunks, embeddings)
    
    save_path = f"{VECTOR_DB_PATH}_{doc_id}"
    vector_store.save_local(save_path)
    return True

def search_document(doc_id: int, query: str):
    print(f"--- Gemini (Baru) berpikir untuk Dokumen ID: {doc_id} ---")
    
    save_path = f"{VECTOR_DB_PATH}_{doc_id}"
    if not os.path.exists(save_path):
        return {"answer": "Error: Dokumen belum siap. Tunggu sebentar lagi."}

    # 1. Cari Kutipan (Retrieval)
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    vector_store = FAISS.load_local(save_path, embeddings, allow_dangerous_deserialization=True)
    results = vector_store.similarity_search(query, k=4)
    
    context_text = "\n\n".join([doc.page_content for doc in results])
    
    # 2. Generate Jawaban dengan Library google-genai BARU
    try:
        # Inisialisasi Client Baru
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        
        prompt = f"""
        Anda adalah asisten akademik yang cerdas. Jawab pertanyaan pengguna BERDASARKAN konteks dokumen di bawah ini.
        
        ATURAN:
        1. Jawab dengan bahasa Indonesia formal & akademis.
        2. Gunakan format Markdown (bold, bullet points).
        3. Jika tidak ada info di dokumen, katakan tidak tahu.

        KONTEKS:
        {context_text}

        PERTANYAAN:
        {query}
        """

        # Panggil Model Baru (gemini-1.5-flash)
        response = client.models.generate_content(
            model='gemini-1.5-flash',
            contents=prompt
        )
        ai_answer = response.text
        
    except Exception as e:
        ai_answer = f"Maaf, ada kendala koneksi ke AI Google. Error: {str(e)}"

    return {
        "answer": ai_answer,
        "context": context_text 
    }