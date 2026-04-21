import random, json, threading
from brain import deepseek
from brain import qwenCoder
from memory import mem
from applications import music_player

playlist = []
flagPlaylist = False
flagMusic = False

def Router(message):
    
    textHistory = mem.texthistory
    global flagPlaylist, flagMusic
    msg = message.lower()

    if ("tocar" in msg[0:5] or "toque" in msg[0:5]):
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
            flagMusic = True
            return f"Tocando {musica.title().replace("Tocar", "").replace("Toque", "").strip()}"
        
    elif ("passar" in msg[0:6] or "proximo" in msg[0:7] or "proxima" in msg[0:7]):
        if flagPlaylist:
            retorno = music_player.passar_musica()
            return retorno
        else: 
            return "Erro, nenhuma playlist está tocando"

    elif ("anterior" in msg[0:8]):
        if flagPlaylist:
            retorno = music_player.anterior_musica()   
            return retorno
        else:
            return "Erro, nenhuma playlist está tocando"

    elif ("pausar" in msg[0:6] or "pause" in msg[0:5] or 'depause' in msg[0:7] or 'despausar' in msg[0:8]):
        if flagPlaylist or flagMusic:

            if music_player.paused == True:
                music_player.paused = False
            else:
                music_player.paused = True
            music_player.player.pause()

            if message == "despause" or message == "despausar":
                return "Música despausada"
            else:
                return "Música pausada"
            
        else:
            return "Erro, nenhuma música está tocando"
    
    elif("parar" in msg[0:5] or "pare" in msg[0:4]):
        if flagPlaylist or flagMusic:
            if flagPlaylist:
                retorno = music_player.parar_musica(playlist["rock"])
                flagPlaylist = False
                return retorno
            else:
                music_player.player.stop()
                flagMusic = False
                return "Música parada"
        else:
            return "Erro, nenhuma música está tocando"
   
    elif "acorda criança, o papai chegou" in msg or "acorda criança o papai chegou" in msg or "acorda crianca o papai chegou" in msg or "acorda crianca, o papai chegou" in msg or "acorda criança papai chegou" in msg or "acorda criança papai chegou" in msg or "acorda crianca papai chegou" in msg or "acorda crianca, papai chegou" in msg:
        threading.Thread(
            target=music_player.tocar_musica,
            args=("should i stay or should i go the clash", )
            ).start()
        return "Bem vindo, senhor!"

    elif "averiguar resenha" in msg:
        return "Bem vindo, senhor!"

    else:
        with open("brain/keyWords.json", "r", encoding="utf8") as words:
            keyWords = json.load(words)
            for k in keyWords["keyWords"]:
                if k in msg:
                    resposta = qwenCoder.Qwen3(msg, textHistory)
                    return resposta
                
        resposta = deepseek.DeepSeek(msg, textHistory)
        return resposta
