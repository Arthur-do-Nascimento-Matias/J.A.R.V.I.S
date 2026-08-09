import microfone from '../assets/microfone.png'
import seta from '../assets/seta.png'
import '../App.css'
import { useState, useRef, useEffect } from 'react'
import { handleKeyPress, submit, iniciarThree } from './Script.jsx'
import { toggleMicAberto, toggleMicApertar } from './micInput'
import { color } from 'three/tsl'

function Interface() {

    const [pergunta, setPergunta] = useState("")
    const [resposta, setResposta] = useState("")
    const [modeloDeIA, setModeloDeIA] = useState("conversa")
    const [tipoMicrofone, setTipoMicrofone] = useState('apertar')
    const toastRef = useRef(null)
    const chatRef = useRef(null)
    const player = useRef(null)
    useEffect(() => {
        const limparThree = iniciarThree()
        return() => {
            limparThree()
        }
    }, [])
    useEffect(() => {
        if(tipoMicrofone == 'aberto'){
          toggleMicAberto(tipoMicrofone, setPergunta, setResposta, modeloDeIA, player, chatRef, toastRef)
         }
    }, [tipoMicrofone])

return (
    <>
    <div className="hamburgers">
  <label className="hamburger">
    <input type="checkbox" />
    <span className="bar"></span>
    <span className="bar"></span>
    <span className="bar"></span>
    <div className="menu">
      <nav>
        <p>Selecionar modelo de IA:  
          <select className="selecionarModelo" id="selecionarModelo" name="selecionarModelo" value={modeloDeIA} onChange={e => {setModeloDeIA(e.target.value)}}>
          <option value="conversa">Conversação</option>
          <option value="programacao">Programação</option>
        </select></p>
        <p>Selecionar modo de microfone:  
          <select className='tipoMicrofone' name="tipoMicrofone" id="tipoMicrofone" value={tipoMicrofone} onChange={e => {setTipoMicrofone(e.target.value)}}>
            <option value="apertar">Aperte para falar</option>
            <option value="aberto">Aberto</option>
          </select>
        </p>
        <audio id="player" ref={player} controls></audio>
      </nav>
    </div>
    </label>
    </div>
    <div className="home">
         <div className="enviarPergunta">
            <button id="microfone" onClick={() => toggleMicApertar(tipoMicrofone, setPergunta, setResposta, modeloDeIA, player, chatRef, toastRef)}><img src={microfone} alt="" draggable="false" id="mic" /></button>
            <textarea id="pergunta" rows="3" cols="50" placeholder="Digite aqui..." onKeyDown={e => handleKeyPress(e, pergunta, setPergunta, setResposta, modeloDeIA, player, chatRef, toastRef)} value={pergunta} onChange={e => setPergunta(e.target.value)}></textarea><br />
            <button id="enviar" onClick={() => submit(pergunta, setPergunta, setResposta, modeloDeIA, player, chatRef, toastRef)}><img src={seta} alt="" draggable="false" /></button>
        </div>
    </div>
    <div id="chat" ref={chatRef}></div>

    <div className='toaster'>
     <div id="toast" className="toast" ref={toastRef}></div> 
    </div>
    </>

)}

export default Interface
