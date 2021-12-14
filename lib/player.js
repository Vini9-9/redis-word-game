/*
  Provides access to Players.
  Redis Key:
    players:{email}
  Redis Schema:
    Hash: {
      email: 'email'
      passwordHash: 'hash'
    }
 */
'use strict';

module.exports = {
  createPlayer: createPlayer,
  getPlayer: getPlayer
};

var redis = require('./redis');
var utility = require('./utility');

var PREFIX = 'player';

/* Schema

Key:
  player: {email}

Value:
  email: {email}
  name: {name}
  password: {password}
*/

/// Public

function createPlayer(email, name, password, cb) {
  // call getPlayer to see if email already exists
  getPlayer(email, function(err, player) {
    if (err) { return cb(err); }
    // if id exists, return error
    if (player) { return cb(new Error('Email já cadastrado')); }
    // create a player object
    player = { email: email, name: name, password: password };
    // make a key
    var key = makeKey(email);
    // save the player (HMSET)
    redis.HMSET(key, player, function (err){
      if(err) {return cb(err)};
      cb(err, player);
    })
  });
}

function getPlayer(email, cb) {
  // make a key
  // return the Redis hash (HGETALL)
  var key = makeKey(email);
  redis.HGETALL(key, cb);
}

/// Private

function makeKey(email) {
  return utility.makeKey(PREFIX, email);
}
