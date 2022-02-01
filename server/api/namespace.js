module.exports = function (app, db) {

    let ObjectId = require('mongodb').ObjectId;

    // Get all users
    app.get("/api/user/", async (req, res) => {
        let data = await db.collection("user").find().toArray()
        //console.log("get /api/users", data)
        res.send(data)
    })

    // Get a single user
    app.get("/api/user/:id", async (req, res) => {
        console.log("get /api/user", req.params.id)
        //let out = { "id": "michele", "email": "michele@example.com" }
        let _id = new ObjectId(req.params.id)
        let data = await db.collection("users").findOne({ _id: _id })
        console.log(data)
        res.send(data)
    })

    //let _id = "6199136ae3c68ef5bb529760"

    // Create a new namascpace

    app.post("/api/namespace", async (req, res) => {
        console.log("post /api/namespace ", req.body)
        /*Control if namespace is unique */
        let ctrl = await db.collection("namespace").find({ "namespace": req.params.namespace })
        if (ctrl.data != null) {
            res.send({ error: "Namespace must be unique" })
        }
        else {
            let out = await db.collection("namespace").insertOne(req.body)
            res.send(out)
        }

    })

    // Update a namespace
    app.put("/api/namespace", async (req, res) => {
        let data = req.body
        let _id = new ObjectId(data._id)
        delete data._id
        console.log("put /api/namespace ", data)
        let out = await db.collection("namespace").replaceOne({ _id: _id }, data)
        res.send(out)
    })


    // Delete a namespace
    app.delete("/api/namespace/:role", async (req, res) => {
        //let out = {"ok": true, "count": 1}
        let data = req.body
        let rl = req.params.role;
        let out;
        if (rl=="Administrator"){
            out = await db.collection("namespace").deleteOne({ "namespace":req.body.namespace })
        }
        else {out = await db.collection("namespace").deleteOne({ "email":req.body.email,"namespace":req.body.namespace })}
        console.log(data)
        
        res.send(out)
    })
}
