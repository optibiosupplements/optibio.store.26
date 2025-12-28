# Crisp Live Chat Setup Instructions

The Crisp live chat widget has been integrated into your OptiBio e-commerce site. Follow these steps to activate it:

## Step 1: Create Crisp Account

1. Visit [https://crisp.chat](https://crisp.chat)
2. Click "Get Started Free"
3. Sign up with your email (free tier includes unlimited conversations)

## Step 2: Get Your Website ID

1. After signing up, go to **Settings** → **Website Settings**
2. Find your **Website ID** (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
3. Copy this ID

## Step 3: Update the Code

1. Open `client/src/App.tsx`
2. Find this line:
   ```tsx
   <CrispChat websiteId="YOUR_WEBSITE_ID" />
   ```
3. Replace `YOUR_WEBSITE_ID` with your actual Crisp website ID:
   ```tsx
   <CrispChat websiteId="12345678-1234-1234-1234-123456789abc" />
   ```

## Step 4: Customize Appearance (Optional)

In your Crisp dashboard:

1. Go to **Settings** → **Chatbox Appearance**
2. Customize colors to match your brand:
   - Primary color: `#1E3A5F` (OptiBio navy blue)
   - Secondary color: `#C9A961` (OptiBio gold)
3. Upload your logo
4. Set welcome message: "Hi! 👋 Have questions about our KSM-66 Ashwagandha? We're here to help!"

## Step 5: Configure Availability

1. Go to **Settings** → **Availability**
2. Set your business hours
3. Configure away message for offline hours
4. Enable email notifications for new conversations

## Features Included

✅ **Chat widget appears on all pages** - Automatically loaded site-wide

✅ **Strategic placement** - Bottom-right corner, non-intrusive

✅ **Mobile responsive** - Works perfectly on all devices

✅ **User context** - Can be enhanced to show user email/name (see CrispChat.tsx)

## Advanced: Set User Data

To automatically populate customer information when they're logged in, add this to your authentication flow:

```tsx
import { setCrispUserData } from '@/components/CrispChat';

// After user logs in:
if (user) {
  setCrispUserData(user.email, user.name);
}
```

## Programmatic Control

You can control the chat widget programmatically:

```tsx
import { openCrispChat, closeCrispChat, showCrispChat, hideCrispChat } from '@/components/CrispChat';

// Open chat on button click
<Button onClick={openCrispChat}>Chat with Support</Button>

// Hide chat on specific pages
useEffect(() => {
  hideCrispChat();
  return () => showCrispChat();
}, []);
```

## Free Tier Limits

- ✅ Unlimited conversations
- ✅ 2 operator seats
- ✅ Mobile apps (iOS & Android)
- ✅ Email integration
- ✅ Basic automation
- ❌ Advanced features require paid plan ($25/month per seat)

## Support

For Crisp-specific questions, visit [https://help.crisp.chat](https://help.crisp.chat)

---

**Note:** The chat widget is currently disabled (shows YOUR_WEBSITE_ID placeholder). It will activate automatically once you update the website ID in `App.tsx`.
