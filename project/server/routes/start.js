const Pool = require("pg").Pool;
// create a new connection pool to the database
const pool = new Pool({
    host: "localhost",
    user: "postgres",
    database: "eniacdb",
    password: "postgres",
    port: 5432  
  });

//const db = require("./database")


const startQuery = ` 
 SET client_min_messages TO WARNING;
 DROP SCHEMA public CASCADE;
 CREATE SCHEMA public;
 GRANT ALL ON SCHEMA public TO postgres;
`

const ManagersTblQuery = "CREATE TABLE Managers(name TEXT, PRIMARY KEY (name) );"

const StocksTblQuery = 
  `CREATE TABLE Stocks (
    name TEXT,
    market TEXT,
    price FLOAT,

    PRIMARY KEY(name)
  );`

const LabelsTblQuery = "CREATE TABLE Labels( name TEXT, PRIMARY KEY(name) );"

const StocksWithLabelsTblQuery =`
CREATE TABLE StocksWithLabels(
  stock TEXT,
  label TEXT,
  weight DECIMAL(2,1),

  PRIMARY KEY(stock,label),
  FOREIGN KEY(stock) REFERENCES Stocks(name),
  FOREIGN KEY(label) REFERENCES Labels(name) ON DELETE CASCADE,
  CHECK (weight>0 AND weight<=3)
);`

const PortfoliosTblQuery = 
  `CREATE TABLE Portfolios (
    manager TEXT,
    stock TEXT,
    volume INTEGER,
    classification TEXT,

    PRIMARY KEY (manager,stock),
    FOREIGN KEY (manager) REFERENCES Managers(name),
    FOREIGN KEY (stock) REFERENCES Stocks(name),
    CHECK (classification = 'SHORT' OR classification = 'LONG')
  );`

const PortfolioInfoViewQuery = `
CREATE VIEW PortfolioInfo AS
(SELECT manager, StocksWithLabels.label AS label, Portfolios.stock, classification, price*volume AS value
FROM Managers, Portfolios, Stocks, StocksWithLabels
WHERE (Managers.name = Portfolios.manager) AND (Portfolios.stock = StocksWithLabels.stock) AND
      (Portfolios.stock = Stocks.name)
);`

const LabelSummaryViewQuery = `CREATE VIEW LabelSummary AS
(SELECT StocksWithLabels.label, SUM(PortfolioInfo.value) AS total_value
FROM StocksWithLabels, PortfolioInfo
WHERE (StocksWithLabels.stock = PortfolioInfo.stock)
GROUP BY StocksWithLabels.label
);`

pool.connect((err, client, done) => {
    if (err) throw err;
    try {

        //Adding all tables and views
        addToDatabase(client, startQuery);
        addToDatabase(client, ManagersTblQuery);
        addToDatabase(client, StocksTblQuery);
        addToDatabase(client, LabelsTblQuery);
        addToDatabase(client, StocksWithLabelsTblQuery);
        addToDatabase(client, PortfoliosTblQuery);
        addToDatabase(client, PortfolioInfoViewQuery);
        addToDatabase(client, LabelSummaryViewQuery);
        } 
    finally {
        done();
  }
  });
  
  function addToDatabase(client, query){
    client.query(query, (err, res) => {
      if (err) {
        console.log("Error: " + err.stack);
      } else {
        console.log("Query success!");
      }
    });
    return client;
  }

