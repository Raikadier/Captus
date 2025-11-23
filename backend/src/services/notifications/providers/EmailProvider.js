import dotenv from 'dotenv';
dotenv.config();

class EmailProvider {
  constructor() {
    this.apiKey = process.env.RESEND_API_KEY;
    this.from = process.env.RESEND_FROM || 'Captus <noreply@captus.app>'; // Default if not set
  }

  async sendEmail({ to, subject, html, text }) {
    if (!this.apiKey) {
      console.warn('Resend API Key is missing. Skipping email.');
      return { success: false, error: 'Missing API Key' };
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          from: this.from,
          to: [to],
          subject: subject,
          html: html,
          text: text
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Resend API Error:', errorData);
        return { success: false, error: errorData };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new EmailProvider();
