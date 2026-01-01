# Firebase Authentication Integration Guide

This guide provides step-by-step instructions for replacing Manus OAuth with Firebase Authentication in the OptiBio e-commerce application.

---

## Why Firebase Auth?

Firebase Authentication provides:
- **Email/password authentication** out of the box
- **Social logins** (Google, Facebook, Apple, etc.)
- **Phone authentication** with SMS verification
- **Anonymous authentication** for guest checkout
- **Built-in security** with token refresh and revocation
- **Free tier** (up to 50,000 MAU)

---

## Step 1: Install Firebase Dependencies

```bash
npm install firebase firebase-admin
```

---

## Step 2: Initialize Firebase Admin SDK

Create `server/_core/firebase-admin.ts`:

```typescript
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export const auth = admin.auth();
export default admin;
```

---

## Step 3: Update Context to Use Firebase Auth

Update `server/_core/context.ts`:

```typescript
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { auth } from "./firebase-admin";
import { getUserByOpenId, upsertUser } from "../db";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    // Extract Firebase ID token from Authorization header
    const token = opts.req.headers.authorization?.split('Bearer ')[1];

    if (token) {
      // Verify Firebase ID token
      const decodedToken = await auth.verifyIdToken(token);

      // Get or create user in database
      user = await getUserByOpenId(decodedToken.uid);

      if (!user) {
        // Create new user from Firebase token
        await upsertUser({
          openId: decodedToken.uid,
          email: decodedToken.email || null,
          name: decodedToken.name || null,
          loginMethod: 'firebase',
        });

        user = await getUserByOpenId(decodedToken.uid);
      }
    }
  } catch (error) {
    console.error("[Auth] Firebase token verification failed:", error);
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
```

---

## Step 4: Initialize Firebase Client SDK

Create `client/src/lib/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Auth helpers
export const loginWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const registerWithEmail = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);

export const logout = () => signOut(auth);

export const onAuthChange = (callback: (user: any) => void) =>
  onAuthStateChanged(auth, callback);
```

---

## Step 5: Update useAuth Hook

Update `client/src/_core/hooks/useAuth.ts`:

```typescript
import { useEffect, useState } from 'react';
import { auth, onAuthChange } from '@/lib/firebase';
import { trpc } from '@/lib/trpc';

export function useAuth() {
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setFirebaseUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch user data from database
  const { data: user, isLoading: dbLoading } = trpc.auth.me.useQuery(undefined, {
    enabled: !!firebaseUser,
  });

  const logoutMutation = trpc.auth.logout.useMutation();

  const logout = async () => {
    await auth.signOut();
    await logoutMutation.mutateAsync();
  };

  return {
    user: user || null,
    loading: loading || dbLoading,
    error: null,
    isAuthenticated: !!firebaseUser,
    logout,
  };
}
```

---

## Step 6: Update tRPC Client to Include Firebase Token

Update `client/src/main.tsx`:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';
import { trpc } from './lib/trpc';
import { auth } from './lib/firebase';
import App from './App';

function Main() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
          async headers() {
            const user = auth.currentUser;
            const token = user ? await user.getIdToken() : null;

            return {
              authorization: token ? `Bearer ${token}` : '',
            };
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default Main;
```

---

## Step 7: Create Login/Register Pages

Create `client/src/pages/Login.tsx`:

```typescript
import { useState } from 'react';
import { useLocation } from 'wouter';
import { loginWithEmail, loginWithGoogle } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await loginWithEmail(email, password);
      toast.success('Logged in successfully!');
      setLocation('/');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      await loginWithGoogle();
      toast.success('Logged in with Google!');
      setLocation('/');
    } catch (error: any) {
      toast.error(error.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center">Sign In</h2>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
```

---

## Step 8: Configure Environment Variables

Add to `apphosting.yaml`:

```yaml
env:
  - variable: FIREBASE_PROJECT_ID
    value: your-project-id
  - variable: FIREBASE_CLIENT_EMAIL
    secret: FIREBASE_CLIENT_EMAIL
  - variable: FIREBASE_PRIVATE_KEY
    secret: FIREBASE_PRIVATE_KEY
  - variable: VITE_FIREBASE_API_KEY
    value: your-api-key
  - variable: VITE_FIREBASE_AUTH_DOMAIN
    value: your-project-id.firebaseapp.com
  - variable: VITE_FIREBASE_PROJECT_ID
    value: your-project-id
  - variable: VITE_FIREBASE_STORAGE_BUCKET
    value: your-project-id.appspot.com
  - variable: VITE_FIREBASE_MESSAGING_SENDER_ID
    value: your-sender-id
  - variable: VITE_FIREBASE_APP_ID
    value: your-app-id
```

---

## Step 9: Enable Authentication Methods in Firebase Console

1. Go to **Firebase Console** > **Authentication**
2. Click **Sign-in method** tab
3. Enable:
   - Email/Password
   - Google (optional)
   - Other providers as needed

---

## Step 10: Test Authentication Flow

1. **Register new user**: Create account with email/password
2. **Login**: Sign in with created credentials
3. **Google login**: Test social authentication
4. **Protected routes**: Verify authentication guards work
5. **Logout**: Confirm session is cleared

---

## Migration Checklist

- [ ] Install Firebase dependencies
- [ ] Initialize Firebase Admin SDK
- [ ] Update context.ts to verify Firebase tokens
- [ ] Initialize Firebase Client SDK
- [ ] Update useAuth hook
- [ ] Update tRPC client to include Firebase token
- [ ] Create Login/Register pages
- [ ] Configure environment variables
- [ ] Enable authentication methods in Firebase Console
- [ ] Test complete authentication flow
- [ ] Remove Manus OAuth code

---

## Cost Comparison

| Feature | Firebase Auth (Free) | Firebase Auth (Paid) |
|---------|---------------------|---------------------|
| Monthly Active Users | Up to 50,000 | Unlimited |
| Authentication Methods | All included | All included |
| Phone Auth | 10,000 verifications/month | $0.01/verification |
| Multi-factor Auth | Included | Included |

---

## Support

- **Firebase Auth Docs**: https://firebase.google.com/docs/auth
- **Firebase Console**: https://console.firebase.google.com
- **Stack Overflow**: https://stackoverflow.com/questions/tagged/firebase-authentication

---

**Last Updated:** December 31, 2025  
**Version:** 1.0.0
