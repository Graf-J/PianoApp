from fastapi import FastAPI
from routers import song, audio

# uvicorn main:app --reload --host 0.0.0.0
app = FastAPI()

# Include Routers
app.include_router(song.router)
app.include_router(audio.router)


@app.get("/Version")
def version():
    return { 'version': '1.0.0' }


