import psycopg2
from models.song import Song

class SongRepository:

	def __init__(self):
		try:
			self.con = psycopg2.connect(database="postgres", user="postgres", password="password", host="db", port="5432")
			self.cursor = self.con.cursor()
			self.create_table()

		except Exception as ex:
			raise ex


	def get_song(self, song_id):
		command = f"""
			SELECT id, name, difficulty, link, added FROM songs
			WHERE id = {song_id};
		"""
		try:
			self.cursor.execute(command)
			song_props = self.cursor.fetchone()

			result = { 
				'id': song_props[0], 
				'name': song_props[1],
				'difficulty': song_props[2],
				'link': song_props[3],
				'added': song_props[4]
			}

			return result

		except Exception as ex:
			raise ex

	def get_songId_by_name(self, song_name):
		command = f"""
			SELECT id FROM songs 
			WHERE name = '{song_name}';
		"""

		try:
			self.cursor.execute(command)
			song_props = self.cursor.fetchone()
			song_id = song_props[0]
			return song_id

		except Exception as ex:
			raise ex


	def get_songs(self):
		command = """
			SELECT id, name, difficulty FROM songs
			ORDER BY added DESC;
		"""

		try:
			self.cursor.execute(command)
			songs = self.cursor.fetchall()

			result = []
			for song_props in songs:
				result.append({
					'id': song_props[0], 
					'name': song_props[1],
					'difficulty': song_props[2]
				})

			return result

		except Exception as ex:
			raise ex


	def add_song(self, song: Song):
		command = f"""
			INSERT INTO songs (name, difficulty, added)
			VALUES ('{song.name}', {song.difficulty}, '{song.added}');
		"""

		try:
			self.cursor.execute(command)
			self.con.commit()

		except Exception as ex:
			raise ex


	def edit_song(self, song: Song):
		
		if song.id is None:
			raise Exception('Song.Id is not defined')

		command = ''

		if song.link is None:
			command = f"""
				UPDATE songs SET 
					name = '{song.name}', 
					difficulty = {song.difficulty}
				WHERE id = {song.id};
			"""
		else:
			command = f"""
				UPDATE songs SET 
					name = '{song.name}', 
					difficulty = {song.difficulty},
					link = '{song.link}'
				WHERE id = {song.id};
			"""

		try:
			self.cursor.execute(command)
			self.con.commit()

		except Exception as ex:
			raise ex


	def remove_song(self, song_id: str):
		command = f"""
			DELETE FROM songs 
			WHERE id = {song_id};
		"""

		try:
			self.cursor.execute(command)
			self.con.commit()

		except Exception as ex:
			raise ex


	def create_table(self):
		command = """
			CREATE TABLE IF NOT EXISTS songs (
				id SERIAL NOT NULL PRIMARY KEY, 
				name VARCHAR (50) NOT NULL,
				difficulty SMALLINT NOT NULL,
				link VARCHAR (255) DEFAULT NULL,
				added TIMESTAMP NOT NULL
			);
		"""

		try:
			self.cursor.execute(command)
			self.con.commit()

		except Exception as ex:
			raise ex
