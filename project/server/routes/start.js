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
  weight NUMERIC(2,1),

  PRIMARY KEY(stock,label),
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

const LabelAggViewQuery = `
CREATE VIEW LabelAgg AS
SELECT stock, jsonb_agg(label) AS Labels
  FROM StocksWithLabels
  GROUP BY stock;
`

const PortfolioInfoViewQuery = `
CREATE VIEW PortfolioInfo AS
(SELECT manager, Portfolios.stock, classification, ROUND((price*volume)::numeric, 1) AS value, LabelAgg.labels AS labels
FROM Managers JOIN Portfolios ON (Managers.name = Portfolios.manager) JOIN Stocks ON (Portfolios.stock = Stocks.name)
              LEFT JOIN LabelAgg ON (Portfolios.stock = LabelAgg.stock)
);`

const PortfoliosSummaryViewQuery = `
CREATE VIEW PortfolioSummary AS
((SELECT PortfolioInfo.manager, PortfolioInfo.classification, SUM(volume) AS total_volume,  SUM(value) AS total_value
 FROM PortfolioInfo JOIN Portfolios using (stock)
 WHERE PortfolioInfo.classification = 'SHORT'
 GROUP BY PortfolioInfo.manager, PortfolioInfo.classification)
 UNION
 (SELECT PortfolioInfo.manager, PortfolioInfo.classification, SUM(volume) AS total_volume,  SUM(value) AS total_value
 FROM PortfolioInfo JOIN Portfolios using (stock)
 WHERE PortfolioInfo.classification = 'LONG'
 GROUP BY PortfolioInfo.manager, PortfolioInfo.classification)
 ORDER BY total_value);
`

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
        addToDatabase(client, LabelAggViewQuery);
        addToDatabase(client, PortfolioInfoViewQuery);
        addToDatabase(client, LabelSummaryViewQuery);
        addToDatabase(client, PortfoliosSummaryViewQuery);

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

