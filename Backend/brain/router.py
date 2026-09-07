from skills.music_player import (
    tocar_playlist
)
from skills.qwen import (
    Qwen
)
from skills import minimax

class Router:

    def __init__(self):
        self.funcoes= {
                "tocar_musica": 'tocar_musica',
                "tocar_playlist": tocar_playlist,
                "parar_musica": 'parar_musica',
                "retroceder_musica": 'retroceder_musica',
                "avancar_musica": 'avancar_musica',
                "averiguar_resenha": 'averiguar_resenha',
                "acorda criança, o papai chegou": 'acorda_crianca',
                "perguntar_hora": 'perguntar_hora',
                "perguntar_data": 'perguntar_data',
                "conversa": 'qwen'
        }

    def executar(self, comando, pergunta, modelo, textHistory):

        print('inicio do executar')

        intent = comando["intent"]
        parameters = comando["parameters"]

        funcao = self.funcoes.get(intent)

        if not funcao:
            print(f"Intent desconhecida: {intent}")
            return

        print('antes da funcao')
        return(funcao(**parameters))
        print('depois da funcao')
         

router = Router()

