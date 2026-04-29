from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.database import create_tables
from app.api import auth, users, roadmap, lessons, progress, ai, code, store


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await create_tables()
    print(f"[STARTUP] {settings.APP_NAME} v{settings.APP_VERSION} started")
    yield
    # Shutdown
    print("[SHUTDOWN] Shutting down...")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Coding & DSA — AI-powered adaptive learning platform",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(roadmap.router)
app.include_router(lessons.router)
app.include_router(progress.router)
app.include_router(ai.router)
app.include_router(code.router)
app.include_router(store.router)


@app.get("/")
async def root():
    return {"message": f"Welcome to {settings.APP_NAME} API 🚀", "version": settings.APP_VERSION}


@app.get("/health")
async def health():
    return {"status": "healthy"}
