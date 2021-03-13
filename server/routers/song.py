from datetime import datetime
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from models.song import Song
from models.file_manager import Filemanager
from models.song_repository import SongRepository

router = APIRouter()

repository = SongRepository()

@router.get("/Song/{song_id}", tags=["Songs"])
async def get_song(song_id: str):
	try:
		song = repository.get_song(song_id)
		return song

	except:
		raise HTTPException(status_code=404, detail='Item not found')


@router.get("/Songs", tags=["Songs"])
async def get_songs():
	try:
		songs = repository.get_songs()
		return songs

	except:
		raise HTTPException(status_code=404, detail='Items not found')


@router.post("/Song", tags=["Songs"])
async def add_song(song: Song):
	try:
		song.added = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
		repository.add_song(song)
		return { 'status': 'OK' }

	except Exception as ex:
		raise HTTPException(status_code=400, detail='Unable to add Song')


@router.put("/Song", tags=["Songs"])
async def edit_song(song: Song):
	try:
		repository.edit_song(song)
		return { 'status': 'OK' }

	except Exception as ex:
		raise HTTPException(status_code=400, detail='Unable to edit Song ( Probably forgot to add the Id to the Song )')


@router.delete("/Song/{song_id}", tags=["Songs"])
async def remove_song(song_id: str):
	try:
		repository.remove_song(song_id)
		return { 'status': 'OK' }

	except Exception as ex:
		raise HTTPException(status_code=400, detail='Unable to delete Song')