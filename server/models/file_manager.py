import os.path

class Filemanager:

	@staticmethod
	def get_song_path(song_id: str):
		file_name = f'{song_id}_sound.m4a'
		path = r'./files/' + file_name
		return path

	@staticmethod
	def file_exists(path: str):
		exists = os.path.isfile(path)
		return exists

	@staticmethod
	def add_song(song_id: str, input_file):
		file_name = f'{song_id}_sound.m4a'

		with open(r'./files/' + file_name, 'wb') as output_file:
			data = input_file.file.read()
			output_file.write(data)

		return f'{song_id}_sound'

	@staticmethod
	def delete_song(path: str):
		os.remove(path)
