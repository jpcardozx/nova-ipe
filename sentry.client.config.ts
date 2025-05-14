// DEPRECATED: Este arquivo está sendo substituído por instrumentation-client.ts
// Mantendo arquivo mínimo para compatibilidade durante a transição
// https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client

import * as Sentry from "@sentry/nextjs";

// Export required hooks for backwards compatibility
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
export const onRequestError = Sentry.captureRequestError;

// Não inicializar aqui - a inicialização acontece no instrumentation-client.ts
