const Pool = require("pg").Pool;
// create a new connection pool to the database
const pool = new Pool({
    host: "localhost",
    user: "postgres",
    database: "eniacdb",
    password: "postgres",
    port: 5432  
  });

const startQuery = ` 
 SET client_min_messages TO WARNING; -- Less talk please.
 DROP SCHEMA public CASCADE;
 CREATE SCHEMA public;
 GRANT ALL ON SCHEMA public TO postgres;
`

const ManagersTblQuery = "CREATE TABLE Managers(name TEXT, PRIMARY KEY (name) );"

const StocksTblQuery = "CREATE TABLE Stocks (name TEXT, price INTEGER, country TEXT, procent DECIMAL(7,2), PRIMARY KEY(name) );"

const LabelsTblQuery = "CREATE TABLE Labels( name TEXT, weight INTEGER, PRIMARY KEY(name) );"

const StocksWithLabelsTblQuery = "CREATE TABLE StocksWithLabels( stock TEXT, label TEXT, PRIMARY KEY(stock,label), FOREIGN KEY(stock) REFERENCES Stocks(name), FOREIGN KEY(label) REFERENCES Labels(name) );"

const PortfoliosTblQuery = "CREATE TABLE Portfolios( manager TEXT, stock TEXT, volume INTEGER, PRIMARY KEY (manager,stock), FOREIGN KEY (manager) REFERENCES Managers(name), FOREIGN KEY (stock) REFERENCES Stocks(name) );"

const PortfolioInfoViewQuery = `
CREATE VIEW PortfolioInfo AS
(SELECT manager, StocksWithLabels.label AS label, country, Portfolios.stock, procent, price*volume AS amount
FROM Managers, Portfolios, Stocks, StocksWithLabels
WHERE (Managers.name = Portfolios.manager) AND (Portfolios.stock = StocksWithLabels.stock)
                                           AND (Portfolios.stock = Stocks.name)
GROUP BY(Portfolios.manager, StocksWithLabels.label, country, Portfolios.stock,procent,amount)
);`

const LabelSummaryViewQuery = `CREATE VIEW LabelSummary AS
(SELECT label, SUM(Portfolios.volume) AS total_volume
FROM StocksWithLabels, Portfolios
WHERE (StocksWithLabels.stock = Portfolios.stock)
GROUP BY label
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
  }