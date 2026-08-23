import { useEffect } from 'react';
import * as THREE from 'three'
let frameId

export default function Sphere() {
    // ======================
    // CAMERA
    useEffect(() => {

    //=================================================
    // CENA

    const cena = new THREE.Scene();
    // ======================
    // CAMERA
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.01,
        1000
    );
    camera.position.z = 5;
    camera.position.x = 3;
    // ======================
    // RENDERER
    const gerador = new THREE.WebGLRenderer({
        alpha: true
    });
    gerador.setSize(
        window.innerWidth,
        window.innerHeight
    );
    gerador.setPixelRatio(
        window.devicePixelRatio
    );
    document.body.appendChild(
        gerador.domElement
    );
    gerador.domElement.style.position = "fixed";
    gerador.domElement.style.top = "0";
    gerador.domElement.style.left = "0";
    gerador.domElement.style.zIndex = "0";
    gerador.domElement.style.pointerEvents = "none";
    // ======================
    // ESFERA
    const geometria = new THREE.SphereGeometry(
        2,
        64,
        64
    );
    const material = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        wireframe: true,
    });
    const esfera = new THREE.Mesh(
        geometria,
        material
    );
    cena.add(esfera);
    // ======================
    // ALVOS
    let alvoX = 0;
    let alvoY = 0;
    let alvoScale = 1;
    let velocidadeRotacao = 0.005;
    // ======================
    // SCROLL DA ESFERA
    function scrollEsfera() {
        if(window.scrollY > 100){
            alvoX = -2.4;
            alvoY = 2.3;
            alvoScale = 0.5;
            velocidadeRotacao = 0.001;
        }else{
            alvoX = 0;
            alvoY = 0;
            alvoScale = 1;
            velocidadeRotacao = 0.005;
        }
    }
    window.addEventListener("scroll", scrollEsfera)
    // ======================
    // PARTICULAS
    const particulasGeometria =
    new THREE.BufferGeometry();
    const quantidade = 400;
    const posicoes = [];
    for(let i = 0; i < quantidade; i++){
        posicoes.push(
            (Math.random() - 0.5) * 20
        );
        posicoes.push(
            (Math.random() - 0.5) * 20
        );
        posicoes.push(
            (Math.random() - 0.5) * 20
        );
    }
    particulasGeometria.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(
            posicoes,
            3
        )
    );
    const particulasMaterial =
    new THREE.PointsMaterial({
        color: 0x00ffff,
        size: 0.02
    });
    const particulas =
    new THREE.Points(
        particulasGeometria,
        particulasMaterial
    );
    cena.add(particulas);
    // ======================
    // ANIMAÇÃO
    function animar(){
        frameId = requestAnimationFrame(animar);
        // MOVIMENTO SUAVE DA ESFERA
        esfera.position.x +=
        (alvoX - esfera.position.x) * 0.05;
        esfera.position.y +=
        (alvoY - esfera.position.y) * 0.05;
        // SCALE SUAVE
        esfera.scale.x +=
        (alvoScale - esfera.scale.x) * 0.05;
        esfera.scale.y +=
        (alvoScale - esfera.scale.y) * 0.05;
        esfera.scale.z +=
        (alvoScale - esfera.scale.z) * 0.05;
        // ROTAÇÃO ESFERA
        esfera.rotation.y += velocidadeRotacao;
        esfera.rotation.x += velocidadeRotacao;
        // PARTÍCULAS
        particulas.rotation.y += 0.001;
        particulas.rotation.x += 0.001;
        // RENDER
        gerador.render(cena, camera);
    }
    animar();
    //MOUSE INTERAGINDO
    function moverEsfera() {
        let mouseX =
        (event.clientX / window.innerWidth)
        - 0.5;
        let mouseY =
        (event.clientY / window.innerHeight)
        - 0.5;
        esfera.rotation.y =
        mouseX * 0.5;
        esfera.rotation.x =
        mouseY * 0.5;
    };
    
    document.addEventListener('mousemove', moverEsfera)
    return() => {
        cancelAnimationFrame(frameId)
        gerador.dispose()
        cena.clear()
        gerador.domElement.remove()
        document.removeEventListener('mousemove', moverEsfera)
        window.removeEventListener("scroll", scrollEsfera)
    }


    }, [])
    return null
}
