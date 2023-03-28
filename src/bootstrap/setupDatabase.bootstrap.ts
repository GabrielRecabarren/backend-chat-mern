import mongoose from 'mongoose';
import { config } from '../config';



export default () => {
    const connect = () => {
        mongoose
            .connect(`${config.DATABASE_URL}`)
            .then(() => {
                console.log('Succesfully connected to database');
            })
            .catch((error) => {
                console.log('Error connecting to database', error);
                return process.exit(1);
            });
    };
    connect();

    mongoose.connection.on('disconnected', connect); //retry connection to server -> 1:retry, 2: cancel manually
};
