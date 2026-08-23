import { useEffect, useRef, useState } from 'react';
import '../cards/Cards.css'
import ironman from '../../assets/musicas/Black Sabbath - Iron Man.mp3'
import comeasyouare from '../../assets/musicas/come as you are.mp3'
import nosurprises from '../../assets/musicas/nosurprises.m4a'
import themanwhosoldtheworld from '../../assets/musicas/The Man Who Sold The World.mp3'
import arthur from '../../assets/aidentro.webp'
import wellington from '../../assets/kurt.webp'
import kaua from '../../assets/kaua.webp'
import theo from '../../assets/Queen.jpeg'

function aparecerCards() {

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
//APARECER CARDS
function Cards() {

    let fade = null
    
    const refModal = useRef(null)
    const refNomeP = useRef(null)
    const refCargo = useRef(null)
    const refDescricao = useRef(null)
    const refFoto = useRef(null)
    const refMusica = useRef(null)
    const somosRef = useRef(null)
    const [card, setCard] = useState(null)

    const textoSomos = "Quem Somos:";
    let indexSomos = 0;
    // =======================
        function escreverSomos(){

        if(indexSomos < textoSomos.length){

            somosRef.current.textContent += textoSomos.charAt(indexSomos);

            indexSomos++;

            setTimeout(() => escreverSomos(somosRef), 200);
        }
    }



    function abrirModal(nomePessoa, cargoPessoa, texto, imagem, audio){

    refModal.current.style.display = 'flex';
    refNomeP.current.innerHTML = nomePessoa;
    refCargo.current.innerHTML = cargoPessoa;
    refDescricao.current.innerHTML = texto;
    refFoto.current.src = imagem;
    refMusica.current.src = audio;
    refMusica.current.loop = true;
    refMusica.current.volume = 0; 
    refMusica.current.play();
    let volume = 0;
    fade = setInterval(() => {
    if(volume < 0.3){
        volume += 0.01;
        refMusica.current.volume = volume;
    }else{
        clearInterval(fade);
    }
}, 100);
}

function esperar(tempo) {
    return new Promise(resolve => setTimeout(resolve, tempo))
}

window.abrirModal = abrirModal
    async function fecharModal(){
        clearInterval(fade)

        refMusica.current.volume = 0.3
        let volume = musica.volume
        refModal.current.style.display = 'none';

        while(volume > 0.01) {
            refMusica.current.volume -= 0.01
            volume = musica.volume;

            if(volume < 0.01) {
                volume = 0
                refMusica.current.volume = 0
            }
            await esperar(100)
        }
}

    useEffect(() => {
        const limparCards = aparecerCards()
        escreverSomos()
        return(() => {
            limparCards()
        })
    })

    return(
        <>
        <h1 id="somos" ref={somosRef}></h1>
            
            <div className="container">


                <div className="cards">
        
            <div className="card" value={card} onClick={() => abrirModal(
            '<span>NOME:</span> <br>  Arthur N. Matias',
            '<span>FUNÇÃO:</span> <br> Dev Back-End',
            '<span>FOCO:</span> <br> Desenvolvedor da A.I <br> Modelagem 3D',
            arthur,
            ironman
        )}>

            <img src={arthur} alt="Arthur" className="foto-card" />
            <div className="content"></div>
            <h2>Arthur Matias</h2>
            <p>Dev Back-end</p>
            </div>

            <div className="card" value={card} onClick={() => abrirModal(
            '<span>NOME:</span> <br>  Kauã Nascimento',
            '<span>FUNÇÃO:</span> <br> Dev Back-End',
            '<span>FOCO:</span> <br> 2º Dev da A.I <br> Modelagem 3D',
            kaua,
            nosurprises  
            )}>

            <img src={kaua} alt="Kaua" className="foto-card" />
            <div className="content"></div>
            <h2>Kauã Nascimento</h2>
            <p>Dev Back-End</p>
            </div>

            <div className="card" value={card} onClick={() => abrirModal(
            '<span>NOME:</span> <br>  Theo C. Melo',
            '<span>FUNÇÃO:</span> <br> Dev Front-End',
            '<span>FOCO:</span> <br> Identidade Visual <br> Experiência Interativa',
            theo,
            themanwhosoldtheworld
            )}>

            <img src={theo} alt="Theo" className="foto-card" />
                <div className="content"></div>
                <h2>Theo Melo</h2>
                    <p>Dev Front-End</p>
                </div>
            
                <div className="card" value={card} onClick={() => abrirModal(
            '<span>NOME:</span> <br>  Wellington S. Dias',
            '<span>FUNÇÃO:</span> <br> Dev Front-End',
            '<span>FOCO:</span> <br> Identidade Visual <br> Experiência Interativa',
            wellington,
            comeasyouare
            )}>
                
            <img src={wellington} alt="Wellington" className="foto-card" />
            <div className="content">
                    <h2>Wellington Dias</h2>
                    <p>Dev Front-End</p>
                </div>
            </div>
        </div>
        </div>

        <div className="modal" id="modal" value="modal" ref={refModal} onClick={(e) => {
                if(e.target.id === "modal"){
                fecharModal()
                }
        }}>
            <div className="modal-content">
            
                <span className="fechar" onClick={() => fecharModal()}>&times; </span>
                <img id="foto" alt="FotoPessoa" ref={refFoto}/>
                <h3 id="nomeP" ref={refNomeP}></h3>
                <h3 id="cargo" ref={refCargo}></h3>
                <h3 id="descricao" ref={refDescricao}></h3>

            </div>
        </div>

     
        <audio id="musica" ref={refMusica}></audio>

        </>
    )
}

export default Cards
