const fs = require("fs");
const path = require("path");

const inputFilePath = path.join(__dirname, "cepBhCompleto.csv");
const outputFilePath = path.join(__dirname, "cepBh.json");

function processCSV(filePath) {
    const data = fs.readFileSync(filePath, "utf8").trim(); // Remover espaços extras
    const lines = data.split("\n").filter((line) => line.trim() !== ""); // Filtra linhas vazias

    if (lines.length < 2) {
        console.error(
            "Erro: O arquivo CSV parece estar vazio ou sem dados válidos."
        );
        return [];
    }

    // Obtendo cabeçalhos e garantindo que o separador seja o correto
    const headers = lines[0].split(";").map((h) => h.trim());
    const cepIndex = headers.indexOf("CEP");
    const bairroIndex = headers.indexOf("BAIRRO");

    if (cepIndex === -1 || bairroIndex === -1) {
        console.error(
            "Erro: Colunas 'CEP' ou 'BAIRRO' não encontradas no CSV."
        );
        return [];
    }

    // Processando linhas e filtrando colunas necessárias
    const result = lines
        .slice(1)
        .map((line) => {
            const columns = line.split(";").map((c) => c.trim());

            if (columns.length > Math.max(cepIndex, bairroIndex)) {
                return {
                    CEP:
                        columns[cepIndex].length >= 3
                            ? columns[cepIndex].slice(0, -3)
                            : columns[cepIndex], // Remove os últimos 3 dígitos
                    BAIRRO: columns[bairroIndex] || "Sem bairro", // Evita valores undefined
                };
            }
        })
        .filter(Boolean);

    return result;
}

const jsonData = processCSV(inputFilePath);

if (jsonData.length > 0) {
    fs.writeFileSync(outputFilePath, JSON.stringify(jsonData, null, 2), "utf8");
    console.log("Arquivo JSON gerado com sucesso:", outputFilePath);
} else {
    console.log("Nenhum dado válido encontrado no CSV.");
}
