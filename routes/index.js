//Preparando o ambiente
const express = require('express')
const router = express.Router()

//Aqui serão configuradas todas as rotas acessadas pelo index
router.get('/', (req,res) => {
    res.render("index")
})


//É necessário exportar o router pra ser usado no server.js
module.exports = router