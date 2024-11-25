'use server'

import { Resend } from 'resend';

const resend = new Resend('re_LF9FiD6g_Hd5NxSaDYGFeDUbTALk6NtGq');

export async function sendOrderConfirmation(email: string, amount: number) {
  try {
    await resend.emails.send({
      from: 'Neil <neilteje135@gmail.com>',
      to: email,
      subject: 'Thank you for your order!',
      html: `
        <h1>Thank you for checking out our product!</h1>
        <p>Our market isn't fully functional yet, but your order for $${amount.toFixed(2)} has been recorded and we will process it once we go live!</p>
        <p>We appreciate your interest in LePhoning!</p>
      `
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: 'Failed to send confirmation email' };
  }
}

