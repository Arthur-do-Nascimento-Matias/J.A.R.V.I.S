import requests

def buscar_coordenadas():

    cidade = "Criciúma"

    url = "https://geocoding-api.open-meteo.com/v1/search"

    params = {
        "name": cidade,
        "count": 1,
        "language": "pt",
        "format": "json"
    }

    resposta = requests.get(url, params=params)
    dados = resposta.json()

    local = dados["results"][0]

    latitude = local["latitude"]
    longitude = local["longitude"]

    return {"latitude": latitude, "longitude": longitude}
