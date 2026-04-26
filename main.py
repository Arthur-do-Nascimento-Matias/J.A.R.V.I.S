from flask import Flask, request, render_template, jsonify
from brain import router
from memory import mem
from applications import music_player

app = Flask(__name__)
app.config['SECRET_KEY'] = 'jarvis'

@app.route('/')
def redirect():
    return render_template('index.html')

@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    pergunta = data['digitado']
    resposta = router.Router(pergunta)
    history = [{'role': 'user', 'content': pergunta}, {'role': 'assistant', 'content': resposta}]
    mem.memoria(history)
    if 'http' in resposta[1][0:4]:
        return jsonify({'resposta': resposta[0], 'audio': resposta[1], 'flag': resposta[2]})
    elif 'pause' in resposta[1][0:5]:
        return jsonify({'resposta': resposta[0], 'pause': resposta[1]})
    elif 'tocar' in resposta[1][0:5]:
        return jsonify({'resposta': resposta[0], 'tocar': resposta[1]})
    elif 'passar' in resposta[2][0:6]:
        return jsonify({'resposta': resposta[0], 'audio': resposta[1], 'passar': resposta[2]})
    elif 'retroceder' in resposta[2][0:10]:
        return jsonify({'resposta': resposta[0], 'audio': resposta[1], 'retroceder': resposta[2]})
    else:
        return jsonify({'resposta': resposta})

@app.route('/nextMusic', methods=['POST'])
def proxima():
    proximaMusica = music_player.buscar_playlist()
    return jsonify(proximaMusica)

if __name__ in '__main__':
    app.run(debug=True)
