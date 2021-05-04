const express = require('express') // node´s own import system
const cors = require('cors')
const app = express()
const port = 3001


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

app.post('/api/label', (req, res) => {
  const label = req.body.label;
  console.log('Adding label', label);
  addLabel(label)
  res.json("Label addedd");
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