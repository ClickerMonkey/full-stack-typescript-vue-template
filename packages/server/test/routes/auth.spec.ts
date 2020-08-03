
import { expect } from 'chai';
import 'mocha';

import { call, newSession, clearRequest, globalRequest } from '../base'
import routes from '../../src/routes';
import { Status } from '../../src/routes/base';

describe('routes.auth', () => 
{

  it('not logged in', async () => 
  {
    const [req, res] = await call(routes.auth.get, {});

    res.expect(Status.SUCCESS, undefined);
  });

  it('logged in', async () => 
  {
    const [req, res] = await call(routes.auth.get, {
      session: newSession('123', 'user@domain.com')
    });

    res.expect(Status.SUCCESS, {
      id: '123',
      email: 'user@domain.com',
    });
  });

  it('missing email', async () => 
  {
    const [req, res] = await call(routes.auth.register, {
      body: { 
        email: '' 
      }
    });

    res.expect(Status.BADREQUEST, 'missing');

    expect(req.session.user).to.be.undefined;
  });

  it('missing name', async () => 
  {
    const [req, res] = await call(routes.auth.register, {
      body: { 
        email: 'user@domain.com' 
      }
    });

    res.expect(Status.BADREQUEST, 'missing');

    expect(req.session.user).to.be.undefined;
  });

  it('missing password', async () => 
  {
    const [req, res] = await call(routes.auth.register, {
      body: { 
        email: 'user@domain.com',
        user_name: 'ClickerMonkey'
      }
    });

    res.expect(Status.BADREQUEST, 'missing');

    expect(req.session.user).to.be.undefined;
  });

  it('password mismatch', async () => 
  {
    const [req, res] = await call(routes.auth.register, {
      body: { 
        email: 'user@domain.com',
        user_name: 'ClickerMonkey',
        password: 'tacobell',
        password_again: 'tacobelldddd'
      }
    });

    res.expect(Status.BADREQUEST, 'mismatch');

    expect(req.session.user).to.be.undefined;
  });

  it('register success', async () => 
  {
    const [req, res] = await call(routes.auth.register, {
      body: { 
        email: 'user@domain.com',
        user_name: 'ClickerMonkey',
        password: 'password',
        password_again: 'password'
      }
    });

    res.expect(Status.SUCCESS);

    expect(req.session.user).to.deep.include({
      email: 'user@domain.com',
    });
  });

});



