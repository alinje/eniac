const {Pool,Client} = require('pg')
const connectionString = 'postgressql://postgres:postgres@localhost:5432/eniacdb'

const client = new Client({
    connectionString:connectionString
})

client.connect()

client.query('SELECT * FROM PortfolioInfo',(err,res)=>{
    console.log(err,res)
    client.end()
})
