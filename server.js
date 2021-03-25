// Configurando variáveis de ambiente de produção
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

//Dependências
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const methodOverride = require('method-override') // O method override amplia os métodos de formulários do navegador de GET e POST pra GET, POST, PUT e DELETE

//Criando a variável que usa o Express
const app = express()

//Rotas
const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')
const bookRouter = require('./routes/books')

//Conectando ao banco de dados MongoDB
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser:true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log("Conectado com Mongoose. Banco: sempas"))

//Configurações do servidor
app.set('view engine', 'ejs') //Motor ejs renderiza as páginas do site
app.set('views', __dirname + '/views') //Aponta pra onde estão as páginas
app.set('layout', 'layouts/layout') 
app.use(methodOverride('_method')) //O method override será usado ao incluir o parâmetro '_method' na action do form
app.use(expressLayouts) //Diz ao servidor pra usar a a dependência de layouts
app.use(express.static('public')) //Configura uma pasta estática pra usar CSS e outras coisas
app.use(express.urlencoded({ extended: false }))

//Configura home pra usar a rota index
app.use('/', indexRouter)
//Configura home pra usar a rota authors
app.use('/authors', authorRouter)
app.use('/books', bookRouter)

//O process.env.PORT é a porta usada pelo servidor online, se não existir a porta local é usada
app.listen(process.env.PORT || '3000', function(){
    console.log("Servidor conectado. Porta: 3000.")
})