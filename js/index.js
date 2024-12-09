import showAlert from './alert.js';

document.addEventListener("DOMContentLoaded", () => {
    async function getUserLocation() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLocation = {
                        lat: position.coords.latitude,
                        long: position.coords.longitude
                    };
                    resolve(userLocation);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    const inputFile = document.getElementById("anexo");
    const fileLabel = document.getElementById("file-label");

    inputFile.addEventListener("change", () => {
        if (inputFile.files.length > 0) {
            const fileName = inputFile.files[0].name;
            
            fileLabel.textContent = fileName;
        } else {
            fileLabel.textContent = "Adicione seu arquivo";
        }
    });

    //função para ler o conteúdo do arquivo, utiliza uma variável em btnDialogBaterPonto
    function lerArquivo(file) {
        return new Promise((resolve, reject) => {
            if (!file) {
                resolve(null);
                return;
            }

            const tamanhoMax = 10 * 1024;
            if (file.size > tamanhoMax) {
                reject(new Error("O arquivo excede o tamanho máximo."));
                showAlert("Arquivo muito grande.", "error");
                return;
            }

            const fileName = file.name.toLowerCase();
            if (!fileName.endsWith('.txt')) {
                reject(new Error("O arquivo deve ter a extensão .txt"));
                showAlert("Arquivo inválido, deve ser '.txt'.", "error");
                return;
            }

            resolve(file.name);

            /* Para ler o conteúdo do arquivo
            const reader = new FileReader();
            
            reader.onload = (event) => {
                resolve(event.target.result);
            };

            reader.onerror = () => {
                reject(new Error("Erro ao ler o arquivo."));
            };

            reader.readAsText(file);
            */
        });
    }

    const diaSemana = document.getElementById("dia-semana");
    const diaMesAno = document.getElementById("dia-mes-ano");
    const horaMinSeg = document.getElementById("hora-min-seg");

    const btnBaterPonto = document.getElementById("btn-bater-ponto");

    const dialogData = document.getElementById("dialog-data");
    dialogData.textContent = "Data: " + getCurrentDate();

    const dialogHora = document.getElementById("dialog-hora");
    dialogHora.textContent = "Hora: " + getCurrentHour();

    const dialogPonto = document.getElementById("dialog-ponto");
    let isDialogOpen = false;

    btnBaterPonto.addEventListener("click", function() {
        isDialogOpen = true;
        dialogPonto.showModal();
        let lastRegisterText = "Último registro: " + localStorage.getItem("lastDateRegister") + " - " + localStorage.getItem("lastTimeRegister") + " | " + localStorage.getItem("lastTypeRegister");
        document.getElementById("dialog-last-register").textContent = lastRegisterText;
    });

    let registerLocalStorage = getRegisterLocalStorage();
    let passado = false;

    const btnDialogBaterPonto = document.getElementById("btn-dialog-bater-ponto");
    btnDialogBaterPonto.addEventListener("click", async () => {
        try {
            const typeRegisterElement = document.getElementById("tipos-ponto");
            let selectedType = typeRegisterElement.value;
            const location = await getUserLocation();

            const observacaoPonto = sanitizeInput(limparInput(document.getElementById("observacao").value));
            const arquivoPonto = document.getElementById("anexo").files[0];
            try {

                const arquivoConteudo = await lerArquivo(arquivoPonto);
                
                const dataCorretaParaRegistro = editandoData ? document.getElementById("input-dialog-data").value : dataOriginal;
                const horaCorretaParaRegistro = editandoHora ? document.getElementById("input-dialog-hora").value : horaOriginal;
                
                let ponto = {
                    "data": dataCorretaParaRegistro,
                    "hora": horaCorretaParaRegistro,
                    "localizacao": {
                        "latitude": location.lat,
                        "longitude": location.long
                    },
                    "id": geradorIdAutomatico(),
                    "tipo": selectedType,
                    "observação": observacaoPonto,
                    "arquivo": arquivoConteudo,
                    "noPassado": passado,
                    "editado": false
                }
                
                console.log(ponto);
                
                saveRegisterLocalStorage(ponto);
                localStorage.setItem("lastTypeRegister", selectedType);
                localStorage.setItem("lastDateRegister", ponto.data);
                localStorage.setItem("lastTimeRegister", ponto.hora);
                
                printCurrentHour();
                
                dialogPonto.close();
                isDialogOpen = false;
                passado = false;
                
                showAlert('Registro de ponto realizado com sucesso!', 'success');
            } catch (fileError) {
                showAlert(fileError.message, "error");
            }
            
        } catch (error) {
            showAlert('Erro em registrar ponto.', 'error');
        }
    });

    function saveRegisterLocalStorage(register) {
        registerLocalStorage.push(register);
        localStorage.setItem("register", JSON.stringify(registerLocalStorage));
    }

    function getRegisterLocalStorage() {
        let registers = localStorage.getItem("register");

        if (!registers) {
            return [];
        }

        return JSON.parse(registers);
    }

    const btnFechar = document.getElementById("btn-fechar");
    btnFechar.addEventListener("click", () => {
        dialogPonto.close();
        isDialogOpen = false;
    });

    function getCurrentWeekDay() {
        const date = new Date();

        let diaDaSemana = new Map([
            [0, "Domingo"],
            [1, "Segunda-Feira"],
            [2, "Terça-Feira"],
            [3, "Quarta-Feira"],
            [4, "Quinta-Feira"],
            [5, "Sexta-Feira"],
            [6, "Sábado"]
        ]);

        const currentDay = date.getDay();

        return diaDaSemana.get(currentDay);
    }

    function getCurrentHour() {
        const locale = navigator.language;
        const date = new Date();

        const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };

        return date.toLocaleTimeString(locale, options);
    }

    function printCurrentHour() {
        if (!isDialogOpen) {
            horaMinSeg.textContent = getCurrentHour();
            dialogHora.textContent = "Hora: " + getCurrentHour();
            dialogData.textContent = "Data: " + getCurrentDate();
        }
    }

    function getCurrentDate() {
        const locale = navigator.language;
        
        const date = new Date();
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };

        return date.toLocaleDateString(locale, options);
    }

    diaSemana.textContent = getCurrentWeekDay();
    diaMesAno.textContent = getCurrentDate();

    printCurrentHour();
    setInterval(printCurrentHour, 1000);

    const btnDialogEditarData = document.getElementById("btn-dialog-editar-data");
    let editandoData = false;
    let dataOriginal = getCurrentDate();

    btnDialogEditarData.addEventListener("click", () => {
        if (!editandoData) {
            const input = document.createElement("input");
            input.type = "text";
            input.id = "input-dialog-data";
            input.maxLength = 10;
            input.value = dataOriginal;

            dialogData.textContent = "";
            dialogData.appendChild(input);  //adiciona o valor do input no lugar do texto

            btnDialogEditarData.textContent = "Salvar";

            editandoData = true;    //entra no modo de edição

            input.addEventListener("input", (dt) => {
                input.value = formatarData(dt.target.value);
            });
        } else {
            const input = document.getElementById("input-dialog-data");
            let novaData = input.value;

            if (dataNoFuturo(novaData)){
                novaData = getCurrentDate();
                dialogData.textContent = "Data: " + novaData;
                showAlert("Data no futuro! Insira uma data válida.", "error");
                passado = false;
            } else if (novaData.length === 10 && dataValida(novaData) && !dataNoFuturo(novaData)) {
                dataOriginal = novaData;
                dialogData.textContent = "Data: " + novaData;
                passado = true;
            } else {
                novaData = getCurrentDate(); 
                dialogData.textContent = "Data: " + novaData;
                showAlert("Data inválida! Voltando para a data atual.", "error"); 
                passado = false;
            }

            //Verifica se ao mudar a data, o usuário não tinha trocado para uma hora no futuro, Ex.: Troca a data para ontem (assim pode colocar uma hora adiantada) e depois troca para hoje
            // permanecendo a hora no futuro. Essa parte serve para evitar isso.
            let novaHora = horaOriginal;
            if (horaNoFuturo(novaData, novaHora)) {
                horaOriginal = getCurrentHour();
                dialogHora.textContent = "Hora: " + horaOriginal;
                showAlert("Hora no futuro! Voltando para a hora atual.", "error");
                passado = false;
            }

            btnDialogEditarData.textContent = "Editar";
            editandoData = false;

        }
    });

    function formatarData(data) {
        data = data.replace(/\D/g, "");

        if (data.length <= 2) {
            return data;
        } else if (data.length <= 4) {
            return data.slice(0, 2) + '/' + data.slice(2);
        } else {
            return data.slice(0, 2) + '/' + data.slice(2, 4) + '/' + data.slice(4, 8);
        }
    }

    function dataValida(dataString) {
        const [dia, mes, ano] = dataString.split('/');
        const date = new Date(`${ano}-${mes}-${dia}`);
        
        return date instanceof Date && !isNaN(date);
    }

    function dataNoFuturo(data) {
        const [dia, mes, ano] = data.split('/').map(Number);
        const dataInserida = new Date(ano, mes - 1, dia);
        const dataAtual = new Date();

        dataAtual.setHours(0, 0, 0, 0); //sem comparar as horas

        return dataInserida > dataAtual;
    }

    const btnDialogEditarHora = document.getElementById("btn-dialog-editar-hora");
    let editandoHora = false;
    let horaOriginal = getCurrentHour();

    btnDialogEditarHora.addEventListener("click", () => {
        if (!editandoHora) {
            const input = document.createElement("input");
            input.type = "text";
            input.id = "input-dialog-hora";
            input.maxLength = 8;
            input.value = horaOriginal;

            dialogHora.textContent = "";
            dialogHora.appendChild(input);

            btnDialogEditarHora.textContent = "Salvar";

            editandoHora = true;

            input.addEventListener("input", (hr) => {
                input.value = formatarHora(hr.target.value);
            });
        } else {
            const input = document.getElementById("input-dialog-hora");
            let novaHora = input.value;
            const novaData = dataOriginal;

            if(horaNoFuturo(novaData, novaHora)) {
                novaHora = getCurrentHour();
                dialogHora.textContent = "Hora: " + novaHora;
                showAlert("Hora no futuro! Voltando para a hora atual.", "error");
                passado = false;
            } else if (novaHora.length === 8 && horaValida(novaHora) && !horaNoFuturo(novaData, novaHora)) {
                horaOriginal = novaHora;
                dialogHora.textContent = "Hora: " + novaHora;
                passado = true;
            } else {
                novaHora = getCurrentHour();
                dialogHora.textContent = "Hora: " + novaHora;
                showAlert("Hora inválida! voltando para a hora atual.", "error");
                passado = false;
            }

            btnDialogEditarHora.textContent = "Editar";
            editandoHora = false;
        }
    });

    function formatarHora(hora) {
        hora = hora.replace(/\D/g, "");

        if (hora.length <= 2) {
            return hora;
        } else if (hora.length <= 4) {
            return hora.slice(0, 2) + ":" + hora.slice(2);
        } else {
            return hora.slice(0, 2) + ":" + hora.slice(2, 4) + ":" + hora.slice(4, 6);
        }
    }

    function horaValida(horaString) {
        const [hora, min, seg] = horaString.split(":");

        if (hora === undefined || min === undefined || seg === undefined) {
            return false;
        }

        if (
            isNaN(hora) || isNaN(min) || isNaN(seg) ||
            parseInt(hora) < 0 || parseInt(hora) > 23 ||
            parseInt(min) < 0 || parseInt(min) > 59 ||
            parseInt(seg) < 0 || parseInt(seg) > 59
        ) {
            return false;
        }

        return true;
    }

    function horaNoFuturo(data, hora) {

        const [dia, mes, ano] = data.split("/").map(Number);
        const [horaPart, minPart, segPart] = hora.split(":").map(Number);

        const dataInserida = new Date(ano, mes - 1, dia, horaPart, minPart, segPart);
        const dataAtual = new Date();

        return dataInserida > dataAtual;
    }
});

function geradorIdAutomatico() {
    const randomNum = Math.floor(Math.random() * 1000000000000);

    const date = new Date();
    const timeStamp = date.getTime();

    return `id-${randomNum}-${timeStamp}`;
}

//Evita que código HTML malicioso entre no sistema
function limparInput(input) {
    return input.replace(/[<>\"\'&]/g, ''); // Remove caracteres perigosos
}

function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input; // Escapa caracteres especiais como '<', '>', etc.
    return div.innerHTML;
}
