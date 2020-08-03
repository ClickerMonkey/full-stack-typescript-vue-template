
import { expect } from 'chai';
import { Request, Response } from 'express';
import { Auth } from 'common';

import { HandlerDefault, HandlerStatus } from '../src/routes/base';
import './database';


export interface RequestInput
{
  session: { user?: Auth }
  body: any
  params: { [key: string]: string }
  query: { [key: string]: string }
}

export const globalRequest: RequestInput = {
  session: {},
  body: null,
  params: {},
  query: {}
};

export function newRequest(input: Partial<RequestInput>): Request
{
  const r = {
    session: input.session || globalRequest.session,
    body: input.body || globalRequest.body,
    params: input.params || globalRequest.params,
    query: input.query || globalRequest.query
  };

  return r as unknown as Request;
}

export function clearRequest(): void
{
  globalRequest.session = null;
  globalRequest.body = null;
  globalRequest.params = {};
  globalRequest.query = {};
}

export interface ResponseInput
{
  status (status: number): Response
  sendStatus (status: number): Response
  json (data?: any): Response
  send (data?: any): Response

  responded: boolean
  responseStatus: number
  responseData: any

  expect(status: HandlerStatus, result?: any): void
}

export function newResponse(): ResponseInput
{
  const response = {
    responded: false,
    responseStatus: 200,
    responseData: undefined,

    status (status: number): Response {
      this.responseStatus = status;
      return this;
    },
    sendStatus (status: number): Response {
      this.responded = true;
      this.responseStatus = status;
      return this;
    },
    json (data: any): Response {
      this.responded = true;
      this.responseData = data;
      return this;
    },
    send (data: any): Response {
      this.responded = true;
      this.responseData = data;
      return this;
    },
    expect(status: HandlerStatus, data?: any) {
      expect(this.responded).to.be.true;
      expect(this.responseStatus).to.equal(status.status);
      if (data !== undefined) {
        expect(this.responseData).to.deep.equal(data);
      }
    }
  };

  return response;
}

export async function call (handle: HandlerDefault, input: Partial<RequestInput>): Promise<[RequestInput, ResponseInput]>
{
  const req = newRequest(input);
  const res = newResponse();

  await handle(req, res as unknown as Response);

  return [req as unknown as RequestInput, res];
}

export function newSession (id: string, email: string): { user: Auth }
{
  return {
    user: {
      id,
      email,
      public_name: email,
      private_name: email,
      user_name: email
    }
  };
}