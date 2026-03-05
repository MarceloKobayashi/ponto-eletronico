const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');


//ROTAS: router.[Method]([Path], [Handler])
router.get('/usuarios', async (req, res) => {
    //Retorna todos os usuários
    try {
        const usuarios = await Usuario.findAll();
        res.json(usuarios);
    } catch (error) {
        console.log("Erro ao exibir usuários: ", usuarios);
    }
});

router.get('/usuario/:id', async (req, res) => {
    const usuario_id = req.params.id;
    
    const usuario = await Usuario.findAll({
        where: {
            id_usuario: usuario_id,
        },
    });
    
    if (usuario.length === 0) {
        return res.status(404).json({ message: "Usuário não encontrado." });
    }
    
    res.json(usuario);
});

router.post('/usuario', async (req, res) => {
    const dados = req.body;

    const usuario = await Usuario.create(
        {
            nome: dados.nome,
            login: dados.login,
            email: dados.email,
            senha: dados.senha,
            permissao: dados.permissao,
        },
    )

    res.status(201).json(usuario);
});

router.delete('/usuario/:id', async (req, res) => {
    const id_usuario = req.params.id;

    const usuario = await Usuario.findByPk(id_usuario);

    if (!usuario) {
        return
    }

    await usuario.destroy();
    res.status(204).json({ message: "Usuário deletado com sucesso!" });
});

router.put('/usuario/:id', async (req, res) => {
    const { nome, email, login, senha, permissao } = req.body;
    const id_usuario = req.params.id;
    const usuario = await Usuario.findByPk(id_usuario);

    if (!usuario) {
        return
    }

    await usuario.update({nome, email, login, senha, permissao});

    res.status(200).json({ message: "Usuário editado com sucesso!" });
});

module.exports = router;
