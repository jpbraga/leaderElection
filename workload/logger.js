const winston = require('winston');

const logLevels = {
    "error": 0,
    "warn": 1,
    "info": 2,
    "http": 3,
    "verbose": 4,
    "debug": 5,
    "silly": 6
  }
  
  const defaultLevel = process.env.LOG_LEVEL? process.env.LOG_LEVEL : "info";
  
  const logger = winston.createLogger({
    levels: logLevels,
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [new winston.transports.Console({ level: defaultLevel ? defaultLevel : "info" })],
  });

  module.exports = {
      logger
  }