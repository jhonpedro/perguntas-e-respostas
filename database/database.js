const Sequilize = require('sequelize')

const connection = new Sequilize('pergunta_respostas', 'root', '0262',{
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection