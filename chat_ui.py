import gradio as gr
from langchain_ollama import OllamaLLM
from langchain_core.prompts import PromptTemplate

llm = OllamaLLM(model="llama3", temperature=0.3, num_predict=500)

prompt = PromptTemplate.from_template("""Você é um assistente útil, claro e direto, como o ChatGPT.
Não seja prolixo. Use linguagem natural e amigável.

Histórico de conversa {history}

Usuário: {pergunta}
IA:""")

chain = prompt | llm

def responder(mensagem, history):

    textHistory = " "
    for item in history:
        if item["role"] == "user":
            textHistory += f"Usuario: {item['content']}\n"
        elif item["role"] == "assistant":
            textHistory += f"IA: {item['content']}\n"

    resposta = chain.invoke({"pergunta": mensagem, "history": textHistory}) 
    return resposta

interface = gr.ChatInterface(responder, title="J.A.R.V.I.S")
interface.launch()
