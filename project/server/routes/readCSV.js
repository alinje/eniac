const dB = require('../database/index.js')
const fastcsv = require("fast-csv");
const fs = require('fs');
var stream = fs.createReadStream('../server/database/PORTFOLIO_ALCUR.csv'); // CHANGE THIS PATH TO DYNAMIC PATH
let csvData = []

function setCSV(file){

    if (file !== [] && typeof file !== 'undefined'){
        stream = fs.createReadStream(file)
        callerFun([])
    }
    /*
    if (file !== [] && typeof file !== 'undefined'){
        splitTxtTmp = file.split('\n')
        splitTxt = splitTxtTmp.map((val) => {
            return val.split(';')
        })
        //console.log(splitTxt)
        callerFun(splitTxt)
    }*/
}

module.exports = {
    setCSV: setCSV,
}

function getCSVData(csvData){
    return new Promise((resolve,reject)=>{
        let csvStream = fastcsv
        .parse({delimiter : ";"})
        .on("data", function(data) {
          csvData.push(data);
        })
        .on("end", function() {
          // remove the first line: header
          csvData.shift();
        });
      
        stream.pipe(csvStream);
        setTimeout(()=>{
            resolve();
        ;} , 2500
        );
    });
    
}

async function callerFun(csvData){
    await getCSVData(csvData);
    let newStockList = []
    let newManagerList = []
    let newPortfolioList = []

    //#region get new Lists 
    let addedStockList = []
    let addedManagerList = []
    let skipList = ["", "LONG", "TICKER", " ", "."];
    var classification = "LONG"
    try{
        for (i = 0 ; i < csvData.length ; i++ ){
            row = csvData[i]
            //console.log(row[1])
            if (row[1] == "SHORT"){
                break;
            }
            if (row[1] == "LONG"){
                classification = "SHORT"
            }
            if (!skipList.includes(row[1])){
                //console.log(newStockList.length)
                if (!addedStockList.includes(row[1])){
                    newStockList.push([row[1], row[4],row[12].replace(",",".")])
                    addedStockList.push(row[1])
                }


                if (!addedManagerList.includes(row[11])){
                    newManagerList.push([row[11]])
                    addedManagerList.push(row[11])
                }

                newPortfolioList.push([row[11], row[1], row[13].replace(/ /g,''), classification])

            }
        }
    } catch(e){
        console.error(e)
    }

    //#endregion
    //console.log(newStockList)


    //#region deleting tables values and adding new ones
    //Deleting old stocks, managers and portfolios
    await sendQuery("DELETE FROM Portfolios",[]).then(res => res)
    await sendQuery("DELETE FROM Stocks",[]).then(res => res)
    await sendQuery("DELETE FROM Managers",[]).then(res => res)



    // adding new stocks to database
    for (i = 0 ; i < newStockList.length; i++){
        await sendQuery("INSERT INTO Stocks VALUES ($1, $2, $3)", newStockList[i])
    }

    // adding new managers to database
    for (i = 0 ; i < newManagerList.length; i++){
        await sendQuery("INSERT INTO Managers VALUES ($1)", newManagerList[i])
    }

    // adding new portfolios to database
    for (i = 0 ; i < newPortfolioList.length; i++){
        await sendQuery("INSERT INTO Portfolios VALUES ($1, $2, $3, $4)", newPortfolioList[i])
    }
    //#endregion

}

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

callerFun(csvData);