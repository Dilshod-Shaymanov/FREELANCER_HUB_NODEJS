import { createLogger, format, transports } from "winston";
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp}  ${level}: ${message}`;
});

const logger = createLogger({
  format: combine(timestamp(), myFormat),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "./log/error.log", level: "info" }),
  ],
});
logger.exitOnError = false;
logger.exceptions.handle(
  new transports.File({ filename: "./log/exceptions.log" })
);
logger.rejections.handle(
  new transports.File({ filename: "./log/rejections.log" })
);
export default logger;
