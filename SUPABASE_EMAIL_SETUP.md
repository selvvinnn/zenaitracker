# Fixing "Email Not Confirmed" Error

## The Issue

Supabase requires email confirmation by default. When users sign up, they receive a confirmation email that they must click before they can sign in.

## Solution 1: Disable Email Confirmation (Recommended for Development)

1. Go to your Supabase Dashboard
2. Navigate to **Authentication → Settings**
3. Under **Email Auth**, find **"Enable email confirmations"**
4. **Disable** this setting
5. Click **Save**

Now users can sign up and sign in immediately without email confirmation.

## Solution 2: Use Email Confirmation (Production)

If you want to keep email confirmation enabled (recommended for production):

1. Keep the setting enabled in Supabase
2. Users will receive a confirmation email after signing up
3. They need to click the link in the email before they can sign in
4. The app now shows helpful messages when email confirmation is required

### Email Templates

You can customize the confirmation email:
1. Go to **Authentication → Email Templates**
2. Edit the **Confirm signup** template
3. Customize the message and styling

## Testing Email Confirmation

1. Sign up with a valid email address
2. Check your email inbox (and spam folder)
3. Click the confirmation link in the email
4. Return to the app and sign in

## Troubleshooting

- **Not receiving emails?** Check spam folder, and verify email settings in Supabase
- **Email link expired?** Request a new confirmation email from the login page
- **Still seeing errors?** Make sure you've clicked the confirmation link before signing in

