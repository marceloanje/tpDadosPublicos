const fs = require("fs");
const path = require("path");

// Caminho dos arquivos
const inputFilePath = path.join(__dirname, "TB_CEP_BR_2018.csv"); // Arquivo de entrada
const outputFilePath = path.join(__dirname, "cepBh.csv"); // Arquivo de saída

// Função para filtrar e exportar os dados
function filtrarEExportarCSV(inputPath, outputPath) {
    fs.readFile(inputPath, "utf8", (err, data) => {
        if (err) {
            console.error("Erro ao ler o arquivo:", err);
            return;
        }

        const linhas = data.split("\n").filter((linha) => linha.trim() !== ""); // Remove linhas vazias
        const header = linhas[0]; // Mantém o cabeçalho
        const resultado = linhas.filter((linha, index) => {
            if (index === 0) return false; // Pula o cabeçalho
            const colunas = linha.split(";");
            return colunas[1] === "MG" && colunas[2] === "Belo Horizonte";
        });

        // Adiciona o cabeçalho ao resultado
        const csvSaida = [header, ...resultado].join("\n");

        // Escreve no novo arquivo CSV
        fs.writeFile(outputPath, csvSaida, "utf8", (err) => {
            if (err) {
                console.error("Erro ao escrever o arquivo:", err);
                return;
            }
            console.log(`Arquivo filtrado salvo em: ${outputPath}`);
        });
    });
}

// Executa a função
filtrarEExportarCSV(inputFilePath, outputFilePath);
