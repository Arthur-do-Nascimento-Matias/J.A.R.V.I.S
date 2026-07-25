import * as THREE from 'three'
let fade = null
let frameId

//TRANSFORMAÇÃO DO NOME EM BOTÃO AO ROLAR A PÁGINA
export function transformarRolar(nomeRef) {
    function onScroll() {
        if(window.scrollY > 50){
            nomeRef.current.classList.add('btn')
        }else{
            nomeRef.current.classList.remove('btn')
        }
    };
    window.addEventListener('scroll', onScroll)
    return() => {
        window.removeEventListener('scroll', onScroll)
    }
}
//=================================================
//TEXTO ESCREVENDO

//=================================================
// CENA
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
camera.position.x = 3;
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
// SCROLL DA ESFERA
function scrollEsfera() {
     if(window.scrollY > 100){
        alvoX = -2.4;
        alvoY = 2.3;
        alvoScale = 0.5;
        velocidadeRotacao = 0.001;
    }else{
        alvoX = 0;
        alvoY = 0;
        alvoScale = 1;
        velocidadeRotacao = 0.005;
    }
}
window.addEventListener("scroll", scrollEsfera)
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
        window.removeEventListener("scroll", scrollEsfera)
    }
}
//=====================
//TEXTO MUDANDO
export function status(statusRef) {
const mensagens = [
    "SYNC 45%",
    "SYNC 63%",
    "SYNC 100%",
    "SYNC 89%",
    "SYNC 97%"
];
let index = 0;
setInterval(() => {
    index++;
    if(index >= mensagens.length){
        index = 0;
    }
    statusRef.current.textContent = mensagens[index];
}, 1000);
}
//=====================
//APARECER CARDS
export function sumonarCards() {
const cards = document.querySelectorAll('.card');
function aparecerCards() {
    cards.forEach((card, index) => {
        if(window.scrollY > 50 + (index * 100)) {
            card.classList.add('aparecer');
        } else {
            card.classList.remove('aparecer');
        }
    });
};
window.addEventListener('scroll', aparecerCards)
return() => {
    window.removeEventListener('scroll', aparecerCards)
}
}
//=====================
//MODAL (POPUP)

export function abrirModal(nomePessoa, cargoPessoa, texto, imagem, audio){

    const modal = document.getElementById('modal');
    const nomeP = document.getElementById('nomeP');
    const cargo = document.getElementById('cargo');
    const descricao = document.getElementById('descricao');
    const foto = document.getElementById('foto');
    const musica = document.getElementById("musica");

    modal.style.display = 'flex';
    nomeP.innerHTML = nomePessoa;
    cargo.innerHTML = cargoPessoa;
    descricao.innerHTML = texto;
    foto.src = imagem;
    musica.src = audio;
    musica.loop = true;
    musica.volume = 0; 
    musica.play();
    let volume = 0;
    fade = setInterval(() => {
    if(volume < 0.3){
        volume += 0.01;
        musica.volume = volume;
    }else{
        clearInterval(fade);
    }
}, 100);
}

function esperar(tempo) {
    return new Promise(resolve => setTimeout(resolve, tempo))
}

window.abrirModal = abrirModal
export async function fecharModal(){
    clearInterval(fade)
    const modal = document.getElementById('modal');
    const musica = document.getElementById("musica");
    musica.volume = 0.3
    let volume = musica.volume
    modal.style.display = 'none';
    while(volume > 0.01) {
        musica.volume -= 0.01
        volume = musica.volume;
        if(volume < 0.01) {
            volume = 0
            musica.volume = 0
        }
        await esperar(100)
    }
}
//=====================
//TEXTO ESCREVENDDO
const texto = "INICIALIZANDO J.A.R.V.I.S";

let index1 = 0;

export function escrever(digitandoRef){

    if(index1 < texto.length){

        digitandoRef.current.textContent += texto.charAt(index1);

        index1++;

        setTimeout(() => {
            escrever(digitandoRef)
        }, 100);
    }
}

const textoSomos = "Quem Somos:";
let indexSomos = 0;
// =======================
export function escreverSomos(somosRef){

    if(indexSomos < textoSomos.length){

        somosRef.current.textContent += textoSomos.charAt(indexSomos);

        indexSomos++;

        setTimeout(() => escreverSomos(somosRef), 200);
    }
}

//=====================
//VÍDEO DO JARVIS
const ativarBtn = document.getElementById("ativarBtn");
const introVideo = document.getElementById("introVideo");

export function ativar(introRef) {

   let introVideo = introRef.current
       // mostra o vídeo
   document.body.classList.add('scroll-desativado')
    // toca o vídeo
   introVideo.style.display = "block"
   introVideo.play();

    // quando terminar
  introVideo.onended = () => {

        // abre outro HTML
       window.location.href = '/jarvis'
       setTimeout(() => {
        introVideo.style.display = 'none'
        document.body.classList.remove('scroll-desativado')
       }, 1000)
}
}
