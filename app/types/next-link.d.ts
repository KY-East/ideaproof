import { ReactNode } from 'react';

// 修复 Next.js Link 组件类型问题
declare module 'next/link' {
  import { LinkProps as NextLinkProps } from 'next/dist/client/link';
  
  type LinkProps = NextLinkProps & {
    children?: ReactNode;
  };
  
  export default function Link(props: LinkProps): JSX.Element;
} 