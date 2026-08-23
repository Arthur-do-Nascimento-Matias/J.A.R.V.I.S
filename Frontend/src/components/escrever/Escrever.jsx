import { useEffect, useRef } from "react";
import '../escrever/Escrever.css'

function Escrever() {
    const digitandoRef = useRef(null);
    const indexRef = useRef(0);

    const texto = "INICIALIZANDO J.A.R.V.I.S";

    useEffect(() => {
        const intervalo = setInterval(() => {

            if (indexRef.current < texto.length) {
                digitandoRef.current.textContent += texto.charAt(indexRef.current);
                indexRef.current++;
            } else {
                clearInterval(intervalo);
            }

        }, 100);

        return () => {
            clearInterval(intervalo);
        };
    }, []);

    return (
        <h2 id="digitando" ref={digitandoRef}></h2>
    );
}

export default Escrever
