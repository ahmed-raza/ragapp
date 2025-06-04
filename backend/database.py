from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

# MySQL DB config
DB_USER = os.getenv('MYSQL_DB_USER')
DB_PASS = os.getenv('MYSQL_DB_PASS')
DB_HOST = os.getenv('MYSQL_DB_HOST')
DB_NAME = os.getenv('MYSQL_DB_NAME')

SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()
