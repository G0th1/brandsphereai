import { ReactNode } from 'react';

export const metadata = {
  title: 'Analytics & Rapporter | BrandSphere AI',
  description: 'Spåra och analysera prestationen för ditt personliga varumärke',
};

export default function AnalyticsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
} 