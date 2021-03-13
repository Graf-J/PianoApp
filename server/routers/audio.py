from fastapi import APIRouter, UploadFile, File
from fastapi.responses import FileResponse
from models.file_manager import Filemanager

router = APIRouter()
	

@router.get("/Audio/{song_id}", tags=["Audio"])
async def get_audio(song_id: str):
	path = Filemanager.get_song_path(song_id)
	return FileResponse(path)


@router.post("/Audio/{song_id}", tags=["Audio"])
async def add_audio(song_id: str, file: UploadFile = File(...)):
	file_name = Filemanager.add_song(song_id, file)
	return file_name