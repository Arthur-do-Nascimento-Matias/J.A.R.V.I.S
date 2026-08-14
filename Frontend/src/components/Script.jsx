import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import DOMpurify from 'dompurify'
import * as THREE from 'three'

let frameId
let vozes = []
let flagGerarResposta = true
let varToastRef
let textHistory = []
let memoriaTemporaria

// ======================
// CAMERA
export function iniciarThree() {
const cena = new THREE.Scene();
// ======================
// CAMERA
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
);
camera.position.z = 5;
camera.position.x = 0;
camera.position.y = -1.1;
// ======================
// RENDERER
const gerador = new THREE.WebGLRenderer({
    alpha: true
});
gerador.setSize(
    window.innerWidth,
    window.innerHeight
);
gerador.setPixelRatio(
    window.devicePixelRatio
);
document.body.appendChild(
    gerador.domElement
);
gerador.domElement.style.position = "fixed";
gerador.domElement.style.top = "0";
gerador.domElement.style.left = "0";
gerador.domElement.style.zIndex = "0";
gerador.domElement.style.pointerEvents = "none";
// ======================
// ESFERA
const geometria = new THREE.SphereGeometry(
    2,
    64,
    64
);
const material = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    wireframe: true,
});
const esfera = new THREE.Mesh(
    geometria,
    material
);
cena.add(esfera);
// ======================
// ALVOS
let alvoX = 0;
let alvoY = 0;
let alvoScale = 1;
let velocidadeRotacao = 0.005;
// ======================
// PARTICULAS
const particulasGeometria =
new THREE.BufferGeometry();
const quantidade = 400;
const posicoes = [];
for(let i = 0; i < quantidade; i++){
    posicoes.push(
        (Math.random() - 0.5) * 20
    );
    posicoes.push(
        (Math.random() - 0.5) * 20
    );
    posicoes.push(
        (Math.random() - 0.5) * 20
    );
}
particulasGeometria.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(
        posicoes,
        3
    )
);
const particulasMaterial =
new THREE.PointsMaterial({
    color: 0x00ffff,
    size: 0.02
});
const particulas =
new THREE.Points(
    particulasGeometria,
    particulasMaterial
);
cena.add(particulas);
// ======================
// ANIMAÇÃO
function animar(){
    frameId = requestAnimationFrame(animar);
    // MOVIMENTO SUAVE DA ESFERA
    esfera.position.x +=
    (alvoX - esfera.position.x) * 0.05;
    esfera.position.y +=
    (alvoY - esfera.position.y) * 0.05;
    // SCALE SUAVE
    esfera.scale.x +=
    (alvoScale - esfera.scale.x) * 0.05;
    esfera.scale.y +=
    (alvoScale - esfera.scale.y) * 0.05;
    esfera.scale.z +=
    (alvoScale - esfera.scale.z) * 0.05;
    // ROTAÇÃO ESFERA
    esfera.rotation.y += velocidadeRotacao;
    esfera.rotation.x += velocidadeRotacao;
    // PARTÍCULAS
    particulas.rotation.y += 0.001;
    particulas.rotation.x += 0.001;
    // RENDER
    gerador.render(cena, camera);
}
animar();
//MOUSE INTERAGINDO
function moverEsfera() {
    let mouseX =
    (event.clientX / window.innerWidth)
    - 0.5;
    let mouseY =
    (event.clientY / window.innerHeight)
    - 0.5;
    esfera.rotation.y =
    mouseX * 0.5;
    esfera.rotation.x =
    mouseY * 0.5;
};
    document.addEventListener('mousemove', moverEsfera)
    return() => {
        cancelAnimationFrame(frameId)
        gerador.dispose()
        cena.clear()
        gerador.domElement.remove()
        document.removeEventListener('mousemove', moverEsfera)
    }
}

/*Seta eventos de clique para os botões de microfone e de enviar texto, respectivamente*/
/*Seleciona vozes disponíveis*/
speechSynthesis.onvoiceschanged = () => {
    vozes = speechSynthesis.getVoices();
};

/*Função responsável por permitir que perguntas sejam enviadas ao clicar enter*/
export const handleKeyPress = (event, pergunta, setPergunta, setResposta, modeloDeIA, player, chatRef, toastRef) => {
  if(event.key == 'Enter') {
    event.preventDefault()
    submit(pergunta, setPergunta, setResposta, modeloDeIA, player, chatRef, toastRef)
  }
}

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

function showMusicToast(nomeMusica, album, banda, toastRef) {
    const toast = toastRef;

    const titulo = nomeMusica || "Música desconhecida";
    const artista = banda || "Artista desconhecido";
    const disco = album || "Álbum desconhecido";

    toast.current.innerHTML = `
        🎵 <strong>${titulo} - ${artista}</strong><br>
        💿 ${disco}
    `;

    toast.current.classList.add('show');

    setTimeout(() => {
        toast.current.classList.remove('show');
    }, 4000);
}

/*Função responsável por fazer requisições ao backend e tratar a resposta*/
export function submit(pergunta, setPergunta, setResposta, modeloDeIA, player, chatRef, toastRef) {
    console.log('submit')
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
