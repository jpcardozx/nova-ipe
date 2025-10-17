import { Metadata } from 'next';
import { HeroSection } from './components/HeroSection';
import { ExpertiseShowcase } from './components/ExpertiseShowcase';
import { ArchitectureSection } from './components/ArchitectureSection';

export const metadata: Metadata = {
  title: 'JP Cardozo | Full-Stack Developer',
  description: 'Portfolio técnico de JP Cardozo - Desenvolvedor full-stack especializado em Next.js, React, TypeScript e arquitetura de sistemas',
};

export default function JPCardozoPage() {
  return (
    <main className="relative bg-slate-950">
      <HeroSection />
      <ExpertiseShowcase />
      <ArchitectureSection />
    </main>
  );
}
