import yt_dlp

i = 0
paused = False
flagPassar = False
playlist = ''

#Busca uma música individual
def buscar_musica(nome):
    ydl_opts = {
        "format": "bestaudio/best",
        "noplaylist": True
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        resultado = ydl.extract_info(f"ytsearch1:{nome}", download=False)

        musica = resultado["entries"][0]

        url = musica["url"]

        titulo = musica.get("title")
        artista = musica.get("artist") or musica.get("uploader")
        album = musica.get("album")

    return [url, titulo, artista, album]

#Busca músicas da playlist
def buscar_playlist(nome=''):
    global i
    global playlist
    if playlist == '':
        playlist = nome
    if i > len(playlist):
        i = 0
    ydl_opt = {
        "format": "bestaudio/best",
        "noplaylist": True
    }
    with yt_dlp.YoutubeDL(ydl_opt) as ydl:
        resultado = ydl.extract_info(f"ytsearch:{playlist[i]}", download=False)
        musica = resultado["entries"][0]
        url = musica["url"]
        titulo = musica.get("title")
        artista = musica.get("artist") or musica.get("uploader")
        album = musica.get("album")
    i += 1
    return [url, titulo, artista, album]
