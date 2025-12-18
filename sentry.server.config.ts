import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Configurar tracing
  tracesSampleRate: 1.0,

  // Environment
  environment: process.env.NODE_ENV,

  // Não enviar em desenvolvimento
  enabled: process.env.NODE_ENV === "production",
});
