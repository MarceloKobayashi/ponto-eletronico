const diaSemana = document.getElementById("dia-semana");
const diaMesAno = document.getElementById("dia-mes-ano");
const horaMinSeg = document.getElementById("hora-min-seg");

const btnBaterPonto = document.getElementById("btn-bater-ponto");
btnBaterPonto.addEventListener("click", register);

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
    //padStart
    //considerar formatos diferentes formatos
    
    const date = new Date();

    let hora = date.getHours().toString().padStart(2, "0");
    let min = date.getMinutes().toString().padStart(2, "0");
    let sec = date.getSeconds().toString().padStart(2, "0");

    return `${hora}:${min}:${sec}`;
}

function printCurrentHour() {
    horaMinSeg.textContent = getCurrentHour();
}

function getCurrentDate() {
    //considerar o locale
    const date = new Date();
    
    const dia = date.getDate().toString().padStart(2, "0");
    const mes = (date.getMonth() + 1).toString().padStart(2, "0");
    
    return `${dia}/${mes}/${date.getFullYear()}`;
}

diaSemana.textContent = getCurrentWeekDay();
diaMesAno.textContent = getCurrentDate();

function register() {   //abrir dialog com no minimo 
    
    alert("Bater ponto.");
}

setInterval(printCurrentHour, 1000);    //repete a função a cada segundo
