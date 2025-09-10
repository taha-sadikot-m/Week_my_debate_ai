// Global type declarations to fix module resolution

// Enable JSX globally
declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> { }
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Window global for browser environment
declare var window: Window & typeof globalThis;

export {};