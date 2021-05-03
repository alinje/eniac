/*
readCVS.js transfers the data from portfolio.csv to the eniacdb database.
*/

const fs = require("fs");
const fastcsv = require("fast-csv");
//const conn = require("connection");

let stream = fs.createReadStream("../eniac/project/server/database/portfolio.csv");
let csvData = [];
let csvStream = fastcsv
  .parse({delimiter : ";"})
  .on("data", function(data) {
    csvData.push(data);
  })
  .on("end", function() {
    // remove the first line: header
    csvData.shift();

    // connect to the PostgreSQL database
    // save csvData
  });

stream.pipe(csvStream);
const Pool = require("pg").Pool;

// create a new connection pool to the database
const pool = new Pool({
  host: "localhost",
  user: "postgres",
  database: "eniacdb",
  password: "postgres",
  port: 5432  
});

const addStockQuery =
  "INSERT INTO Stocks (name, price, country, procent) VALUES ($1, $2, $3, $4)";

const addManagerQuery =
  "INSERT INTO Managers (name) VALUES ($1)";

const addPortfolioQuery =
  "INSERT INTO Portfolios (manager, stock, volume) VALUES ($1, $2, $3)";

let skipList = ["", "LONG", "TICKER"];

//conn.getManagers();




//c.addPortfolios(data)
//c.addStock(stock_data)

pool.connect((err, client, done) => {
  if (err) throw err;
  try {
    for (i = 0 ; i < csvData.length ; i++ ){
      row = csvData[i];
      if (row[0] == "SHORT"){
        /*
        let volvoInserts = ["Cyklisk", "Value", "Beta 1,8"]
        let nibeInserts = ["Hållbar", "Quality", "Momentum", "Beta 1,2"]
        let embracerInserts = ["Growth", "Tech", "Förvärv", "Momentum", "Beta 1"]
        let labels = ["Cyklisk", "Value", "Beta 1,8", "Hållbar", "Quality", "Momentum", "Beta 1,2", "Growth", "Tech", "Förvärv", "Momentum", "Beta 1" ]

        for (i=0 ; i< labels;i++){
          addToDatabase(client, "INSERT INTO Labels (name, weight) VALUES ($1, $2)", [labels[i], 1]);
        }

        addToDatabase(client, "INSERT INTO StocksWithLabels (stock, label) VALUES ($1, $2)", ["VOLV B", volvoInserts[0]])
        addToDatabase(client, "INSERT INTO StocksWithLabels (stock, label) VALUES ($1, $2)", ["VOLV B", volvoInserts[1]])
        addToDatabase(client, "INSERT INTO StocksWithLabels (stock, label) VALUES ($1, $2)", ["VOLV B", volvoInserts[2]])

        addToDatabase(client, "INSERT INTO StocksWithLabels (stock, label) VALUES ($1, $2)", ["NIBE B", nibeInserts[0]])
        addToDatabase(client, "INSERT INTO StocksWithLabels (stock, label) VALUES ($1, $2)", ["NIBE B", nibeInserts[1]])
        addToDatabase(client, "INSERT INTO StocksWithLabels (stock, label) VALUES ($1, $2)", ["NIBE B", nibeInserts[2]])
        addToDatabase(client, "INSERT INTO StocksWithLabels (stock, label) VALUES ($1, $2)", ["NIBE B", nibeInserts[3]])

        addToDatabase(client, "INSERT INTO StocksWithLabels (stock, label) VALUES ($1, $2)", ["EMBRAC B", embracerInserts[0]])
        addToDatabase(client, "INSERT INTO StocksWithLabels (stock, label) VALUES ($1, $2)", ["EMBRAC B", embracerInserts[1]])
        addToDatabase(client, "INSERT INTO StocksWithLabels (stock, label) VALUES ($1, $2)", ["EMBRAC B", embracerInserts[2]])
        addToDatabase(client, "INSERT INTO StocksWithLabels (stock, label) VALUES ($1, $2)", ["EMBRAC B", embracerInserts[3]])
        addToDatabase(client, "INSERT INTO StocksWithLabels (stock, label) VALUES ($1, $2)", ["EMBRAC B", embracerInserts[i]])
        */
        break;
      }

      if (!skipList.includes(row[0])){

        //Adding stocks
        addToDatabase(client, addStockQuery, [row[0], 100,"SE", 0.12] );

        //Adding Managers
        addToDatabase(client, addManagerQuery, [row[10]]);

        //Adding Portfolios
        addToDatabase(client, addPortfolioQuery, [row[10], row[0], row[12].replace(" ", "")]);

      }
      
      
    }
  } finally {
      done();
}
});

function addToDatabase(client, query, data){
  client.query(query, data, (err, res) => {
    if (err) {
      console.log(err.stack)
      return (err.stack);
    } else {
      //console.log(res.rowCount)
      return ("inserted " + res.rowCount + " row:", data);
    }
  });
  return client
}