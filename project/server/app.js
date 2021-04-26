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

app.get("/grid-data", (req, res) => {
    res.send({

    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})