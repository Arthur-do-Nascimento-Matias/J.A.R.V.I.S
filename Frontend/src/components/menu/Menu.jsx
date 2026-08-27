import { useState, useRef, useEffect } from 'react'
import '../menu/Menu.css'
import '../../components/microphone/micInput'
import { toggleMicAberto } from '../../components/microphone/micInput'

function Menu({ setModeloDeIA, modeloDeIA, setTipoMicrofone, tipoMicrofone, player, toastRef, pergunta, setPergunta, resposta, setResposta, chatRef }) {

    const menuRef = useRef(null)
    const refCirculoReator = useRef(null)
    const circuloDeDentro = useRef(null)
    const refBarra = useRef(null)

    function abrirMenu( menuRef, refCirculoReator, refBarra ) {
    menuRef.current.classList.toggle('ativo')
    refCirculoReator.current.classList.toggle('ativo')
    refBarra.current.classList.toggle('ativo')
    }

    useEffect(() => {
      if(tipoMicrofone == 'aberto'){
            toggleMicAberto(tipoMicrofone, setPergunta, setResposta, modeloDeIA, player, chatRef, toastRef)
          }
       }, [tipoMicrofone])
    
    return(
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
                <option value="offline">Offline</option>
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
        </>
    )
}

export default Menu
