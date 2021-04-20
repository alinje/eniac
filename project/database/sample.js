class Sample{

    getPortfolioInfo() {
        const {Pool,Client} = require('pg')
        const connectionString = 'postgressql://postgres:postgres@localhost:5432/eniacdb'
        const client = new Client({
        connectionString:connectionString
        })
        client.connect()
        client.query('SELECT * FROM PortfolioInfo',(err,res)=>{
            console.log(err,res)
            client.end()
            return res
        })
    }

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
            return res
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
var test = new Sample()
test.getPortfolioInfo()
