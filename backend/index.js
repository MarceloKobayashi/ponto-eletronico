const express = require('express');
const app = express();
const PORT = 3000;
const cors = require('cors');

const usuarioRotas = require('./routes/usuario');
const pontoRotas = require('./routes/ponto');

//Importando o módulo
const sequelize = require('./config/db');
const Usuario = require('./models/usuario');
const Ponto = require('./models/ponto');

app.use(cors({ origin: 'http://127.0.0.1:5500' }));

/*Testando a conexão
sequelize.authenticate()
            .then(() => {   //authenticate é assíncrono, por isso a listen ocorre antes
                console.log("Conexão sucesso!");
            }).catch(error => {
                console.log("Erro!");
            });
*/

//Atualiza as colunas
sequelize.sync({ alter: true }) //Se houver divergência entre modelo e tabela, reconstroi a tabela e mantem os dados
        .then(() => {
            console.log("BD sincronizado.");
        }).catch(error => {
            console.log("Erro!");
        });

Usuario.hasMany(Ponto, {
    foreignKey: "id_usuario"
});

Ponto.belongsTo(Usuario, {
    foreignKey: "id_usuario"
});

app.use(express.json());
app.use('/', usuarioRotas);
app.use('/', pontoRotas);


app.listen(PORT, () => {
    console.log("Servidor aguardando requisições.");
});
