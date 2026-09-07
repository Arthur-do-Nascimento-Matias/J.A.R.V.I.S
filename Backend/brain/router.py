from skills.music_player import (
    tocar_playlist,
    tocar_musica,
    parar_musica,
    despausar_musica,
    retroceder_musica,
    avancar_musica,
    acorda_crianca
)
from skills.averiguar_resenha import (
    averiguar_resenha
)
from skills.jarvis_thinking import (
    jarvis_thinking
)

class Router:

    def __init__(self):
        self.funcoes= {
                "tocar_musica": tocar_musica,
                "tocar_playlist": tocar_playlist,
                "parar_musica": parar_musica,
                "despausar_musica": despausar_musica,
                "retroceder_musica": retroceder_musica,
                "avancar_musica": avancar_musica,
                "averiguar_resenha": averiguar_resenha,
                "acorda_crianca": acorda_crianca,
                "perguntar_hora": 'perguntar_hora',
                "perguntar_data": 'perguntar_data',
        }

    def executar(self, comando, pergunta, modelo, textHistory):


        intent = comando["intent"]
        parameters = comando["parameters"]

        funcao = self.funcoes.get(intent)

        if not funcao:
            return jarvis_thinking(pergunta, textHistory, modelo)

        return(funcao(*parameters.values()))
         
router = Router()
