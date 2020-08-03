
import { EMAIL_MAX, PASSWORD_MIN, PASSWORD_MAX, USER_NAME_MIN, USER_NAME_MAX, PUBLIC_NAME_MIN, PUBLIC_NAME_MAX, PRIVATE_NAME_MIN, PRIVATE_NAME_MAX, LOGIN_ID_MIN } from '../constants';
import { str } from 'valid8or';
import { RegisterRequest, ValidationFor, LoginRequest } from '../types';
import { validationPath } from '../paths';


export const register: ValidationFor<RegisterRequest> = {
  email: str()
    .required().message(validationPath.user.email.required)
    .trim()
    .maxLength(EMAIL_MAX).message(validationPath.user.email.maxLength)
    .email().message(validationPath.user.email.email)
    .normalizeEmail(),
  password: str()
    .required().message(validationPath.auth.register.password.required)
    .trim()
    .minLength(PASSWORD_MIN).message(validationPath.auth.register.password.minLength)
    .maxLength(PASSWORD_MAX).message(validationPath.auth.register.password.maxLength),
  user_name: str()
    .required().message(validationPath.user.user_name.required)
    .trim()
    .minLength(USER_NAME_MIN).message(validationPath.user.user_name.minLength)
    .maxLength(USER_NAME_MAX).message(validationPath.user.user_name.maxLength),
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
};

export const login: ValidationFor<LoginRequest> = {
  id: str()
    .required().message(validationPath.auth.login.id.required)
    .trim()
    .minLength(LOGIN_ID_MIN).message(validationPath.auth.login.id.minLength),
  password: str()
    .required().message(validationPath.auth.login.password.required)
    .trim()
    .minLength(PASSWORD_MIN).message(validationPath.auth.login.password.minLength)
    .maxLength(PASSWORD_MAX).message(validationPath.auth.login.password.maxLength)
};
