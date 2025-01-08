const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

// Caminhos dos arquivos
const bairroFile = path.join(__dirname, "bairroRendaFiltradoTeste.csv");
const cepBairroFile = path.join(__dirname, "cep_bairro2.csv");
const outputFile = path.join(__dirname, "cep_bairro_novo.csv");

const bairroMap = {};

// Ler bairro.csv e mapear { nome → id }
fs.createReadStream(bairroFile)
    .pipe(csv({ separator: ";" }))
    .on("data", (row) => {
        bairroMap[row.nome] = row.id;
    })
    .on("end", () => {
        console.log("Mapa de bairros carregado:", bairroMap);

        const cepBairros = [];

        // Ler cep_bairro.csv e substituir nome pelo ID
        fs.createReadStream(cepBairroFile)
            .pipe(csv({ separator: ";" }))
            .on("data", (row) => {
                const bairroId = bairroMap[row.bairro] || "N/A"; // Se não encontrar, coloca 'N/A'
                cepBairros.push(`${row.cep};${bairroId}`);
            })
            .on("end", () => {
                const csvContent = ["cep;bairro"].concat(cepBairros).join("\n");

                // Salvar novo arquivo CSV
                fs.writeFileSync(outputFile, csvContent, "utf8");
                console.log(`Arquivo salvo como ${outputFile}`);
            });
    });
