
import * as postmark from 'postmark';

import { getEmailTemplate } from './functions';
import { EMAIL_FROM, EMAIL_SERVER_CLIENT } from './constants';

export interface Templates {
  register: string;
  error: string;
}

export const templatesHTML: Templates = {
  register: getEmailTemplate('register.html'),
  error: getEmailTemplate('error.html')
};

export const templatesTEXT: Templates = {
  register: getEmailTemplate('register.txt'),
  error: getEmailTemplate('error.txt')
};

export const client = new postmark.ServerClient(EMAIL_SERVER_CLIENT);

export async function sendEmail(email: {
  to: string,
  subject: string,
  template: keyof Templates,
  vars: object
})
{
  const html = injectVars(templatesHTML[email.template], email.vars);
  const text = injectVars(templatesTEXT[email.template], email.vars);
  
  return await client.sendEmail({
    "From": EMAIL_FROM,
    "To": email.to,
    "Subject": email.subject,
    "TextBody": text,
    "HtmlBody": html
  });
}

export function injectVars (content: string, vars: object): string
{
  for (let varName in vars) 
  {
    content = content.replace(new RegExp(`\\[\\[${varName}\\]\\]`, 'g'), vars[varName]);
  } 

  return content;
}