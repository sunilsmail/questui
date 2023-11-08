/// <reference path="../../typings/mock-http-typings.d.ts" />

/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare module '*.json' {
  const value: any;
  export default value;
}
