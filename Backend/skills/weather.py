from brain import geocoding
import requests

url = "https://api.open-meteo.com/v1/forecast"

def buscar_previsao_tempo():

    coordenadas = geocoding.buscar_coordenadas()

    params = {
        "latitude": coordenadas["latitude"],
        "longitude": coordenadas["longitude"],
        "current": "temperature_2m,weather_code",
        "timezone": "America/Sao_Paulo"
    }

    resposta = requests.get(url, params=params)
    dados = resposta.json()

    temperatura = dados["current"]["temperature_2m"]
    return {"resposta": f"A previsão do tempo em Celcius é, aproximadamente, {temperatura} °C"}
