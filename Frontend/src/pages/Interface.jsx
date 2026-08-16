import '../App.css' 
import Sphere from '../components/jarvisSphere/Sphere.jsx'
import Menu from '../components/menu/Menu.jsx'
import Weather from '../components/weather/Weather.jsx'
import Chat from '../components/chat/Chat.jsx'
import Clock from '../components/clock/Clock.jsx'
import Toaster from '../components/toaster/Toaster.jsx'
import { useState, useRef } from "react";

function Interface() {

        const [modeloDeIA, setModeloDeIA] = useState("conversa")
        const [tipoMicrofone, setTipoMicrofone] = useState('apertar')
        const player = useRef(null)
        const toastRef = useRef(null)
        const [pergunta, setPergunta] = useState("")
        const [resposta, setResposta] = useState("")
        const chatRef = useRef(null)
 

return (
    <>

    <Sphere />
    
    <Menu 
      setModeloDeIA={setModeloDeIA} 
      modeloDeIA={modeloDeIA}
      setTipoMicrofone={setTipoMicrofone}
      tipoMicrofone={tipoMicrofone}
      player={player}
      pergunta={pergunta}
      setPergunta={setPergunta}
      resposta={resposta}
      setResposta={setResposta}
      chatRef={chatRef}
      />

    <Weather />

    <Clock />

    <Toaster 
      toastRef={toastRef}
    />

    <Chat 
      setModeloDeIA={setModeloDeIA} 
      modeloDeIA={modeloDeIA}
      setTipoMicrofone={tipoMicrofone}
      tipoMicrofone={tipoMicrofone}
      player={player}
      toastRef={toastRef}
      pergunta={pergunta}
      setPergunta={setPergunta}
      resposta={resposta}
      setResposta={setResposta}
      chatRef={chatRef}
      />

    </>

)}

export default Interface
