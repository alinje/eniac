const fs = require("fs");
const fastcsv = require("fast-csv");

let stream = fs.createReadStream("project/database/portfolio.csv");
let csvData = [];
let csvStream = fastcsv
  .parse()
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

// remove the first line: header

for (i=1;i<=8;i++){
  csvData.shift();
}
// create a new connection pool to the database
const pool = new Pool({
  host: "localhost",
  user: "postgres",
  database: "eniacdb",
  password: "postgres",
  port: 5432
});

const query =
  "INSERT INTO Stocks (name, price, country, procent) VALUES ($1, $2, $3, $4)";

pool.connect((err, client, done) => {
  if (err) throw err;
  try {
    csvData.forEach(row => {
      client.query(query, [row[0], 20, 'SE', 0.17] , (err, res) => {
        if (err) {
          console.log(err.stack);
        } else {
          console.log("inserted " + res.rowCount + " row:", row);
        }
      });
    });
  } finally {
    done();
  }
});