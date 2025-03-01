import { ReactNode } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export const metadata = {
  title: 'Onboarding | BrandSphere AI',
  description: 'Skapa din personliga varumärkesstrategi med BrandSphere AI',
};

export default function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
} 