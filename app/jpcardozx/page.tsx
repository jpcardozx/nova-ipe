
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Process } from './components/Process';
import { Pricing } from './components/Pricing';
import { Experience } from './components/Experience';
import { Testimonials } from './components/Testimonials';
import { Contact } from './components/Contact';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pedro de Mello | Full-Stack Developer & Design UI/UX',
  description: 'Portfólio de desenvolvimento e design de Pedro de Mello.',
};

export default function PedroMelloPortfolio() {
  return (
    <div className="bg-white text-gray-800">
      <Hero />
      <main className="overflow-x-hidden">
        <Projects />
        <Process />
        <Pricing />
        <Skills />
        <Experience />
        <Testimonials />
        <Contact />
      </main>
    </div>
  );
}
