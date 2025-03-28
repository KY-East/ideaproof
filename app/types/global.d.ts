/// <reference types="react" />
/// <reference types="next" />

import { ReactNode } from 'react';

// 扩展 JSX 命名空间，解决 HTML 元素类型问题
declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: any;
      span: any;
      h1: any;
      h2: any;
      h3: any;
      h4: any;
      h5: any;
      h6: any;
      p: any;
      a: any;
      button: any;
      input: any;
      textarea: any;
      select: any;
      option: any;
      form: any;
      label: any;
      header: any;
      main: any;
      footer: any;
      nav: any;
      section: any;
      article: any;
      img: any;
      svg: any;
      path: any;
      circle: any;
      ul: any;
      li: any;
      table: any;
      tr: any;
      td: any;
      th: any;
    }
  }
}

// 修复 Next.js Link 组件类型问题
declare module 'next/link' {
  import { LinkProps as NextLinkProps } from 'next/dist/client/link';
  
  type LinkProps = NextLinkProps & {
    children?: ReactNode;
  };
  
  export default function Link(props: LinkProps): JSX.Element;
}

export {}; 