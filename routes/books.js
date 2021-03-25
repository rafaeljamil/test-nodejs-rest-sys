//Preparando o ambiente
const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path') //Lib do express pra definir caminhos
const author = require('../models/author')
const Book = require('../models/book')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'] //Um array de tipos MIME pra ser usado como filtro no multer


//Aqui serão configuradas todas as rotas acessadas pelo books
//Com MongoDB a melhor prática é usar asyinc/await pra pegar/colocar informação no BD
//Com async/await é utilizado try pra executar o código e catch pra pegar erros caso ocorram

//Pegar todos os books
router.get('/', async (req,res) => {
    //Queries das buscas dos livros
    let query = Book.find()
    if(req.query.title != null && req.query.title != ''){
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if(req.query.publishedBefore != null && req.query.publishedBefore != ''){
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    if(req.query.publishedAfter != null && req.query.publishedAfter != ''){
        query = query.lte('publishDate', req.query.publishedAfter)
    }
    //Mostra os livros que batem com a busca
    try{
        const books = await query.exec()
        res.render("books/index", {
            books: books,
            busca: req.query
        })
    }catch{
        res.redirect('/')
    }
})

//Rota novo livro
router.get('/new', async (req,res) => {
    renderNewPage(res, new Book())
})

//Adicionar livros
//O form em books/new redireciona pra esta rota. Por aqui o novo livro é salvo no BD
router.post('/', async (req,res) => {
    let book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description
    })
    saveCover(book, req.body.cover)
    //console.log(JSON.parse(req.body.cover))
    try{
        const newBook = await book.save()
        // res.redirect(`books/${newBook.id}`)
        res.redirect('books')
    }catch(err){
        console.log(err)
        renderNewPage(res, book, true)
        //console.log(error)
    }
})

//Rota que mostra o livro
router.get('/:id', async (req,res) => {
    try{
        const book = await Book.findById(req.params.id).populate('author').exec()
        res.render('books/show', {book: book})
    }catch{
        res.redirect('/')
    }
})

//Rota que edita o livro
router.get('/:id/edit', async (req,res) => {
    try{
        const book = await Book.findById(req.params.id)
        renderEditPage(res, book)
    }catch{
        res.redirect('/')
    }
})

//Rota de atualizar livro
router.put('/:id', async (req,res) => {
    let book 
    try{
        book = await Book.findById(req.params.id)
        book.title = req.body.title
        book.author = req.body.author
        book.publishDate = new Date(req.body.publishDate)
        book.pageCount = req.body.pageCount
        book.description = req.body.description
        if(req.body.cover != null  && req.body.cover !== ''){
            saveCover(book, req.body.cover)
        }
        await book.save()
        res.redirect(`/books/${book.id}`)
    }catch{
        if(book != null){
            renderEditPage(res, book, true)
        }else{
            res.redirect('/')
        }
        
    }
})

//Rota pra apagar livros
router.delete('/:id', async (req,res) => {
    let book
    try{
        book = await Book.findById(req.params.id)
        await book.remove()
        res.redirect('/books')
    }catch{
        if(book != null){
            res.render('books/show', {
                book:book,
                errorMessage: 'Impossível remover livro'
            })  
        }else{
            res.redirect('/')
        }
    }
})

async function renderNewPage(res, book, hasError = false){
    renderFormPage(res, book, 'new', hasError)
}

async function renderEditPage(res, book, hasError = false){
    renderFormPage(res, book, 'edit', hasError)
}

async function renderFormPage(res, book, form, hasError = false){
    try{
        const authors = await author.find({}) //passando o find com objeto vazio retorna todas as entradas do BD
        const params = {  //Parâmetros passados para a página renderizada
            authors: authors,
            book: book
        }
        if (hasError){
            if(form === 'edit'){
                params.errorMessage = 'Erro ao atualizar livro.'
            }else{
                params.errorMessage = 'Erro ao criar livro.' //Se encontrar erro cria o parâmetro errorMessage
            }
        } 
        res.render(`books/${form}`, params) //Renderiza a página de novos livros passando todos os autores e o novo livro vazio
    }catch{
        res.redirect('/books')
    }
}

async function saveCover(book, coverEncoded){
    if(coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if(cover != null && imageMimeTypes.includes(cover.type)){
        book.coverImage = new Buffer.from(cover.data, 'base64')
        book.coverImageType = cover.type
    }
}

//É necessário exportar o router pra ser usado no server.js
module.exports = router