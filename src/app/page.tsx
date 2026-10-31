import Hero from '@/components/home/Hero';
import CustomizerSection from '@/components/home/CustomizerSection';
import CatalogueSection from '@/components/home/CatalogueSection';
import UploadStudio from '@/components/home/UploadStudio';
import Faq from '@/components/home/Faq';
import ContactSection from '@/components/home/ContactSection';

export default function HomePage() {
  return (
    <div className="flex w-full max-w-full flex-col overflow-x-hidden">
      <Hero />
      <CustomizerSection />
      <CatalogueSection />
      <UploadStudio />
      <Faq />
      <ContactSection />
    </div>
  );
}
