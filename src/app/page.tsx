import Hero from '@/components/home/Hero';
import CatalogueSection from '@/components/home/CatalogueSection';
import CustomizerSection from '@/components/home/CustomizerSection';
import UploadStudio from '@/components/home/UploadStudio';
import Faq from '@/components/home/Faq';
import ContactSection from '@/components/home/ContactSection';

export default function HomePage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Hero />
      <CatalogueSection />
      <CustomizerSection />
      <UploadStudio />
      <Faq />
      <ContactSection />
    </div>
  );
}
