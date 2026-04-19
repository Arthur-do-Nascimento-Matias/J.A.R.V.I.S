import yt_dlp
import vlc
import time

i = 0
paused = False
flagPassar = False

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
        global i
        numeroDaMusica = i
        while player.is_playing():
            time.sleep(2)
            if paused:
                while paused:
                    time.sleep(2)
        if numeroDaMusica == i:            
            global flagPassar
            flagPassar = True

def tocar_playlist(nome):
    while i < len(nome):
        url = buscar_playlist(nome[i])
        print('Contador: ', i)
        tocar_audio([url])
        global flagPassar
        if flagPassar:
            flagPassar = False
            passar_musica()

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
        print('Contador: ', i)
        return "Música retrocedida"
    else: 
        return "Erro"

def parar_musica(nome):
    global i
    i = len(nome) + 1
    player.stop()
    return "Música parada"
