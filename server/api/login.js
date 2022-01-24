//const config = require("../config.js")

function generateRandomString(iLen) {
    var sRnd = '';
    var sChrs = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    for (var i = 0; i < iLen; i++) {
        var randomPoz = Math.floor(Math.random() * sChrs.length);
        sRnd += sChrs.substring(randomPoz, randomPoz + 1);
    }
    return sRnd;
}

module.exports = function (app, db) {



    // Get a login
    app.get("/api/login/:email/:password", async (req, res) => {
        console.log("get /api/logins", req.params)

        let email = req.params.email;
        let password = req.params.password;
        let isUser = await db.collection("user").findOne({ "email": email }, { "password": password })
        res.send(isUser)
    })

    // Create a new login

    app.post("/api/login", async (req, res) => {
        console.log("post /api/login ", req.body)
        let out = await db.collection("user").findOne({ "email": req.body.email, "password": req.body.password })
        if (out != null) {
            let token = generateRandomString(10);
            let name = out.name + " " + out.surname;
            let loggedEmail = out.email;
            let loggedId=out._id;
            let loggedRole=out.role;
            res.send({ token, name, loggedEmail, loggedId, loggedRole })
            

        }
        else res.send({ error: "User not found" })
        // res.send(out)
    })

    // Update a login
    app.put("/api/login", async (req, res) => {
        //let out = {"ok": true, "count": 1}
        let data = req.body
        console.log("put /api/login", data)
        let id = data._id
        delete data._id
        let upd = { "$set": data }
        let out = await db.collection("user").updateOne({ "CF": data.CF }, upd)
        res.send(out)
    })

    // Delete a login
    app.delete("/api/login", async (req, res) => {
        //let out = {"ok": true, "count": 1}
        let data = req.body
        console.log(data)
        let out = await db.collection("user").deleteOne({ email: data.email })
        res.send(out)
    })
}
