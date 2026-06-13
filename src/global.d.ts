declare module '*/index.css' {
  const css: Record<string, string>;
  export default css;
}

declare module '*.css' {
  const css: string;
  export default css;
}

