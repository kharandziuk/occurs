Promise = require('bluebird')
express = require('express')
app = express()
{MongoClient} = require('mongodb')
assert = require 'assert'

IS_DEVELOPMENT = true

url = 'mongodb://localhost:27017/myproject'
client = Promise.promisify(MongoClient.connect, MongoClient)(url)
app.use((req, res, next)->
  client.then((db)->
    console.log 'here'
    req.db = {
      events: db.collection('events')
    }
    next()
  )
  .catch((e)->
    console.log(e)
    throw e
  )
)

if IS_DEVELOPMENT
  app.use('/static', express.static(__dirname + "/static"))

  app.get('/', (req, res) ->
    response.sendFile(__dirname + "static/views/index.html")
  )

app.get('/event', (req, res) ->
  req.db.events.count((err, count)->
    res.json({count})
  )
)


app.post('/event', (req, res) ->
  date = new Date
  req.db.events.insert({date}, (err, result) ->
    res.json(date)
  )
)

app.listen(8000)
