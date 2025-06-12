# tools/vector_search.py
from langchain.tools import Tool
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from doc import load_documents_from_folder
from dotenv import load_dotenv
from config import UPLOAD_DIR
import os

load_dotenv()

class DocumentSearch:
    def __init__(self, docs_dir=UPLOAD_DIR, db_dir="./chroma_db"):
        self.docs_dir = docs_dir
        self.db_dir = db_dir

        if not os.path.exists(db_dir) or not os.listdir(db_dir):
            self._load_and_persist()

        self.db = Chroma(persist_directory=db_dir, embedding_function=OpenAIEmbeddings())

    def _load_and_persist(self):
        documents = load_documents_from_folder(self.docs_dir)
        splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
        docs = splitter.split_documents(documents)
        db = Chroma.from_documents(docs, OpenAIEmbeddings(), persist_directory=self.db_dir)
        db.persist()

    def search(self, query: str, k: int = 3):
        results = self.db.similarity_search(query, k=k)
        return "\n\n".join([doc.page_content for doc in results])


# Create a LangChain tool
document_search_tool = Tool(
    name="document_search",
    description="Search uploaded documents and return relevant content.",
    func=lambda q: DocumentSearch().search(q)
)
