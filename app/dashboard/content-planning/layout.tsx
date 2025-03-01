import { ReactNode } from 'react';

export const metadata = {
  title: 'Innehållsplanering | BrandSphere AI',
  description: 'Planera och organisera ditt innehåll strategiskt',
};

export default function ContentPlanningLayout({
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