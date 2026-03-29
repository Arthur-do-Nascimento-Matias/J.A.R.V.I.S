from fastapi import FastAPI
from langchain_ollama import OllamaLLM
from langchain_core.prompts import PromptTemplate

app = FastAPI()

llm = OllamaLLM(model="llama3", temperature=0.3, num_predict=500)
prompt = PromptTemplate.from_template("""Você é um assistente útil, claro e direto, como o ChatGPT. Não seja prolixo. Use linguagem natural e amigável.\nUsuário: {pergunta}\nIA: """)

chain = prompt | llm

print('J.A.R.V.I.S')
print('\n')
print('Digite sair para encerrar')


print('\n')
    pergunta = input("Você: ")

    if pergunta.lower() in ['sair', 'exit', 'quit']:
        print('Até logo')
        break

    @app.get("/chat")
    def chat(pergunta: str):
        resposta = chain.stream({'pergunta': pergunta})

        for chunk in resposta:
            text = getattr(chunk, 'content', str(chunk))
            print(text, end='', flush=True)


        return {"resposta": "Você perguntou" + pergunta}
        