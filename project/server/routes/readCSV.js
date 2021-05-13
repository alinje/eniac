// SPARA UNDAN GAMLA LABELS OCH STOCKSWITHLABELS
// DROP ALL TABLES
// LÄGG IN NYA STOCKS, MANAGERS OCH PORTFOLIOS
// LÄGG IN GAMLA LABELS OCH STOCKSWITHLABELS


const dB = require('../database/index.js')

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


let oldLabels = []
let res = sendQuery("SELECT * FROM Labels", [])
res.then(function(result){
  for (i = 0; i<result.rows.length;i++){
    oldLabels.push(result.rows[i])
  }
  //console.log(oldLabels.length)
  return res
})

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

async function deleteAndInsert(oldLabels) {
  try {
    await dB.query("BEGIN", [])

    console.log(oldLabels.length)

    for (i = 0; i < oldLabels.length;i++){
      await dB.query("INSERT INTO Labels VALUES ($1);", [oldLabels[i].name])
    }

    await dB.query("COMMIT",[])
  }
  catch (e) {
    await dB.query("ROLLBACK",[])
  }

}

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
  const res = await dB.query(query, param)
  return res
}


