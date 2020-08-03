
import { validations } from 'common';
import { body } from '../validation';


export const get = [

];

export const register = [
  body(validations.auth.register)
];

export const login = [
  body(validations.auth.login)
];

export const logout = [

];