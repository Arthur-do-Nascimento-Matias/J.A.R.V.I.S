import microfone from '../assets/microfone.png'
import seta from '../assets/seta.png'
import clip from '../assets/clip.png'
import '../App.css'
import { useState, useRef, useEffect } from 'react'
import { handleKeyPress, submit, iniciarThree, abrirMenu, atualizarRelogio } from './Script.jsx'
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
    const menuRef = useRef(null)
    const refRelogio = useRef(null)
    const refCirculoReator = useRef(null)
    const circuloDeDentro = useRef(null)
    const refBarra = useRef(null)
    useEffect(() => {
        const limparThree = iniciarThree()
        atualizarRelogio(refRelogio)
        const intervalo = setInterval(() => {
          atualizarRelogio(refRelogio)
        }, 1000)
        return() => {
            limparThree()
            clearInterval(intervalo)
        }
    }, [])
    useEffect(() => {
        if(tipoMicrofone == 'aberto'){
          toggleMicAberto(tipoMicrofone, setPergunta, setResposta, modeloDeIA, player, chatRef, toastRef)
         }
    }, [tipoMicrofone])

return (
    <>
    <div className='pulso'>
      <div className="circuloDeFora" onClick={() => abrirMenu(menuRef, refCirculoReator, refBarra)} ref={refCirculoReator}>
        <div className="circuloDeDentro" ref={circuloDeDentro}></div>
        <div className="barraCirculo" ref={refBarra}></div>
    </div>
    </div>
    <div className="menu" ref={menuRef}>
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

    <div className='relogio' ref={refRelogio}><p>00:00:00</p></div>

    <div className="previsaoTempo">
      <div className='headerWeather'>
        <p>🔴Painel do tempo</p>
      </div>
      <div id="ww_7c83de337ef91" v='1.3' loc='auto' a='{"t":"horizontal","lang":"pt","sl_lpl":1,"ids":[],"font":"Arial","sl_ics":"one_a","sl_sot":"celsius","cl_bkg":"rgba(69,90,100,0)","cl_font":"#FFFFFF","cl_cloud":"#FFFFFF","cl_persp":"#81D4FA","cl_sun":"#FFC107","cl_moon":"#FFC107","cl_thund":"#FF5722"}'>Mais previsões: <a href="https://tempolongo.com/rio_de_janeiro_tempo_25_dias/" id="ww_7c83de337ef91_u" target="_blank">Previsão do tempo em Rio de Janeiro para 30 dias</a></div><script async src="https://app3.weatherwidget.org/js/?id=ww_7c83de337ef91"></script>
    </div>
    
    <div className="home">
         <div className="enviarPergunta">
            <button id="microfone" onClick={() => toggleMicApertar(tipoMicrofone, setPergunta, setResposta, modeloDeIA, player, chatRef, toastRef)}><img src={microfone} alt="" draggable="false" id="mic" /></button>
            <textarea id="pergunta" rows="3" cols="50" placeholder="Digite aqui..." onKeyDown={e => handleKeyPress(e, pergunta, setPergunta, setResposta, modeloDeIA, player, chatRef, toastRef)} value={pergunta} onChange={e => setPergunta(e.target.value)}></textarea><br />
            <button id="arquivo" onClick={() => alert('Não ta pronto')}><img src={clip} alt="" draggable="false" /></button>
            <button id="enviar" onClick={() => submit(pergunta, setPergunta, setResposta, modeloDeIA, player, chatRef, toastRef)}><img src={seta} alt="" draggable="false" /></button>
        </div>
    </div>
    
    <div id="chat" ref={chatRef}></div>

    <div className='toaster' id='toaster'>
     <div id="toast" className="toast" ref={toastRef}></div> 
    </div>
    </>

)}

export default Interface
