// SPARA UNDAN GAMLA LABELS OCH STOCKSWITHLABELS
// DElETE ALL TABLES
// LÄGG IN NYA STOCKS, MANAGERS OCH PORTFOLIOS
// LÄGG IN GAMLA LABELS OCH STOCKSWITHLABELS

/*
1. Spara undan data som behövs, 2. Ta bort data som behövs, 3. Lägg in data som undansparats

1. Spara undan stocks i en oldStockArray
2. Uppdatera eller lägg in nya stocks i Stocks-tabellen
3. Ta bort värden allt eftersom i oldStockArray
4. När alla nya stocks är antingen inlagda eller uppdaterade: ta bort alla stocks som är kvar i oldStockArray

1. Ta bort alla värden ur portfolios
2. Lägg till nya 

*/
const dB = require('../database/index.js')
const csv = require('csv-parser');
const fs = require('fs');
let csvData = []

readDataFromCSV(csvData)
 .then(res => printIT(csvData))

function readDataFromCSV(csvData){
  fs.createReadStream('project/server/database/PORTFOLIO_ALCUR.csv')
  .pipe(csv())
  .on('data', (row) => {
    csvData.push(row)
  })
  .on('end', () => {  
    console.log('CSV file successfully processed');
    return csvData
  });
}


async function printIT(csvData){
  console.log(csvData)
}

/*

let newStockList = []
let newManagerList = []
let newPortfolioList = []
// #region 2. NewStocks/NewManagers/NewPortfolios


let skipList = ["", "LONG", "TICKER", " ", "."];
var classification = "LONG"
for (i = 0 ; i < csvData.length ; i++ ){
  row = csvData[i]
  if (row[1] == "SHORT"){
    break;
  }
  if (row[1] == "LONG"){
    classification = "SHORT"
  }
  if (!skipList.includes(row[1])){

    if (!newStockList.includes(row[1])){
      newStockList.push([row[1], row[1], row[4],row[12].replace(",",".")])
    }


    if (!newManagerList[0].includes(row[11])){
      newManagerList.push([row[11]])
    }

    newPortfolioList.push([row[11], row[1], row[13].replace(/ /g,''), classification])

  }
}


console.log(newManagerList)



//main()

async function main(){

  //Spara undan data som behövs

  // 1. OldStocks


  let oldStocks = []
  let res = await sendQuery("SELECT * FROM Stocks", []).then(res => res)
  for (i = 0; i<res.rows.length;i++){
    oldStocks.push(res.rows[i])
  }

}

/*
async function deleteAndInsert(oldLabels) {
  try {
    await sendQuery("BEGIN", []).then(res => res)
    await sendQuery("DELETE FROM Labels;",[]).then(res => res)
    //console.log("IM HERE!")

    for (i = 0; i < oldLabels.length;i++){
      //console.log(oldLabels[i].name)
      //sendQuery("INSERT INTO Labels (name) VALUES ($1);", ['Fisk'])
      await sendQuery("INSERT INTO Labels VALUES ($1);", [oldLabels[i].name]).then( res => res)
    }

    await sendQuery("COMMIT",[]).then(res => res)
  }
  catch (e) {
    await sendQuery("ROLLBACK",[]).then(res => res)
  }
}



/*
const fs = require("fs");
const fastcsv = require("fast-csv");
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
  await dB.query('BEGIN')
  let newStockList = []
  try {

    for (i = 0 ; i < csvData.length ; i++ ){
      row = csvData[i]
      newStockList.push(row[1])
    }
    //console.log(newStockList)
    await dB.query('COMMIT')
  } catch (e) {
    await dB.query('ROLLBACK')
    throw e
  } finally {
}
})().catch(e => console.error(e.stack))




let oldStocksWithLabels = []
let stockWithLabelsRes = sendQuery("SELECT * FROM StocksWithLabels", [])
stockWithLabelsRes.then(function(result){
  for (i = 0; i<result.rows.length;i++){
    oldStocksWithLabels.push(result.rows[i])
  }
  //console.log(oldStocksWithLabels)
  //process.exit()
})

deleteAndInsert(oldLabels)



/*
let deleteRes = sendQuery("DELETE FROM Labels;",[])
deleteRes.then(function(result){

  try {
    sendQuery("BEGIN",[]).then((res)=>res)
    for (i = 0; i < oldLabels.length;i++){
      sendQuery("INSERT INTO Labels VALUES ($1);", [oldLabels[i].name]).then((res) => res)
    }
    sendQuery("COMMIT",[]).then((res)=>res)
  } catch (e) {
    sendQuery("ROLLBACK",[]).then((res)=>res)
    throw e
  }

})
*/

async function sendQuery(query, param){
  try{
    const res = await dB.query(query, param)
    //console.log(res)
    return res
  } catch(e){
    console.error(e.stack)
    throw e
  }

}


