// filepath: types/react-dom-cjs.d.ts
// Provide type declarations to bypass TS errors for react-dom CJS files
declare module 'react-dom/cjs/*.development.js' {
  const content: any;
  export default content;
}
declare module 'react-dom/cjs/*.production.min.js' {
  const content: any;
  export default content;
}
