const fs = require("fs");
const fastcsv = require("fast-csv");

let stream = fs.createReadStream("project/database/portfolio.csv");
let csvData = [];
let csvStream = fastcsv
  .parse()
  .on("data", delimiter =";", function(data, delimiter) {
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
//const { delimiter } = require("node:path");

// remove the first line: header
for (i=0;i<7;i++){
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
  "INSERT INTO Labels (name, weight) VALUES ($1, $2)";

pool.connect((err, client, done) => {
  if (err) throw err;
  try {
    csvData.forEach(row => {
      client.query(query, row, (err, res) => {
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