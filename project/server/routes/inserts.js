/*
readCVS.js transfers the data from portfolio.csv to the eniacdb database.
*/

const Pool = require("pg").Pool;

// create a new connection pool to the database
const pool = new Pool({
  host: "localhost",
  user: "postgres",
  database: "eniacdb",
  password: "postgres",
  port: 5432  
});

const fs = require("fs");
const fastcsv = require("fast-csv");
//const conn = require("connection");

let stream = fs.createReadStream('./project/server/database/PORTFOLIO_ALCUR.csv');
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


;(async () => {
    // note: we don't try/catch this because if connecting throws an exception
    // we don't need to dispose of the client (it will be undefined)
    const client = await pool.connect()
    try {
        await client.query('BEGIN')
        //#region Adding the CSV data from portfolios.csv
        const addStockQuery = "INSERT INTO Stocks (name, market, price) VALUES ($1, $2, $3)";
        const addManagerQuery = "INSERT INTO Managers (name) VALUES ($1)";
        const addPortfolioQuery = "INSERT INTO Portfolios (manager, stock, volume, classification) VALUES ($1, $2, $3, $4)";
        let skipList = ["", "LONG", "TICKER" ," "];
        var classification = "LONG"
        let stockList = [];
        let managerList = [];


        for (i = 0 ; i < csvData.length ; i++ ){
            row = csvData[i];
            //console.log(row[1])
            if (row[1] == "SHORT"){
              break;
            }
            if (row[1] == "LONG"){
              classification = "SHORT"
            }

      
            if (!skipList.includes(row[1])){
                //Adding stocks from CSV to database
                if (!stockList.includes(row[1])){
                    await client.query(addStockQuery, [row[1], row[4],row[12].replace(",",".")])
                }

                //Adding Managers from CSV to database
                if (!managerList.includes(row[11])){
                    //console.log(row[10])
                    //console.log(managerList.includes(row[0]))
                    await client.query(addManagerQuery, [row[11]])
                }

                //Adding Portfolios from CSV to database
                await client.query(addPortfolioQuery,[row[11], row[1], row[13].replace(/ /g,''), classification])

                stockList.push(row[1])
                managerList.push(row[11])
            }
        }
        //#endregion

        //#region Adding test insert label data
        let volvoInserts = ["Cyklisk", "Value", "Beta 1,8"]
        let nibeInserts = ["Hållbar", "Quality", "Momentum", "Beta 1,2"]
        let embracerInserts = ["Growth", "Tech", "Förvärv", "Momentum", "Beta 1"]
        let labels = ["Cyklisk", "Value", "Beta 1,8", "Hållbar", "Quality", "Momentum", "Beta 1,2", "Growth", "Tech", "Förvärv", "Momentum", "Beta 1" ]
        let labelsList = []
        for (i=0; i<labels.length;i++){
            if (!labelsList.includes(labels[i])){
                await client.query("INSERT INTO Labels (name) VALUES ($1)", [labels[i]])
                labelsList.push(labels[i])
            }

        }
        const stocksWithLabelsQuery = "INSERT INTO StocksWithLabels (stock, label, weight) VALUES ($1, $2, $3)"
        await client.query(stocksWithLabelsQuery, ["VOLV B", volvoInserts[0], 1])
        await client.query(stocksWithLabelsQuery, ["VOLV B", volvoInserts[1], 1])
        await client.query(stocksWithLabelsQuery, ["VOLV B", volvoInserts[2], 1])

        await client.query(stocksWithLabelsQuery, ["NIBE B", nibeInserts[0], 1])
        await client.query(stocksWithLabelsQuery, ["NIBE B", nibeInserts[1], 1])
        await client.query(stocksWithLabelsQuery, ["NIBE B", nibeInserts[2], 1])
        await client.query(stocksWithLabelsQuery, ["NIBE B", nibeInserts[3], 1])

        await client.query(stocksWithLabelsQuery, ["EMBRAC B", embracerInserts[0], 1])
        await client.query(stocksWithLabelsQuery, ["EMBRAC B", embracerInserts[1], 1])
        await client.query(stocksWithLabelsQuery, ["EMBRAC B", embracerInserts[2], 1])
        await client.query(stocksWithLabelsQuery, ["EMBRAC B", embracerInserts[3], 1])
        await client.query(stocksWithLabelsQuery, ["EMBRAC B", embracerInserts[4], 1])
        
        //#endregion
      await client.query('COMMIT')
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    } finally {
      client.release()

    }
})().catch(e => console.error(e.stack))
