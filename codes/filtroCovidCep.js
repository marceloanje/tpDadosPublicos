const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

// Caminhos dos arquivos
const cepBairroFile = path.join(__dirname, "cep_bairro2.csv");
const covidFile = path.join(__dirname, "covid19bh-unificado.csv");
const outputFile = path.join(__dirname, "covid19bh_filtrado_final.csv");

async function readCSV(filePath, delimiter = ";") {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv({ separator: delimiter }))
            .on("data", (data) => results.push(data))
            .on("end", () => resolve(results))
            .on("error", (error) => reject(error));
    });
}

async function filterByCEP() {
    try {
        // Lê os arquivos CSV
        const cepBairroData = await readCSV(cepBairroFile, ";");
        const covidData = await readCSV(covidFile, ",");

        // Extrai os CEPs do primeiro arquivo
        const cepSet = new Set(cepBairroData.map((row) => row.cep.trim()));

        // Filtra o segundo arquivo mantendo apenas os CEPs do primeiro
        const covidFiltrado = covidData.filter((row) =>
            cepSet.has(row.cep.trim())
        );

        // Gera o novo CSV com os dados filtrados
        const header = Object.keys(covidFiltrado[0]).join(",") + "\n";
        const rows = covidFiltrado
            .map((row) => Object.values(row).join(","))
            .join("\n");
        fs.writeFileSync(outputFile, header + rows, "utf8");

        console.log(
            'Filtragem concluída! O arquivo "covid19bh_filtrado.csv" foi gerado.'
        );
    } catch (error) {
        console.error("Erro ao processar os arquivos:", error);
    }
}

filterByCEP();
