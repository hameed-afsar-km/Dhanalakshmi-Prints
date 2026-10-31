import type { Metadata } from 'next';
import { Suspense } from 'react';
import CatalogueContent from '@/components/catalogue/CatalogueContent';
import { BRAND } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Shop the collection | ${BRAND.name}`,
  description: 'Browse personalised 3D printed gifts and studio pieces from Dhanalakshmi Prints.',
};

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center bg-brand-offwhite">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-brand-primary/40">
            Loading collection
          </span>
        </div>
      }
    >
      <CatalogueContent />
    </Suspense>
  );
}
