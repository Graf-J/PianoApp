from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class Song(BaseModel):
	id: Optional[int]
	name: str
	difficulty: int
	added: Optional[datetime]


