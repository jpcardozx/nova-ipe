import Footer from "./sections/Footer";
import NavBar from "./sections/NavBar";
import Hero from "./sections/Hero";
import SecaoImoveisAVenda from "./sections/SecaoImoveisAVenda";
import SecaoImoveisParaAlugar from "./sections/SecaoImoveisParaAlugar";

export default function Home() {
  return (
    <div>
      <NavBar />
      <Hero />
      <SecaoImoveisAVenda />
      <SecaoImoveisParaAlugar />
      <Footer />
    </div>
  );
}
