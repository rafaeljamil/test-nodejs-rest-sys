//Models são collections para o MongoDB, equivalente às tabelas do MySQL
//Mongoose é a dependência que realiza os comandos no MongoDB
const mongoose = require('mongoose')


//A 'tabela' (schema) é passada como um objeto
const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    publishDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now //Pega como padrão a data da criação da entrada no BD
    },
    coverImage: {
        type: Buffer,
        required: true
    },
    coverImageType: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, //Referencia outra coleção (tabela no MySQL) pra poder pegar os dados
        required: true,
        ref: 'Author' // A referência é o nome dado à coleção.
    }
})

bookSchema.virtual('coverImagePath').get(function(){
    if(this.coverImage != null && this.coverImageType != null){
        return `data: ${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
})

//Ao exportar o schema damos acesso para outros scripts poderem usar esse modelo
//O nome da 'tabela' é passado como parâmetro ao exportar o modelo, e ela é criada quando for usada.
module.exports = mongoose.model("Book", bookSchema)