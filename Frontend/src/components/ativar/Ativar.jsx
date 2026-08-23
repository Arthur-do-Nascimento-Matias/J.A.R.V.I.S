import '../ativar/Ativar.css'
import intro from '../../assets/Intro - JARVIS .mp4'
import { useState, useRef } from 'react'

function Ativar() {

    const [introVideo, setIntroVideo] = useState(false)
    const introRef = useRef("")

   function ativar(){

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

return(
    <>
    <div className="botao">
        <button className="ativar" id="ativarBtn" onClick={() => ativar(introRef)}>
            <a className="jarvis">
                Ativar
            </a>
        </button>
    </div>

    <video id="introVideo" ref={introRef} disablePictureInPicture>
       <source src={intro} type="video/mp4" value={introVideo}/>
    </video>

    </>
    )
}

export default Ativar
