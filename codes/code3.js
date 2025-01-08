const fs = require("fs");
const readline = require("readline");

async function loadCepSet(filePath) {
    const cepSet = new Set();
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    let firstLine = true;
    for await (const line of rl) {
        if (firstLine) {
            firstLine = false;
            continue;
        } // Pular cabeçalho
        const [cep] = line.split(";"); // Pega a primeira coluna (CEP)
        cepSet.add(cep);
    }
    return cepSet;
}

async function checkCepInList(cepSet, filePath) {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    let firstLine = true;
    const missingCeps = new Set(); // Usamos Set para evitar valores duplicados

    for await (const line of rl) {
        if (firstLine) {
            firstLine = false;
            continue;
        } // Pular cabeçalho
        const cols = line.split(",");
        const cep = cols[3]; // A quarta coluna (índice 3) é o CEP

        if (!cepSet.has(cep)) {
            missingCeps.add(cep); // Adiciona apenas CEPs ausentes
        }
    }

    if (missingCeps.size > 0) {
        console.log("CEPs não encontrados:", Array.from(missingCeps));
    } else {
        console.log("Todos os CEPs do segundo arquivo estão no primeiro.");
    }
}

async function main() {
    const cepSet = await loadCepSet("cep_bairro2.csv");
    await checkCepInList(cepSet, "covid19bh-unificado.csv");
}

main().catch(console.error);
