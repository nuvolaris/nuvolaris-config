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