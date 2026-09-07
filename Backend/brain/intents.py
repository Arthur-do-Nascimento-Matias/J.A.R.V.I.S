from ollama import chat
from langchain_core.prompts import PromptTemplate
import json

INTENTS = [
    "tocar_musica",
    "tocar_playlist",
    "parar_musica",
    "perguntar_hora",
    "perguntar_data",
    "abrir_aplicativo",
    "pesquisar",
    "conversa"
]

#Usa o modelo de IA da Minimax para responder perguntas relacionadas a programação e desenvolvimento.
#Apenas é ativado quando a opção 'programação' está selecionada no frontend
prompt = PromptTemplate.from_template("""Indetifique a intenção do que o usuário digita e os respectivos parametros
Não use caracteres especias

Intenções permitidas: INTENTS = [
    "tocar_musica",
    "tocar_playlist",
    "parar_musica",
    "retroceder_musica",
    "avancar_musica",
    "averiguar_resenha",
    "acorda criança, o papai chegou",
    "perguntar_hora",
    "perguntar_data",
    "conversa"
]

1. O campo "intent" deve conter SOMENTE uma das intents permitidas.
2. Nunca invente uma nova intent.
3. Sempre retorne JSON válido.
4. "parameters" deve ser sempre um objeto JSON.
5. Se não houver parâmetros, use {{}}.
6. Não escreva explicações.
7. Não use markdown.
8. Não coloque o JSON dentro de ```.

            Perguntas do usuario: 
            {pergunta}

            Devolva a resposta nesse formato JSON: 

        {{
            "intent": "",
            "parameters": {{}}
        }}

            """)

def Minimax(entrada): 

    mensagem = prompt.format(pergunta=entrada) 

    response = chat(
        model='gpt-oss:120b-cloud',
        messages=[{"role": "user", "content": mensagem}]
    )

    resultado = json.loads(response.message.content)

    if resultado["intent"] not in INTENTS:
        resultado["intent"] = "conversa"

    if not isinstance(resultado["parameters"], dict):
        resultado["parameters"] = {}    

    print(resultado)
    return resultado
    
