import { useRef, useEffect } from 'react'
import '../../components/clock/Clock.css'

function Clock() {

    function atualizarRelogio(refRelogio) {
        const agora = new Date()
        const horas = String(agora.getHours()).padStart(2,'0')
        const minutos = String(agora.getMinutes()).padStart(2,'0')
        const segundos = String(agora.getSeconds()).padStart(2,'0')
        refRelogio.current.textContent = `${horas}:${minutos}:${segundos}`
    }

      const refRelogio = useRef(null)

    useEffect(() =>
        {
            atualizarRelogio(refRelogio)
            const intervalo = setInterval(() => {
                atualizarRelogio(refRelogio)}, 1000
            )
            return(() => {
                clearInterval(intervalo)
            })
        }, [])

    return(
        <>
         <div className='relogio' ref={refRelogio}><p>00:00:00</p></div>
        </>
    )
}

export default Clock
