//Preparando o ambiente
const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')

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
        res.redirect(`authors/${newAuthor.id}`) // Se der certo, redireciona pra página do novo autor
    }catch{
        res.render('authors/new', {
            author: author,
            errorMessage: 'Houve um erro ao criar autor...'   
        })
    }
})

router.get('/:id', async (req, res) => { // Rota que mostra detalhes do autor por id
    try{
        const author = await Author.findById(req.params.id)
        const books = await Book.find({author: author.id}).limit(6).exec()
        res.render('authors/show', {author: author, booksByAuthor: books})
    }catch{
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => { // Rota de edição do autor por id
    try{
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', {author: author}) 
    }catch{
        res.redirect('/authors')
    }
})

router.put('/:id', async (req, res) => { // Rota de edição do autor
    let author // Inicializa a variável fora do try/catch pra poder ser acessada nos dois
    try{
        const author = await Author.findById(req.params.id) // Busca o autor pelo id
        author.name = req.body.name // Atualiza o nome do autor com o nome passado no body
        await author.save() // Salva as mudanças
        res.redirect(`/authors/${author.id}`)
    }catch{
        if(author == null){
            res.redirect('/') // Se não existir autor, se houver algum erro no id, volta pra home
        }else{
            res.render('authors/new', { // Se o erro for outro, recarrega a página de novo autor com as mudanças não salvas
                author: author,
                errorMessage: 'Houve um erro ao atualizar autor...'   
            }) 
        }
    }
})

router.delete('/:id', async (req,res) => {
    let author
    try{
        author = await Author.findById(req.params.id)
        await author.remove() // Pra criar/editar autor usa o save(), pra apagar usa o remove()
        res.redirect('/authors')
    }catch{
        if(author == null){
            res.redirect('/')
        }else{
            res.redirect(`/authors/${author.id}`) // Se remover der errado, volta pra página do autor
        }
    }
})

//É necessário exportar o router pra ser usado no server.js
module.exports = router