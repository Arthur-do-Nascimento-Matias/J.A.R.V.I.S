import ollama

def embeddings(msg):
    response = ollama.embed(
        model='granite-embedding',
        input=msg,
    )
    return(response.embeddings)
