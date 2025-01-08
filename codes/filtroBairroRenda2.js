const fs = require("fs");
const path = require("path");
const readline = require("readline");

// Caminhos dos arquivos
const cepBairroFile = path.resolve("cep_bairro2.csv");
const bairroRendaFile = path.resolve("bairroRendaCompleto.csv");
const outputFile = path.resolve("bairroRendaFiltradoTeste.csv");

// Função para ler CSV e retornar como array de objetos
function readCSV(filePath, delimiter = ";") {
    return new Promise((resolve, reject) => {
        const rows = [];
        const rl = readline.createInterface({
            input: fs.createReadStream(filePath),
            output: process.stdout,
            terminal: false,
        });

        let headers = [];
        rl.on("line", (line) => {
            const cols = line.split(delimiter);
            if (headers.length === 0) {
                headers = cols;
            } else {
                const row = {};
                cols.forEach((col, index) => {
                    row[headers[index]] = col;
                });
                rows.push(row);
            }
        });

        rl.on("close", () => resolve(rows));
        rl.on("error", (err) => reject(err));
    });
}

// Função para salvar dados em um CSV
function writeCSV(filePath, data, delimiter = ";") {
    return new Promise((resolve, reject) => {
        if (data.length === 0) {
            return reject("Nenhum dado para salvar.");
        }

        const headers = Object.keys(data[0]);
        const rows = data.map((row) =>
            headers.map((header) => row[header]).join(delimiter)
        );
        const content = [headers.join(delimiter), ...rows].join("\n");

        fs.writeFile(filePath, content, "utf8", (err) => {
            if (err) reject(err);
            resolve();
        });
    });
}

// Função principal
(async function main() {
    try {
        // Ler os arquivos CSV
        const cepBairroData = await readCSV(cepBairroFile);
        const bairroRendaData = await readCSV(bairroRendaFile);

        // Criar um conjunto com os bairros
        const bairros = new Set(cepBairroData.map((row) => row["bairro"]));

        // Filtrar os dados do bairroRendaCompleto
        const filteredData = bairroRendaData.filter((row) =>
            bairros.has(row["NOME"])
        );

        // Salvar os dados filtrados em um novo arquivo CSV
        await writeCSV(outputFile, filteredData);

        console.log(`Arquivo '${outputFile}' gerado com sucesso!`);
    } catch (error) {
        console.error("Erro:", error);
    }
})();
