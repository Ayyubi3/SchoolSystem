const winston = require('winston');

const logger = winston.createLogger({
  level: "info",
  levels: {
    error: 0, // Critical errors
    warn: 1,  // Something may be wrong
    info: 2,  // info for example if someone creates a user
    debug: 3 // everything
  },
  format: winston.format.json(),
  transports: [
    //
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: 'combined.log', level: "debug" }),
  ],
});

winston.addColors({

  error: 'bold red blackBG',
  warn: 'underline yellow',
  info: 'white',
  debug: 'dim grey'

})

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.ENV !== 'PROD') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}


module.exports = { logger }
