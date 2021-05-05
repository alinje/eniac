const express = require('express') // node´s own import system
const cors = require('cors')
const app = express()
const bodyParser = require("body-parser");
const port = 3001


app.use(cors())
app.use(bodyParser.json());

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

app.post('/addLabels', (req, res) => {
  const label = req.body.label;
  console.log('Adding label', label);
  addLabel(label)
  res.json("Label added");
});

app.post('/addLabelsToStock', (req, res) => {
    const label = req.body.label;
	const stock = req.body.stock;
	const weight = req.body.weight;
    console.log('Adding labels to stock with associated weight', stock, label, weight);
    addLabelToStock(stock,label,weight)
    res.json("Label added to stock");
  });


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


     /* TEST
    Add label to Labels table with one argument. The argument is the label name 
    */
    function addLabel(label_name){
        const {Pool,Client} = require('pg')
        const connectionString = 'postgressql://postgres:postgres@localhost:5432/eniacdb'
        const client = new Client({
        connectionString:connectionString
        })
        client.connect()
        client.query('INSERT INTO Labels VALUES($1)', [label_name],(err,res)=>{
            console.log(err,res)
            client.end()
            return res
        })
    }
    
           /*
    Add label to stock in StocksWithLabels table with two arguments. The arguments are
    the stock_name and the label_name. The stock_name/label_name that is added to the table has 
    to exist in the Stocks table/Labels table. There is a condition in StocksWithLabels that monitor
    this.
    */
    function addLabelToStock(stock_name,label_name,weight){
        const {Pool,Client} = require('pg')
        const connectionString = 'postgressql://postgres:postgres@localhost:5432/eniacdb'
        const client = new Client({
        connectionString:connectionString
        })
        client.connect()
        client.query('INSERT INTO StocksWithLabels VALUES($1,$2, $3)', [stock_name,label_name,weight],(err,res)=>{
            console.log(err,res)
            client.end()
            return res
        })
    }