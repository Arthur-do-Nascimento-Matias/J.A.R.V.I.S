from ollama import chat
from langchain_core.prompts import PromptTemplate

#Usa o modelo de IA da Qwen para responder perguntas em modo offline.
#Apenas é ativado quando a opção 'offline' está selecionada no frontend
prompt = PromptTemplate.from_template("""Você é um assistente útil, claro e direto.
Não seja prolixo. Use linguagem natural e amigável. Seu nome é JARVIS. 
Aja assim como a I.A "JARVIS" do filme "Iron Man". Não use emojis.
                
            Histórico de conversa:
            {history}
                                      
            Perguntas do usuario: 
            {pergunta}
            resposta da IA:""")

def jarvis_thinking(pergunta, textHistory, modelo): 

    mensagem = prompt.format(history=textHistory, pergunta=pergunta) 

    response = chat(
        model='gpt-oss:120b-cloud',
        messages=[{"role": "user", "content": mensagem}]
    )

    return {"resposta": response.message.content}
