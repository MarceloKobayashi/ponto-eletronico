import showAlert from './alert.js';

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

let registroAtual = null;

function renderList(filtro = "todos") {
    const registers = JSON.parse(localStorage.getItem("register")) || [];
    const containerRegisters = document.getElementById("registros-relatorio");

    const tipoAbreviado = {
        "entrada": { nome: "E - Entrada", ordem: 1 },
        "intervalo": { nome: "I - Intervalo", ordem: 2 },
        "volta-intervalo": { nome: "V - Volta intervalo", ordem: 3 },
        "saida": { nome: "S - Saída", ordem: 4 }
    };

    const dataAtual = new Date();
    const registrosFiltrados = registers.filter(register => {
        const dataRegistro = new Date(register.data.split("/").reverse().join("-"));
        if (filtro === "ultima-semana") {
            return (dataAtual - dataRegistro) <= (7 * 24 * 60 * 60 * 1000) && (dataAtual - dataRegistro) >= 0;
        } else if (filtro === "ultimo-mes") {
            return (dataAtual - dataRegistro) <= (30 * 24 * 60 * 60 * 1000) && (dataAtual - dataRegistro) >= 0;
        }
        return true;
    });

    if (containerRegisters) {
        containerRegisters.innerHTML = '';

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
            return new Date(dataB) - new Date(dataA);
        });

        let fundoBranco = true;

        for (const data of datasOrdenadas) {
            const registrosPorData = grupoPorData[data];

            registrosPorData.sort((a, b) => {
                const tipoOrdem = tipoAbreviado[a.tipo].ordem - tipoAbreviado[b.tipo].ordem;
                
                if (tipoOrdem === 0) {
                    const horaA = a.hora.split(":").map(Number);
                    const horaB = b.hora.split(":").map(Number);
                
                    const segundosA = (horaA[0] * 3600) + (horaA[1] * 60) + horaA[2];
                    const segundosB = (horaB[0] * 3600) + (horaB[1] * 60) + horaB[2];
                
                    return segundosA - segundosB;
                }

                return tipoOrdem;
            });

            const divData = document.createElement("div");
            divData.classList.add("div-data");
            divData.innerHTML = `<p>> ${data}: </p>`;
            containerRegisters.appendChild(divData);

            registrosPorData.forEach(register => {         
                const divRegistro = document.createElement("div");
                divRegistro.classList.add("registros");
                divRegistro.classList.add("registro-padrao");

                if (fundoBranco) {
                    divRegistro.classList.add("registro-branco");
                } else {
                    divRegistro.classList.add("registro-cinza");
                }
                fundoBranco = !fundoBranco;
                
                register.observação = register.observação || "Sem observação."; 

                if (register.observação !== "Sem observação.") {
                    divRegistro.classList.remove("registro-padrao");
                    divRegistro.classList.add("registro-observacao");
                }
                if (register.noPassado) {
                    divRegistro.classList.remove("registro-padrao");
                    divRegistro.classList.add("registro-passado");
                }
                if (register.editado) {
                    divRegistro.classList.remove("registro-padrao");
                    divRegistro.classList.add("registro-editado");
                }

                const tipoAbrev = tipoAbreviado[register.tipo].nome;



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

                const btnEditar = divRegistro.querySelector(".btn-editar");
                btnEditar.addEventListener("click", () => {
                    registroAtual = register;

                    document.getElementById("dialog-editar-data").textContent = `Data: ${register.data}`;
                    document.getElementById("editar-hora").value = register.hora;
                    document.getElementById("editar-observacao").value = register.observação;
                    document.getElementById("editar-tipos-ponto").value = register.tipo;

                    document.getElementById("file-label").textContent = register.arquivo ? register.arquivo : "Adicione seu arquivo.";

                    const horaInput = document.getElementById("editar-hora");
                    horaInput.addEventListener("input", (e) => {
                        horaInput.value = formatarHora(e.target.value);
                    });
                    
                    const dialogEditar = document.getElementById("dialog-editar");
                    dialogEditar.showModal();
                });

                const btnExcluir = divRegistro.querySelector(".btn-excluir");
                btnExcluir.addEventListener("click", () => {
                    showAlert("Não é possível excluir esse registro.", "error");
                });
            });
        }
    } else {
        console.error("O container de registros não foi encontrado.");
    }
}

const btnSalvar = document.getElementById("btn-dialog-editar-ponto");
btnSalvar.addEventListener("click", () => {
    if (registroAtual) {
    
        const horaInput = document.getElementById("editar-hora").value;
        
        if (!verificarHoraValida(horaInput, registroAtual.hora)) {
            return;
        }

        if (registroAtual.hora !== horaInput) {
            registroAtual.noPassado = true;
        }

        registroAtual.hora = horaInput;
        
        const observacaoEditada = limparInput(document.getElementById("editar-observacao").value);
        registroAtual.observação = observacaoEditada === "" ? "Sem observação." : observacaoEditada;

        registroAtual.tipo = document.getElementById("editar-tipos-ponto").value;

        const arquivoInput = document.getElementById("editar-arquivo");
        if (arquivoInput.files && arquivoInput.files.length > 0) {
            const arquivo = arquivoInput.files[0];
            registroAtual.arquivo = arquivo.name;
        } else {
            registroAtual.arquivo = registroAtual.arquivo || "Sem anexo";
        }

        const registers = JSON.parse(localStorage.getItem("register")) || [];
        const index = registers.findIndex(r => r.id === registroAtual.id);
        
        if (index !== -1) {
            registroAtual.editado = true;

            registers[index] = registroAtual;
            localStorage.setItem("register", JSON.stringify(registers));

            renderList();
            document.getElementById("dialog-editar").close();
        } else {
            showAlert("Registro não encontrado.", "error");
        }
    }
});

const btnFecharDialog = document.getElementById("btn-editar-fechar");
btnFecharDialog.addEventListener("click", () => {
    document.getElementById("dialog-editar").close();
});

function formatarHora(hora) {
    hora = hora.replace(/\D/g, "");

    if (hora.length <= 2) {
        return hora;
    } else if (hora.length <= 4) {
        return hora.slice(0, 2) + ":" + hora.slice(2, 4);
    } else {
        return hora.slice(0, 2) + ":" + hora.slice(2, 4) + ":" + hora.slice(4, 6);
    }
}

function verificarHoraValida(horaInput, horaAtual) {
    const horaRegex = /^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    if (!horaRegex.test(horaInput)) {
        showAlert("Formato de hora inválido. Use o formato HH:MM:SS.", "error");
        return false;
    }

    const [horaInputH, horaInputM, horaInputS] = horaInput.split(":").map(Number);
    const [horaAtualH, horaAtualM, horaAtualS] = horaAtual.split(":").map(Number);

    const horaInputSegundos = (horaInputH * 3600) + (horaInputM * 60) + horaInputS;
    const horaAtualSegundos = (horaAtualH * 3600) + (horaAtualM * 60) + horaAtualS;

    if (horaInputSegundos > horaAtualSegundos) {
        showAlert("Hora no futuro!", "error");
        return false;
    }
    return true;
}

document.addEventListener("DOMContentLoaded", () => {
    renderList();
});

//Evita que código HTML malicioso entre no sistema
function limparInput(input) {
    return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
