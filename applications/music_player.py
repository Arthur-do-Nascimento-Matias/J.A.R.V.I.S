import yt_dlp
import vlc
import time

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
        return

def tocar_musica(nome):
    url = buscar_playlist(nome)
    tocar_audio([url])

def pausar():
    player.pause()
