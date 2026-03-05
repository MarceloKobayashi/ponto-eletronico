const express = require('express');
const router = express.Router();
const Ponto = require('../models/ponto');

router.get('/pontos', async (req, res) => {
    const pontos = await Ponto.findAll();

    res.status(200).json(pontos);
});

router.post('/ponto', async (req, res) => {
    const ponto = await Ponto.create({
        tipo: req.body.tipo,
        dataHora: req.body.dataHora,
        id_usuario: req.body.id_usuario
    });

    res.status(201).json(ponto);
});

router.put('/ponto/:id', async (req, res) => {
    const ponto = await Ponto.findByPk(req.params.id);

    const pontoAtualizado = await ponto.update({
        tipo: req.body.tipo,
        dataHora: req.body.dataHora
    });

    res.status(200).json(pontoAtualizado);
});

router.delete('/ponto/:id', async (req, res) => {
    const ponto = await Ponto.findByPk(req.params.id);

    ponto.destroy();

    res.status(204).send(`Ponto com id ${req.params.id} deletado com sucesso.`);
});

router.get('/pontos/usuario/:id_usuario', async (req, res) => {
    const pontos = await Ponto.findAll({
        where: {
            id_usuario: req.params.id_usuario
        }
    });

    res.status(200).json(pontos);
});

module.exports = router;
