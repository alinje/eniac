const fs = require("fs");
const fastcsv = require("fast-csv");

let stream = fs.createReadStream("project/database/data.csv");
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
csvData.shift();

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