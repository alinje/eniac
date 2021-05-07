/*
The class connection.js includes methods that connects to the database.
With the methods you can query the database. As of now the methods collect
everything from each table ("SELECT * [*=everything] FROM Table").
*/

const { Pool } = require('pg')
const pool = new Pool()
const connectionString = 'postgressql://postgres:postgres@localhost:5432/eniacdb'


module.exports = {
    async query(text, params) {
        const start = Date.now()
        const res = await pool.query(text, params)
        const duration = Date.now() - start
        console.log('executed query', { text, duration, rows: res.rowCount })
        return res
    },
    async getClient() {
        const client = await pool.connect()
        const query = client.query
        const release = client.release
        // set a timeout of 5 seconds, after which we will log this client's last query
        const timeout = setTimeout(() => {
            console.error('A client has been checked out for more than 5 seconds!')
            console.error(`The last executed query on this client was: ${client.lastQuery}`)
        }, 5000)
        // monkey patch the query method to keep track of the last query executed
        client.query = (...args) => {
            client.lastQuery = args
            return query.apply(client, args)
        }
        client.release = () => {
            // clear our timeout
            clearTimeout(timeout)
            // set the methods back to their old un-monkey-patched version
            client.query = query
            client.release = release
            return release.apply(client)
        }
        return client
    }
}

function getLabelsTest() {

    client.connect()
    client.query('SELECT * FROM Labels', (err, res) => {
        console.log(err, res)
        client.end()
        return res
    })
}

/*
TODO: 
1. There is a lot of redundant code in the methods. Plenty of attempts
to solve this have been conducted without success. As of now, it works, but
it is not fancy.
2. Ensure that methods has arguments which makes it possible to
make querys with conditions. (SELECT * FROM Table WHERE manager = 'something'
AND label = 'something')
*/


//export default class Connection{

/*
Method that querys the eniacdb to obtain portfolioinfo. The portfolioinfo contains
(as of now) the manager, label of the stock, country of the stock, the stock, percent
and amount.
TODO: Give the method arguments that can be used in conditions.
*/
function getAllPortfolioInfo() {
    const { Pool, Client } = require('pg')
    const connectionString = 'postgressql://postgres:postgres@localhost:5432/eniacdb'
    const client = new Client({
        connectionString: connectionString
    })
    client.connect()
    const res = client.query('SELECT * FROM PortfolioInfo', (err, res) => {
        console.log(err, JSON.stringify(res))
        client.end()
        return res
    })
    return res
}

function printRandom() {
    return "This is a random message!";
}

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

/*
Method that querys the eniacdb to obtain all managers in the Managers table.
*/
function getManagers() {
    const { Pool, Client } = require('pg')
    const connectionString = 'postgressql://postgres:postgres@localhost:5432/eniacdb'
    const client = new Client({
        connectionString: connectionString
    })
    client.connect()
    client.query('SELECT * FROM Managers', (err, res) => {
        console.log(err, res)
        client.end()
        return parse(res)
    })
}

/*
Method that querys the eniacdb to obtain all labels in the Labels table.
*/
function getLabels() {
    const { Pool, Client } = require('pg')
    const connectionString = 'postgressql://postgres:postgres@localhost:5432/eniacdb'
    const client = new Client({
        connectionString: connectionString
    })
    client.connect()
    client.query('SELECT * FROM Labels', (err, res) => {
        console.log(err, res)
        client.end()
        return res
    })
}

/*
Method that querys the eniacdb to obtain all stocks in the Stocks table.
*/
function getStocks() {
    const { Pool, Client } = require('pg')
    const connectionString = 'postgressql://postgres:postgres@localhost:5432/eniacdb'
    const client = new Client({
        connectionString: connectionString
    })
    client.connect()
    client.query('SELECT * FROM Stocks', (err, res) => {
        console.log(err, res)
        client.end()
        return res
    })
}
/*
Adds manager to the Managers table. The argument is the identifior for the manager.
For Alcur the manager identifior is the manager's initials.
*/
function addManager(manager_initials) {
    const { Pool, Client } = require('pg')
    const connectionString = 'postgressql://postgres:postgres@localhost:5432/eniacdb'
    const client = new Client({
        connectionString: connectionString
    })
    client.connect()
    client.query('INSERT INTO Managers VALUES($1)', [manager_initials], (err, res) => {
        console.log(err, res)
        client.end()
        return res
    })
}

/*
Add label to Labels table with two argument. The arguments are the labels name and
the labels weight.
*/
function addLabel(label_name, label_weight) {
    const { Pool, Client } = require('pg')
    const connectionString = 'postgressql://postgres:postgres@localhost:5432/eniacdb'
    const client = new Client({
        connectionString: connectionString
    })
    client.connect()
    client.query('INSERT INTO Labels VALUES($1,$2)', [label_name, label_weight], (err, res) => {
        console.log(err, res)
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
function addLabelToStock(stock_name, label_name) {
    const { Pool, Client } = require('pg')
    const connectionString = 'postgressql://postgres:postgres@localhost:5432/eniacdb'
    const client = new Client({
        connectionString: connectionString
    })
    client.connect()
    client.query('INSERT INTO StocksWithLabels VALUES($1,$2)', [stock_name, label_name], (err, res) => {
        console.log(err, res)
        client.end()
        return res
    })
}



exports.getPI = getPortfolioInfo()
//}
//var test = new Connection()
//test.addManagers();
//test.getManagers()
console.log(printRandom())
console.log(getPortfolioInfo("Alex"))
