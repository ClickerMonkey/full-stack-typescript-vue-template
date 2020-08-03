
import { Path } from './types';

export function pathsFor<T extends object> (item: T, initialPath: string): Path<T>
{
  const out: any = {};

  for (let prop in item)
  {
    const key = initialPath + '.' + prop;
    const value = item[prop];

    if (typeof value === 'object')
    {
      out[prop] = pathsFor(value as unknown as object, key)
    }
    else
    {
      out[prop] = key;
    }
  }

  return out as Path<T>;
}