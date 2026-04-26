function submit() {

    let player = document.getElementById('player')
    let texto = document.getElementById('pergunta').value
    document.getElementById('pergunta').value = ''
    document.getElementById('resposta').innerHTML = '...'

    fetch('/submit', {
        method: 'POST',
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
        if (data.pause) {
            player.pause()
        }
        if (data.passar) {
            player.src = data.audio
            player.load()
            player.play()
        }
        if (data.retroceder) {
            player.src = data.audio
            player.load()
            player.play()
        }
        if (data.tocar) {
            player.play()
        }
        if (data.audio) {
            player.src = data.audio
            player.play()
            console.log(data.flag, typeof data.flag)
            if (data.flag == true) {
              mediaPlayer(player)
          }
        }
    })
}

function mediaPlayer(player) {
    player.onended = async function() {
        fetch('/nextMusic', {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            player.src = data
            player.load()
            player.play()
        })
    }
}
