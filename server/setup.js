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
let db = undefined

async function store(coll, id, val) {
    let key = {}
    key[id] = val[id]
    console.log(coll, val)
    await db.collection(coll).updateOne(key, { $set: val }, { upsert: true })
}

module.exports = async function (_db) {
    db = _db
    await store("user", "email", {
        "role": 'Administrator',
        "name": 'Michele',
        "surname": 'Sciabarra',
        "address": 'via Terracini 28',
        "phone": '3926197994',
        "email": 'michele@sciabarra.com',
        "password": 'nuvola'
        
    })
    await store("user", "email", {
        "role": 'Administrator',
        "name": 'Mirella',
        "surname": 'Di Girolamo',
        "address": 'via Terracini 28',
        "phone": '3286480094',
        "email": 'mirella@sciabarra.com',
        "password": 'nuvola'
    })
    await store("user", "email", {
        "role": 'User',
        "name": 'Marco',
        "surname": 'Solo',
        "address": '',
        "phone": '',
        "email": 'info@sciabarra.com',
        "password": 'nuvola'
    })
    await store("namespace", "namespace", {
        "email": "info@sciabarra.com",
        "namespace": "alfabetagamma",
    })
    await store("namespace", "namespace", {
        "email": "info@sciabarra.com",
        "namespace": "deltaxiomicrom",
    })
    await store("namespace", "namespace", {
        "email": "mirella@sciabarra.com",
        "namespace": "namespacebase",
    })
    await store("namespace", "namespace", {
        "email": "michele@sciabarra.com",
        "namespace": "namespacealfa",
    })

}
