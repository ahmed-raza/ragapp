from routes import auth, settings
from routes.documents import upload
from routes.documents import documents

routes = [
    auth.router,
    settings.router,
    upload.router,
    documents.router
]
