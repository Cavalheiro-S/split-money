import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Configurar tracing
  tracesSampleRate: 1.0,

  // Session Replay
  replaysSessionSampleRate: 0.1, // 10% das sessões
  replaysOnErrorSampleRate: 1.0, // 100% quando há erro

  // Integrations
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Remover dados sensíveis antes de enviar
  beforeSend(event, hint) {
    // Não enviar em desenvolvimento
    if (process.env.NODE_ENV === "development") {
      return null;
    }

    // Remover dados sensíveis
    if (event.request) {
      delete event.request.cookies;
      if (event.request.headers) {
        delete event.request.headers.Authorization;
        delete event.request.headers.Cookie;
      }
    }

    // Remover informações de usuário sensíveis
    if (event.user) {
      delete event.user.email;
      delete event.user.ip_address;
    }

    return event;
  },

  // Environment
  environment: process.env.NODE_ENV,
});
