const express = require('express')
const app = express()
const port = 3000


app.use(express.static("../public"))

app.get('/', (req, res) => {
  res.sendFile("../public/HomePage/index.html", {root: __dirname})
})



app.post('/login', (req, res) => {
  console.log(req)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

