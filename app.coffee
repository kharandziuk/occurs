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
    console.log 'here'
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

jwauth = require('./lib/jwauth')(app, C.users)

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
          iss: user._id,
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
        req.db.insert({username, password}, (err)->
          throw err if err?
          res.status(201).end()
        )
    req.db.users.count((err, count)->
      res.json({count})
    )
  else
    res
      .status(400)
      .json(
        error:  'username and password'
      )
)


app.get('/events', [auth], (req, res) ->
  req.db.events.count((err, count)->
    res.json({count})
  )
)

app.post('/events', [auth], (req, res) ->
  date = new Date
  req.db.events.insert({date}, (err, result) ->
    res.json(date)
  )
)

if IS_DEVELOPMENT
  app.use('/static', express.static(__dirname + "/static"))

  app.get('/', (req, res) ->
    response.sendFile(__dirname + "static/views/index.html")
  )

app.listen(8000)
