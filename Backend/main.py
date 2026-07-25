from flask import Flask, request, render_template, jsonify
from brain import router, stt
from applications import music_player
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
        resposta = router.Router(pergunta, modelo, textHistory)
        #Interpreta como formatar a resposta recebida
        if 'http' in resposta[1][0][0:4]:
            return jsonify({'resposta': resposta[0], 'audio': resposta[1][0], 'flag': resposta[2], 'musica': resposta[1][1:3]})
        elif 'pause' in resposta[1][0:5]:
            return jsonify({'resposta': resposta[0], 'pause': resposta[1]})
        elif 'tocar' in resposta[1][0:5]:
            return jsonify({'resposta': resposta[0], 'tocar': resposta[1]})
        elif 'passar' in resposta[1][0:6]:
            return jsonify({'resposta': resposta[0], 'audio': resposta[2], 'passar': resposta[1]})
        elif 'retroceder' in resposta[1][0:10]:
            return jsonify({'resposta': resposta[0], 'audio': resposta[2], 'retroceder': resposta[1]})
        else:
            return jsonify({'resposta': resposta[0], 'apresentacao': resposta[2]})
    except Exception as e:
        print(e)
        return jsonify({'resposta': 'Ocorreu um erro durante o processamento da resposta. Peço desculpas pelo acontecido. Se possível contacte um dos meus desenvolvedores para que o erro seja resolvido.'})

#Rota que é chamada para passar a música de uma playlist
@app.route('/nextMusic', methods=['POST'])
def proxima():
    resposta = music_player.buscar_playlist()
    return jsonify({'audio': resposta[0], 'musica': resposta[1:3]})

if __name__ in '__main__':
    app.run(debug=True)
