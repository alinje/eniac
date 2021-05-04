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