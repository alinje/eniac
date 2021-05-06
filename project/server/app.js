const express = require('express') // node´s own import system
const cors = require('cors')
const app = express()
const bodyParser = require("body-parser");
const port = 3001


app.use(cors())

//Without Body Parder the req.body us undefined!!
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

//Receives a JSON file from "editLabels.js" containing label name and adding it
app.post('/addLabels', (req, res) => {
  const label = req.body.label;
  console.log('Adding label', label);
  addLabel(label)
  res.json("Label added");
  {/*return res.redirect('/editLabels');*/}
});

//Receives a JSON file from "editLabels.js" containing label name and deleting it
app.post('/deleteLabel', (req, res) => {
    const label = req.body.label;
    console.log('Deleting label', label);
    deleteLabel(label)
    res.json("Label deleted");
});

//Receives a JSON file from "editLabels.js" containing stock, label and weight
app.post('/addLabelsToStock', (req, res) => {
    const label = req.body.label;
	const stock = req.body.stock;
	const weight = req.body.weight;
    console.log('Adding labels to stock with associated weight', stock, label, weight);
    addLabelToStock(stock,label,weight)
	res.json("Label added to stock");
	});

//Receives a JSON file from "editLabels.js" containing stock, label and weight
app.post('/editWeight', (req, res) => {
    const label = req.body.label;
	const stock = req.body.stock;
	const weight = req.body.weight;
    console.log('Editing weight', stock, label, weight);
    editWeight(stock,label,weight)
    res.json("Weight changed");
});

//Receives a JSON file from "editLabels.js" containing stock and label
app.post('/deleteLabelFromStock', (req, res) => {
    const label = req.body.label;
	const stock = req.body.stock;
    console.log('Deleting label', stock, label);
    deleteLabelFromStock(stock,label)
    res.json("Label deleted from stock");
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

    //Function that edits a stocks weight with associated label
    function editWeight(stock_name,label_name,weight){
        const {Pool,Client} = require('pg')
        const connectionString = 'postgressql://postgres:postgres@localhost:5432/eniacdb'
        const client = new Client({
        connectionString:connectionString
        })
        client.connect()
        client.query('UPDATE StocksWithLabels SET weight=($1) WHERE stock=($2) AND label=($3)', [weight,stock_name,label_name],(err,res)=>{
            console.log(err,res)
            client.end()
            return res
        })
    }

    //Deletes a label from a stock
    function deleteLabelFromStock (stock_name,label_name){
        const {Pool,Client} = require('pg')
        const connectionString = 'postgressql://postgres:postgres@localhost:5432/eniacdb'
        const client = new Client({
        connectionString:connectionString
        })
        client.connect()
        client.query('DELETE FROM StocksWithLabels WHERE stock=($1) AND label=($2)', [stock_name,label_name],(err,res)=>{
            console.log(err,res)
            client.end()
            return res
        })
    }

    // Function that deletes label from Labels. StocksWithLabels has ON DELETE CASCADE, which allows us to
    // Delete label even if a stock has this label
    function deleteLabel(label_name){
        const {Pool,Client} = require('pg')
        const connectionString = 'postgressql://postgres:postgres@localhost:5432/eniacdb'
        const client = new Client({
        connectionString:connectionString
        })
        client.connect()
        client.query('DELETE FROM Labels WHERE name=($1)', [label_name],(err,res)=>{
            console.log(err,res)
            client.end()
            return res
        })
    }