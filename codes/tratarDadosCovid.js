const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

const files = [
    "covid19bh-2020.csv",
    "covid19bh-2021.csv",
    "covid19bh-2022.csv",
    "covid19bh-2023.csv",
    "covid19bh-2024.csv",
];

const targetColumns = [
    "num_not",
    "sexo",
    "racacor",
    "cep",
    "dt_nasc",
    "forma_doenca",
    "classificacao",
    "evolucao",
    "ano",
];
let allData = [];

// Função para processar cada arquivo CSV
const processCSV = (file, removeFirstColumn) => {
    const filePath = path.join(__dirname, file);
    const csvData = fs.readFileSync(filePath, "utf8");

    let { data } = Papa.parse(csvData, { header: true, skipEmptyLines: true });

    // Remover a primeira coluna, se necessário
    if (removeFirstColumn && data.length > 0) {
        const firstColumn = Object.keys(data[0])[0];
        data = data.map((row) => {
            delete row[firstColumn];
            return row;
        });
    }

    // Filtrar colunas desejadas
    const filteredData = data.map((row) => {
        let newRow = {};
        targetColumns.forEach((col) => {
            newRow[col] = row[col] || "";
        });
        return newRow;
    });

    return filteredData;
};

// Processar os arquivos
files.forEach((file) => {
    const removeFirstColumn =
        file.includes("2022") || file.includes("2023") || file.includes("2024");
    const data = processCSV(file, removeFirstColumn);
    allData = allData.concat(data);
});

// Converter para CSV e salvar
const finalCSV = Papa.unparse(allData, { header: true });
fs.writeFileSync("covid19bh-unificado.csv", finalCSV, "utf8");

console.log("Arquivo unificado salvo como covid19bh-unificado.csv");
