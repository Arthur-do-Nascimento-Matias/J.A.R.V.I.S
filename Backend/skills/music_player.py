import os
import json
import random
from pathlib import Path

import requests
from dotenv import load_dotenv

load_dotenv()

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

PASTA_ATUAL = Path(__file__).resolve().parent
ARQUIVO_PLAYLIST = PASTA_ATUAL / "playlist" / "playlist.json"

# Estado do player
i = 0
paused = False
flagPlaylist = False
flagMusic = False
flagPausar = False
playlist = []
musica_atual = None


def pesquisar_youtube(nome):
    """Pesquisa uma música usando a API oficial do YouTube."""

    if not YOUTUBE_API_KEY:
        raise RuntimeError("YOUTUBE_API_KEY não configurada.")

    response = requests.get(
        "https://www.googleapis.com/youtube/v3/search",
        params={
            "part": "snippet",
            "q": nome,
            "type": "video",
            "videoEmbeddable": "true",
            "maxResults": 1,
            "key": YOUTUBE_API_KEY
        },
        timeout=15
    )

    response.raise_for_status()

    dados = response.json()
    resultados = dados.get("items", [])

    if not resultados:
        return None

    video = resultados[0]
    video_id = video["id"]["videoId"]
    titulo = video["snippet"]["title"]
    artista = video["snippet"]["channelTitle"]

    return {
        "youtubeId": video_id,
        "musica": [titulo, artista, None]
    }


def resposta_musica(musica, mensagem):
    """Cria a resposta esperada pelo frontend."""

    if not musica:
        return {
            "resposta": "Não encontrei essa música."
        }

    return {
        "resposta": mensagem,
        "youtubeId": musica["youtubeId"],
        "musica": musica["musica"],
        "acao": "reproduzir"
    }


def tocar_musica(nome):
    global flagPlaylist, flagMusic
    global flagPausar, musica_atual

    musica = pesquisar_youtube(nome)

    if not musica:
        return {"resposta": "Não encontrei essa música."}

    flagMusic = True
    flagPlaylist = False
    flagPausar = False
    musica_atual = musica

    return resposta_musica(musica, f"Tocando {nome}")


def buscar_playlist(nome=""):
    global i

    lista = nome if isinstance(nome, list) else playlist

    if not lista:
        return None

    i %= len(lista)

    return pesquisar_youtube(lista[i])


def tocar_playlist():
    global i, playlist
    global flagPlaylist, flagMusic, flagPausar
    global musica_atual

    with open(ARQUIVO_PLAYLIST, "r", encoding="utf8") as arquivo:
        dados = json.load(arquivo)

    playlist = list(dados.get("rock", []))

    if not playlist:
        return {"resposta": "A playlist está vazia."}

    random.shuffle(playlist)

    i = 0

    musica = buscar_playlist()

    if not musica:
        return {"resposta": "Não encontrei a música da playlist."}

    flagPlaylist = True
    flagMusic = False
    flagPausar = False
    musica_atual = musica

    return resposta_musica(musica, "Tocando playlist")


def parar_musica():
    global flagPausar, paused

    if not musica_atual:
        return {"resposta": "Não há música tocando."}

    flagPausar = True
    paused = True

    return {
        "resposta": "Música pausada",
        "pause": True,
        "acao": "pausar"
    }


def despausar_musica():
    global flagPausar, paused

    if not flagPausar:
        return {"resposta": "Não há música pausada."}

    flagPausar = False
    paused = False

    return {
        "resposta": "Música despausada",
        "tocar": True,
        "acao": "continuar"
    }


def retroceder_musica():
    global i, musica_atual, flagPausar

    if not flagPlaylist or not playlist:
        return {"resposta": "Não há playlist tocando."}

    i = (i - 1) % len(playlist)

    musica = buscar_playlist()

    if not musica:
        return {"resposta": "Não encontrei a música anterior."}

    musica_atual = musica
    flagPausar = False

    return resposta_musica(musica, "Música retrocedida")


def avancar_musica():
    global i, musica_atual, flagPausar

    if not flagPlaylist or not playlist:
        return {"resposta": "Não há playlist tocando."}

    i = (i + 1) % len(playlist)

    musica = buscar_playlist()

    if not musica:
        return {"resposta": "Não encontrei a próxima música."}

    musica_atual = musica
    flagPausar = False

    return resposta_musica(musica, "Música avançada")


def acorda_crianca():
    musica = tocar_musica(
        "Should I Stay or Should I Go The Clash"
    )

    if musica.get("youtubeId"):
        musica["resposta"] = "Bem-vindo, senhor."

    return musica
    