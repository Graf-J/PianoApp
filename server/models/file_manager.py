
class Filemanager:

	@staticmethod
	def get_song_path(song_id: str):
		file_name = f'{song_id}_audio.m4a'
		path = r'./files/' + file_name
		return path


	@staticmethod
	def add_song(song_id: str, input_file):
		file_name = f'{song_id}_audio.m4a'

		with open(r'./files/' + file_name, 'wb') as output_file:
			data = input_file.file.read()
			output_file.write(data)

		return f'{song_id}_sound'
