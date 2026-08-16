import microfone from '../assets/microfone.png'
import '../App.css'
import { toggleMicAberto, toggleMicApertar } from '../components/microphone/micInput'
import { useState, useRef, useEffect } from 'react'

function CaseMode(){
    const [tipoMicrofone, setTipoMicrofone] = useState('apertar')
    const [pergunta, setPergunta] = useState("")
    const [resposta, setResposta] = useState("")
    const [modeloDeIA, setModeloDeIA] = "conversa"
    const toastRef = useRef(null)
    const chatRef = useRef(null)
    const player = useRef(null)
    useEffect(() => {
        if(tipoMicrofone == 'aberto'){
          toggleMicAberto(tipoMicrofone, setPergunta, setResposta, modeloDeIA, player, chatRef, toastRef)
         }
    }, [tipoMicrofone])

    return(
        <>
            <button id="microfoneCase" onClick={() => toggleMicApertar(tipoMicrofone, setPergunta, setResposta, modeloDeIA, player, chatRef, toastRef, true)}><img src={microfone} alt="" draggable="false" id="mic" /></button>
            <textarea id="perguntaCase" rows="3" cols="50" placeholder="Digite aqui..." onKeyDown={e => handleKeyPress(e, pergunta, setPergunta, setResposta, modeloDeIA, player, chatRef, toastRef)} value={pergunta} onChange={e => setPergunta(e.target.value)}></textarea>
            <div id="chatCase" ref={chatRef}></div>
              <select className='tipoMicrofoneCase' name="tipoMicrofone" id="tipoMicrofoneCase" value={tipoMicrofone} onChange={e => {setTipoMicrofone(e.target.value)}}>
                  <option value="apertar">Aperte para falar</option>
                  <option value="aberto">Aberto</option>
              </select>
              <select className="selecionarModelo" id="selecionarModeloCase" name="selecionarModelo" value={modeloDeIA} onChange={e => {setModeloDeIA(e.target.value)}}>
                 <option value="conversa">Conversação</option>
                 <option value="programacao">Programação</option>
             </select>
             <audio id="playerCase" ref={player} controls></audio>
        </>
    )
}

export default CaseMode
