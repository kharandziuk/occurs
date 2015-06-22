url = require('url')
jwt = require('jwt-simple')

module.exports = (req, res, next)->
  parsed_url = url.parse(req.url, true)
  ###
  * Take the token from:
  * 
  *  - the POST value access_token
  *  - the GET parameter access_token
  *  - the x-access-token header
  *    ...in that order.
  * 
  ###
  token = req.headers["authorization"]
  console.log(req.headers)
  console.log(token)
  {app} = req
  console.log(app.get('jwtTokenSecret'))
  decoded = jwt.decode(token, app.get('jwtTokenSecret'))
  console.log(decoded)
  if token?
    try
      console.log(app.get('jwtTokenSecret'))
      decoded = jwt.decode(token, app.get('jwtTokenSecret'))
    catch error
      console.log('here')
      null
    if decoded?
      ObjectID = require('mongodb').ObjectID
      req.db.users.findOne({ '_id': new ObjectID(decoded.iss) }, (err, user)->
        throw err if (err?)
        req.user = user
        return next()
      )
    else
      res.end('Not authorized', 401)
      return
  else
    res.end('Not authorized', 401)
    return
