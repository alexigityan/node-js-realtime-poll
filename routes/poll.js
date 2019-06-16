const express = require('express')
const route = express.Router()

const Vote = require('../models/Vote')

const Pusher = require('pusher')

const pusher = new Pusher({
  appId: process.env.PUSHER_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: 'eu'
})

route.get('/', (req, res)=>{
  Vote.find()
    .then( votes => {
      res.json(votes)
    })
    .catch( err => {
      console.log(err)
      res.sendStatus(500)
    })
})

route.post('/', (req, res)=>{
  const { os } = req.body

  if (os) {
    const data = {
      'vote': os,
      'points': 1
    }
    new Vote(data).save()
      .then( vote => {
        pusher.trigger('poll-channel', 'poll-vote-event', vote)
        res.json(data)
      })
      .catch( err => {
        console.log(err)
        res.sendStatus(500)
      })
  }

})

module.exports = route