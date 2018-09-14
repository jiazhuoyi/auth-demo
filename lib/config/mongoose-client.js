const mongoose = require('mongoose');
const fs = require('fs');

const config = require('../../config');

const dbUrl = `mongodb://${config.mongo.ip}:${config.mongo.port}/${config.mongo.db}`;

mongoose.connect(dbUrl, {useNewUrlParser:true}, function(err) {
    if(err) {
      console.log('Connection Error:', err);
    } else {
      console.log('mongodb连接成功!!!');
    }
});

var models_path = __dirname + '/../models';

var walk = function(path) {
  fs
    .readdirSync(path)
    .forEach(function(file) {
      var newPath = path + '/' + file
      var stat = fs.statSync(newPath)
      if (stat.isFile()) {
        if (/(.*)\.(js|coffee)/.test(file)) { 
          require(newPath)
        }
      }
      else if (stat.isDirectory()) {
        walk(newPath)
      }
    })
};
walk(models_path);