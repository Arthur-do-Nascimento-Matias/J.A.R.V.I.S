from fastapi import FastAPI
from langchain_ollama import OllamaLLM
from langchain_core.prompts import PromptTemplate

app = FastAPI()

llm = OllamaLLM(model="llama3", temperature=0.3, num_predict=500)
prompt = PromptTemplate.from_template("""Você é um assistente útil, claro e direto, como o ChatGPT. Não seja prolixo. Use linguagem natural e amigável.\nUsuário: {pergunta}\nIA: """)

chain = prompt | llm

@app.get("/chat")
def chat(pergunta: str):
    resposta = chain.invoke({'pergunta': pergunta})
    return {"resposta": resposta}
