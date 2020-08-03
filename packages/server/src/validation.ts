
import { getRouteHandler } from 'valid8or';
import { Request, Response } from 'express';



export function onFailure(failures: object, req: Request, res: Response)
{
  res.status(400).json({ failures });
}

export const query = getRouteHandler<Request, Response>('query', onFailure);

export const param = getRouteHandler<Request, Response>('params', onFailure);

export const body = getRouteHandler<Request, Response>('body', onFailure);

export const session = getRouteHandler<Request, Response>('session', onFailure);
