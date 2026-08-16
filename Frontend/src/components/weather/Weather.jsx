import '../weather/Weather.css'

function Weather() {
    return(
        <>
         <div className="previsaoTempo">
              <div className='headerWeather'>
                <p>🔴Painel do tempo</p>
              </div>
              <div id="ww_7c83de337ef91" v='1.3' loc='auto' a='{"t":"horizontal","lang":"pt","sl_lpl":1,"ids":[],"font":"Arial","sl_ics":"one_a","sl_sot":"celsius","cl_bkg":"rgba(69,90,100,0)","cl_font":"#FFFFFF","cl_cloud":"#FFFFFF","cl_persp":"#81D4FA","cl_sun":"#FFC107","cl_moon":"#FFC107","cl_thund":"#FF5722"}'>Mais previsões: <a href="https://tempolongo.com/rio_de_janeiro_tempo_25_dias/" id="ww_7c83de337ef91_u" target="_blank">Previsão do tempo em Rio de Janeiro para 30 dias</a></div><script async src="https://app3.weatherwidget.org/js/?id=ww_7c83de337ef91"></script>
            </div>
        </>
    )
}

export default Weather
