import * as auth from './auth';
import * as user from './user';
export declare const validations: {
    id: import("valid8or").ValidatorString;
    optionalId: import("valid8or").ValidatorString;
    auth: typeof auth;
    user: typeof user;
};
