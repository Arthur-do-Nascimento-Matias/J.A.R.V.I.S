from ollama import chat
from langchain_core.prompts import PromptTemplate

prompt = PromptTemplate.from_template("""Você é um assistente útil, claro e direto.
Não seja prolixo. Use linguagem natural e amigável. Seu nome é JARVIS. 
Aja assim como a I.A "JARVIS" do filme "Iron Man". Trate o usuario como o homem de ferro, como um mestre.
                
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
