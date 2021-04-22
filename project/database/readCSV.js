const fs = require("fs");
const fastcsv = require("fast-csv");

let stream = fs.createReadStream("project/database/portfolio.csv");
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

const addManager =
  "INSERT INTO Managers (name) VALUES ($1)";

const addPortfolio =
  "INSERT INTO Portfolios (manager, stock, volume) VALUES ($1, $2, $3)";

let skipList = ["", "LONG"];

pool.connect((err, client, done) => {
  if (err) throw err;
  try {
    for (i = 0; i< csvData.length;i++){
      row = csvData[i];
      if (row[0] == "SHORT"){
        break;
      }

      if (!skipList.includes(row[0])){
        client.query(addStockQuery, [row[0], 100,"SE", 0.12], (err, res) => {
          if (err) {
            console.log(err.stack);
          } else {
            console.log("inserted " + res.rowCount + " row:", row[0]);
          }
        });

        client.query(addManager, [row[10]], (err, res) => {
          if (err) {
            console.log(err.stack);
          } else {
            console.log("inserted " + res.rowCount + " row:", row[10]);
          }
        });

        client.query(addPortfolio, [row[10], row[0], row[12].replace(" ", "")], (err, res) => {
          if (err) {
            console.log(err.stack);
          } else {
            console.log("inserted " + res.rowCount + " row:", [row[10], row[0], 1000]);
          }
        });
      }

    }
  } finally {
      done();
}
});