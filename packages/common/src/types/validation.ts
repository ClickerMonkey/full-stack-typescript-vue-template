import { Validator } from 'valid8or';

export type ValidationFor<T> =
{
  [P in keyof T]: Validator<T[P]>
}