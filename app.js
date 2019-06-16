const express = require('express')
const path = require('path')
const cors = require('cors')

require('dotenv').config()
require('./db-config')()

const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(cors())

app.use('/poll', require('./routes/poll'))

const PORT = process.env.PORT || 5500
app.listen(PORT, ()=>console.log(`server listens on ${PORT}`))