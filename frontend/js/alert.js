const divAlertaRegistroPonto = document.getElementById("alerta-registro-ponto");
const alertaMensagem = document.getElementById("alerta-mensagem");
const btnFecharAlerta = document.getElementById("btn-fechar-alerta");

export default function showAlert(mensagem, tipo = 'success') {
    alertaMensagem.textContent = mensagem;

    divAlertaRegistroPonto.classList.remove("success", "error");
    divAlertaRegistroPonto.classList.add(tipo);

    divAlertaRegistroPonto.classList.remove("hidden");
    divAlertaRegistroPonto.classList.add("show");

    const alertaTimeout = setTimeout(() => {
        hideAlert();
    }, 3000);

    btnFecharAlerta.addEventListener("click", () => {
        clearTimeout(alertaTimeout);
        hideAlert();
    });
}

function hideAlert() {
    divAlertaRegistroPonto.classList.remove("show");
    divAlertaRegistroPonto.classList.add("hidden");
}