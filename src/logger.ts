import { createLogger, format, transports } from "winston";
import { consoleFormat } from "winston-console-format";

const {LOG_DIR} = process.env;

// Logger

export const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
      ),
    transports: [
        new transports.File({ filename: `${LOG_DIR}/error.log`, level: 'error' }),
        new transports.File({ filename: `${LOG_DIR}/combined.log` }),
        new transports.Console({
            format: format.combine(
              format.colorize({ all: true }),
              format.padLevels(),
              consoleFormat({
                showMeta: true,
                metaStrip: ["timestamp", "service"],
                inspectOptions: {
                  depth: Infinity,
                  colors: true,
                  maxArrayLength: Infinity,
                  breakLength: 120,
                  compact: Infinity,
                },
              })
            ),
          }),
    ]
})