function renderList() {

    const registers = JSON.parse(localStorage.getItem("register")) || [];

    const containerRegisters = document.getElementById("registros-relatorio");

    const tipoAbreviado = {
        "entrada": "E - Entrada",
        "intervalo": "I - Intervalo",
        "volta-intervalo": "V - Volta intervalo",
        "saida": "S - Saída"
    }

    if (containerRegisters) {
        containerRegisters.innerHTML='';

        const grupoPorData = {};
        
        registers.forEach(register => {
            const data = register.data;
            if (!grupoPorData[data]) {
                grupoPorData[data] = [];
            }
            grupoPorData[data].push(register);
        });

        for (const data in grupoPorData) {
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