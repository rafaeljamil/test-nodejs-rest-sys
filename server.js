// Configurando variáveis de ambiente de produção
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

//Dependências
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')

//Criando a variável que usa o Express
const app = express()

//Rotas
const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')

//Conectando ao banco de dados MongoDB
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser:true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log("Conectado com Mongoose. Banco: sempas"))

//Configurações do servidor
app.set('view engine', 'ejs') //Motor ejs renderiza as páginas do site
app.set('views', __dirname + '/views') //Aponta pra onde estão as páginas
app.set('layout', 'layouts/layout') 
app.use(expressLayouts) //Diz ao servidor pra usar a a dependência de layouts
app.use(express.static('public')) //Configura uma pasta estática pra usar CSS e outras coisas
app.use(express.urlencoded({limit: '10mb', extended: false}))

//Configura home pra usar a rota index
app.use('/', indexRouter)
app.use('/authors', authorRouter)

//O process.env.PORT é a porta usada pelo servidor online, se não existir a porta local é usada
app.listen(process.env.PORT || '3000', function(){
    console.log("Servidor conectado. Porta: 3000.")
})