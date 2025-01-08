// Função para processar o CSV
function limparCSV(conteudoCSV) {
    // Divide o conteúdo em linhas
    const linhas = conteudoCSV.split("\n");

    // Pega o cabeçalho
    const cabecalho = linhas[0];

    // Função para remover texto entre parênteses
    function removerParenteses(texto) {
        return texto.replace(/\([^)]*\)/g, "").trim();
    }

    // Processa cada linha e remove duplicatas
    const linhasUnicas = new Set();
    linhas.slice(1).forEach((linha) => {
        if (linha.trim()) {
            // Remove texto entre parênteses de cada campo
            const campos = linha
                .split(";")
                .map((campo) => removerParenteses(campo));
            linhasUnicas.add(campos.join(";"));
        }
    });

    // Reconstrói o CSV com o cabeçalho e as linhas únicas
    return [cabecalho, ...Array.from(linhasUnicas)].join("\n");
}

// Para usar com File API no navegador
function processarArquivo(arquivo) {
    const leitor = new FileReader();

    leitor.onload = function (evento) {
        const conteudo = evento.target.result;
        const csvLimpo = limparCSV(conteudo);

        // Cria um blob com o conteúdo processado
        const blob = new Blob([csvLimpo], { type: "text/csv;charset=utf-8;" });

        // Cria link para download
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "arquivo_limpo.csv";
        link.click();
    };

    leitor.readAsText(arquivo);
}

// Para usar com Node.js
function processarArquivoNode(caminhoEntrada, caminhoSaida) {
    const fs = require("fs");

    // Lê o arquivo
    const conteudo = fs.readFileSync(caminhoEntrada, "utf8");

    // Processa o conteúdo
    const csvLimpo = limparCSV(conteudo);

    // Salva o resultado
    fs.writeFileSync(caminhoSaida, csvLimpo, "utf8");
}

processarArquivoNode("cep_bairro.csv", "cep_bairro2.csv");
