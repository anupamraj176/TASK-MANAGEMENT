import Hero         from '../components/home/Hero';
import Features     from '../components/home/Features';
import HowItWorks   from '../components/home/HowItWorks';
import MainLayout   from '../layouts/MainLayout';



export default function Home() {
  return (
    <MainLayout>
      <main>
        <Hero />
        <Features />
        <HowItWorks />
      </main>
    </MainLayout>
  );
}
