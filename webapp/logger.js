
import { createLogger, transports, format } from 'winston';

const logger = createLogger({
    level: 'debug',
    format: format.combine(format.timestamp(), format.json()),
    // transports: [new transports.File({ filename: 'app.log' })],
    transports: [new transports.Console()]
})

export default logger;

