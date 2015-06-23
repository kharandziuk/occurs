Promise = require('bluebird')
express = require('express')
app = express()
bodyParser = require('body-parser')
{MongoClient} = require('mongodb')
assert = require 'assert'
auth = require './lib/auth'
jwt = require('jwt-simple')

IS_DEVELOPMENT = true

app.use(bodyParser.json())

url = 'mongodb://localhost:27017/myproject'
client = Promise.promisify(MongoClient.connect, MongoClient)(url)
app.use((req, res, next)->
  client.then((db)->
    req.db = {
      events: db.collection('events')
      users: db.collection('users')
    }
    next()
  )
  .catch((e)->
    console.log(e)
    throw e
  )
)


app.set('jwtTokenSecret', 'YOUR_SECRET_STRING')

app.get('/users', (req, res)->
  {username, password} = req.body
  if username? and password?
    req.db.users.find({username, password}).toArray (err, users)->
      throw err if err?
      assert users.length <= 1
      if users.length == 0
        res.status(404).json(error: 'no user with such username/password')
      else
        token = jwt.encode({
          iss: users[0]._id,
        }, app.get('jwtTokenSecret'))
        res.status(200).json({
          username,
          token
          socket: 'some address'
        })

  else
    res
      .status(400)
      .json(
        error:  'username and password'
      )
)

app.post('/users', (req, res)->
  {username, password} = req.body
  if username? and password?
    req.db.users.find({username}).toArray (err, users)->
      assert users.length <= 1
      if users.length == 1
        res
          .status(400)
          .json(
            error: 'there is a user with such id'
          )
      else
        req.db.users.insert({username, password}, (err)->
          throw err if err?
          res.status(201).end()
        )
  else
    res
      .status(400)
      .json(
        error:  'username and password'
      )
)


app.get('/events', (req, res) ->
  req.db.events.find({}).toArray((err, events)->
    throw err if err?
    console.log(events)
    res.json({events})
  )
)

app.post('/events', [auth], (req, res) ->
  date = new Date
  req.db.events.insert({date, userId: req.user._id }, (err, result) ->
    res.json(result)
  )
)

if IS_DEVELOPMENT
  #app.use('/static', express.static(__dirname + "/static"))
  app.use('/static', express.static(__dirname + "/s"))

  app.get('/', (req, res) ->
    res.sendFile(__dirname + "/static/views/index.html")
  )

app.listen(8000)
console.log('started!')
