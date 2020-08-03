import { Validator } from 'valid8or';
export declare type ValidationFor<T> = {
    [P in keyof T]: Validator<T[P]>;
};
