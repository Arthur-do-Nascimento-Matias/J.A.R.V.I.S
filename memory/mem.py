texthistory = " "

def memoria(history):
    
    global texthistory
    for item in history:
        if item["role"] == "user":
            texthistory += f"Usuario: {item['content']}\n"
        elif item["role"] == "assistant":
            texthistory += f"IA: {item['content']}\n"

    return texthistory
