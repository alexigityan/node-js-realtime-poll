const mongoose = require('mongoose')

const dbUser = process.env.DB_USER || 'username'
const dbPass = process.env.DB_PASS || 'password'


const dbUrl = `mongodb://${dbUser}:${dbPass}@ds137857.mlab.com:37857/node-js-poll-app`

module.exports = function() {
  mongoose.connect(dbUrl, { useNewUrlParser: true})
  .then(()=>console.log('database connected'))
  .catch ( err => console.log(err))
}
