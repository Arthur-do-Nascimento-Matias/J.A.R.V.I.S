import requests

def buscar_coordenadas(localizacao):

    url = "https://geocoding-api.open-meteo.com/v1/search"

    params = {
        "name": localizacao,
        "count": 1,
        "language": "pt",
        "format": "json"
    }

    print(params)
    resposta = requests.get(url, params=params)
    dados = resposta.json()

    local = dados["results"][0]

    for local in dados["results"]:
        print(
            local["name"],
            local.get("country"),
            local["latitude"],
            local["longitude"]
        )

    latitude = local["latitude"]
    longitude = local["longitude"]

    return {"latitude": latitude, "longitude": longitude, "país": local.get("country"), "local": local["name"]}
