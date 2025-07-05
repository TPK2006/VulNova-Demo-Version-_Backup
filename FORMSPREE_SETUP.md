# Formspree Setup Guide for VulNova Contact Form

This guide will help you set up Formspree to send emails directly from the VulNova website without opening the user's email client.

## What is Formspree?

Formspree is a free service that allows you to send emails directly from HTML forms without any backend code. It's perfect for static websites.

## Setup Steps:

### 1. Create Formspree Account

1. Go to [https://formspree.io/](https://formspree.io/)
2. Click "Get Started" and sign up
3. Verify your email address

### 2. Create a New Form

1. In your Formspree dashboard, click "New Form"
2. Give it a name like "VulNova Contact Form"
3. Choose your email address (hello@vulnova.io)
4. Click "Create Form"

### 3. Get Your Form Endpoint

1. After creating the form, you'll get a unique endpoint URL
2. It will look like: `https://formspree.io/f/xpzgwqjq`
3. Copy this URL

### 4. Update the Website Code

Replace the Formspree endpoint in `index.html`:

```javascript
// Replace this line in the contact form submission:
fetch('https://formspree.io/f/xpzgwqjq', {

// With your actual endpoint:
fetch('YOUR_FORMSPREE_ENDPOINT', {
```

### 5. Configure Email Settings

1. In your Formspree dashboard, go to your form settings
2. Set the "To" email to: `hello@vulnova.io`
3. Customize the email subject and template if needed

### 6. Test the Setup

1. Open the website
2. Click "Contact Us"
3. Fill out the form
4. Submit and check if you receive the email at hello@vulnova.io

## Formspree Free Plan Features:

- **50 submissions per month** (perfect for a coming soon site)
- **Spam protection**
- **Email notifications**
- **Form analytics**
- **Custom email templates**

## Email Format:

Formspree will send emails in this format:

```
Subject: VulNova Contact: [Subject]

Name: [Name]
Email: [Email]
Company: [Company]
Phone: [Phone]
Subject: [Subject]
Message: [Message]
Newsletter Signup: [Yes/No]

Submitted via VulNova Contact Form
```

## Customization Options:

### Custom Email Subject:
```javascript
formData.append('_subject', `VulNova Contact: ${data.subject}`);
```

### Custom Email Template:
You can customize the email template in your Formspree dashboard.

### Redirect After Submission:
```javascript
formData.append('_next', 'https://yourwebsite.com/thank-you');
```

## Security Features:

- **Spam protection** built-in
- **Rate limiting** to prevent abuse
- **Email validation**
- **CAPTCHA support** (optional)

## Troubleshooting:

1. **Emails not received**: Check spam folder and Formspree dashboard
2. **Form not submitting**: Check browser console for errors
3. **Wrong endpoint**: Verify the Formspree URL is correct
4. **Rate limiting**: Check your monthly submission count

## Support:

- Formspree Documentation: [https://formspree.io/docs/](https://formspree.io/docs/)
- Formspree Support: [https://formspree.io/support/](https://formspree.io/support/)

## Alternative Services:

If you prefer other services:
- **Netlify Forms** (if hosting on Netlify)
- **Getform.io**
- **Web3Forms**
- **FormSubmit**

Once configured, your contact form will send emails directly to hello@vulnova.io without opening the user's email client! 