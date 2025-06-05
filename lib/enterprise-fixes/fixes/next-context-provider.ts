'use client';

import * as React from 'react';

// Type definitions
interface ActionQueueContextType {
  ping: () => void;
  invalidate: () => void;
  refresh: () => void;
  reset: () => void;
  prefetch: () => void;
}

interface ServerInsertedHTMLContextType {
  mountedInstances: Set<unknown>;
  updateHead: () => void;
}

declare global {
  interface Window {
    __NEXT_ACTION_QUEUE_CONTEXT?: React.Context<ActionQueueContextType>;
    __NEXT_SERVER_INSERTED_HTML_CONTEXT?: React.Context<ServerInsertedHTMLContextType>;
  }
}

// Create contexts with proper types
const defaultActionQueue: ActionQueueContextType = {
  ping: () => {},
  invalidate: () => {},
  refresh: () => {},
  reset: () => {},
  prefetch: () => {}
};

const defaultServerInserted: ServerInsertedHTMLContextType = {
  mountedInstances: new Set(),
  updateHead: () => {},
};

export const ActionQueueContext = React.createContext(defaultActionQueue);
export const ServerInsertedHTMLContext = React.createContext(defaultServerInserted);
export const PathnameContext = React.createContext("");
export const LayoutSegmentsContext = React.createContext<string[]>([]);

// Attach to window for Next.js internal code to find
if (typeof window !== 'undefined') {
  window.__NEXT_ACTION_QUEUE_CONTEXT = ActionQueueContext;
  window.__NEXT_SERVER_INSERTED_HTML_CONTEXT = ServerInsertedHTMLContext;
}

interface Props {
  children: React.ReactNode;
}

// Helper function to create wrapped children
const wrapWithProviders = (children: React.ReactNode) => 
  React.createElement(ActionQueueContext.Provider, { value: defaultActionQueue },
    React.createElement(ServerInsertedHTMLContext.Provider, { value: defaultServerInserted },
      React.createElement(PathnameContext.Provider, { value: "" },
        React.createElement(LayoutSegmentsContext.Provider, { value: [] },
          children
        )
      )
    )
  );

export const NextContextProvider: React.FC<Props> = ({ children }) => {
  return wrapWithProviders(children);
};
