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
});

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
}

function getCurrentDate() {
    const locale = navigator.language;
    
    const date = new Date();
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };

    return date.toLocaleDateString(locale, options);
}

diaSemana.textContent = getCurrentWeekDay();
diaMesAno.textContent = getCurrentDate();


setInterval(printCurrentHour, 1000);    //repete a função a cada segundo
