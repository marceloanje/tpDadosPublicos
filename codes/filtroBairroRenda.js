const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser");

// Caminhos dos arquivos
const jsonFilePath = path.join(__dirname, "cepBh.json");
const csvFilePath = path.join(__dirname, "bairroRendaCompleto.csv");
const outputCsvPath = path.join(__dirname, "bairroRendaFiltrado.csv");

// Função para extrair bairros únicos do JSON
function getUniqueBairrosFromJson(filePath) {
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const bairros = [...new Set(jsonData.map((item) => item.BAIRRO.trim()))]; // Remove duplicatas
    return bairros;
}

// Função para filtrar CSV
function filterCsvByBairros(inputCsvPath, bairros, outputCsvPath) {
    const filteredRows = [];
    const headers = [];

    fs.createReadStream(inputCsvPath)
        .pipe(csvParser({ separator: ";" }))
        .on("headers", (headerList) => {
            headers.push(...headerList); // Captura os cabeçalhos do CSV
        })
        .on("data", (row) => {
            if (bairros.includes(row.NOME.trim())) {
                filteredRows.push(row);
            }
        })
        .on("end", () => {
            // Escrever CSV filtrado
            const csvContent = [
                headers.join(";"), // Cabeçalhos
                ...filteredRows.map((row) =>
                    headers.map((header) => row[header]).join(";")
                ), // Linhas
            ].join("\n");

            fs.writeFileSync(outputCsvPath, csvContent, "utf8");
            console.log(`Novo CSV criado: ${outputCsvPath}`);
        });
}

// Executar o processo
const bairrosUnicos = getUniqueBairrosFromJson(jsonFilePath);
filterCsvByBairros(csvFilePath, bairrosUnicos, outputCsvPath);
