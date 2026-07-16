import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Pipeline } from './components/Pipeline';
import { Outcomes } from './components/Outcomes';
import { DeveloperTools } from './components/DeveloperTools';
import { Integrations } from './components/Integrations';
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
          <Pipeline />
        </Reveal>

        <Reveal delay={60}>
          <Outcomes />
        </Reveal>

        <Reveal delay={60}>
          <DeveloperTools />
        </Reveal>

        <Reveal delay={60}>
          <Integrations />
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
