// React shim to fix JSX issues
import React from 'react';

declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> { }
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Window and DOM types
declare var window: any;
declare var document: any;
declare var navigator: any;

export {};