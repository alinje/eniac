const {Pool,Client} = require('pg')

const DATABASE = "eniacdb"
const USERNAME = "postgres"
const PASSWORD = "postgres"


const connectionString = 'postgressql://postgres:postgres@localhost:5432/eniacdb'

const client = new Client({
    connectionString:connectionString
})

client.connect()

const sql = "SELECT * FROM PortfolioInfo WHERE manager = $1 AND label = $2"
const values = ['Albin', 'coronavinnare']

client.query(sql, values, (err,res)=>{
    console.log(err,res)
    client.end()
})
