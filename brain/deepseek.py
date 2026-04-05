from ollama import chat
from langchain_core.prompts import PromptTemplate

prompt = PromptTemplate.from_template("""Você é um assistente útil, claro e direto, como o ChatGPT.
Não seja prolixo. Use linguagem natural e amigável. Seu nome é JARVIS. Não se apresente ao não ser que seja pedido.
                
            Histórico de conversa:
            {history}
                                      
            Perguntas do usuario: 
            {pergunta}
            resposta da IA:""")

def DeepSeek(entrada, textHistory):

    mensagem = prompt.format(history=textHistory, pergunta=entrada)

    response = chat(
        model="deepseek-v3.1:671b-cloud",
        messages=[{"role": "user", "content": mensagem}]
    )

    return response.message.content
