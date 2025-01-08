const fs = require("fs");

function parseCSV(content, delimiter = ";") {
    const lines = content.trim().split("\n");
    const headers = lines[0].split(delimiter);

    return lines.slice(1).map((line) => {
        const values = line.split(delimiter);
        return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index];
            return obj;
        }, {});
    });
}

function normalizarNomeBairro(nome) {
    return nome
        .toLowerCase()
        .trim()
        .replace(/\r/g, "")
        .replace(/\(.*?\)/g, "") // remove conteúdo entre parênteses
        .replace(/vale do jatobá/g, "jatobá")
        .replace(/i+/g, "") // remove numeração romana
        .replace(/[0-9]/g, "") // remove números
        .trim();
}

function compararBairros(arquivoCepBairro, arquivoBairro) {
    // Lê os arquivos CSV
    const cepBairroData = fs.readFileSync(arquivoCepBairro, "utf-8");
    const bairroData = fs.readFileSync(arquivoBairro, "utf-8");

    // Parse dos CSVs
    const cepBairros = parseCSV(cepBairroData);
    const bairros = parseCSV(bairroData);

    // Criar um conjunto de nomes normalizados dos bairros base
    const bairrosNormalizados = new Map();
    bairros.forEach((b) => {
        const nomeNormalizado = normalizarNomeBairro(b.nome);
        bairrosNormalizados.set(nomeNormalizado, b.nome);
    });

    // Mapear bairros não encontrados com seus nomes originais
    const bairrosNaoEncontrados = new Map();
    const bairrosEncontrados = new Map();

    // Verificar cada bairro do arquivo cep_bairro
    cepBairros.forEach((registro) => {
        if (
            !registro.bairro ||
            registro.bairro.toLowerCase().trim() === "sem bairro"
        ) {
            return;
        }

        const nomeOriginal = registro.bairro.trim();
        const nomeNormalizado = normalizarNomeBairro(registro.bairro);

        if (!bairrosNormalizados.has(nomeNormalizado)) {
            bairrosNaoEncontrados.set(
                nomeOriginal,
                (bairrosNaoEncontrados.get(nomeOriginal) || 0) + 1
            );
        } else {
            bairrosEncontrados.set(
                nomeOriginal,
                (bairrosEncontrados.get(nomeOriginal) || 0) + 1
            );
        }
    });

    return {
        totalBairrosCep: cepBairros.length,
        totalBairrosBase: bairros.length,
        bairrosNaoEncontrados: Array.from(bairrosNaoEncontrados.entries()).sort(
            (a, b) => b[1] - a[1]
        ), // ordena por frequência
        bairrosEncontrados: Array.from(bairrosEncontrados.entries()).sort(
            (a, b) => b[1] - a[1]
        ), // ordena por frequência
        todosEncontrados: bairrosNaoEncontrados.size === 0,
    };
}

// Exemplo de uso:
try {
    const resultado = compararBairros(
        "cep_bairro2.csv",
        "bairroRendaFiltradoTeste.csv"
    );

    console.log("\nResultado da comparação:");
    console.log(
        `Total de registros em cep_bairro: ${resultado.totalBairrosCep}`
    );
    console.log(`Total de bairros na base: ${resultado.totalBairrosBase}`);

    if (resultado.todosEncontrados) {
        console.log("Todos os bairros foram encontrados!");
    } else {
        console.log("\nBairros não encontrados (e quantidade de ocorrências):");
        resultado.bairrosNaoEncontrados.forEach(([bairro, count]) => {
            console.log(`- ${bairro}: ${count} ocorrência(s)`);
        });

        console.log("\nBairros encontrados com mais ocorrências:");
        resultado.bairrosEncontrados
            .slice(0, 10) // mostra os 10 mais frequentes
            .forEach(([bairro, count]) => {
                console.log(`- ${bairro}: ${count} ocorrência(s)`);
            });
    }
} catch (error) {
    console.error("Erro ao processar os arquivos:", error.message);
}
