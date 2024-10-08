const btnEditarData = document.getElementById("btn-dialog-editar-data");
btnEditarData.addEventListener("click", () => {
    if (!document.getElementById("input-data")) {
        const dataAtual = dialogData.textContent.split(" ")[0]; // Assume que a data está antes da hora

        const inputData = document.createElement("input");
        inputData.type = "date";
        inputData.id = "input-data";
        inputData.value = dataAtual;

        dialogData.textContent = '';
        dialogData.appendChild(inputData);

        inputData.addEventListener("change", () => {
            const novaData = inputData.value;
            dialogData.textContent = novaData; // Atualiza apenas a data
            inputData.remove(); // Remove o input após a seleção
        });

        inputData.focus();
    }
});
const btnEditarHora = document.getElementById("btn-dialog-editar-hora");