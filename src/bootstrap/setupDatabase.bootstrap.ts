import mongoose from 'mongoose';
import { config } from '../config';
import Logger from 'bunyan';

const log: Logger = config.createLogger('setupDatabase');

export default () => {
    const connect = () => {
        mongoose
            .connect(`${config.DATABASE_URL}`)
            .then(() => {
                log.info('Succesfuly connected to database');
            })
            .catch(error => {
                log.error('Error connecting to database', error);
                return process.exit(1);
            });
    };
    connect();

    mongoose.connection.on('disconnected', connect); //retry connection to server -> 1:retry, 2: cancel manually
};
