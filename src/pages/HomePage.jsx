import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import News from '../components/News';
import Activities from '../components/Activities';
import Services from '../components/Services';
import Hiroba from '../components/Hiroba';
import Pricing from '../components/Pricing';
import About from '../components/About';
import Founders from '../components/Founders';
import Gallery from '../components/Gallery';
import Media from '../components/Media';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Voilà les enfants | 子供英語教室 京都 西京区 | English School Kyoto</title>
        <meta name="description" content="京都・西京区の子供英語教室。英語キャンプ、オンラインレッスン、ホームステイ、親子ひろば。English classes for children in Kyoto Nishikyo-ku." />
        <link rel="canonical" href="https://www.voila-les-enfants.jp/" />
      </Helmet>
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
    </>
  );
}
