const mongo = require("mongodb");
const mongoUrl = "mongodb://localhost"

async function init() {
    const client = new mongo.MongoClient(mongoUrl)
    return client.connect()
}

if (process.argv.length < 3) {
    let repl = require("repl").start();
    init().then(client => { 
        repl.context["client"] = client
        repl.context["db"] = client.db()
    })
} else {
    let setup = require(process.argv[2])
    init().then(async (client) => {
        await setup(client.db())
        return client  
    }).then(client => client.close())
}