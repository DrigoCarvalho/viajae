const sqlite3 = require("sqlite3").verbose()

const db = new sqlite3.Database("./src/database/database.db")

module.exports = db

/*db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS feedbacks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            text TEXT
        );
    `)

    const query = `
        
        INSERT INTO feedbacks (
            name,
            text
        ) VALUES (?,?);

    `
    const values = [
        "esio",
        "muito bom"
    ]

    function afterInsertData(err) {
        if(err){
            return console.log(err)
        }

        console.log("ok")
        console.log(this)
    }

    //db.run(query, values, afterInsertData)

    db.all(`SELECT * FROM feedbacks`, function(err,rows) {
        if(err){
            return console.log(err)
        }

        console.log(rows)
    })




}) */