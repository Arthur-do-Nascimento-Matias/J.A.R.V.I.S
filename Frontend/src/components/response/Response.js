import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import DOMpurify from 'dompurify'
import { showMusicToast } from "../toaster/Toaster";

    let vozes = []
    let flagGerarResposta = true
    let varToastRef
    let textHistory = []
    let memoriaTemporaria

    /*Seta eventos de clique para os botões de microfone e de enviar texto, respectivamente*/
    /*Seleciona vozes disponíveis*/
    speechSynthesis.onvoiceschanged = () => {
        vozes = speechSynthesis.getVoices();
    };

    function typeText(element, text, speed = 2, callback) {
        let i = 0;
        element.innerHTML = "";

        const cursor = document.createElement("span");
        cursor.classList.add("cursor");
        cursor.innerHTML = "|";

        element.appendChild(cursor);

        function typing() {
            i += 2;

            element.innerHTML = text.slice(0, i);
            element.appendChild(cursor);

            if (i < text.length) {
                setTimeout(typing, speed);
            } else {
                cursor.remove();
                if (callback) callback();
            }
        }

        typing();
    }

    /*Função responsável por fazer requisições ao backend e tratar a resposta*/
    export function submit(pergunta, setPergunta, setResposta, modeloDeIA, player, chatRef, toastRef) {
        if(pergunta.trim() == '') {
            alert('Campo de mensagem vazio')
            return
        }
        memoriaTemporaria = pergunta
        if(flagGerarResposta){
        flagGerarResposta = false
        speechSynthesis.cancel()
        setPergunta('')
        varToastRef = toastRef
    
        const msgUsuario = document.createElement('div')
        msgUsuario.className = 'mensagem usuario'
        msgUsuario.textContent = pergunta
        chatRef.current.appendChild(msgUsuario)

        const loading = document.createElement('div')
        loading.className = 'mensagem ia'
        loading.id = 'loading'
        loading.innerHTML = `
        digitando
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
        `
        chatRef.current.appendChild(loading)

        fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                modelo: modeloDeIA,
                digitado: pergunta,
                historico: textHistory.slice(-5)
            })
        })
        .then(response => response.json())
        .then(data => {

            textHistory.push({'usuario': memoriaTemporaria, 'ia': data.resposta})
            memoriaTemporaria = ''
            flagGerarResposta = true
            document.getElementById('loading')?.remove()

            const div = document.createElement("div");
            div.classList.add("mensagem", "ia");
            chatRef.current.appendChild(div);

            if(data.apresentacao){
                document.getElementById('root').style.opacity = 0
            }
            div.scrollIntoView({
                behavior: "smooth",
                block: "start"
            })
            let textoPlano = data.resposta;
            typeText(div, textoPlano, 5, () => {
                // depois que terminar de digitar → aplica markdown
                div.innerHTML = DOMpurify.sanitize(marked.parse(data.resposta));
            });
            /*Formata o texto e faz a converção para voz*/
            let respostaFormatada = data.resposta.replace(/\*/g, '').replace(/\//g, '').replace(/```[\s\S]*?```/g, '')
            let vozSaida = new SpeechSynthesisUtterance(respostaFormatada);
            vozSaida.lang = "pt-BR";
            vozSaida.voice = vozes.find(
                voz => voz.name.includes("Antonio")
            )
            speechSynthesis.speak(vozSaida);
            vozSaida.onend = () => {
                document.getElementById('root').style.opacity = 1
            }
            /*Verifica se a resposta da IA vem com alguma condição especial relacionada ao music player*/
            if (data.pause) {
                player.current.pause()
            }
            if (data.passar) {
                player.current.src = data.audio
                player.current.load()
                player.current.play()
            }
            if (data.retroceder) {
                player.current.src = data.audio
                player.current.load()
                player.current.play()
            }
            if (data.tocar) {
                player.current.play()
            }
            console.log(data.audio + 'oi')
            if (data.audio) {
                player.current.src = data.audio
                player.current.play()
                showMusicToast(
                    data.musica[0],
                    data.musica[2],
                    data.musica[1],
                    varToastRef
                )
                if (data.flag == true) {
                mediaPlayer(player)
            }
            }
        })
    }
        else{
            alert('Espere a resposta ficar pronta para mandar outra mensagem')
        }
    }

    /*Essa função é responsável por passar a música quando uma música da playlist acaba*/
    function mediaPlayer(player) {
        player.current.onended = async function() {
            fetch('/nextMusic', {
                method: 'POST'
            })
            .then(response => response.json())
            .then(data => {
                player.current.src = data.audio
                player.current.load()
                player.current.play()
                showMusicToast(
                    data.musica[0],
                    data.musica[2],
                    data.musica[1],
                    varToastRef
                )
            })
        }
    }
