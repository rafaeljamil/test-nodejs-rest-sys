//Models são para o MongoDB o que tabelas são para o MySQL
//Mongoose é a dependência que realiza os comandos no MongoDB
const mongoose = require('mongoose')

//A 'tabela' (schema) é passada como um objeto
const authorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

//Ao exportar o schema damos acesso para outros scripts poderem usar esse modelo
//O nome da 'tabela' é passado como parâmetro ao exportar o modelo, e ela é criada quando for usada.
module.exports = mongoose.model("Author", authorSchema)