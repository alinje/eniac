// SPARA UNDAN GAMLA LABELS OCH STOCKSWITHLABELS
// DElETE ALL TABLES
// LÄGG IN NYA STOCKS, MANAGERS OCH PORTFOLIOS
// LÄGG IN GAMLA LABELS OCH STOCKSWITHLABELS
const dB = require('../database/index.js')
main()

async function main(){

  let oldLabels = []
  let res = await sendQuery("SELECT * FROM Labels", []).then(res => res)
  //res.then(res => res.json())
  //console.log(res)
  for (i = 0; i<res.rows.length;i++){
    oldLabels.push(res.rows[i])
  }

  deleteAndInsert(oldLabels)


}


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
    console.log(res)
    return res
  } catch(e){
    console.error(e.stack)
    throw e
  }

}


