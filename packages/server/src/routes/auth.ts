
import { Request, Response } from 'express';
import { validationPath, UserStatus } from 'common';

import { User } from '../models/User';
import { handler, Status, trying } from './base';
import { MAX_LOGIN_ATTEMPTS, MAX_LOGIN_TIME } from '../constants';
import { sendEmail } from '../email';


/**
 * GET /auth
 */
export const get = handler(async (req: Request) => 
{
  return req.session.user;
});

/**
 * POST /auth
 */
export const register = handler(async (req: Request, res: Response) => 
{
  const { user_name, email, public_name, private_name, password, password_again, interests, search_location } = req.body;

  if (password !== password_again) 
  {
    return Status.withFailures({password: validationPath.auth.register.password.mismatch});
  }

  const sameEmail = await User.byEmail(email);

  if (sameEmail) 
  {
    return Status.withFailures({email: validationPath.user.email.duplicate});
  }

  const sameUser = await User.byUserName(user_name);

  if (sameUser) 
  {
    return Status.withFailures({user_name: validationPath.user.user_name.duplicate});
  }

  const salty = User.salt();
  const hashy = User.hash(salty, password);

  const user = await User.create({
    email:            email,
    user_name:        user_name,
    public_name:      public_name,
    private_name:     private_name,
    salt:             salty,
    password:         hashy,
    status:           UserStatus.PENDING,
    login_at:         null,
    login_attempts:   0,
    created_at:       new Date(),
  });
  
  const user_id = user.id;

  req.session.user = user.getAuth();

  trying(async () => {
    sendEmail({
      to: email,
      subject: 'Welcome to Site',
      template: 'register',
      vars: { private_name, user_id, email }
    });
  }, req); 

  return req.session.user;
});

/**
 * PUT /auth
 */
export const login = handler(async (req: Request, res: Response) => 
{
  const { id, password } = req.body;

  const user = await User.byId(id);

  if (!user || !user.isValid())
  {
    return Status.withFailures({id: validationPath.auth.login.id.notFound});
  }

  if (user.login_attempts >= MAX_LOGIN_ATTEMPTS) 
  {
    const elapsedTime = Date.now() - user.login_at.getTime();
    const inRange = elapsedTime < MAX_LOGIN_TIME;

    if (inRange) 
    {
      return Status.withFailures({id: validationPath.auth.login.id.wait});
    } 
    else 
    {
      await user.update({
        login_attempts: 0,
        login_attempt_at: null
      });
    }
  }

  const hashy = User.hash(user.salt, password);

  if (hashy !== user.password) 
  {
    await user.update({
      login_attempts: user.login_attempts + 1,
      login_attempt_at: new Date()
    });

    return Status.withFailures({password: validationPath.auth.login.password.wrong});
  }

  if (user.login_attempts !== 0) 
  {
    await user.update({
      login_attempt_at: null,
      login_attempts: 0
    });
  }
  
  req.session.user = user.getAuth();

  return req.session.user;
});

/**
 * DELETE /auth
 */
export const logout = handler(async (req: Request, res: Response) => 
{
  if (req.session.user)
  {
    req.session.user = null;
  }

  return Status.SUCCESS;
});
