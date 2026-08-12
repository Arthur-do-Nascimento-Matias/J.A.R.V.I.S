import math

#Responsável por calcular a similariedade entre o embendding da mensagem enviada e os demais embenddings já calculados, que são referentes a funções específicas
def similariedadeCosseno(msg, comparacao):
    dot = sum(a * b for a, b in zip(msg[0], comparacao[0]))
    mag1 = math.sqrt(sum(a * a for a in msg[0]))
    mag2 = math.sqrt(sum(b * b for b in comparacao[0]))
    if mag1 == 0 or mag2 == 0:
        return 0.0
    return dot / (mag1 * mag2)
