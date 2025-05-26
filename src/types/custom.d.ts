import { FunctionComponent, SVGAttributes } from 'react';
/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference types="next" />

// Enhance window interface
interface Window {
  dataLayer?: unknown[];
  gtag?: (...args: any[]) => void;
  workbox?: any;
  __WB_MANIFEST?: any[];
  WSP?: {
    ready: boolean;
    env: {
      isWhatsApp: boolean;
      isSlowConnection: boolean;
      supportsIntersectionObserver: boolean;
    };
  };
}

// For importing static assets
declare module '*.svg' {
  const content: FunctionComponent<SVGAttributes<SVGElement>>;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

// For CSS/SCSS modules
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

// For Web Workers
declare module '*?worker' {
  const WorkerConstructor: new () => Worker;
  export default WorkerConstructor;
}

// For environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SANITY_PROJECT_ID: string;
    NEXT_PUBLIC_SANITY_DATASET: string;
    NEXT_PUBLIC_SITE_URL: string;
    NODE_ENV: 'development' | 'production' | 'test';
    [key: string]: string | undefined;
  }
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export {};
