import showAlert from './alert.js';

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

function lerArquivo(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            resolve(null);
            return;
        }

        const reader = new FileReader();
        
        reader.onload = (event) => {
            resolve(event.target.result);
        };

        reader.onerror = () => {
            reject(new Error("Erro ao ler o arquivo."));
        };

        reader.readAsText(file);
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
btnBaterPonto.addEventListener("click", function() {
    dialogPonto.showModal();
    let lastRegisterText = "Último registro: " + localStorage.getItem("lastDateRegister") + " - " + localStorage.getItem("lastTimeRegister") + " | " + localStorage.getItem("lastTypeRegister");
    document.getElementById("dialog-last-register").textContent = lastRegisterText;
});

let registerLocalStorage = getRegisterLocalStorage();

const btnDialogBaterPonto = document.getElementById("btn-dialog-bater-ponto");
btnDialogBaterPonto.addEventListener("click", async () => {
    try {

        const observacaoPonto = document.getElementById("observacao").value;
        const arquivoPonto = document.getElementById("anexo").files[0];
        
        const typeRegisterElement = document.getElementById("tipos-ponto");
        let selectedType = typeRegisterElement.value;
        const location = await getUserLocation();
        
        const arquivoConteudo = await lerArquivo(arquivoPonto);

        let ponto = {
            "data": getCurrentDate(),
            "hora": getCurrentHour(),
            "localizacao": {
                "latitude": location.lat,
                "longitude": location.long
            },
            "id": 1,
            "tipo": selectedType,
            "observação": observacaoPonto,
            "arquivo": arquivoConteudo
        }
        
        console.log(ponto);
        
        saveRegisterLocalStorage(ponto);
        localStorage.setItem("lastTypeRegister", selectedType);
        localStorage.setItem("lastDateRegister", ponto.data);
        localStorage.setItem("lastTimeRegister", ponto.hora);
        
        printCurrentHour();
        
        dialogPonto.close();
        
        showAlert('Registro de ponto realizado com sucesso!', 'success');
    } catch (error) {
        showAlert('Erro em registrar ponto.', 'error');
    }
        
    })
    
function saveRegisterLocalStorage(register) {
    registerLocalStorage.push(register)
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
});

function getCurrentWeekDay() {
    const date = new Date();

    let diaDaSemana = new Map ([
        [0, "Domingo"],
        [1, "Segunda-Feira"],
        [2, "Terça-Feira"],
        [3, "Quarta-Feira"],
        [4, "Quinta-Feira"],
        [5, "Sexta-Feira"],
        [6, "Sábado"]
    ])

    const currentDay = date.getDay();

    return diaDaSemana.get(currentDay);
}

function getCurrentHour() {
    const locale = navigator.language;
    const date = new Date();

    const options = {hour: '2-digit', minute: '2-digit', second: '2-digit'};

    return date.toLocaleTimeString(locale, options);
}

function printCurrentHour() {
    horaMinSeg.textContent = getCurrentHour();
    dialogHora.textContent = "Hora: " + getCurrentHour();
    dialogData.textContent = "Data: " + getCurrentDate();
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
setInterval(printCurrentHour, 1000);    //repete a função a cada segundo
