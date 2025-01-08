const fs = require("fs");
const csv = require("csv-parser");

const inputFile = "covid19bh-unificado.csv";
const outputFile = "covid19bh-confirmados.csv";

const results = [];
const headers = [];

fs.createReadStream(inputFile)
    .pipe(csv())
    .on("headers", (headerList) => {
        headers.push(...headerList); // Guardar cabeçalhos
    })
    .on("data", (row) => {
        if (row.classificacao === "Confirmados") {
            results.push(row);
        }
    })
    .on("end", () => {
        const csvContent = [
            headers.join(","),
            ...results.map((obj) => Object.values(obj).join(",")),
        ].join("\n");

        fs.writeFileSync(outputFile, csvContent, "utf8");
        console.log(`Arquivo filtrado salvo como: ${outputFile}`);
    });
