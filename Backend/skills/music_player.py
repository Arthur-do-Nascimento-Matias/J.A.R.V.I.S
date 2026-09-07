import yt_dlp
import json
import random

i = 0
paused = False
flagPassar = False
flagPlaylist = False
flagMusic = False
flagPausar = False
playlist = ''

#Busca uma música individual
def tocar_musica(nome):

    global flagPlaylist
    global flagMusic

    flagMusic = True
    flagPlaylist = False

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

    return {"resposta": "Tocando " + nome, "audio": url, "musica": [titulo, artista, album]}

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

    global flagPlaylist
    global flagMusic

    flagPlaylist = True
    flagMusic = False

    with open("skills/playlist/playlist.json", "r", encoding="utf8") as arquivo:
        global playlist
        playlist = json.load(arquivo)
        random.shuffle(playlist["rock"])

        musica = buscar_playlist(playlist["rock"])

        return {"resposta": "Tocando playlist", "audio": musica[0], "musica": musica[1:3]}

def parar_musica():
    global flagPausar

    flagPausar = True
    return {"resposta": "música pausada", "pause": True}

def despausar_musica():
    global flagPausar

    if not flagPausar: 
        return {"resposta": "Não há música pausada"}

    flagPausar = False
    return {"resposta": "Música despausada", "tocar": True}

def retroceder_musica():

    global flagPlaylist
    print(flagPlaylist)
    if flagPlaylist == False:
        return {"resposta": "Não há playlist tocando"}

    global i

    if i == 0:
        return {"resposta": "Não há música para retroceder"}
    i -= 1

    musica = tocar_playlist()
    return {"resposta": "Música retrocedida", "audio": musica["audio"], "musica": musica["musica"]}

def avancar_musica():

    global flagPlaylist
    global i

    if flagPlaylist == False:
        return {"resposta": "Não há playlist tocando"}

    i += 1
    musica = tocar_playlist()
    return {"resposta": "Música avançada", "audio": musica["audio"], "musica": musica["musica"]}

def acorda_crianca():

    global flagPlaylist 
    global flagMusic 

    flagPlaylist = False
    flagMusic = True

    musica = tocar_musica('should i stay or should i go the clash')
    return {"resposta": "Bem vindo senhor", "audio": musica["audio"], "musica": musica["musica"]}
