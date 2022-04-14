module.exports = function(app, db) {

    let ObjectId = require('mongodb').ObjectId;

    // Get all users
    app.get("/api/users/", async(req, res) => {
        let data = await db.collection("user").find().toArray()
        //console.log("get /api/users", data)
        res.send(data) 
    })

    // Get a single user
    app.get("/api/user/:email", async(req, res) => {
        console.log("get /api/user", req.params.email)
        //let out = { "id": "michele", "email": "michele@example.com" }
       
        let data = await db.collection("user").findOne( {"email":req.params.email })
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
    app.put("/api/user/:email", async(req, res)  => {
        let dt = req.body
        //data._id =new ObjectId(data, _id)
        delete dt._id
        console.log("put /api/user ", dt)
        let out = await db.collection("user").replaceOne({"email":req.params.email},dt)
        res.send(out)
    })


    // Delete a user
    app.del("/api/user", async(req, res) => {   
        //let out = {"ok": true, "count": 1}
        let data = req.body
        console.log(data)
        let outus = await db.collection("user").deleteOne( { "email": req.body.email } )
        let outns = await db.collection("namespace").deleteMany({"email":req.body.email})
       
        res.send(outns)
    }) 
}
