/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */
const fs = require('fs')
const path = require("path")
const express = require('express')
const cors = require('cors')
const mongo = require("mongodb");

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

const mongoUrl =  "mongodb://localhost"
const client =  new mongo.MongoClient(mongoUrl)
client.connect()
const db = client.db("data")

// add here your apis
require("./hello")(app, db)
require("./api/login")(app, db)
require("./api/user")(app, db)
// end

let server = require("http").createServer({}, app);
server.listen(port, "0.0.0.0", () => {
    console.log(`Development server listening at http://localhost:${port}`)
});
