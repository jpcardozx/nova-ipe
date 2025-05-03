import Footer from "./sections/Footer";
import NavBar from "./sections/NavBar";
import Hero from "./sections/Hero";
import DestaquesVenda from "./sections/DestaquesVenda";
import SecaoImoveisParaAlugar from "./sections/SecaoImoveisParaAlugar";
import Referencias from "./sections/Referencias";
import Valor from "./sections/Valor";
import Destaques from "./sections/Destaques";
import FormularioContato from "./components/FormularioContato";
import { Montserrat } from 'next/font/google';
import DestaquesAluguel from "./sections/DestaquesAluguel";

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
      <DestaquesVenda />
      <Referencias />
      <DestaquesAluguel />
      <Destaques />
      <FormularioContato />
      <Footer />
    </div>
  );
}
