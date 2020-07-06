const express = require("express")
const cors = require("cors")

const server = express()

const db = require("./database/db")

server.use(cors())
server.use(express.static("public"))

server.use(express.urlencoded({ extended: true }))

const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})


server.get("/", (req,res) => {

    db.all(`SELECT * FROM feedbacks`, function(err,rows) {
        if(err){
            return console.log(err)
        }

        console.log(rows[rows.length-1])
        return res.render("index.html", { feedbacks: rows })
    })


    
})

server.post("/savefeedback", (req,res) => {

    const query = `
        
        INSERT INTO feedbacks (
            name,
            text
        ) VALUES (?,?);

    `
    const values = [
        req.body.name,
        req.body.text
    ]

    function afterInsertData(err) {
        if(err){
            return console.log(err)
        }

        

        return res.render("hotelsresults.html", {saved: true})
    }

    db.run(query, values, afterInsertData)

})

server.get("/hoteis", (req,res) => {
    return res.render("hotel.html")
})

server.get("/voos", (req,res) => {
    return res.render("flight.html")
})

server.get("/resultadosdevoos", (req,res) => {
    return res.render("flightsresults.html")
})
server.get("/resultadosdabusca", (req,res) => {
    return res.render("hotelsresults.html")
})

server.listen(process.env.PORT || 3000)