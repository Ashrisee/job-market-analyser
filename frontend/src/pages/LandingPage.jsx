import ParticleBackground from '../components/landing/ParticleBackground';
import Hero from '../components/landing/Hero';
import FeatureShowcase from '../components/landing/FeatureShowcase';
import StatsSection from '../components/landing/StatsSection';
import TechStrip from '../components/landing/TechStrip';
import AIAnimation from '../components/landing/AIAnimation';
import ProfileForm from '../components/forms/ProfileForm';
import Footer from '../components/layout/Footer';

export default function LandingPage() {
  return (
    <>
      <ParticleBackground />
      <Hero />
      <TechStrip />
      <FeatureShowcase />
      <StatsSection />
      <AIAnimation />
      <ProfileForm />
      <Footer />
    </>
  );
}
