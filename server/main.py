from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import song, audio

# uvicorn main:app --reload --host 0.0.0.0
app = FastAPI()

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(song.router)
app.include_router(audio.router)


@app.get("/Version")
def version():
    return { 'version': '1.0.0' }


