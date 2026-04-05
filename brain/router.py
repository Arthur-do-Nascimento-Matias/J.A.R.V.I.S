def Router(message):

    keyWords = ["python", "css", "html", "javascript", "js", "java", "servidor", "servidores",
                "banco de dados", "xaamp", "sql", "mariadb", "mombodb", "postgree", "postgre",
                "postgresqul", "c#", "c++", "robotica", "robótica", "modelos de ia",
                "modelos de inteligencia artificial", "modelo de inteligencia artificial",
                "modelo de inteligência artificial", "modelos de inteligência artificial",
                "ollama", "llm", "codigo", "codigos", "código", "códigos", "erro", "bug",
                "api", "programacao", "programação", "programaçao", "programacão", "funciona?"
                "funciona", "funcioma:"]
    
    for k in keyWords:
        if k in message.lower():
            return "code"
        
    return "none"
