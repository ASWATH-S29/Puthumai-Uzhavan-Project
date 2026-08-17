import MarketingNav from '@/components/landing/MarketingNav';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Benefits from '@/components/landing/Benefits';
import HowItWorks from '@/components/landing/HowItWorks';
import Pricing from '@/components/landing/Pricing';
import About from '@/components/landing/About';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <MarketingNav />
      <main>
        <Hero />
        <Features />
        <Benefits />
        <HowItWorks />
        <Pricing />
        <About />
      </main>
      <Footer />
    </div>
  );
}
