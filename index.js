const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const connection = require('./database/database.js')
const Pergunta = require('./database/Pergunta.js')
const Resposta = require('./database/Resposta.js')


connection.
    authenticate()
    .then(() => {
        console.log("Conexão com o banco com sucesso")
    })
    .catch((msgErro) => {
        console.log(msgErro)
    })

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.get("/",(req,res) => {
    Pergunta.findAll({raw: true, order: [
        ['id','DESC']
    ]}).then( perguntas =>{
        res.render("index",{
            nome_pag: "Perguntas e respostas",
            pergunta: perguntas
        })
    })

})

app.get("/perguntar", (req, res) => {
    res.render("perguntar",{
        nome_pag: "Perguntar"
    })
})

app.post("/salvarpergunta",(req, res) => {
    let titulo = req.body.titulo
    let descricao = req.body.descricao

    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/")
    })
})

app.get("/pergunta/:id", (req, res) => {
    let id = req.params.id

    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined){
            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                raw: true,
                order: [['id', 'DESC']]
            }).then(respostas => {
                res.render("pergunta",{
                    nome_pag: "Pergunta " + id,
                    pergunta: pergunta,
                    respostas: respostas
                })
            })
        }else{
            res.redirect("/")
        }
    })
})

app.post("/responder",(req, res) => {
    let corpo = req.body.corpo
    let perguntaId = req.body.pergunta
    
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(()=>{
        res.redirect("/pergunta/" + perguntaId)
    })
})

app.listen(3333, (erro)=>{
    if(erro){
        console.log(erro)
    }else{
        console.log("App rodando")
    }
})