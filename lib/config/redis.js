'user strict';

const Redis = require('ioredis');

let pub = {};
let redis = {};

exports.connectRedis = function(config) {
  redis = new Redis(config);
  pub = new Redis(config);
  redis.once('connect', () => {
    console.log('redis连接成功');
  }, (error) => {
    console.log('连接失败：', error);
  });
  redis.on('reconnecting', () => console.log('Redis reconnetcing....'));

  redis.once('message', (channel, msg) => {
    console.log('监听到：', channel, msg);
  })
}

exports.getRedis = function() {
  return {
    redis,
    pub
  };
}

