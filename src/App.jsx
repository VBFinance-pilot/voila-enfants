import { LanguageProvider } from './contexts/LanguageContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import News from './components/News';
import Activities from './components/Activities';
import Services from './components/Services';
import Hiroba from './components/Hiroba';
import Pricing from './components/Pricing';
import About from './components/About';
import Founders from './components/Founders';
import Gallery from './components/Gallery';
import Media from './components/Media';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <LanguageProvider>
      <Navbar />
      <Hero />
      <News />
      <Activities />
      <Services />
      <Hiroba />
      <Pricing />
      <About />
      <Founders />
      <Gallery />
      <Media />
      <Contact />
      <Footer />
    </LanguageProvider>
  );
}
