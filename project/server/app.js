//import {getPortfolioInfo} from '/project/server/database/connection.js'
/*const {Pool,Client} = require('pg')
const connectionString = 'postgressql://postgres:postgres@localhost:5432/eniacdb'
const client = new Client({
connectionString:connectionString
})*/
//const getPortfolioInfo = require('../../project/server/database/connection.js')
const dB = require('../server/database/index.js')
const express = require('express') // node´s own import system
const cors = require('cors')
const app = express()
const bodyParser = require("body-parser");
const port = 3001
//const db = require("./database")
/*
async function getLabelSummary() {
    db.query("SELECT * FROM LabelSummary", [])
}*/

// pool connection
//const { Pool, Client } = require('pg')
//const connectionString = 'postgressql://postgres:postgres@localhost:5432/eniacdb'




/*
const client = new Client({
    connectionString: connectionString
})*/

async function getPortfolioInfo(manager) {
    const { Pool, Client } = require('pg')
    const connectionString = 'postgressql://postgres:postgres@localhost:5432/eniacdb'
    
    const client = new Client({
        connectionString: connectionString
    })

    await client.connect()
    const res = await client.query('SELECT * FROM PortfolioInfo WHERE manager = $1', [manager])
    await client.end()
    //console.log(res);
    return res
}


app.use(cors())

//Without Body Parder the req.body us undefined!!
app.use(bodyParser.json());

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

app.post('/import-portfolio-alcur', (req, res) => {
    const label = req.body;
  });

//Receives a JSON file from "editLabels.js" containing label name and adding it
app.post('/addLabels', (req, res) => {
  const label = req.body.label;
  console.log('Adding label', label);
  dB.query("INSERT INTO Labels (name) VALUES ($1)", [label]);
  //addLabel(label)
  //res.json("Label added");
  {/*return res.redirect('/editLabels');*/}
});

//Receives a JSON file from "editLabels.js" containing label name and deleting it
app.post('/deleteLabel', (req, res) => {
    const label = req.body.label;
    console.log('Deleting label', label);
    dB.query("DELETE FROM Labels WHERE name = ($1)", [label]);
    //deleteLabel(label)
    //res.json("Label deleted");
});

//Receives a JSON file from "editLabels.js" containing stock, label and weight
app.post('/addLabelsToStock', (req, res) => {
    const label = req.body.label;
	const stock = req.body.stock;
	const weight = req.body.weight;
    dB.query('INSERT INTO StocksWithLabels VALUES($1,$2, $3)', [stock,label,weight])
    console.log('Adding labels to stock with associated weight', stock, label, weight);
	//res.json("Label added to stock");
	});

//Receives a JSON file from "editLabels.js" containing stock, label and weight
app.post('/editWeight', (req, res) => {
    const label = req.body.label;
	const stock = req.body.stock;
	const weight = req.body.weight;
    dB.query('UPDATE StocksWithLabels SET weight=($1) WHERE stock=($2) AND label=($3)', [weight,stock,label])
    console.log('Editing weight', stock, label, weight);
    //editWeight(stock,label,weight)
    //res.json("Weight changed");
});

//Receives a JSON file from "editLabels.js" containing stock and label
app.post('/deleteLabelFromStock', (req, res) => {
    const label = req.body.label;
	const stock = req.body.stock;
    console.log('Deleting label', stock, label);
    dB.query('DELETE FROM StocksWithLabels WHERE stock=($1) AND label=($2)', [stock,label])
    //deleteLabelFromStock(stock,label)
    //res.json("Label deleted from stock");
});

app.post('/insert-into-stock', (req, res) => {
    const name = req.body.name;
	const market = req.body.market;
    const price = req.body.price;
    dB.query("INSERT INTO Stocks VALUES ($1, $2, $3)", [name,market, price])
    //deleteLabelFromStock(stock,label)
    //res.json("Label deleted from stock");
});

app.post('/insert-into-managers', (req, res) => {
    const name = req.body.name;
    dB.query("INSERT INTO Stocks VALUES ($1)", [name])
    //deleteLabelFromStock(stock,label)
    //res.json("Label deleted from stock");
});


app.get("/labelsummary", async (req, res) => {
    //const pi = await db.query()
    //res.send(pi.rows)
})

app.get("/get-portfolioinfo", async (req, res) => {
    const pi = await dB.query("SELECT * FROM PortfolioInfo", [])
    //console.log(pi)
    res.send(pi.rows
        //dB.getPI("Alex")
        //jQuery.getscript("../../project/server/database/connection.js",getPortfolioInfo("Alex"))
    )
})

app.get("/get-PortfolioSummary", async (req, res) => {
    const pi = await  dB.query("SELECT * FROM PortfolioSummary", [])
    res.send(pi.rows)
})

app.get("/get-labels", async (req, res) => {
    const pi = await  dB.query("SELECT * FROM LabelSummary", [])
    res.send(pi.rows)
})



app.listen(port, () => {
/*
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
    });*/



    // await client.connect()
    console.log(`Example app listening at http://localhost:${port}`)
})
