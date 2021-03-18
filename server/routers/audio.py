from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from models.file_manager import Filemanager

router = APIRouter()
	

@router.get("/Audio/{song_id}", tags=["Audio"])
async def get_audio(song_id: str):
	path = Filemanager.get_song_path(song_id)

	if Filemanager.file_exists(path):
		file = FileResponse(path)
		return file
	else:
		raise HTTPException(status_code=404, detail='Audio not found')


@router.get("/Audio/{song_id}/Exists", tags=["Audio"])
async def check_audio(song_id: str):
	path = Filemanager.get_song_path(song_id)
	exists = Filemanager.file_exists(path)
	return { 'status': exists }


@router.post("/Audio/{song_id}", tags=["Audio"])
async def add_audio(song_id: str, file: UploadFile = File(...)):
	file_name = Filemanager.add_song(song_id, file)
	return file_name


@router.delete("/Audio/{song_id}", tags=["Audio"])
async def delete_audio(song_id: str):
	path = Filemanager.get_song_path(song_id)

	if Filemanager.file_exists(path):
		Filemanager.delete_song(path)
		return { 'status': 'OK' }
	else:
		raise HTTPException(status_code=404, detail='Audio not found')
