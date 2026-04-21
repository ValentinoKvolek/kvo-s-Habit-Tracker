import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";
import { db } from "@/db";
import * as schema from "@/db/schema";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  trustedOrigins: [
    "http://localhost:1244",
    "http://181.231.85.92:1244",
  ],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      console.log("[reset-password] sending to:", user.email, "url:", url);
      const result = await resend.emails.send({
        from: "Constantia <onboarding@resend.dev>",
        to: "valentino.franco230119@alumnos.info.unlp.edu.ar", // TODO: cambiar a user.email cuando se verifique un dominio
        subject: "Restablecer contraseña — Constantia",
        html: `
          <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;padding:32px;background:#fdf8f0;border-radius:8px;border:1px solid #e8dcc8">
            <h1 style="font-size:22px;color:#3d2b1f;margin-bottom:8px">Restablecé tu contraseña</h1>
            <p style="color:#6b5744;font-size:14px;line-height:1.6">
              Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>Constantia</strong>.
            </p>
            <a href="${url}" style="display:inline-block;margin:24px 0;padding:12px 28px;background:#8b4513;color:#fff;text-decoration:none;border-radius:6px;font-size:14px;font-family:sans-serif">
              Restablecer contraseña
            </a>
            <p style="color:#9e8878;font-size:12px;line-height:1.6">
              Este enlace expira en 1 hora. Si no solicitaste esto, ignorá este mensaje.
            </p>
            <hr style="border:none;border-top:1px solid #e8dcc8;margin:24px 0" />
            <p style="color:#b8a898;font-size:11px;font-style:italic;text-align:center">
              "Comienza donde estás. Usa lo que tienes." — Constantia
            </p>
          </div>
        `,
      });
      console.log("[reset-password] resend result:", JSON.stringify(result));
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // refresh session if older than 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes client-side cache
    },
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
