from ollama import chat
from langchain_core.prompts import PromptTemplate

#Usa o modelo de IA da Minimax para responder perguntas relacionadas a programação e desenvolvimento.
#Apenas é ativado quando a opção 'programação' está selecionada no frontend
prompt = PromptTemplate.from_template("""Você é um assistente útil, claro e direto.
Não seja prolixo. Use linguagem natural e amigável. Seu nome é JARVIS. 
Aja assim como a I.A "JARVIS" do filme "Iron Man". Não use emojis.
                
            Histórico de conversa:
            {history}
                                      
            Perguntas do usuario: 
            {pergunta}
            resposta da IA:""")

def Minimax(entrada, textHistory): 

    mensagem = prompt.format(history=textHistory, pergunta=entrada) 

    response = chat(
        model='minimax-m3:cloud',
        messages=[{"role": "user", "content": mensagem}]
    )

    return response.message.content
    