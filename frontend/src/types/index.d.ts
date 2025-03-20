/// <reference types="next" />
/// <reference types="next/image-types/global" />

import 'react';

declare module 'react' {
  interface JSX {
    IntrinsicElements: any;
  }
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  const content: string;
  export default content;
} 