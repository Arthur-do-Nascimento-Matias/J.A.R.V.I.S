from groq import Groq
import tempfile
import os
from dotenv import load_dotenv

load_dotenv()

#Usa a IA do Groq para interpretar o audio do microfone e transformar em texto
def speechToText(data):
    try:
        client = Groq(api_key=os.getenv('GROQ_API_KEY'))
        with tempfile.NamedTemporaryFile(suffix='.ogg', delete=False) as f:
            f.write(data)
            caminho = f.name

        with open(caminho, "rb") as file:
            transcription = client.audio.transcriptions.create(
                file=(caminho, file.read()),
                model='whisper-large-v3-turbo',
                temperature=0,
                response_format='verbose_json',
                language='pt'
            )
            return (transcription.text)
    except Exception as e:
        print(e)
        return ''