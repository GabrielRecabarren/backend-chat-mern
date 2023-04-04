import { ieNoOpen } from 'helmet';
import HTTP_STATUS from 'http-status-codes';

export interface IErrorResponde {
    message: string;
    statusCode: number;
    status: string;
    serializeErrors(): IError;


}

export interface IError {
    message: string;
    statusCode:number;
    status: string;
}

