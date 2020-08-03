
export interface Paging<T>
{
  count: number;
  rows: T[]
}

export type uuid = string;

export type Path<T> = 
{
  [P in keyof T]: T[P] extends object ? Path<T[P]> : string;
};