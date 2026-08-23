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


<div className="hud">
  

<div className="canto"></div>

    <div className="scanline"></div>
  
    <div className="status">
        SYSTEM ONLINE
    </div>
  
    <div className="barra">
        <div className="progresso"></div>
    </div>
</div>


 <video id="introVideo" ref={introRef} disablePictureInPicture>
    <source src={intro} type="video/mp4" value={introVideo}/>
</video>

</>
)}

export default Index
