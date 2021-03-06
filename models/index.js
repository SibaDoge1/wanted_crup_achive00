'use strict';

const isInMemory = true;

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const config = require(__dirname + '/../config/config.json');
const db = {};
const util = require('../util');

let isLogging = process.env.DBLOGGING ? Boolean(process.env.DBLOGGING) : false;

let sequelize;
if(isInMemory){
  sequelize = new Sequelize('sqlite::memory:', {'logging':isLogging});
}
else{
  sequelize = new Sequelize(config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});



db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.sequelize.sync().then( () => {
  util.log(" DB connected");
}).catch(err => {
  util.log("DB connection failed: ", err);
})

module.exports = db;
