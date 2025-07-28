import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);
// we export it so that we can import using this file anyware resend

