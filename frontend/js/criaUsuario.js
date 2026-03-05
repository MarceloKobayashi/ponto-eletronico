document.getElementById("btn-criar-usuario").addEventListener("click", async () => {

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const login = document.getElementById("login").value;   
    const senha = document.getElementById("senha").value;
    const permissao = document.getElementById("tipo").value;
    
    const response = await fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome: nome,
            email: email,
            login: login,
            senha: senha,
            permissao: permissao
        })
    })
    .then()
    .catch(error => {
        console.log(error);
    });

    console.log(response.json);

});

//belongs hasmanyusers
//pesquisar como relacionar duas tabelas 1:N
