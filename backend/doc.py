import os
from langchain_community.document_loaders import PyPDFLoader, TextLoader, Docx2txtLoader
from langchain.docstore.document import Document

def load_documents_from_folder(folder_path: str) -> list[Document]:
    all_docs = []

    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)

        if filename.endswith(".txt"):
            loader = TextLoader(file_path, encoding="utf-8")
        elif filename.endswith(".pdf"):
            loader = PyPDFLoader(file_path)
        elif filename.endswith(".docx"):
            loader = Docx2txtLoader(file_path)
        elif filename.endswith(".md"):
            loader = TextLoader(file_path)
        else:
            print(f"❌ Unsupported file format: {filename}")
            continue

        try:
            docs = loader.load()
            all_docs.extend(docs)
        except Exception as e:
            print(f"⚠️ Failed to load {filename}: {e}")

    return all_docs
