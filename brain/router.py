import random, json
from brain import deepseek
from brain import qwenCoder
from memory import mem
from applications import music_player

playlist = []
flagPlaylist = False
flagMusic = False
flagPause = False

def Router(message):
    
    textHistory = mem.texthistory
    global flagPlaylist, flagMusic, flagPause
    msg = message.lower()

    if ("tocar" in msg[0:5] or "toque" in msg[0:5]):
        if "playlist" in message.lower():
            with open("applications/playlist/playlist.json", "r", encoding="utf8") as arquivo:
                global playlist
                playlist = json.load(arquivo)
                random.shuffle(playlist["rock"])
                musica = music_player.buscar_playlist(playlist["rock"])
                flagPlaylist = True
                flagMusic = False
                return ["Tocando playlist", musica, True]
        
        else:
            nomeMusica = message.replace("tocar", "").replace("toque", "").strip()
            musica = music_player.buscar_musica(nomeMusica)
            flagMusic = True
            flagPlaylist = False
            return [f"Tocando {nomeMusica.title()}", musica, False]
        
    elif ("passar" in msg[0:6] or "proximo" in msg[0:7] or "proxima" in msg[0:7]):
        if flagPlaylist:
            musica = music_player.buscar_playlist()
            return ["Música passada", musica, "passar"]
        else: 
            return "Erro, nenhuma playlist está tocando"

    elif ("anterior" in msg[0:8] or "retroceder" in msg[0:10]):
        if flagPlaylist:
            if music_player.i >= 2:
                music_player.i -= 2
                musica = music_player.buscar_playlist()
                return ["Música retrocedida", musica, "retroceder"]
            else:
                return "Erro, não existe música anterior"
        else:
            return "Erro, nenhuma playlist está tocando"

    elif('depause' in msg[0:7] or 'despausar' in msg[0:9]):
        if flagPause:
           flagMusic = True
           flagPlaylist = True
           flagPause= False
           return ["Música despausada", "tocar"]
    
    elif("parar" in msg[0:5] or "pare" in msg[0:4] or "pausar" in msg[0:6] or "pause" in msg[0:5]):
        if flagPlaylist or flagMusic:
            flagMusic = False
            flagPlaylist = False
            flagPause = True
            return ["Música pausada", "pause"]
        else:
            return "Erro, nenhuma música está tocando"
   
    elif "acorda criança, o papai chegou" in msg or "acorda criança o papai chegou" in msg or "acorda crianca o papai chegou" in msg or "acorda crianca, o papai chegou" in msg or "acorda criança papai chegou" in msg or "acorda criança papai chegou" in msg or "acorda crianca papai chegou" in msg or "acorda crianca, papai chegou" in msg:
        musica = music_player.buscar_musica('should i stay or should i go the clash')
        flagMusic = True
        return ["Bem vindo, senhor!", musica, False]

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
