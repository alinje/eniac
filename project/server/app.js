//import {getPortfolioInfo} from '/project/server/database/connection.js'
/*const {Pool,Client} = require('pg')
const connectionString = 'postgressql://postgres:postgres@localhost:5432/eniacdb'
const client = new Client({
connectionString:connectionString
})*/
//const getPortfolioInfo = require('../../project/server/database/connection.js')
const dB = require('../../project/server/database/connection.js')
const express = require('express') // node´s own import system
const cors = require('cors')
const app = express()
const port = 3001

// pool connection
const { Pool, Client } = require('pg')
const connectionString = 'postgressql://postgres:postgres@localhost:5432/eniacdb'




/*
const client = new Client({
    connectionString: connectionString
})*/

async function getPortfolioInfo(manager) {


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
        hello: 'noob'
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


app.get("/get-labels", async (req, res, next) => {



    db.query('SELECT * FROM Labels', (err, res) => {
        if (err) {
            return next(err)
        }
        res.send(res.rows[0])
    })


})

//https://stackoverflow.com/questions/25962958/calling-a-javascript-function-in-another-js-file

app.listen(port, () => {

    pg.connect(connectionString, function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT $1::int AS number', ['1'], function (err, result) {
            //call `done()` to release the client back to the pool
            done();

            if (err) {
                return console.error('error running query', err);
            }
            console.log(result.rows[0].number);
            //output: 1
        });
    });



    // await client.connect()
    console.log(`Example app listening at http://localhost:${port}`)
})

