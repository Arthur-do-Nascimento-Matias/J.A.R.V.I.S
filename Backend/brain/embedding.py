import ollama

#Resposável por gerar um vetor necessário para calcular a similariedade entre diferentes possibilidades de respostas
def embeddings(msg):
    response = ollama.embed(
        model='granite-embedding',
        input=msg,
    )
    return(response.embeddings)
