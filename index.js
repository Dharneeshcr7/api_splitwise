const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors') 

connectToMongo();
const app = express()
const port = process.env.PORT||5000

app.use(cors())
app.use(express.json())
app.use('/api/auth', require('./routes/auth'))
app.use('/api/group',require('./routes/group'))
app.use('/api/bills',require('./routes/transaction'))



app.listen(port, () => {
  console.log(`backend listening at ${process.env.CYCLIC_URL}:${port}`)
})