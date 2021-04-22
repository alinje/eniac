/*
The class connection.js includes methods that connects to the database.
With the methods you can query the database. As of now the methods collect
everything from each table ("SELECT * [*=everything] FROM Table").
*/

/*
TODO: 
1. There is a lot of redundant code in the methods. Plenty of attempts
to solve this have been conducted without success. As of now, it works, but
is not fancy.
2. Ensure that methods has arguments which makes it possible to
make querys with conditions. (SELECT * FROM Table WHERE manager = 'something'
AND label = 'something')
*/

const { parse } = require('fast-csv')

class Connection{

    /*
    TODO: Give the method arguments that can be used in conditions.
    */
    getPortfolioInfo() {
        const {Pool,Client} = require('pg')
        const connectionString = 'postgressql://postgres:postgres@localhost:5432/eniacdb'
        const client = new Client({
        connectionString:connectionString
        })
        client.connect()
        client.query('SELECT * FROM PortfolioInfo',(err,res)=>{
            console.log(err,JSON.stringify(res))
            client.end()
            return res
        })
    }

    /*
    TODO: Give the method arguments that can be used in conditions.
    */
    getManagers(){
        const {Pool,Client} = require('pg')
        const connectionString = 'postgressql://postgres:postgres@localhost:5432/eniacdb'
        const client = new Client({
        connectionString:connectionString
        })
        client.connect()
        client.query('SELECT * FROM Managers',(err,res)=>{
            console.log(err,res)
            client.end()
            return parse(res)
        })
    }

    getLabels(){
        const {Pool,Client} = require('pg')
        const connectionString = 'postgressql://postgres:postgres@localhost:5432/eniacdb'
        const client = new Client({
        connectionString:connectionString
        })
        client.connect()
        client.query('SELECT * FROM Labels',(err,res)=>{
            console.log(err,res)
            client.end()
            return res
        })
    }

    getStocks(){
        const {Pool,Client} = require('pg')
        const connectionString = 'postgressql://postgres:postgres@localhost:5432/eniacdb'
        const client = new Client({
        connectionString:connectionString
        })
        client.connect()
        client.query('SELECT * FROM Stocks',(err,res)=>{
            console.log(err,res)
            client.end()
            return res
        })
    }

    addManagers(){
        const {Pool,Client} = require('pg')
        const connectionString = 'postgressql://postgres:postgres@localhost:5432/eniacdb'
        const client = new Client({
        connectionString:connectionString
        })
        client.connect()
        client.query('INSERT INTO Managers VALUES($1)',["Tobias"],(err,res)=>{
            console.log(err,res)
            client.end()
            return res
        })
    }
}
var test = new Connection()
test.getManagers()
