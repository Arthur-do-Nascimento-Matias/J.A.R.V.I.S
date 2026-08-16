import '../App.css'
import intro from '../assets/Intro - JARVIS .mp4'
import ironman from '../assets/musicas/Black Sabbath - Iron Man.mp3'
import comeasyouare from '../assets/musicas/come as you are.mp3'
import nosurprises from '../assets/musicas/nosurprises.m4a'
import themanwhosoldtheworld from '../assets/musicas/The Man Who Sold The World.mp3'
import arthur from '../assets/aidentro.webp'
import wellington from '../assets/kurt.webp'
import kaua from '../assets/kaua.webp'
import theo from '../assets/Queen.jpeg'
import { useState, useRef, useEffect } from 'react'
import { ativar, transformarRolar, escrever, iniciarThree, status, sumonarCards, abrirModal, fecharModal, escreverSomos } from '../components/IndexCode.jsx'

function Index() {

    const [card, setCard] = useState(null)
    const [introVideo, setIntroVideo] = useState(false)
    const introRef = useRef("")
    const nomeRef = useRef(null)
    const digitandoRef = useRef(null)
    const statusRef = useRef(null)
    const somosRef = useRef("")
    useEffect(() => {
        escreverSomos(somosRef)
        escrever(digitandoRef)
        status(statusRef)
        const limparThree = iniciarThree()
        const limparRolar = transformarRolar(nomeRef)
        const limparSumonarCards = sumonarCards()
        return() => {
            limparThree()
            limparRolar()
            limparSumonarCards()
        }
    }, [])
    
return(
    <>
    <div className='inicio'>
    <h1 className="nome" ref={nomeRef}>
    <a className="jarvis">
        J.A.R.V.I.S
    </a>
</h1>

<p className="subTexto">Sistema Neural Integrado</p>

<h2 id="digitando" ref={digitandoRef}></h2>

<div className="botao">
    <button className="ativar" id="ativarBtn" onClick={() => ativar(introRef)}>
        <a className="jarvis">
            Ativar
        </a>
    </button>
</div>
</div>

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

<div className="modal" id="modal" value="modal" onClick={(e) => {
        if(e.target.id === "modal"){
           fecharModal()
         }
}}>
    <div className="modal-content">
    
        <span className="fechar" onClick={() => fecharModal()}>&times; </span>
        <img id="foto" alt="FotoPessoa" />
        <h3 id="nomeP"></h3>
        <h3 id="cargo"></h3>
        <h3 id="descricao"></h3>

    </div>
</div>

<div className="hud">
  
    <p
    className="sync"
    id="status" ref={statusRef}>
    SYNC 0%
</p>

<div className="canto"></div>

    <div className="scanline"></div>
  
    <div className="status">
        SYSTEM ONLINE
    </div>
  
    <div className="barra">
        <div className="progresso"></div>
    </div>
</div>


<audio id="musica"></audio>

 <video id="introVideo" ref={introRef} disablePictureInPicture>
    <source src={intro} type="video/mp4" value={introVideo}/>
</video>

</>
)}

export default Index
