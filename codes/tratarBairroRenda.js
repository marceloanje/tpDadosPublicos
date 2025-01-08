const fs = require("fs");
const path = require("path");

// Caminho do arquivo CSV original
const inputFilePath = path.join(
    __dirname,
    "Mapa_das_Desigualdades_dados_abertos_20210531.csv"
);
// Caminho do arquivo CSV processado
const outputFilePath = path.join(__dirname, "bairroRendaCompleto.csv");

// Lendo o arquivo CSV
fs.readFile(inputFilePath, "utf8", (err, data) => {
    if (err) {
        console.error("Erro ao ler o arquivo:", err);
        return;
    }

    // Separar as linhas
    const linhas = data
        .split("\n")
        .map((linha) => linha.trim())
        .filter((l) => l);

    // Pegando os cabeçalhos e identificando os índices das colunas desejadas
    const cabecalho = linhas[0].split(";");
    const indicesDesejados = [
        cabecalho.indexOf("ID"),
        cabecalho.indexOf("NOME"),
        cabecalho.indexOf("rend_med_sm"),
        cabecalho.indexOf("populacao"),
    ];

    // Filtrando as linhas para manter apenas as colunas desejadas
    const resultado = linhas.map((linha) => {
        const valores = linha.split(";");
        return indicesDesejados.map((i) => valores[i]).join(";");
    });

    // Escrevendo o novo CSV filtrado
    fs.writeFile(outputFilePath, resultado.join("\n"), "utf8", (err) => {
        if (err) {
            console.error("Erro ao salvar o arquivo:", err);
        } else {
            console.log("Arquivo filtrado salvo com sucesso:", outputFilePath);
        }
    });
});
