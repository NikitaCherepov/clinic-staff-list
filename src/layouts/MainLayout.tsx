import { ReactNode } from 'react';

export default function MainLayout({ children }: { children: ReactNode }) {
  return <main>{children}</main>;
}
