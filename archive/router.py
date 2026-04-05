from ollama import chat

def Router(message):

    prompt = f"""Você é uma IA de router.

    Tudo que você deve responder é classificar se um a mensagem enviada pelo usuário envolve: 
    -programação;
    -desenvolvimento web;
    -bancos de dados;
    -modelos de inteligência artficial;
    -servidores.

    entrada do usuário:
    {message}

    Caso positivo para algum desses criterios você responderá com:
    code

    Caso contrario será:
    none

    Reponda somente com:
    CODE ou NONE

    """

    response = chat(
        model="smollm:135m",
        messages=[{"role": "user", "content": prompt}]
    )

    return response.message.content
