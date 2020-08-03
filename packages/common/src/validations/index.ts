
import { str } from 'valid8or';
import { validationPath } from '../paths';


import * as auth from './auth';
import * as user from './user';



const id = str()
  .required().message(validationPath.generic.id.required)
  .uuid().message(validationPath.generic.id.uuid)

const optionalId = str()
  .optional()
  .uuid().message(validationPath.generic.id.uuid)


export const validations = 
{
  id,
  optionalId,
  auth,
  user
}