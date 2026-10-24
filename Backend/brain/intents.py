
import os
import json

from ollama import Client
from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate

load_dotenv()

# Configuração do Ollama Cloud
api_key = os.getenv("OLLAMA_API_KEY")

if not api_key:
    raise RuntimeError("OLLAMA_API_KEY não configurada no .env")

client = Client(
    host="https://ollama.com",
    headers={
        "Authorization": f"Bearer {api_key}"
    }
)

INTENTS = [
    "tocar_musica",
    "tocar_playlist",
    "parar_musica",
    "despausar_musica",
    "retroceder_musica",
    "avancar_musica",
    "acorda_crianca",
    "perguntar_hora",
    "perguntar_data",
    "buscar_previsao_tempo",
    "pesquisar_noticias",
    "apresentar-se"
]

# Identifica a intenção do usuário e seus parâmetros
prompt = PromptTemplate.from_template("""
Identifique a intenção do que o usuário digita
e os respectivos parâmetros.

Não utilize caracteres especiais fora do JSON.

Intenções permitidas:
{intents}

Caso a entrada do usuário não corresponda
a nenhuma intenção, utilize "conversa".

Intenção padrão: conversa

Regras:
1. O campo "intent" deve conter somente uma
   das intenções permitidas ou "conversa".
2. Nunca invente uma nova intenção.
3. Sempre retorne JSON válido.
4. "parameters" deve ser sempre um objeto JSON.
5. Se não houver parâmetros, utilize {{}}.
6. Não escreva explicações.
7. Não utilize Markdown.
8. Não coloque o JSON dentro de blocos de código.
9. Inclua os parâmetros necessários, como
   nome da música, localização, entre outros.
10. Priorize a conversa. Não utilize funções
    adicionais sem uma solicitação explícita.
11. Caso o pedido para previsão do tempo não inclua o nome de um lugar retorne o nome vazio

Pergunta do usuário:
{pergunta}

Retorne somente este formato JSON:

{{
    "intent": "conversa",
    "parameters": {{}}
}}
""")

def Minimax(entrada):

    mensagem = prompt.format(
        pergunta=entrada,
        intents=", ".join(INTENTS)
    )

    response = client.chat(
        model="gemma4:31b",
        messages=[
            {
                "role": "user",
                "content": mensagem
            }
        ],
        format="json",
        stream=False
    )

    resultado = json.loads(response.message.content)

    # Valida a intenção
    if resultado.get("intent") not in INTENTS:
        resultado["intent"] = "conversa"

    # Garante que os parâmetros sejam um dicionário
    if not isinstance(resultado.get("parameters"), dict):
        resultado["parameters"] = {}

    print(resultado)

    return resultado
