import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import DOMpurify from 'dompurify'
import { showMusicToast } from "../toaster/Toaster";
import { error } from "three/src/utils.js";

const API_URL = import.meta.env.VITE_API_URL;

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
    export function submit(pergunta, setPergunta, modeloDeIA, player, chatRef, toastRef) {
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

        fetch(`${API_URL}/submit`, {
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

        if(data.precisaDeLocalizacao) {
            if(navigator.geolocation) {

                navigator.geolocation.getCurrentPosition((position) => {

                    let latitude = position.coords.latitude
                    let longitude = position.coords.longitude

                    fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=pt-BR`
                    )
                    .then(resp => resp.json())
                    .then(data => {

                    fetch(`${API_URL}/previsaoTempo`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            latitude: latitude,
                            longitude: longitude,
                            país: data.address.country,
                            local: data.address.city
                            })
                        })
                        .then(resp => resp.json())
                        .then(data => {
                            tratamentoDeResposta(pergunta, setPergunta, modeloDeIA, player, chatRef, toastRef, data)
                    })
                })
            },
        (error) => {
            console.log(error)
             tratamentoDeResposta(
                pergunta,
                setPergunta,
                modeloDeIA,
                player,
                chatRef,
                toastRef,
                {
                    resposta: "Não consegui obter sua localização. Informe a cidade para consultar a previsão do tempo."
                }
        )
        },
         {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 300000
        }
        )
        }

            return
        }

          tratamentoDeResposta(pergunta, setPergunta, modeloDeIA, player, chatRef, toastRef, data)

        })
    }
        else{
            alert('Espere a resposta ficar pronta para mandar outra mensagem')
        }
    }

    let youtubePlayer = null;
    let youtubePronto = null;

    function carregarYouTube() {
        if (youtubePronto) return youtubePronto;

        youtubePronto = new Promise((resolve) => {
            if (window.YT?.Player) {
                resolve(window.YT);
                return;
            }

            const callbackAnterior = window.onYouTubeIframeAPIReady;

            window.onYouTubeIframeAPIReady = () => {
                callbackAnterior?.();
                resolve(window.YT);
            };

            if (!document.querySelector(
                'script[src="https://www.youtube.com/iframe_api"]'
            )) {
                const script = document.createElement("script");
                script.src = "https://www.youtube.com/iframe_api";
                document.head.appendChild(script);
            }
        });

        return youtubePronto;
    }

    async function reproduzirYouTube(data) {
        if (!data.youtubeId) return;

        const YT = await carregarYouTube();

        if (!youtubePlayer) {
            const container = document.createElement("div");

            container.id = "jarvis-youtube-player";

            Object.assign(container.style, {
                position: "fixed",
                right: "20px",
                bottom: "20px",
                width: "390px",
                height: "220px",
                maxWidth: "calc(100vw - 40px)",
                zIndex: "9999",
                background: "#000"
            });

            const elemento = document.createElement("div");
            elemento.id = "youtube-iframe";

            container.appendChild(elemento);
            document.body.appendChild(container);

            youtubePlayer = new YT.Player("youtube-iframe", {
                width: "100%",
                height: "100%",
                videoId: data.youtubeId,
                playerVars: {
                    autoplay: 1,
                    controls: 1,
                    playsinline: 1
                },
                events: {
                    onReady: (evento) => {
                        evento.target.playVideo();
                    },
                    onStateChange: async (evento) => {
                        if (evento.data !== YT.PlayerState.ENDED) {
                            return;
                        }

                        try {
                            const resposta = await fetch(
                                `${API_URL}/nextMusic`,
                                { method: "POST" }
                            );

                            if (!resposta.ok) {
                                throw new Error("Erro ao avançar música");
                            }

                            const proxima = await resposta.json();

                            if (proxima.youtubeId) {
                                await reproduzirYouTube(proxima);
                            }
                        } catch (erro) {
                            console.error("Erro na playlist:", erro);
                        }
                    }
                }
            });

        } else {
            youtubePlayer.loadVideoById(data.youtubeId);
        }

        if (data.musica) {
            showMusicToast(
                data.musica[0],
                data.musica[2],
                data.musica[1],
                varToastRef
            );
        }
    }

    /*Essa função é responsável por passar a música quando uma música da playlist acaba*/
    function mediaPlayer(player) {
        player.current.onended = async function() {
            fetch(`${API_URL}/nextMusic`, {
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

function tratamentoDeResposta(pergunta, setPergunta, modeloDeIA, player, chatRef, toastRef, data) {

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

        let respostaFormatada = data.resposta
        .replace(/<a\b[^>]*>[\s\S]*?<\/a>/gi, '')
        .replace(/\*/g, '')
        .replace(/\//g, '')
        .replace(/```[\s\S]*?```/g, '')
        .trim();

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

        // Reprodução pelo YouTube
        if (data.youtubeId) {
            reproduzirYouTube(data).catch(console.error);
        }

        // Pausar música
        if (data.pause || data.acao === "pausar") {
            if (youtubePlayer) {
                youtubePlayer.pauseVideo();
            } else {
                player.current?.pause();
            }
        }

        // Continuar reprodução
        if (data.tocar || data.acao === "continuar") {
            if (youtubePlayer) {
                youtubePlayer.playVideo();
            } else {
                player.current?.play();
            }
        }

        // Compatibilidade com o player antigo
        if (data.audio && !data.youtubeId) {
            player.current.src = data.audio;
            player.current.load();
            player.current.play();

            if (data.musica) {
                showMusicToast(
                    data.musica[0],
                    data.musica[2],
                    data.musica[1],
                    varToastRef
                );
            }

            mediaPlayer(player);
        }

}
