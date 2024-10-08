function renderList() {
    registers = JSON.parse(localStorage.getItem("register"));

    const containerRegisters = document.getElementById("registros-relatorio");

    registers.forEach(register => {
        console.log(register);

        const divRegistro = document.createElement("div");

        divRegistro.innerHTML = `<p>${register.data}</p>`;

        //data x date

        containerRegisters.appendChild(divRegistro);
    })
}

renderList();