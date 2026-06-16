import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

// This API key must be added to your Vercel Environment Variables
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message } = request.body;

    // Basic validation
    if (!name || !email || !message) {
      return response.status(400).json({ error: 'Missing required fields' });
    }

    // Send the email
    // If you haven't verified a domain in Resend yet, you MUST use 'onboarding@resend.dev'.
    // Once your domain is verified, you can set RESEND_FROM_EMAIL in your env vars.
    const senderEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    const { data, error } = await resend.emails.send({
      from: `AIC Website <${senderEmail}>`,
      to: ['jyzdigihub@gmail.com'], 
      reply_to: email,
      subject: `[Inquiry] ${subject}: ${name}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
          <h2 style="color: #dc2626; border-bottom: 1px solid #eee; padding-bottom: 10px;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Category:</strong> ${subject}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    if (error) {
      return response.status(400).json(error);
    }

    return response.status(200).json({ success: true, data });
  } catch (error) {
    return response.status(500).json({ error: 'Internal server error' });
  }
}