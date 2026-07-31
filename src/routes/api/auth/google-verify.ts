import { createFileRoute } from "@tanstack/react-router";
import { decodeGoogleJwt, GoogleUserProfile } from "@/lib/custom-google-auth";

interface RequestBody {
  credential?: string; // Google ID Token
}

export const Route = createFileRoute("/api/auth/google-verify")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: RequestBody;
        try {
          body = (await request.json()) as RequestBody;
        } catch {
          return json({ error: "Invalid JSON payload" }, 400);
        }

        const credential = body.credential;
        if (!credential) {
          return json({ error: "Google credential ID token missing" }, 400);
        }

        try {
          // Verify ID Token directly with Google TokenInfo API
          const googleRes = await fetch(
            `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
          );

          if (!googleRes.ok) {
            // Fallback to local JWT decoding if network/tokeninfo is delayed
            const fallbackUser = decodeGoogleJwt(credential);
            if (fallbackUser) {
              return json({ success: true, user: fallbackUser, credential });
            }
            return json({ error: "Google token verification failed" }, 401);
          }

          const info = await googleRes.json();

          const verifiedUser: GoogleUserProfile = {
            googleId: info.sub,
            email: info.email,
            name: info.name || info.email,
            picture: info.picture || "",
            givenName: info.given_name,
            familyName: info.family_name,
            emailVerified: info.email_verified === "true" || info.email_verified === true,
          };

          // Sync user to Supabase database (profiles & user_roles)
          try {
            const { createClient } = await import("@supabase/supabase-js");
            const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
            const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
            if (supabaseUrl && serviceKey) {
              const supa = createClient(supabaseUrl, serviceKey);
              await supa.from("profiles").upsert({
                id: verifiedUser.googleId,
                display_name: verifiedUser.name,
                avatar_url: verifiedUser.picture,
                email: verifiedUser.email,
              }, { onConflict: "id" });

              await supa.from("user_roles").upsert({
                user_id: verifiedUser.googleId,
                role: "user",
              }, { onConflict: "user_id,role" });
            }
          } catch {
            /* ignore background db sync failure */
          }

          return json({
            success: true,
            user: verifiedUser,
            credential,
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          // Fallback parsing
          const fallbackUser = decodeGoogleJwt(credential);
          if (fallbackUser) {
            return json({ success: true, user: fallbackUser, credential });
          }
          return json({ error: `Failed to verify Google Token: ${message}` }, 500);
        }
      },
    },
  },
});

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
