
import { Request } from 'express';
import { Op, OrderItem, WhereOptions, FindAndCountOptions, IncludeOptions, FindOptions } from 'sequelize';
import { Model } from 'sequelize-typescript';


export type SearchOrdering = {
  [order: string]: OrderItem[]
};

export type SearchField = string[] | string;

export class SearchHelper<T>
{

  public request: Request;
  public defaultLimit = 10;
  public limit: number;
  public offset: number;
  public where: WhereOptions;
  public order: OrderItem[];
  public orderings: SearchOrdering;
  public include: IncludeOptions[]

  public constructor (request: Request, where: WhereOptions = {})
  {
    this.request = request;
    this.where = where;
  }

  public require (param: string): void
  {
    if (!this.has(param))
    {
      throw `${param} is required for searching`;
    }
  }

  public addInclude (include: IncludeOptions): void
  {
    if (!this.include)
    {
      this.include = [];
    }

    this.include.push(include);
  }

  public addWhere (field: SearchField, value: any)
  {
    this.applyWhere(this.where, value, field);
  }

  public addNumberWhere (param: string, field: SearchField = param, min: number | false = false, max: number | false = false): boolean
  {
    if (!this.has(param))
    {
      return false;
    }

    const original = this.get(param);

    const checkNumber = (x: any): number => 
    {
      const parsed = parseFloat(x);

      if (min !== false && parsed < min)
      {
        throw `The value ${parsed} in ${param} is less than the allowed minimum`;
      }

      if (max !== false && parsed > max)
      {
        throw `The value ${parsed} in ${param} is greater than the allowed maximum`;
      }

      return parsed;
    };

    if (Array.isArray(original))
    {
      const parsed = original.map( checkNumber );

      this.applyWhere(this.where, { [Op.in]: parsed }, field);
    }
    else
    {
      const parsed = checkNumber(original);

      this.applyWhere(this.where, parsed, field);
    }

    return true;
  }

  public addExactWhere (param: string, field: SearchField = param): boolean
  {
    if (!this.has(param))
    {
      return false;
    }

    const value = this.get(param);

    this.applyWhere(this.where, value, field);

    return true;
  }

  public addInsensitiveWhere (param: string, field: SearchField = param): boolean
  {
    if (!this.has(param))
    {
      return false;
    }

    const value = this.get(param);

    this.applyWhere(this.where, { [Op.iLike]: value }, field);

    return true;
  }

  public addLikeWhere (param: string, field: SearchField = param, startsOnly: boolean = false): boolean
  {
    if (!this.has(param))
    {
      return false;
    }

    const value = this.get(param);
    const liked = startsOnly
      ? `${value}%`
      : `%${value}%`;

    this.applyWhere(this.where, { [Op.iLike]: liked }, field);

    return true;
  }

  public addDefault (param: string, value: any): void
  {
    if (!this.has(param))
    {
      this.request.query[param] = value;
    }
  }

  public restrictLimit (): void
  {
    if (!isFinite(this.limit))
    {
      this.limit = this.defaultLimit;
    }
  }

  public restrictLimitConditionally (param: string, perCharacter: number): boolean
  {
    if (!this.has(param))
    {
      return false;
    }

    const value = this.get(param);

    if (!isFinite(this.limit))
    {
      if (typeof value === 'string')
      {
        this.limit = this.defaultLimit * value.length;
      }
      else
      {
        this.limit = this.defaultLimit;
      }
    }

    return true;
  }

  public applyWhere (where: WhereOptions, value: any, field: SearchField): void
  {
    if (Array.isArray(field))
    {
      const or = {};

      for (let i = 0; i < field.length; i++)
      {
        or[field[i]] = value;
      }

      where[Op.or] = or;
    }
    else
    {
      where[field] = value;
    }
  }

  public setOrderings (orderings: SearchOrdering): void
  {
    this.orderings = orderings;
  }

  public applyOrder (orderProperty: string = 'order', required: boolean = true): boolean
  {
    if (!this.has(orderProperty))
    {
      return false;
    }

    const value = this.get(orderProperty);

    if (!this.orderings[value])
    {
      if (required)
      {
        throw `Invalid order ${value}`;
      }

      return false;
    }

    this.order = this.orderings[value];

    return true;
  }

  public applyPaging (limitProperty: string = 'limit', offsetProperty: string = 'offset'): boolean
  {
    if (!this.has(limitProperty))
    {
      return false;
    }

    const limitOriginal = this.get(limitProperty);
    const offsetOriginal = this.get(offsetProperty);

    let limit = parseInt(limitOriginal);
    let offset = parseInt(offsetOriginal);

    if (!isFinite(limit))
    {
      throw `Limit ${limitOriginal} is not valid`;
    }

    if (offsetOriginal && !isFinite(offset))
    {
      throw `Offset ${offsetOriginal} is not valid`;
    }
    else if (!isFinite(offset))
    {
      offset = 0;
    }

    this.limit = limit;
    this.offset = offset;

    return true;
  }

  public getOptions(options: FindOptions = {}): FindOptions
  {
    const { order, limit, offset, where, include } = this;

    if (order !== undefined) options.order = order;
    if (limit !== undefined) options.limit = limit;
    if (offset !== undefined) options.offset = offset;
    if (Object.keys(where).length) options.where = where;
    if (include !== undefined) options.include = include;

    return options;
  }

  public has (property: string): boolean
  {
    return this.get(property) !== undefined;
  }

  public get (property: string): any
  {
    if (property in this.request.query)
    {
      return this.request.query[property];
    }

    if (property in this.request.body)
    {
      return this.request.body[property];
    }
  }

}