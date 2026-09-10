from datetime import datetime, date, time
from zoneinfo import ZoneInfo 

def perguntar_hora():
    data_e_hora_atuais = datetime.now()  
    fuso_horario = ZoneInfo('America/Sao_Paulo')  
    data_e_hora_sao_paulo = data_e_hora_atuais.astimezone(fuso_horario)  
    data_e_hora_formatada = data_e_hora_sao_paulo.strftime('%H:%M') 
    return {"resposta": "São " + data_e_hora_formatada}

def perguntar_data():
    data_atual = date.today() 
    data_em_texto = data_atual.strftime('%d/%m/%Y')
    return {"resposta": "Hoje é " + data_em_texto}
