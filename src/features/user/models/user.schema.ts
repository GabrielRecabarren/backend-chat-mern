import { IUserDocument } from '../interfaces/userDocument.interface';
import mongoose, { model, Model, Schema } from 'mongoose';

const userSchema: Schema = new Schema({

});

//Fuera del esquema le digo que quiero pasarlo exportado a la base de datos
const UserModel: Model<IUserDocument> = model<IUserDocument>('User', userSchema, 'User');

export { UserModel };
