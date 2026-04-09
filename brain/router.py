import threading
import json
import random
from applications import music_player

playlist = []
flagPlaylist = False

def Router(message):

    global flagPlaylist
    msg = message.lower()

    keyWords = ["python", "css", "html", "javascript", "js", "java", "servidor", "servidores",
                "banco de dados", "xaamp", "sql", "mariadb", "mombodb", "postgree", "postgre",
                "postgresqul", "c#", "c++", "robotica", "robótica", "modelos de ia",
                "modelos de inteligencia artificial", "modelo de inteligencia artificial",
                "modelo de inteligência artificial", "modelos de inteligência artificial",
                "ollama", "llm", "codigo", "codigos", "código", "códigos", "erro", "bug",
                "api", "programacao", "programação", "programaçao", "programacão", "funciona?"
                "funciona", "funciona:"]
    
    if ("tocar" in msg or "toque" in msg) and len(message) < 30:
        if "playlist" in message.lower():
            with open("applications/playlist/playlist.json", "r", encoding="utf8") as arquivo:
                global playlist
                playlist = json.load(arquivo)
                random.shuffle(playlist["rock"])
                threading.Thread(
                    target=music_player.tocar_playlist,
                    args=(playlist["rock"],)).start()
                flagPlaylist = True
                return "Tocando playlist"
        
        else:
            musica = message.replace("tocar", "").replace("toque", "").strip()
            threading.Thread(
            target=music_player.tocar_musica,
            args=(musica,)).start()
            
            return f"Tocando {musica.title().replace("Tocar", "").replace("Toque", "").strip()}"
        
    elif ("passar" in msg or "proximo" in msg or "proxima" in msg) and len(message) < 20:
        if flagPlaylist:
            retorno = music_player.passar_musica(playlist["rock"])
            return retorno
        else: 
            return "erro"

    elif ("anterior" in msg) and len(message) < 20:
        if flagPlaylist:
            retorno = music_player.anterior_musica()   
            return retorno
        else:
            return "erro"

    elif ("pausar" in msg or "pause" in msg) and len(message) < 20:
        music_player.player.pause()
        if message == "despause" or message == "despausar":
            return "Música despausada"
        else:
            return "Música pausada"
    
    elif("parar" in msg or "pare" in msg) and len(message) < 20:
        if flagPlaylist:
            retorno = music_player.parar_musica(playlist["rock"])
            flagPlaylist = False
            return retorno
        else:
            music_player.player.stop()
            return "Música parada"

    else:
        for k in keyWords:
            if k in message.lower():
                return "code"
            
        return "none"
