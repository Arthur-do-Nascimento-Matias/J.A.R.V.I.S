import random, json
import unidecode
from brain import cosineSimilarity
from brain import embedding 
from brain import gemma
from brain import minimax
from applications import music_player

playlist = []
flagPlaylist = False
flagMusic = False
flagPause = False
embToqueMusica = embedding.embeddings('tocar')
embPassarMusica = embedding.embeddings('passar / proxima')
embAnteriorMusica = embedding.embeddings('anterior / retroceder')
embPararMusica = embedding.embeddings('parar musica')
embDespausarMusica = embedding.embeddings('despausar / despause')
embAcordaCrianca = embedding.embeddings('acorda criança, o papai chegou')
embResenha = embedding.embeddings('averiguar resenha')
embPlaylist = embedding.embeddings('playlist')
embApresentacao = embedding.embeddings('apresente-se')

#Maior função do projeto. 
#Interpreta a mensagem e a leva para o devido arquivo para ser executada
def Router(message, model, textHistory):

    global flagPlaylist, flagMusic, flagPause

    embMsg = embedding.embeddings(message)

    similariedadeMusica = cosineSimilarity.similariedadeCosseno(embMsg, embToqueMusica)
    similariedadeParar = cosineSimilarity.similariedadeCosseno(embMsg, embPararMusica)
    similariedadeProximo = cosineSimilarity.similariedadeCosseno(embMsg, embPassarMusica)
    similariedadeAnterior = cosineSimilarity.similariedadeCosseno(embMsg, embAnteriorMusica)
    similariedadeDespausar = cosineSimilarity.similariedadeCosseno(embMsg, embDespausarMusica)
    similariedadeAcordaCrianca = cosineSimilarity.similariedadeCosseno(embMsg, embAcordaCrianca)
    similariedadeResenha = cosineSimilarity.similariedadeCosseno(embMsg, embResenha)
    similariedadePlaylist = cosineSimilarity.similariedadeCosseno(embMsg, embPlaylist)
    similariedadeApresentacao = cosineSimilarity.similariedadeCosseno(embMsg, embApresentacao)

    msg = message.lower().lstrip()
    
    print(similariedadeParar)
    #Condicionais referentes a outras coisas além de responder perguntas
    if(similariedadeApresentacao > 0.8):
        return ['Olá! Meu nome é Jarvis, seu assistente pessoal. Estou aqui para responder perguntas e o auxiliar em tarefas através de meu imenso conhecimento. Diferente de outras ferramentas de inteligência artificial, também possuo a capacidade de reproduzir músicas. Fui criado por Arthur Matias, estudante do Senac Criciúma, usando de ferramentas de desenvolvimento web como React e Css, além de linguagens de programação como Python e Javascript.', 'apresentacao', True]

    if (similariedadeAcordaCrianca > 0.8):
        musica = music_player.buscar_musica('should i stay or should i go the clash')
        flagMusic = True
        return ["Bem vindo, senhor!", musica, False]

    elif (similariedadeResenha > 0.8):
        return ["Qual resenha devo averiguar, senhor?", 'resenha', False]
    
    elif (similariedadeProximo > 0.8):
       if flagPlaylist:
           musica = music_player.buscar_playlist()
           return ["Música passada", "passar", musica]
       else: 
         return ["Erro, nenhuma playlist está tocando", 'erro', False]

    elif (similariedadeAnterior > 0.8):
        if flagPlaylist:
            if music_player.i >= 2:
                music_player.i -= 2
                musica = music_player.buscar_playlist()
                return ["Música retrocedida", "retroceder", musica]
            else:
                return ["Erro, não existe música anterior", 'erro', False]
        else:
            return ["Erro, nenhuma playlist está tocando", 'erro', False]

    elif(similariedadeDespausar > 0.7):
        if flagPause:
           flagMusic = True
           flagPlaylist = True
           flagPause= False
           return ["Música despausada", "tocar", False]
        return ["Não há música para ser despausada", 'erro', False]

    elif(similariedadeParar > 0.73):
        if flagPlaylist or flagMusic:
            flagMusic = False
            flagPlaylist = False
            flagPause = True
            return ["Música pausada", "pause", False]
        else:
            return ["Erro, nenhuma música está tocando", 'erro', False]

    elif (similariedadeMusica > 0.72):
        if (similariedadePlaylist > 0.65):
            with open("applications/playlist/playlist.json", "r", encoding="utf8") as arquivo:
                global playlist
                playlist = json.load(arquivo)
                random.shuffle(playlist["rock"])
                musica = music_player.buscar_playlist(playlist["rock"])
                flagPlaylist = True
                flagMusic = False
                return ["Tocando playlist", musica, True]
        
        else:
            nomeMusica = msg.title().split(' ', 1)[1]
            musica = music_player.buscar_musica(nomeMusica)
            flagMusic = True
            flagPlaylist = False
            return [f"Tocando {musica[1]}", musica, False]
        
    #Chama os modelos de IA
    else:
        if model == 'programacao':
            resposta = minimax.Minimax(message, textHistory)
            return resposta
                
        resposta = gemma.Gemma(message, textHistory)
        return [resposta, 'resposta', False]
 