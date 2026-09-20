import requests
import feedparser
from urllib.parse import quote

def pesquisar_noticias(pesquisa):

    news = []

    url = (
        "https://news.google.com/rss/search?"
        f"q={quote(pesquisa)}"
        "&hl=pt-BR"
        "&gl=BR"
        "&ceid=BR:pt-419"
    )

    resposta = requests.get(url)

    feed = feedparser.parse(
        resposta.content
    )

    for i, noticia in enumerate(
            feed.entries[:5],
            start=1):

            titulo = noticia.get(
                "title",
                ""
            )

            data = noticia.get(
                "published",
                ""
            )

            news.append(
                f"{i}. {titulo}\n"
                f". Data: {data}\n"
            )

    return {
        "resposta": "\n\n".join(news)
    }