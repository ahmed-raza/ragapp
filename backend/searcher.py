from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from doc import load_documents_from_folder
from dotenv import load_dotenv
import os

load_dotenv()

documents = load_documents_from_folder('./docs')

splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
docs = splitter.split_documents(documents)

embedding_model = OpenAIEmbeddings()

db = Chroma.from_documents(docs, embedding_model, persist_directory="./chroma_db")
db.persist()

query = "What is the name of this cadidate?"
results = db.similarity_search(query, k=1)

for i, doc in enumerate(results):
    print(f"\n--- Result {i+1} ---\n{doc.page_content}")
