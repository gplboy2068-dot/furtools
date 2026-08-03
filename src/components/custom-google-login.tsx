import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import {
  decodeGoogleJwt,
  saveCustomSession,
  GoogleUserProfile,
  DEFAULT_GOOGLE_CLIENT_ID,
  getGoogleOAuthUrl,
} from '@/lib/custom-google-auth';

interface CustomGoogleLoginProps {
  clientId?: string;
  onSuccess?: (user: GoogleUserProfile) => void;
  className?: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
          }) => void;
          prompt: () => void;
          renderButton: (
            element: HTMLElement,
            options: { theme?: string; size?: string; width?: number }
          ) => void;
        };
      };
    };
  }
}

export function CustomGoogleLogin({
  clientId = DEFAULT_GOOGLE_CLIENT_ID,
  onSuccess,
  className = '',
}: CustomGoogleLoginProps) {
  const { t } = useTranslation('common');
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load Google GIS script dynamically for auto One-Tap
    if (!window.google && !document.getElementById('google-gis-script')) {
      const script = document.createElement('script');
      script.id = 'google-gis-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setScriptLoaded(true);
        initGis();
      };
      document.head.appendChild(script);
    } else if (window.google) {
      setScriptLoaded(true);
      initGis();
    }
  }, [clientId]);

  const initGis = () => {
    if (window.google) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => handleCredentialResponse(response.credential),
        });
        window.google.accounts.id.prompt();
      } catch {
        /* ignore */
      }
    }
  };

  const handleCredentialResponse = async (credentialToken: string) => {
    setLoading(true);
    try {
      // Verify via custom API handler
      const res = await fetch('/api/auth/google-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialToken }),
      });

      const data = await res.json();

      let userProfile: GoogleUserProfile | null = null;
      if (res.ok && data.success && data.user) {
        userProfile = data.user;
      } else {
        // Fallback local decode
        userProfile = decodeGoogleJwt(credentialToken);
      }

      if (!userProfile) {
        toast.error('Google Sign-In failed to read profile.');
        return;
      }

      // Save custom session
      saveCustomSession(userProfile, credentialToken);
      toast.success(`Welcome back, ${userProfile.name}!`);

      if (onSuccess) {
        onSuccess(userProfile);
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      console.error('Google sign-in error:', err);
      toast.error('Could not complete Google Sign-In.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomGoogleClick = async () => {
    setLoading(true);
    try {
      // 1. Try Supabase OAuth redirect first
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard',
        },
      });

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      if (error || !data?.url) {
        // 2. Direct Google OAuth fallback window
        const redirectUri = window.location.origin + '/auth';
        window.location.href = getGoogleOAuthUrl(clientId, redirectUri);
      }
    } catch {
      const redirectUri = window.location.origin + '/auth';
      window.location.href = getGoogleOAuthUrl(clientId, redirectUri);
    }
  };



  return (
    <Button
      type="button"
      variant="outline"
      disabled={loading}
      onClick={handleCustomGoogleClick}
      className={`w-full rounded-full gap-2 border-border/80 hover:bg-accent/60 ${className}`}
    >
      <svg viewBox="0 0 24 24" className="size-4 shrink-0" aria-hidden>
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.12A6.98 6.98 0 0 1 5.47 12c0-.74.13-1.45.37-2.12V7.04H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.96l3.66-2.84z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
        />
      </svg>
      <span>{loading ? 'Signing in with Google...' : 'Continue with Google'}</span>
    </Button>
  );
}
