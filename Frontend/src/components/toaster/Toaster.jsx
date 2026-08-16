import '../toaster/Toaster.css'

function Toaster({ toastRef }){

    return(
        <>
         <div className='toaster' id='toaster'>
              <div id="toast" className="toast" ref={toastRef}></div> 
         </div>
        </>
    )
}

export function showMusicToast(nomeMusica, album, banda, toastRef) {
        const toast = toastRef;
    
        const titulo = nomeMusica || "Música desconhecida";
        const artista = banda || "Artista desconhecido";
        const disco = album || "Álbum desconhecido";
    
        toast.current.innerHTML = `
            🎵 <strong>${titulo} - ${artista}</strong><br>
            💿 ${disco}
        `;
    
        toast.current.classList.add('show');
    
        setTimeout(() => {
            toast.current.classList.remove('show');
        }, 4000);
    }

export default Toaster
