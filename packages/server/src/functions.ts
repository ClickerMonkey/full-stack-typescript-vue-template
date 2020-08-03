
import { EPSILON } from 'common';

import { readFileSync } from 'fs';
import { resolve } from 'path';


export function equalsNumber(a: number, b: number) 
{
  return Math.abs(a - b) < EPSILON;
}

export function equalsAny (a: any, b: any) 
{
  if (a === b) {
    return true;
  }

  const at = typeof a;
  const bt = typeof b;
  if (at !== bt) {
    return false;
  }

  const aarr = a instanceof Array;
  const barr = b instanceof Array;
  if (aarr !== barr) {
    return false;
  }

  const adate = a instanceof Date;
  const bdate = b instanceof Date;
  if (adate !== bdate) {
    return false;
  }

  if ((a === null) !== (b === null)) {
    return false;
  }

  if (adate) {
    return a.getTime() === b.getTime();
  }

  if (aarr) {
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (!equalsAny(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }

  if (at === 'object') {

    for (let prop in a) {
      if (!(prop in b)) {
        return false;
      }
      if (!equalsAny(a[prop], b[prop])) {
        return false;
      }
    }

    for (let prop in b) {
      if (!(prop in a)) {
        return false;
      }
    }
    return true;
  }

  return false;
}

export function arrayToMap <T>(array: T[], property: keyof T): { [key: string]: T }
{
  const map = {};

  for (let i = 0; i < array.length; i++) 
  {
    const item = array[i];

    if (property in item) 
    {
      map[item[property] as any as string] = item;
    }
  }

  return map;
}

export const QUERY_CACHE: { [file: string]: string } = {};

export function getQuery (file: string): string
{
  const full = resolve(__dirname, '../src/query/' + file);

  if (full in QUERY_CACHE)
  {
    return QUERY_CACHE[full];
  }

  return QUERY_CACHE[full] = readFileSync(full).toString();
}

export const TEMPLATE_CACHE: { [file: string]: string } = {};

export function getEmailTemplate (file: string): string
{
  const full = resolve(__dirname, '../src/emails/' + file);

  if (full in QUERY_CACHE)
  {
    return TEMPLATE_CACHE[full];
  }

  return TEMPLATE_CACHE[full] = readFileSync(full).toString();
}

export function bitCompare (a: number, b: number)
{
  const added = (a ^ b) & b;
  const removed = (a ^ b) & a;
  const addedCount = bitCount(added);
  const removedCount = bitCount(removed);

  return { added, addedCount, removed, removedCount };
}

export function bitCount (n: number): number 
{
  n = n - ((n >> 1) & 0x55555555)
  n = (n & 0x33333333) + ((n >> 2) & 0x33333333)
  return ((n + (n >> 4) & 0xF0F0F0F) * 0x1010101) >> 24
}