import yt_dlp

i = 0
paused = False
flagPassar = False
playlist = ''

def buscar_musica(nome):
    ydl_opts = {
    "format": "bestaudio/best",
    "noplaylist": True
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(f"ytsearch:{nome}", download=False)
        url = info["entries"][0]["url"]
    return url

def buscar_playlist(nome=''):
    global i
    global playlist
    if playlist == '':
        playlist = nome
    if i > len(playlist):
        i = 0
    print('contadorAntes:', i)
    ydl_opt = {
        "format": "bestaudio/best",
        "noplaylist": True
    }
    with yt_dlp.YoutubeDL(ydl_opt) as ydl:
        info = ydl.extract_info(f"ytsearch:{playlist[i]}", download=False)
        url = info["entries"][0]["url"]
    i += 1
    return url
