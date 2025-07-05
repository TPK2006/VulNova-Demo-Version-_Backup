# EmailJS Setup Guide for VulNova Contact Form

This guide will help you set up EmailJS to send emails directly from the VulNova website without requiring users to have an email client.

## What is EmailJS?

EmailJS is a service that allows you to send emails directly from JavaScript without a backend server. It's perfect for static websites like this one.

## Setup Steps:

### 1. Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Add Email Service

1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the authentication steps
5. Note down your **Service ID** (e.g., `service_abc123`)

### 3. Create Email Templates

#### Contact Form Template:
1. Go to "Email Templates"
2. Click "Create New Template"
3. Name it "Contact Form"
4. Use this template:

```html
Subject: New Contact Form Submission from VulNova Website

Hello VulNova Team,

You have received a new contact form submission from the VulNova website.

Contact Details:
- Name: {{from_name}}
- Email: {{from_email}}
- Company: {{company}}
- Phone: {{phone}}
- Subject: {{subject}}
- Newsletter Signup: {{newsletter_signup}}

Message:
{{message}}

Submitted on: {{submitted_at}}

Best regards,
VulNova Website
```

5. Note down your **Template ID** (e.g., `template_xyz789`)

#### Notification Template:
1. Create another template named "Launch Notification"
2. Use this template:

```html
Subject: VulNova Launch Notification Request

Hello VulNova Team,

A new user has requested to be notified when VulNova launches.

Email: {{from_email}}
Submitted on: {{submitted_at}}

Best regards,
VulNova Website
```

### 4. Get Your Public Key

1. Go to "Account" → "API Keys"
2. Copy your **Public Key**

### 5. Update the Website Code

Replace the placeholder values in `index.html`:

```javascript
// Replace these values in the script section:

// Your EmailJS public key
emailjs.init("YOUR_EMAILJS_PUBLIC_KEY");

// Your service ID
emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)

// Your notification template ID
emailjs.send('YOUR_SERVICE_ID', 'YOUR_NOTIFICATION_TEMPLATE_ID', templateParams)
```

### 6. Test the Setup

1. Open the website
2. Click "Contact Us"
3. Fill out the form
4. Submit and check if you receive the email at hello@vulnova.io

## EmailJS Free Plan Limits:

- **200 emails per month** (perfect for a coming soon site)
- **2 email templates**
- **1 email service**

## Alternative Email Services:

If you prefer other services, EmailJS supports:
- Gmail
- Outlook
- Yahoo
- Custom SMTP
- And many more

## Security Notes:

- The public key is safe to expose in frontend code
- EmailJS handles authentication securely
- No sensitive credentials are stored in your code

## Troubleshooting:

1. **Emails not sending**: Check browser console for errors
2. **Template not found**: Verify template ID is correct
3. **Service not working**: Re-authenticate your email service
4. **Rate limiting**: Check your EmailJS usage in dashboard

## Support:

- EmailJS Documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- EmailJS Community: [https://community.emailjs.com/](https://community.emailjs.com/)

Once configured, your contact form will send emails directly from the application to hello@vulnova.io without requiring users to have an email client installed. 