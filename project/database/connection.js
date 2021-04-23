/*
The class connection.js includes methods that connects to the database.
With the methods you can query the database. As of now the methods collect
everything from each table ("SELECT * [*=everything] FROM Table").
*/

/*
TODO: 
1. There is a lot of redundant code in the methods. Plenty of attempts
to solve this have been conducted without success. As of now, it works, but
it is not fancy.
2. Ensure that methods has arguments which makes it possible to
make querys with conditions. (SELECT * FROM Table WHERE manager = 'something'
AND label = 'something')
*/


class Connection{

    /*
    Method that querys the eniacdb to obtain portfolioinfo. The portfolioinfo contains
    (as of now) the manager, label of the stock, country of the stock, the stock, percent
    and amount.
    TODO: Give the method arguments that can be used in conditions.
    */
    getAllPortfolioInfo() {
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

    getPortfolioInfo(manager) {
        const {Pool,Client} = require('pg')
        const connectionString = 'postgressql://postgres:postgres@localhost:5432/eniacdb'
        const client = new Client({
        connectionString:connectionString
        })
        client.connect()
        client.query('SELECT * FROM PortfolioInfo WHERE manager = $1', [manager],(err,res)=>{
            console.log(err,res)
            client.end()
            return res
        })
    }

    /*
    Method that querys the eniacdb to obtain all managers in the Managers table.
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

    /*
    Method that querys the eniacdb to obtain all labels in the Labels table.
    */
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

      /*
    Method that querys the eniacdb to obtain all stocks in the Stocks table.
    */
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
    /*
    Adds manager to the Managers table. The argument is the identifior for the manager.
    For Alcur the manager identifior is the manager's initials.
    */
    addManager(manager_initials){
        const {Pool,Client} = require('pg')
        const connectionString = 'postgressql://postgres:postgres@localhost:5432/eniacdb'
        const client = new Client({
        connectionString:connectionString
        })
        client.connect()
        client.query('INSERT INTO Managers VALUES($1)', [manager_initials],(err,res)=>{
            console.log(err,res)
            client.end()
            return res
        })
    }

    /*
    Add label to Labels table with two argument. The arguments are the labels name and
    the labels weight.
    */
    addLabel(label_name,label_weight){
        const {Pool,Client} = require('pg')
        const connectionString = 'postgressql://postgres:postgres@localhost:5432/eniacdb'
        const client = new Client({
        connectionString:connectionString
        })
        client.connect()
        client.query('INSERT INTO Labels VALUES($1,$2)', [label_name,label_weight],(err,res)=>{
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
    addLabelToStock(stock_name,label_name){
        const {Pool,Client} = require('pg')
        const connectionString = 'postgressql://postgres:postgres@localhost:5432/eniacdb'
        const client = new Client({
        connectionString:connectionString
        })
        client.connect()
        client.query('INSERT INTO StocksWithLabels VALUES($1,$2)', [stock_name,label_name],(err,res)=>{
            console.log(err,res)
            client.end()
            return res
        })
    }

}
var test = new Connection()
//test.addManagers();
//test.getManagers()
test.getPortfolioInfo("Alex");
