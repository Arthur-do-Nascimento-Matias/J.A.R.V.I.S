from brain import qwenCoder
from brain import deepseek 
from brain import router
from memory import mem
import gradio as gr

def responder(mensagem, history):

    textHistory = mem.memoria(history)

    regente = router.Router(mensagem).strip().lower()
    if "code" in regente:
        resposta = qwenCoder.Qwen3(mensagem, textHistory)
        return resposta
    elif "none" in regente:
        resposta =  deepseek.DeepSeek(mensagem, textHistory)
        return resposta
    else:
        return regente.capitalize()

interface = gr.ChatInterface(responder, title="J.A.R.V.I.S")
interface.launch()
