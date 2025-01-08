const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

// Função para ler um arquivo CSV e convertê-lo em um array de objetos
function lerCSV(caminhoArquivo) {
    return new Promise((resolve, reject) => {
        const resultados = [];
        fs.createReadStream(caminhoArquivo)
            .pipe(csv({ separator: ";" })) // Define o separador correto
            .on("data", (data) => resultados.push(data))
            .on("end", () => resolve(resultados))
            .on("error", (error) => reject(error));
    });
}

// Função para escrever um array de objetos em um novo arquivo CSV
function escreverCSV(caminhoArquivo, dados) {
    const cabecalho = Object.keys(dados[0]).join(";");
    const linhas = dados.map((obj) => Object.values(obj).join(";"));
    fs.writeFileSync(
        caminhoArquivo,
        [cabecalho, ...linhas].join("\n"),
        "utf-8"
    );
}

async function processarCSV() {
    try {
        // Caminhos dos arquivos CSV
        const arquivoMapa = path.join(
            __dirname,
            "Mapa_das_Desigualdades_dados_abertos_20210531.csv"
        );
        const arquivoBairro = path.join(__dirname, "bairroRendaFiltrado.csv");
        const arquivoSaida = path.join(
            __dirname,
            "bairroRendaComPopulacao.csv"
        );

        // Ler os arquivos CSV
        const mapaDados = await lerCSV(arquivoMapa);
        const bairroDados = await lerCSV(arquivoBairro);

        // Criar um dicionário { nome do bairro -> população }
        const populacaoPorBairro = {};
        mapaDados.forEach((linha) => {
            populacaoPorBairro[linha.NOME] = linha.populacao; // Associa o nome do bairro à população
        });

        // Atualizar os dados da segunda tabela com a população correspondente
        const bairroAtualizado = bairroDados.map((linha) => ({
            ...linha,
            populacao: populacaoPorBairro[linha.nome] || "", // Adiciona a população ou string vazia se não encontrar
        }));

        // Escrever o novo CSV
        escreverCSV(arquivoSaida, bairroAtualizado);
        console.log("Arquivo gerado com sucesso:", arquivoSaida);
    } catch (error) {
        console.error("Erro ao processar CSV:", error);
    }
}

// Executar a função
processarCSV();
