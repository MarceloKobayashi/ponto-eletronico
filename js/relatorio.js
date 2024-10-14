const btnTodos = document.getElementById("btn-todos");
btnTodos.addEventListener("click", () => {
    renderList();
});

const btnSemana = document.getElementById("btn-semana");
btnSemana.addEventListener("click", () => {
    renderList("ultima-semana");
});

const btnMes = document.getElementById("btn-mes");
btnMes.addEventListener("click", () => {
    renderList("ultimo-mes");
});

function renderList(filtro = "todos") {

    const registers = JSON.parse(localStorage.getItem("register")) || [];

    const containerRegisters = document.getElementById("registros-relatorio");

    const tipoAbreviado = {
        "entrada": "E - Entrada",
        "intervalo": "I - Intervalo",
        "volta-intervalo": "V - Volta intervalo",
        "saida": "S - Saída"
    }

    const dataAtual = new Date();
    const registrosFiltrados = registers.filter(register => {
        const dataRegistro = new Date(register.data.split("/").reverse().join("-"));
        if (filtro === "ultima-semana") {
            return(dataAtual - dataRegistro) <= (7 * 24 * 60 * 60 * 1000) && (dataAtual - dataRegistro) >= 0;
        } else if (filtro === "ultimo-mes") {
            return (dataAtual - dataRegistro) <= (30 * 24 * 60 * 60 * 1000) && (dataAtual - dataRegistro) >= 0;
        }

        return true;
    })

    if (containerRegisters) {
        containerRegisters.innerHTML='';

        const grupoPorData = {};
        
        registrosFiltrados.forEach(register => {
            const data = register.data;
            if (!grupoPorData[data]) {
                grupoPorData[data] = [];
            }
            grupoPorData[data].push(register);
        });

        const datasOrdenadas = Object.keys(grupoPorData).sort((a, b) => {
            const dataA = a.split("/").reverse().join("-");
            const dataB = b.split("/").reverse().join("-");
            //converte o formato das datas para que o JS possa comparar corretamente, no formato ano-mes-dia

            return new Date(dataB) - new Date(dataA);
        });

        for (const data of datasOrdenadas) {
            const registrosPorData = grupoPorData[data];

            const divData = document.createElement("div");
            divData.classList.add("div-data")
            divData.innerHTML = `<p>> ${data}: </p>`;
            containerRegisters.appendChild(divData);

            registrosPorData.forEach(register => {         
                const divRegistro = document.createElement("div");
                divRegistro.classList.add("registros");

                if (register.observação === "") {
                    register.observação = "Sem observação.";
                } else {
                    const classeObservacao = divRegistro.classList.add("registro-observacao");
                }

                const tipoAbrev = tipoAbreviado[register.tipo];

                const classePassado = register.noPassado ? divRegistro.classList.add("registro-passado") : '';

                const dadosRegistro = `
                    <div>
                        <div class="registro-dados">
                            <span class="tipo">${tipoAbrev}</span>
                            <span class="hora">| ${register.hora}</span>
                            <span class="observacao">| ${register.observação || 'Sem observação'}</span>
                            <span class="arquivo">| ${register.arquivo || 'Sem anexo'}</span>
                            <div class="registro-botoes">
                                <button class="btn-editar">Editar</button>
                                <button class="btn-excluir">Excluir</button>
                            </div>
                        </div>
                    </div>
                `;
                divRegistro.innerHTML = dadosRegistro;
                    
                containerRegisters.appendChild(divRegistro);
            });
        }
    } else {
        console.error("O container de registros não foi encontrado.");
    }
}

renderList();

