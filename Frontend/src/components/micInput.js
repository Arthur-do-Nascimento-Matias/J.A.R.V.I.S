import { submit } from "./Script.jsx"

let setpergunta
let setresposta
let modelodeia
let player
let recorder = null
let canrecord = false
let chunks = []
let isrecording = false
let blob = null
let isSettingUp = false
export let resp = null
let audioContext
let analyser
let dataArray
let jaFalou = false
let aberto = false
let processando = false

/*Pede pela permissão para acessar o microfone*/
export function setupAudio(setPergunta, setResposta, modeloDeIA, player, chatRef, toastRef) {
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        return navigator.mediaDevices.getUserMedia({
            /*Isso é essencial para o áudio ser capturado com boa qualidade*/
            audio: {
              channelCount: 1,
              sampleRate: 44100,
              sampleSize: 16,
              echoCancellation: false,
              noiseSuppression: false,
              autoGainControl: false
            }
        }) 
        .then(stream => setupStream(stream, setPergunta, setResposta, modeloDeIA, player, chatRef, toastRef))
        .catch(err => console.log(err))
    }
}

/*Espera que o gravador tenha data disponivel para juntar em um blob.*/
function setupStream(stream, setPergunta, setResposta, modeloDeIA, player, chatRef, toastRef) {
    try{
    recorder = new MediaRecorder(stream)
    audioContext = new AudioContext()
    const source = audioContext.createMediaStreamSource(stream)
    analyser = audioContext.createAnalyser()
    analyser.fftSize = 512
    source.connect(analyser)
    dataArray = new Uint8Array(
        analyser.frequencyBinCount
    )
    detectarSilencio()
    recorder.ondataavailable = e => {
        chunks.push(e.data)
    }
    recorder.onstop = e => {
        if(jaFalou || !aberto){
        processando = true
        blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' })
        chunks = []
        if(blob.size < 5000) {
            blob = null
            return
        }
        fetch('/transcription', {
            method: 'POST',
            headers: {
                'Content-Type': blob.type
            },
            body: blob
    })
    .then(response => response.text())
    .then(data => {
        /*Depois, a manda para uma requisição para o backend.*/
        jaFalou = false
        submit(data, setPergunta, setResposta, modeloDeIA, player, chatRef, toastRef)
    })
    .finally(() => {
        /*Por último, desativa o microfone por completo e reseta as variáveis, isso é importante para burlar o 'Communication Mode' do Android*/
        isrecording = false
        processando = false
        pararGravacao()
        if(aberto) {
            recorder.start()
            isrecording = true
        }
    })
}
    }
    canrecord = true
}
    catch{
        alert('Erro ao capturar audio')
    }
}

/*Ativa e desativa o gravador quando o modo do microfone está em 'aberto'*/
export async function toggleMicAberto(tipoMicrofone, setPergunta, setResposta, modeloDeIA, player, chatRef, toastRef){
  chunks = []
        isrecording = false
        if(processando) return
        if(tipoMicrofone == 'aberto') {
            aberto = true
        }
        else{
            aberto = false
        }
        if(isSettingUp) return
        if(!recorder) {
            isSettingUp = true
            try {
                await setupAudio(setPergunta, setResposta, modeloDeIA, player, chatRef, toastRef)
            } finally {
                isSettingUp = false
            }
        }  
        if(!canrecord) return
        isrecording = !isrecording
        if(isrecording) {
            recorder.stop()
            recorder.start()
        }
        else {
            recorder.stop()
        }
    }

/*Inicia o microfone ao apertar*/
export async function toggleMicApertar(tipoMicrofone, setPergunta, setResposta, modeloDeIA, player, chatRef, toastRef, caseMode) {
    if(caseMode) {
        document.getElementById('microfoneCase').classList.toggle('ativo')
    }
    else{
        document.getElementById('microfone').classList.toggle('ativo')
    }
    chunks = []
        if(processando) return
        if(isSettingUp) return
        if(!recorder) {
            isSettingUp = true
            try {
                await setupAudio(setPergunta, setResposta, modeloDeIA, player, chatRef, toastRef)
            } finally {
                isSettingUp = false
            }
        }  
        if(!canrecord) return
        isrecording = !isrecording
        if(isrecording) {
            if(aberto){
                recorder.stop()
            }
            recorder.start()
        }
        else {
            recorder.stop()
        }
    }

/*Desativa o microfone automaticamente quando não detecta mais som*/
function detectarSilencio() {
    let silencio = 0
    setInterval(() => {
        analyser.getByteFrequencyData(dataArray)
        let volume = 0
        for(let i=0; i < dataArray.length; i++) {
            volume += dataArray[i]
        }
        volume = volume / dataArray.length
        if(volume >= 25 && isrecording){
            jaFalou = true
            silencio = 0
        }
        if(volume < 25 && jaFalou && isrecording) {
            silencio += 100
        }
        else {
            silencio = 0
        }
        if(silencio >= 1300){
            pararGravacao()
            silencio = 0
        }
    }, 50)
}

function pararGravacao() {
    if(!isrecording) return
    isrecording = false
    recorder.stop()
}
