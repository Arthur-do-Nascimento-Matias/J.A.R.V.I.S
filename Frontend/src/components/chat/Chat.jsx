import '../chat/Chat.css'
import microfone from '../../assets/microfone.png'
import seta from '../../assets/seta.png'
import clip from '../../assets/clip.png'
import { useState, useRef } from 'react'
import { submit } from '../response/Response'
import { toggleMicApertar } from '../microphone/micInput'

function Chat({ setModeloDeIA, modeloDeIA, setTipoMicrofone, tipoMicrofone, player, toastRef, pergunta, setPergunta, resposta, setResposta, chatRef }) {

    /*Função responsável por permitir que perguntas sejam enviadas ao clicar enter*/
    const handleKeyPress = (event, pergunta, setPergunta, setResposta, modeloDeIA, player, chatRef, toastRef) => {
    if(event.key == 'Enter') {
        event.preventDefault()
        submit(pergunta, setPergunta, setResposta, modeloDeIA, player, chatRef, toastRef)
    }
    }

    return(
        <>
         <div className="home">
            <div className="enviarPergunta">
                <button id="microfone" onClick={() => toggleMicApertar(tipoMicrofone, setPergunta, setResposta, modeloDeIA, player, chatRef, toastRef)}><img src={microfone} alt="" draggable="false" id="mic" /></button>
                <textarea id="pergunta" rows="3" cols="50" placeholder="Digite aqui..." onKeyDown={e => handleKeyPress(e, pergunta, setPergunta, setResposta, modeloDeIA, player, chatRef, toastRef)} value={pergunta} onChange={e => setPergunta(e.target.value)}></textarea><br />
                <button id="arquivo" onClick={() => alert('Não ta pronto')}><img src={clip} alt="" draggable="false" /></button>
                <button id="enviar" onClick={() => submit(pergunta, setPergunta, setResposta, modeloDeIA, player, chatRef, toastRef)}><img src={seta} alt="" draggable="false" /></button>
            </div>
          </div>
    
    <div id="chat" ref={chatRef}></div>
    </>
    )
}

export default Chat
