
import { date, str } from 'valid8or';
import { ValidationFor, UserProfileUpdate } from '../types';
import { validationPath } from '../paths';
import { USER_NAME_MIN, USER_NAME_MAX, EMAIL_MAX, PUBLIC_NAME_MIN, PUBLIC_NAME_MAX, PRIVATE_NAME_MIN, PRIVATE_NAME_MAX } from '../constants';

export const update: ValidationFor<UserProfileUpdate> = 
{
  public_name: str()
    .required().message(validationPath.user.public_name.required)
    .trim()
    .minLength(PUBLIC_NAME_MIN).message(validationPath.user.public_name.minLength)
    .maxLength(PUBLIC_NAME_MAX).message(validationPath.user.public_name.maxLength),
  private_name: str()
    .required().message(validationPath.user.private_name.required)
    .trim()
    .minLength(PRIVATE_NAME_MIN).message(validationPath.user.private_name.minLength)
    .maxLength(PRIVATE_NAME_MAX).message(validationPath.user.private_name.maxLength),
  birthdate: date().optional(),
  user_name: str()
    .required().message(validationPath.user.user_name.required)
    .trim()
    .minLength(USER_NAME_MIN).message(validationPath.user.user_name.minLength)
    .maxLength(USER_NAME_MAX).message(validationPath.user.user_name.maxLength),
  email: str()
    .required().message(validationPath.user.email.required)
    .trim()
    .maxLength(EMAIL_MAX).message(validationPath.user.email.maxLength)
    .email().message(validationPath.user.email.email)
    .normalizeEmail()
};
