import yt_dlp
import json
import random

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

    if i >= len(nome):
        i = 0

    ydl_opt = {
        "format": "bestaudio/best",
        "noplaylist": True
    }

    with yt_dlp.YoutubeDL(ydl_opt) as ydl:
        resultado = ydl.extract_info(
            f"ytsearch:{nome[i]}",
            download=False
        )

        musica = resultado["entries"][0]

        url = musica["url"]
        titulo = musica.get("title")
        artista = musica.get("artist") or musica.get("uploader")
        album = musica.get("album")

    i += 1

    return [url, titulo, artista, album]

def tocar_playlist():
    with open("skills/playlist/playlist.json", "r", encoding="utf8") as arquivo:
        global playlist
        playlist = json.load(arquivo)
        random.shuffle(playlist["rock"])

        print('antes de buscar musica')

        musica = buscar_playlist(playlist["rock"])
        flagPlaylist = True
        flagMusic = False

        print('buscou a musica')

        return {"resposta": "Tocando playlist", "audio": musica[0], "musica": musica[1:3]}
