//Models são collections para o MongoDB, equivalente às tabelas do MySQL
//Mongoose é a dependência que realiza os comandos no MongoDB
const mongoose = require('mongoose')
const Book = require('./book')

//A 'tabela' (schema) é passada como um objeto
const authorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

authorSchema.pre('remove', function(next){
    Book.find({author: this.id}, (err, books) => {
        if(err){
            next(err)
        }else if(books.length > 0){
            next(new Error('Este autor tem livros...'))
        }else{
            next()
        }
    })
})

//Ao exportar o schema damos acesso para outros scripts poderem usar esse modelo
//O nome da 'tabela' é passado como parâmetro ao exportar o modelo, e ela é criada quando for usada.
module.exports = mongoose.model("Author", authorSchema)