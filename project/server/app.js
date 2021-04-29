//import {getPortfolioInfo} from '/project/server/database/connection.js'

//const getPortfolioInfo = require('../../project/server/database/connection.js')
const dB = require('../../project/server/database/connection.js')
const express = require('express') // node´s own import system
const cors = require('cors')
const app = express()
const port = 3001

async function getPortfolioInfo(manager) {
    const {Pool,Client} = require('pg')
    const connectionString = 'postgressql://postgres:postgres@localhost:5432/eniacdb'
    const client = new Client({
    connectionString:connectionString
    })
    await client.connect()
    const res = await client.query('SELECT * FROM PortfolioInfo WHERE manager = $1', [manager])
    await client.end()
    //console.log(res);
    return res
}


app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get("/home", (req, res) => {
    res.send({
        hello:'noob'
    })
})

app.get("/grid-data", (req, res) => {
    res.send({

    })
})

app.get("/dBInit", async (req, res) => {
    const pi = await getPortfolioInfo("Alex")
    //console.log(pi)
    res.send(pi.rows
        //dB.getPI("Alex")
        //jQuery.getscript("../../project/server/database/connection.js",getPortfolioInfo("Alex"))
    )
})

//https://stackoverflow.com/questions/25962958/calling-a-javascript-function-in-another-js-file

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

