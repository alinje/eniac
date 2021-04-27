const dB = require("C:/Users/hanna/Documents/agileProjekt/eniac/project/server/database/connection.js")

const express = require('express') // node´s own import system
const cors = require('cors')
const app = express()
const port = 5432


app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get("/home", (req, res) => {
    res.send({
        hello:'noob'
    })
})

app.get("/grid-data", (req, res) => {
    res.send({

    })
})

app.get("/dBInit", (req, res) => {
    res.send(
        getPortfolioInfo("Alex")
    )
})



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

