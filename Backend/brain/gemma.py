from ollama import chat
from langchain_core.prompts import PromptTemplate

#Usa o modelo de IA do GPT para responder perguntas.
#É ativado quando a opção 'conversação' está selecionada no frontend
prompt = PromptTemplate.from_template("""Você é um assistente útil, claro e direto.
Não seja prolixo. Use linguagem natural e amigável. Seu nome é JARVIS. 
Aja assim como a I.A "JARVIS" do filme "Iron Man". Não use emojis.
                
            Histórico de conversa:
            {history}
                                      
            Perguntas do usuario: 
            {pergunta}
            resposta da IA:""")

def Gemma(entrada, textHistory):

    mensagem = prompt.format(history=textHistory, pergunta=entrada)

    response = chat(
        model="gemma4:31b-cloud",
        messages=[{"role": "user", "content": mensagem}]
    )

    return response.message.content
