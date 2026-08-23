import '../status/Status.css'
import { useRef } from "react"

function Status() {

    const statusRef = useRef(null)

    //=====================
    //TEXTO MUDANDO
    const mensagens = [
        "SYNC 45%",
        "SYNC 63%",
        "SYNC 100%",
        "SYNC 89%",
        "SYNC 97%"
    ];
    let index = 0;
    setInterval(() => {
        index++;
        if(index >= mensagens.length){
            index = 0;
        }
        statusRef.current.textContent = mensagens[index];
    }, 1000);

    return(
        <>
            <p className="sync" id="status" ref={statusRef}> SYNC 0%</p>
        </>
    )
}

export default Status
