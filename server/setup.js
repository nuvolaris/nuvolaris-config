let db = undefined

async function store(coll, id, val) {
    let key = {}
    key[id] = val[id]
    console.log(coll, val)
    await db.collection(coll).updateOne(key, { $set: val }, { upsert: true })
}

module.exports = async function (_db) {
    db = _db
    await store("struttura", "idstruttura", {
        "idstruttura": "C.D.C. FONDAZIONE POLIAMBULANZA",
        "indirizzo": "Via Leonida Bissolati 57 25124 Brescia",
        "CFamministratore": "CCCCCC11C11C111C"

    })
    await store("struttura", "idstruttura", {
        "idstruttura": "IRCCS SAN RAFFAELE",
        "indirizzo": "Via Olgettina 60 20132 Milano ",
        "CFamministratore": "CCCCCC11C11C111C",

    })
    await store("ambulatorio", "idambulatorio", {
        "idambulatorio": "Ambulatorio stomizzati 1",
        "idstruttura":"C.D.C. FONDAZIONE POLIAMBULANZA",
        "indirizzo": " ",
        "idstanza": "Scala E, IV piano vicino segreteria della Ginecologia"
    })
    await store("ambulatorio", "idambulatorio", {
        "idambulatorio": "Ambulatorio stomizzati 2",
        "idstruttura":"IRCCS SAN RAFFAELE",
        "indirizzo": " ",
        "idstanza": "Sett B piano terreno"
    })
    await store("ambulatorio", "idambulatorio", {
        "idambulatorio": "Ambulatorio stomizzati urologia",
        "idstruttura":"IRCCS SAN RAFFAELE",
        "indirizzo": " ",
        "idstanza": "Settore Q piano terreno"
    })
    await store("anagrafica", "CF", {
        "ruolo": "Amministratore",
        "CF": "CCCCCC11C11C111C",
        "nome": "Mario",
        "cognome": "Rossi",
        "indirizzo": "Via Roma  1 100 Roma",
        "cellulare": "3381234567",
        "email": "dev@openmed.cloud",
        "password": "openmed",
        "idstruttura": "IRCCS SAN RAFFAELE"
    })
    await store("anagrafica", "CF", {
        "ruolo": "Amministratore",
        "CF": "CCCCCC11C11C111F",
        "nome": "Giuseppe",
        "cognome": "Verdi",
        "indirizzo": "Via Milano  1 12100 Milano",
        "cellulare": "3387654321",
        "email": "nicola.caione@gmail.com",
        "password": "openmed",
        "idstruttura": "C.D.C. FONDAZIONE POLIAMBULANZA"
    })
}