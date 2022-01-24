module.exports = function(app, db) {

    let ObjectId = require('mongodb').ObjectId;

    // Get all users
    app.get("/api/users/", async(req, res) => {
        let data = await db.collection("user").find().toArray()
        //console.log("get /api/users", data)
        res.send(data) 
    })

    // Get a single user
    app.get("/api/user/:id", async(req, res) => {
        console.log("get /api/user", req.params.id)
        //let out = { "id": "michele", "email": "michele@example.com" }
        let _id = new ObjectId(req.params.id)
        let data = await db.collection("users").findOne( {_id: _id })
        console.log(data)
        res.send(data)
    })

    //let _id = "6199136ae3c68ef5bb529760"

    // Create a new user
    
    app.post("/api/user", async(req, res) => {
        console.log("post /api/user ", req.body)
        let ctrl = await db.collection("user").find({ "email": req.body.email })
        //console.log("answer user",ctrl)
        if (ctrl.data != null) {
            res.send({ error: "Email must be unique" })
        }
        else {
            let nmout = await db.collection("namespace").insertOne ({"email":req.body.email,"namespace":req.body.namespace})
            let out = await db.collection("user").insertOne({"role":req.body.role,"name":req.body.name,"surname":req.body.surname,"address":req.body.address,"phone":req.body.phone,"email":req.body.email,"password":req.body.password})
            res.send(out)
        }
        
       
    })

    // Update a user
    app.put("/api/user", async(req, res)  => {
        let data = req.body
        let _id = new ObjectId(data._id)
        delete data._id
        console.log("put /api/user ", data)
        let out = await db.collection("users").replaceOne({_id:_id},data)
        res.send(out)
    })


    // Delete a user
    app.delete("/api/user", async(req, res) => {   
        //let out = {"ok": true, "count": 1}
        let data = req.body
        let _id = new ObjectId(data._id)
        console.log(data)
        let out = await db.collection("users").deleteOne( { _id: _id } )
        res.send(out)
    }) 
}
