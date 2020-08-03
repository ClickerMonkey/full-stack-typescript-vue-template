
import * as useragent from 'express-useragent';
import { Request, Response } from 'express';
import { Auth, validationPath } from 'common';

import { User } from '../models/User';
import { EMAIL_ERRORS_TO } from '../constants';
import { sendEmail } from '../email';



export class HandlerStatus 
{
  public status: number;
  public body: any;

  public constructor (status: number, body?: any) 
  {
    this.status = status;
    this.body = body;
  }

  public withBody (body: any): HandlerStatus
  {
    return new HandlerStatus(this.status, body);
  }

  public send(res: Response): void 
  {
    if (this.body)
    {
      res.status(this.status).json(this.body);
    } 
    else 
    {
      res.sendStatus(this.status);
    }
  }

  public withFailures(failures: any) 
  {
    return this.withBody({ failures });
  }
}

export const Status = {
  SUCCESS:          new HandlerStatus(200),
  CREATED:          new HandlerStatus(201),
  ACCEPTED:         new HandlerStatus(202),
  NOCONTENT:        new HandlerStatus(204),
  BADREQUEST:       new HandlerStatus(400),
  UNAUTHORIZED:     new HandlerStatus(401),
  PAYMENT:          new HandlerStatus(402),
  FORBIDDEN:        new HandlerStatus(403),
  NOTFOUND:         new HandlerStatus(404),
  NOTALLOWED:       new HandlerStatus(405),
  NOTACCEPTABLE:    new HandlerStatus(406),
  TIMEOUT:          new HandlerStatus(408),
  CONFLICT:         new HandlerStatus(409),
  GONE:             new HandlerStatus(410),
  ERROR:            new HandlerStatus(500),
  NOTIMPLEMENTED:   new HandlerStatus(501),

  withFailures(failures: any) {
    return Status.BADREQUEST.withBody({ failures });
  }
};

export class HandlerError extends Error 
{
  public status: number;

  constructor(message, statusObject = Status.ERROR) {
      super(message);
      this.status = statusObject.status;
      Error.captureStackTrace(this, HandlerError);
  }
}

export type HandlerDefault = (req: Request, res: Response) => void;

export function handleCaughtError(e: Error, req?: Request, res?: Response)
{
  console.error(e);

  if (res)
  {
    res.status(Status.ERROR.status).json({
      error: e.message
    });
  }

  if (!req) 
  {
    return;
  }

  trying(async () => {
    sendEmail({
      to: EMAIL_ERRORS_TO,
      subject: 'Site Error',
      template: 'error',
      vars: {
        error: e.stack,
        path: req.path,
        method: req.method,
        host: req.hostname,
        ip: req.ip,
        user: req.session.user ? req.session.user.id : null,
        params: JSON.stringify(req.params, null, 2),
        body: JSON.stringify(req.body, null, 2),
        query: JSON.stringify(req.query, null, 2),
        userAgent: JSON.stringify(useragent.parse(req.headers['user-agent']), null, 2)
      }
    });
  });
}

export async function trying(callback: () => Promise<void>, req?: Request)
{
  try
  {
    await callback();
  }
  catch (e)
  {
    handleCaughtError(e, req);
  }
}

export function handleResult(res: Response, result: any): void 
{
  if (result instanceof HandlerStatus) 
  {
    result.send(res);
  } 
  else 
  {
    res.json(result);
  }
}

export type HandlerAuth = (req: Request, res: Response, auth: Auth) => Promise<any>;

export function handlerWithAuth(getResults: HandlerAuth): HandlerDefault
{
  return async (req: Request, res: Response) => 
  {
    if (req.session.user) 
    {
      try 
      {
        const result = await getResults(req, res, req.session.user as Auth);

        handleResult(res, result);
      } 
      catch (e) 
      {
        handleCaughtError(e, req, res);
      }
    } 
    else 
    {
      handleResult(res, Status.UNAUTHORIZED);
    }
  };
};

export type HandlerOptionalUser = (req: Request, res: Response, user?: User, auth?: Auth) => Promise<any>;

export function handlerWithOptionalUser(getResults: HandlerOptionalUser): HandlerDefault
{
  return async (req: Request, res: Response) =>
  {
    if (req.session.user)
    {
      return await handlerWithUser(getResults)(req, res);
    }
    else
    {
      return await handler(getResults)(req, res);
    }
  };
}

export type HandlerUser = (req: Request, res: Response, user: User, auth: Auth) => Promise<any>;

export function handlerWithUser(getResults: HandlerUser): HandlerDefault
{
  return async (req: Request, res: Response) => 
  {
    if (req.session.user) 
    {
      const user = await User.fromSession(req);

      if (user && user.isValid()) 
      {
        try 
        {
          const result = await getResults(req, res, user, req.session.user);

          handleResult(res, result);
        } 
        catch (e) 
        {
          handleCaughtError(e, req, res);
        }
      } 
      else 
      {
        handleResult(res, Status.UNAUTHORIZED);
      }
    } 
    else 
    {
      handleResult(res, Status.UNAUTHORIZED);
    }
  };
};

export function handler(getResults: HandlerDefault): HandlerDefault 
{
  return async (req, res) => 
  {
    try 
    {
      const result = await getResults(req, res);

      handleResult(res, result);
    } 
    catch (e) 
    {
      handleCaughtError(e, req, res);
    }
  };
}