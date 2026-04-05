from brain import qwenCoder
from brain import deepseek 
from brain import router
from applications import music_player
import threading
import gradio as gr

def responder(mensagem, history):

    textHistory = " "
    for item in history:
        if item["role"] == "user":
            textHistory += f"Usuario: {item['content']}\n"
        elif item["role"] == "assistant":
            textHistory += f"IA: {item['content']}\n"

    if "tocar" in mensagem.lower() or "toque" in mensagem.lower() and len(mensagem) < 20:
        musica = mensagem.replace("tocar", "").replace("toque", "").strip()
        threading.Thread(
        target=music_player.tocar_musica,
        args=(musica,)
).start()
        
        return f"Tocando {musica.title().replace("Tocar", "").replace("Toque", "").strip()}"
    
    elif "pausar" in mensagem.lower() or "pause" in mensagem.lower() and len(mensagem) < 10:
        music_player.pausar()
        if mensagem == "despause" or mensagem == "despausar":
            return "Música despausada"
        else:
            return "Música pausada"

    else:
        regente = router.Router(mensagem).strip().lower()
        if "code" in regente:
            resposta = qwenCoder.Qwen3(mensagem, textHistory)
        else:
            resposta =  deepseek.DeepSeek(mensagem, textHistory)
        return resposta

interface = gr.ChatInterface(responder, title="J.A.R.V.I.S")
interface.launch()
