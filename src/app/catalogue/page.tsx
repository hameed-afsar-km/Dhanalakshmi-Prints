import type { Metadata } from 'next';
import { Suspense } from 'react';
import CatalogueContent from '@/components/catalogue/CatalogueContent';
import { BRAND } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Catalogue | ${BRAND.name}`,
  description:
    'Explore personalised 3D printed gifts, keychains, photo lamps, desk objects and custom figurines from Dhanalakshmi Prints.',
};

function CatalogueFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-brand-offwhite">
      <div className="flex flex-col items-center gap-3">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-brand-primary/15 border-t-brand-primary" />
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-brand-primary/40">
          Loading catalogue
        </span>
      </div>
    </div>
  );
}

export default function CataloguePage() {
  return (
    <Suspense fallback={<CatalogueFallback />}>
      <CatalogueContent />
    </Suspense>
  );
}
