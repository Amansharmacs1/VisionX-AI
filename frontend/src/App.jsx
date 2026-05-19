import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import GestureControl from './components/GestureControl';
import TechStack from './components/TechStack';
import USP from './components/USP';
import UseCases from './components/UseCases';
import DesiredOutput from './components/DesiredOutput';
import FutureScope from './components/FutureScope';
import Team from './components/Team';
import Footer from './components/Footer';

function App() {
  return (
    <div className="bg-apple-bg text-apple-text-primary min-h-screen font-sans selection:bg-apple-accent selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <About />
        <HowItWorks />
        <Features />
        <GestureControl />
        <TechStack />
        <USP />
        <UseCases />
        <DesiredOutput />
        <FutureScope />
        <Team />
      </main>
      <Footer />
    </div>
  );
}

export default App;
