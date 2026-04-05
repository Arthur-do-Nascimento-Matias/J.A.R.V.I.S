from langchain_ollama import OllamaLLM
from langchain_core.prompts import PromptTemplate

llm = OllamaLLM(model="llama3", temperature=0.1, num_predict=500)

prompt = PromptTemplate.from_template("""Você é um assistente útil, claro e direto, como o ChatGPT.
Não seja prolixo. Use linguagem natural e amigável. Seu nome é JARVIS. Não se apresente ao não ser que seja pedido.
                
            Histórico de conversa:
            {history}
                                      
            Perguntas do usuario: 
            {pergunta}
            resposta da IA:""")

def llm3(mensagem, textHistory):
    
    chainLLM = prompt | llm

    return chainLLM.invoke({"pergunta": mensagem, "history": textHistory})
