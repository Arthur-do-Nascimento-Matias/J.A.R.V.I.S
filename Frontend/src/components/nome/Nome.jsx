import { useEffect, useRef } from "react"
import '../nome/Nome.css'

function Nome() {
    const nomeRef = useRef(null)

    function transformarRolar() {
        function onScroll() {
            if(window.scrollY > 50){
                nomeRef.current.classList.add('btn')
            }else{
                nomeRef.current.classList.remove('btn')
            }
        };
        window.addEventListener('scroll', onScroll)
        return() => {
            window.removeEventListener('scroll', onScroll)
        }
    }

    useEffect(() => {
        const limparTransformarRolar = transformarRolar()
        return(() => {
            limparTransformarRolar()
        })
    })


    return(
    <>
        <div className='inicio'>
        <h1 className="nome" ref={nomeRef}>
            <a className="jarvis">
                J.A.R.V.I.S
            </a>
        </h1>

        <p className="subTexto">Sistema Neural Integrado</p>

        </div>
    </>
    )
}

export default Nome
