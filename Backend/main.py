from flask import Flask, request, render_template, jsonify
from brain import stt, intents
from brain.router import router
from skills import music_player
from skills import weather
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

#Rota onde é enviada a entrada do microfone para ser transformada em texto
@app.route('/transcription', methods=['POST'])
def mic():
    data = request.data
    texto = stt.speechToText(data)
    return texto

#Rota onde ocorre o processamento do backend
@app.route('/submit', methods=['POST'])
def submit():
    try:
        data = request.get_json()
        pergunta = data.get("digitado", "") + data.get("audio", "")
        modelo = data.get('modelo')
        textHistory = data.get('historico', [])

        comando = intents.Minimax(pergunta)

        resposta = router.executar(comando, pergunta, modelo, textHistory)
        #Interpreta como formatar a resposta recebida
        return jsonify(resposta)

    except Exception as e:
        print(e)
        return jsonify({'resposta': 'Ocorreu um erro durante o processamento da resposta. Peço desculpas pelo acontecido. Se possível contacte um dos meus desenvolvedores para que o erro seja resolvido.'})

#Rota que é chamada para passar a música de uma playlist
@app.route('/nextMusic', methods=['POST'])
def proxima():
    resposta = music_player.avancar_musica()
    return jsonify(resposta)

@app.route('/previsaoTempo', methods=['POST'])
def previsaoTempo():
    data = request.get_json()
    latitude = data.get("latitude")
    longitude = data.get("longitude")
    local = data.get("local")
    país = data.get("país")
    resposta = weather.previsao_tempo({"latitude": latitude, "longitude": longitude, "local": local, "país": país})
    return {resposta}

if __name__ in '__main__':
    app.run(debug=True)
