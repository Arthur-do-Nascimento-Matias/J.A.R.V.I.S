function submit() {

    let texto = document.getElementById('pergunta').value
    let player = document.getElementById('player')
    document.getElementById('pergunta').value = ''
    document.getElementById('resposta').innerHTML = '...'

    fetch('/submit', {
        method: ['POST'],
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            digitado: texto
        })
    }) 
    .then(response => response.json())
    .then(data => {
        document.getElementById('resposta').innerHTML = data.resposta
        if (data.audio) {
            player.src = data.audio
            player.play()
        }
    })
}
