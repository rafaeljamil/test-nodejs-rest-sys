//Preparando o ambiente
const express = require('express')
const router = express.Router()
const Author = require('../models/author')

//Aqui serão configuradas todas as rotas acessadas pelo authors
//Com MongoDB a melhor prática é usar asyinc/await pra pegar/colocar informação no BD
//Com async/await é utilizado try pra executar o código e catch pra pegar erros caso ocorram

//Pegar todos os autores
router.get('/', async (req,res) => {
    //Função de busca de autores. RegExp busca o query como parte do nome. Se buscar por Jo vai retornar John, Joshua, Johnatha, José. A flag 'i' diz que não tem distinção de caps.
    let busca = {}
    if (req.query.name != null && req.query.name !== ''){
        busca.name = new RegExp(req.query.name, 'i')
    }
    //Função assíncrona que busca os autores 
    try{
        const authors = await Author.find(busca)
        res.render("authors/index", {authors: authors, busca: req.query})
    }catch{
        res.redirect('/')
    }
})

//Rota novo autor
router.get('/new', (req,res) => {
    res.render('authors/new', {author: new Author()}) //Cria um objeto author e passa ele como variável ao ejs. Não salva no BD
})

//Adicionar autores
//O form em authors/new redireciona pra esta rota. Por aqui o novo autor é salvo no BD
router.post('/', async (req,res) => {
    const author = new Author({ //Inicia o construtor do novo autor e salva na variável o nome dado na página
        name: req.body.name
    })

    try{
        const newAuthor = await author.save()
        //res.redirect(`authors/${newAuthor.id}`)
        res.redirect(`authors`)
    }catch{
        res.render('authors/new', {
            author: author,
            errorMessage: 'Houve um erro ao criar autor...'   
        })
    }
})

//É necessário exportar o router pra ser usado no server.js
module.exports = router