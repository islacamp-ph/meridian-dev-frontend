import { Header } from './components/Header';
import { Hero } from './components/Hero';
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
          <DeveloperTools />
        </Reveal>

        <Reveal delay={60}>
          <Cta />
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}

export default App;
