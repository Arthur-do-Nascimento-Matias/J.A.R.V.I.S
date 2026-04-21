from flask import Flask, request, render_template, jsonify
from brain import router
from memory import mem

app = Flask(__name__)
app.config['SECRET_KEY'] = 'jarvis'

@app.route('/')
def redirect():
    return render_template('index.html')

@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    pergunta = data['digitado']
    print(pergunta)
    resposta = router.Router(pergunta)
    print(resposta)
    history = [{'role': 'user', 'content': pergunta}, {'role': 'assistant', 'content': resposta}]
    mem.memoria(history)
    return jsonify({'resposta': resposta})

if __name__ in '__main__':
    app.run(debug=True)
