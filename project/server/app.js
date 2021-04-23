const express = require('express') // node´s own import system
const cors = require('cors')
const app = express()
const port = 3001

app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get("/home", (req, res) => {
    res.send({
        hello:'noob'
    })
})

app.get("/singleStockGrowth", (res, req) => {
    res.send({
        tesla: [
            10, 12, 15, 16, 14, 17, 19
        ]
    })
})

app.get("/label"), (res, req) => {
    res.send({
        coronaWinners: [{
            "stock": "Tesla",
            "labels": [
                "kort", "coronavinnare"
            ]
        },
        {
            "stock": "Snapchat",
            "labels": [
                "coronavinnare"
            ]
        }]
    })
}

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})