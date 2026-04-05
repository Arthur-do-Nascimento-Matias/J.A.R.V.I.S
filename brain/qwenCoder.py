from ollama import chat
from langchain_core.prompts import PromptTemplate

prompt = PromptTemplate.from_template("""Você é um assistente útil, claro e direto.
Não seja prolixo. Use linguagem natural e amigável. 
                
            Histórico de conversa:
            {history}
                                      
            Perguntas do usuario: 
            {pergunta}
            resposta da IA:""")

def Qwen3(entrada, textHistory): 

    mensagem = prompt.format(history=textHistory, pergunta=entrada) 

    response = chat(
        model="qwen3-coder:480b-cloud",
        messages=[{"role": "user", "content": mensagem}]
    )

    return response.message.content
    