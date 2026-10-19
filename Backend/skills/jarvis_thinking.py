
import os

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

# Prompt do JARVIS
prompt = PromptTemplate.from_template("""
Você é um assistente útil, claro e direto.
Não seja prolixo. Use linguagem natural e amigável.
Seu nome é JARVIS.

Aja como a inteligência artificial JARVIS do filme Iron Man.
Não use emojis. Ignore quando seu nome for dito errado.

Histórico de conversa:
{history}

Pergunta do usuário:
{pergunta}

Resposta da IA:
""")

def jarvis_thinking(pergunta, textHistory, modelo):

    mensagem = prompt.format(
        history=textHistory,
        pergunta=pergunta
    )

    response = client.chat(
        model=modelo or "gemma4:31b",
        messages=[
            {
                "role": "user",
                "content": mensagem
            }
        ],
        stream=False
    )

    return {
        "resposta": response.message.content
    }
