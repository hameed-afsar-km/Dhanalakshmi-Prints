import type { Metadata } from 'next';
import ProductDetailContent from '@/components/products/ProductDetailContent';
import { INITIAL_PRODUCTS } from '@/lib/seed-data';
import { getProductBySlugOrId } from '@/lib/catalog';
import { BRAND } from '@/lib/constants';

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return INITIAL_PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlugOrId(INITIAL_PRODUCTS, slug);

  if (!product) {
    return { title: `Piece not found | ${BRAND.name}` };
  }

  return {
    title: `${product.name} | ${BRAND.name}`,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [{ url: product.imageUrl }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  return <ProductDetailContent slug={slug} />;
}
