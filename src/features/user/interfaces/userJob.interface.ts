import { INotificationSettings } from './notificationsSettinfs.interface';
import { IUserDocument } from './userDocument.interface';

export interface IUserJob {

    keyOne?: string;
    keyTwo?: string;
    value?: string | INotificationSettings | IUserDocument;

}
