//Aqui serão configuradas todas as rotas acessadas pelo index
const express = require('express')
const router = express.Router()

router.get('/', (req,res) => {
    res.render("index")
})


//É necessário exportar o router pra ser usado no server.js
module.exports = router