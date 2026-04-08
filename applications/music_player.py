import yt_dlp
import vlc
import time

i = 0

player = vlc.MediaPlayer()

def buscar_playlist(nome):
    ydl_opts = {
    "format": "bestaudio/best",
    "noplaylist": True
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(f"ytsearch:{nome}", download=False)
        url = info["entries"][0]["url"]
    return url

def tocar_audio(urls):
    musica = urls
    for url in musica:
        media = vlc.Media(url)
        player.set_media(media)
        player.play()
        time.sleep(2)
        while player.is_playing():
            time.sleep(2)

def tocar_playlist(nome):
    while i < len(nome):
        url = buscar_playlist(nome[i])
        tocar_audio([url])

def tocar_musica(nome):
    url = buscar_playlist(nome)
    tocar_audio([url])

def passar_musica():
    player.stop()
    global i
    i += 1
    return "Música passada"

def anterior_musica():
    global i
    if i > 0:
        player.stop()
        i -= 1
        return "Música retrocedida"
    else: 
        return "Erro"

def parar_musica(nome):
    global i
    i = len(nome) + 1
    player.stop()
    return "Música parada"
