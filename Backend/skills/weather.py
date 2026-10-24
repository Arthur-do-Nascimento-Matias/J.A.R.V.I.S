from brain import geocoding
from datetime import datetime
import unicodedata
import requests

url = "https://api.open-meteo.com/v1/forecast"


def normalizar_texto(texto):
    texto = str(texto).strip().lower()

    return "".join(
        c for c in unicodedata.normalize("NFD", texto)
        if unicodedata.category(c) != "Mn"
    )


def buscar_previsao_tempo(localizacao="", dia=None):

    if not localizacao:
        return {"precisaDeLocalizacao": True, "data": dia}

    coordenadas = geocoding.buscar_coordenadas(localizacao)

    if not coordenadas:
        return {"erro": "Não consegui encontrar essa localização."}

    return previsao_tempo(coordenadas, dia)


def previsao_tempo(coordenadas, dia=None):

    params = {
        "latitude": coordenadas["latitude"],
        "longitude": coordenadas["longitude"],
        "timezone": "auto"
    }

    # Sem dia informado: temperatura atual
    if dia is None or normalizar_texto(dia) in ("", "agora"):
        params["current"] = "temperature_2m,weather_code"

    # Com dia informado: previsão diária
    else:
        params["daily"] = (
            "temperature_2m_max,"
            "temperature_2m_min,"
            "precipitation_probability_max,"
            "weather_code"
        )
        params["forecast_days"] = 16

    try:
        resposta = requests.get(url, params=params, timeout=10)
        resposta.raise_for_status()
        dados = resposta.json()

    except (requests.RequestException, ValueError):
        return {"erro": "Não foi possível consultar a previsão do tempo."}

    local = coordenadas["local"]
    pais = coordenadas["país"]

    # TEMPERATURA ATUAL
    if "current" in dados:
        temperatura = dados["current"]["temperature_2m"]

        return {
            "resposta": (
                f"A temperatura atual em {local}, {pais}, "
                f"é de aproximadamente {temperatura} graus Celsius."
            )
        }

    # PREVISÃO PARA UM DIA
    diario = dados.get("daily")

    if not diario:
        return {"erro": "Previsão indisponível."}

    datas = diario["time"]
    dia_normalizado = normalizar_texto(dia)

    dias_relativos = {
        "hoje": 0,
        "amanha": 1,
        "depois de amanha": 2
    }

    if dia_normalizado in dias_relativos:
        indice = dias_relativos[dia_normalizado]

    else:
        
        meses = {
            "janeiro": 1, "fevereiro": 2, "marco": 3,
            "abril": 4, "maio": 5, "junho": 6,
            "julho": 7, "agosto": 8, "setembro": 9,
            "outubro": 10, "novembro": 11, "dezembro": 12
        }

        partes = normalizar_texto(dia).split(" de ")

        if len(partes) in (2, 3) and partes[1] in meses:
            ano = int(partes[2]) if len(partes) == 3 else datetime.now().year
            dia = f"{int(partes[0]):02d}/{meses[partes[1]]:02d}/{ano}"

        try:
            try:
                data = datetime.strptime(str(dia), "%d/%m/%Y")
            except ValueError:
                data = datetime.strptime(str(dia), "%Y-%m-%d")

            data_formatada = data.strftime("%Y-%m-%d")

            if data_formatada not in datas:
                return {
                    "erro": "A previsão está disponível para até 16 dias, incluindo hoje."
                }

            indice = datas.index(data_formatada)

        except ValueError:
            return {
                "erro": "Dia inválido. Use hoje, amanhã, depois de amanhã ou uma data."
            }

    maxima = diario["temperature_2m_max"][indice]
    minima = diario["temperature_2m_min"][indice]
    chuva = diario["precipitation_probability_max"][indice]
    codigo = diario["weather_code"][indice]

    condicoes = {
        0: "céu limpo",
        1: "céu predominantemente limpo",
        2: "céu parcialmente nublado",
        3: "céu encoberto",
        45: "neblina",
        48: "neblina",
        51: "garoa leve",
        53: "garoa moderada",
        55: "garoa intensa",
        61: "chuva leve",
        63: "chuva moderada",
        65: "chuva forte",
        71: "neve leve",
        73: "neve moderada",
        75: "neve forte",
        80: "pancadas de chuva leves",
        81: "pancadas de chuva moderadas",
        82: "pancadas de chuva fortes",
        95: "trovoadas",
        96: "trovoadas com granizo",
        99: "trovoadas com granizo forte"
    }

    condicao = condicoes.get(codigo, "condições variáveis")
    data_previsao = datetime.strptime(
        datas[indice], "%Y-%m-%d"
    ).strftime("%d/%m/%Y")

    resposta_texto = (
        f"A previsão do tempo para {local}, {pais}, "
        f"no dia {data_previsao}, indica {condicao}, "
        f"com temperatura mínima de {minima} graus "
        f"e máxima de {maxima} graus Celsius."
    )

    if chuva is not None:
        resposta_texto += (
            f" A probabilidade máxima de precipitação "
            f"prevista é de {chuva}%."
        )

    return {
        "resposta": resposta_texto
    }
