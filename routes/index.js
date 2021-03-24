//Preparando o ambiente
const express = require('express')
const router = express.Router()
const Book = require('../models/book')

//Aqui serão configuradas todas as rotas acessadas pelo index
router.get('/', async (req,res) => {
    let books
    try{
        books = await Book.find().sort({ createAt: 'desc '}).limit(10).exec()
    }catch{
        books = []
    }
    res.render("index", {books: books})
})


//É necessário exportar o router pra ser usado no server.js
module.exports = router