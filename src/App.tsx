import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { VerdictBand } from './components/VerdictBand';
import { DeveloperTools } from './components/DeveloperTools';
import { Cta } from './components/Cta';
import { Footer } from './components/Footer';
import { Reveal } from './components/Reveal';

function App() {
  return (
    <div className="page">
      <Header />

      <main>
        <Hero />

        <Reveal>
          <VerdictBand />
        </Reveal>

        <Reveal delay={60}>
          <DeveloperTools />
        </Reveal>

        <Reveal delay={80}>
          <Cta />
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}

export default App;
