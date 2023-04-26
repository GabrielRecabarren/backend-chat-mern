import mongoose, { Document, ObjectId } from 'mongoose';


export interface IUser{
    _id: string | ObjectId;//Hash único
    authId: string | ObjectId;
    username: string ;
    email: string;
    password?: string;
    avatarColor: string;
    uId: string; //nos permite recuperar claves de la cache(redis)
    postsCount: number;
    work: string;
    school: string;
    quote: string;
    location: string;
    blocked: mongoose.Types.ObjectId[];
    blockedBy: mongoose.Types.ObjectId[];
    followersCount: number;
    followingCount: number;
    notifications: INotificationSettings;
    social: ISocialLinks;
    bgImageVersion: string;
    bgImageId: string;
    profilePicture:string;
    passwordResetToken?: string;
    passwordResetExpires?: number | string;
    createdAt: Date;
}
