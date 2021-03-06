//import {getPortfolioInfo} from '/project/server/database/connection.js'
/*const {Pool,Client} = require('pg')
const connectionString = 'postgressql://postgres:postgres@localhost:5432/eniacdb'
const client = new Client({
connectionString:connectionString
})*/
//const getPortfolioInfo = require('../../project/server/database/connection.js')

const read = require('../server/routes/readCSV.js')
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

app.post('/import-portfolio-alcur', async (req, res) => {
    //await new Promise(r => setTimeout(r, 1000))

    const { file } = req.body


    if (typeof file === 'undefined') {

        res.json({ message: 'Could not add item!' })
        return
    } else {
        //console.log(path)
    }

    read.setCSV(file)

    res.json('Success')
    return

});

app.get('/import-portfolio-alcur', (req, res) => {
    res.send({
        ts: Date.now(),
    })

})

//Receives a JSON file from "editLabels.js" containing label name and adding it
app.post('/addLabels', (req, res) => {
    const label = req.body.label;
    console.log('Adding label', label);
    dB.query("INSERT INTO Labels (name) VALUES ($1)", [label]);
    //addLabel(label)
    //res.json("Label added");
    window.location.reload();
    //return res.redirect('../client/pages/editLabels.js')
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
    dB.query('INSERT INTO StocksWithLabels VALUES($1,$2, $3)', [stock, label, weight])
    console.log('Adding labels to stock with associated weight', stock, label, weight);
    //res.json("Label added to stock");
});

//Receives a JSON file from "editLabels.js" containing stock, label and weight
app.post('/editWeight', (req, res) => {
    const label = req.body.label;
    const stock = req.body.stock;
    const weight = req.body.weight;
    dB.query('UPDATE StocksWithLabels SET weight=($1) WHERE stock=($2) AND label=($3)', [weight, stock, label])
    console.log('Editing weight', stock, label, weight);
    //editWeight(stock,label,weight)
    //res.json("Weight changed");
});

//Receives a JSON file from "editLabels.js" containing stock and label
app.post('/deleteLabelFromStock', (req, res) => {
    const label = req.body.label;
    const stock = req.body.stock;
    console.log('Deleting label', stock, label);
    dB.query('DELETE FROM StocksWithLabels WHERE stock=($1) AND label=($2)', [stock, label])
    //deleteLabelFromStock(stock,label)
    //res.json("Label deleted from stock");
});

app.post('/insert-into-stock', (req, res) => {
    const name = req.body.name;
    const market = req.body.market;
    const price = req.body.price;
    dB.query("INSERT INTO Stocks VALUES ($1, $2, $3)", [name, market, price])
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
    res.send(pi.rows)
})

app.get("/get-PortfolioSummary", async (req, res) => {
    const pi = await dB.query("SELECT * FROM PortfolioSummary", [])
    res.send(pi.rows)
})

app.get("/get-labels", async (req, res) => {
    const pi = await dB.query("SELECT * FROM Labels", [])
    res.send(pi.rows)
})

app.get("/get-labels-summary", async (req, res) => {
    const pi = await dB.query("SELECT * FROM LabelSummary", [])
    res.send(pi.rows)
})

app.get("/get-labelsummary", async (req, res) => {
    const q =   `WITH shortSumLabel AS
	(SELECT label, sum(PortfolioInfo.value) AS SHORT
	From StocksWithLabels, PortfolioInfo
	WHERE StocksWithLabels.stock = PortfolioInfo.stock AND PortfolioInfo.classification = 'SHORT'
	GROUP BY StocksWithLabels.label),
longSumLabel AS
	(SELECT label, sum(PortfolioInfo.value) AS LONG
	From StocksWithLabels, PortfolioInfo
	WHERE StocksWithLabels.stock = PortfolioInfo.stock AND PortfolioInfo.classification = 'LONG'
	GROUP BY StocksWithLabels.label),
totalSumLabel AS
	(SELECT label, sum(PortfolioInfo.value) AS TOTAL
	From StocksWithLabels, PortfolioInfo
    WHERE StocksWithLabels.stock = PortfolioInfo.stock
	GROUP BY StocksWithLabels.label)
SELECT DISTINCT StocksWithLabels.label, CAST(COALESCE(LONG,0) AS Float) AS LONG, CAST(COALESCE(SHORT,0) AS Float) AS SHORT, CAST(TOTAL AS Float)
FROM StocksWithLabels LEFT JOIN shortSumLabel USING (label) LEFT JOIN longSumLabel USING (label) LEFT JOIN totalSumLabel USING (label);`
    const pi = await  dB.query(q,[])
    res.send(pi.rows)
})

app.get("/get-stocksummary", async (req, res) => {
    const q =   `WITH shortSumStock AS
	(SELECT stock, sum(PortfolioInfo.value) AS SHORT
	From PortfolioInfo
	WHERE classification = 'SHORT'
	GROUP BY stock),
longSumStock AS
	(SELECT stock, sum(PortfolioInfo.value) AS LONG
	From PortfolioInfo
	WHERE classification = 'LONG'
	GROUP BY stock),
totalSumStock AS
	(SELECT stock, sum(PortfolioInfo.value) AS TOTAL
	From PortfolioInfo
	GROUP BY stock)
SELECT DISTINCT stock, COALESCE(LONG,0) AS LONG, COALESCE(SHORT,0) AS SHORT, TOTAL
FROM PortfolioInfo LEFT JOIN shortSumStock USING (stock) LEFT JOIN longSumStock USING (stock) LEFT JOIN totalSumStock USING (stock)
ORDER BY stock;`
    const pi = await  dB.query(q,[])
    res.send(pi.rows)
})

app.get("/get-managersummary", async (req, res) => {
    const q =   `WITH shortSumManager AS
	(SELECT manager, sum(PortfolioInfo.value) AS SHORT
	From PortfolioInfo
	WHERE classification = 'SHORT'
	GROUP BY manager),
longSumManager AS
	(SELECT manager, sum(PortfolioInfo.value) AS LONG
	From PortfolioInfo
	WHERE PortfolioInfo.classification = 'LONG'
	GROUP BY manager),
totalSumManager AS
	(SELECT manager, sum(PortfolioInfo.value) AS TOTAL
	From PortfolioInfo
	GROUP BY manager)
SELECT DISTINCT PortfolioInfo.manager, COALESCE(LONG,0) AS LONG, COALESCE(SHORT,0) AS SHORT, TOTAL
FROM PortfolioInfo LEFT JOIN shortSumManager USING (manager) LEFT JOIN longSumManager USING (manager) LEFT JOIN totalSumManager USING (manager);`
    const pi = await  dB.query(q,[])
    res.send(pi.rows)
})

app.get("/get-stocks-with-labels", async (req, res) => {
    const pi = await dB.query("SELECT * FROM StocksWithLabels", [])
    res.send(pi.rows)
})

app.get("/get-stocks-from-portfolio-with-argument", async (req, res) => {
    const m = req.query.manager;
    const pi = await  dB.query("SELECT stock, volume, classification FROM Portfolios WHERE manager = ($1)", [m])
    res.send(pi.rows)
})


app.get("/get-stocks-from-stockswithlabels-with-argument", async (req, res) => {
    const label = req.query.label;
    const q = `WITH totalSumStock AS
	(SELECT stock, sum(PortfolioInfo.value) AS TOTAL
	From PortfolioInfo
	GROUP BY stock)
    SELECT stock, weight, weight*TOTAL AS "Exposed Value" FROM StocksWithLabels JOIN totalSumStock USING (stock) WHERE label = ($1)`
    const pi = await  dB.query(q, [label])
    res.send(pi.rows)
})

app.get("/get-onlystocks-with-labels", async (req, res) => {
    const pi = await  dB.query("SELECT DISTINCT stock FROM StocksWithLabels", [])
    res.send(pi.rows)
})

app.get("/get-stocks", async (req, res) => {
    const pi = await dB.query("SELECT name FROM Stocks", [])
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
