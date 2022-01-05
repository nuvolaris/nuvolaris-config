const fs = require('fs')
const path = require("path")
const express = require('express')
const cors = require('cors')

const rootDir = path.dirname(__dirname) + "/client/public"
console.log(rootDir)
const port = 3000

const app = express()
app.use(cors());
app.use(express.json())
app.use(express.static(rootDir));

app.get('/app/*', (req, res) => {
    let file = rootDir+"/index.html"
    res.sendFile(file)
})

let hello = require("./hello")
let db = {}
hello(app, db)

let server = require("http").createServer({}, app);
server.listen(port, "0.0.0.0", () => {
    console.log(`Development server listening at http://localhost:${port}`)
});
