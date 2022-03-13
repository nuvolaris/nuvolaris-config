const mongo = require("mongodb");
const mongoUrl = "mongodb://localhost"

let db = undefined

async function init() {
    const client = new mongo.MongoClient(mongoUrl)
    return client.connect()
}

if (process.argv.length < 3) {
    let repl = require("repl").start();
    init().then(client => {
        db = client.db("data")
        repl.context["client"] = client
        repl.context["db"] = db
    })
} else {
    let setup = require(process.argv[2])
    init().then(async (client) => {
        db = client.db("data")
        await setup(db)
        return client  
    }).then(client => client.close())
}