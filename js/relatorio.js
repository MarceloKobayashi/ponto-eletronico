function renderList() {

    const registers = JSON.parse(localStorage.getItem("register")) || [];

    const containerRegisters = document.getElementById("registros-relatorio");

    const tipoAbreviado = {
        "entrada": "E",
        "intervalo": "I",
        "volta-intervalo": "V",
        "saida": "S"
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
            divData.innerHTML = `<p>> ${data}: </p>`;
            containerRegisters.appendChild(divData);

            registrosPorData.forEach(register => {         
                const divRegistro = document.createElement("div");

                if (register.observação === "") {
                    register.observação = "Sem observação.";
                }

                const tipoAbrev = tipoAbreviado[register.tipo];

                const dadosRegistro = `
                    <p style="display: flex; align-items: center;">
                        <span style="width: 10%; padding-right: 5px;">${tipoAbrev}</span>
                        <span style="width: 15%; padding-right: 5px;">| ${register.hora}</span>
                        <span style="width: 30%; padding-right: 5px;">| ${register.observação || 'Sem observação'}</span>
                        <span style="width: 30%;">| ${register.arquivo || 'Sem anexo'}</span>
                    </p>
                `;
                divRegistro.innerHTML = dadosRegistro;
                    
                    //data x date
                    
                containerRegisters.appendChild(divRegistro);
            });
        }
        
    } else {
        console.error("O container de registros não foi encontrado.");
    }
}

renderList();