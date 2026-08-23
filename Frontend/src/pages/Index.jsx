import '../App.css'
import Sphere from '../components/jarvisSphere/SphereIndex'
import Status from '../components/status/Status'
import Hud from '../components/hud/Hud'
import Escrever from '../components/escrever/Escrever'
import Ativar from '../components/ativar/Ativar'
import Nome from '../components/nome/Nome'
import Cards from '../components/cards/Cards'

function Index() {
    
return(
    <>
    
        <Sphere />
        <Hud />
        <Status />
        <Escrever />
        <Ativar />
        <Nome />
        <Cards />

    </>
    )
}

export default Index
