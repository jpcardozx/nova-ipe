import Footer from "./sections/Footer";
import NavBar from "./sections/NavBar";
import Hero from "./sections/Hero";
import SecaoImoveisAVenda from "./sections/SecaoImoveisAVenda";
import SecaoImoveisParaAlugar from "./sections/SecaoImoveisParaAlugar";
import Referencias from "./sections/Referencias";
import Valor from "./sections/Valor";
import Destaques from "./sections/Destaques";
import { Montserrat } from 'next/font/google';

const montSerrat = Montserrat({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-montserrat',
});

export default function Home() {
  return (
    <div className={`${montSerrat.className} bg-[#0D1F2D] overflow-hidden`}>
      <NavBar />
      <Hero />
      <Valor />
      <SecaoImoveisAVenda />
      <Referencias />
      <SecaoImoveisParaAlugar />
      <Destaques />
      <Footer />
    </div>
  );
}
