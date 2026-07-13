from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base, SessionLocal
from app.api.routes import router
from app.core.initial_data import create_admin_user

# Crear tablas
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Segura API",
    description="API rápida con FastAPI y SQLAlchemy",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rutas
app.include_router(router, prefix="/api/v1")

@app.get("/")
def root():
    return {
        "message": "Segura API",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Crear usuario admin al iniciar (después de definir todo)
def init_admin():
    db = SessionLocal()
    try:
        create_admin_user(db)
    finally:
        db.close()

# Ejecutar al iniciar
init_admin()