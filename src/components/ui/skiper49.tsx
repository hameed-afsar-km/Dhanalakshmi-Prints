'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Autoplay, EffectCoverflow, Keyboard, Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper/types';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export interface Skiper49Item {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  href: string;
  meta?: string;
}

interface Skiper49Props {
  items: Skiper49Item[];
  className?: string;
  autoplay?: boolean;
  loop?: boolean;
  onSlideChange?: (index: number) => void;
}

export default function Skiper49({
  items,
  className,
  autoplay = true,
  loop = true,
  onSlideChange,
}: Skiper49Props) {
  const swiperRef = useRef<SwiperClass | null>(null);

  if (!items.length) return null;

  return (
    <div className={cn('skiper49 relative', className)}>
      <Swiper
        modules={[A11y, Autoplay, EffectCoverflow, Keyboard, Navigation, Pagination]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => onSlideChange?.(swiper.realIndex)}
        effect="coverflow"
        grabCursor
        centeredSlides
        loop={loop}
        keyboard={{ enabled: true }}
        slidesPerView={1.15}
        spaceBetween={16}
        speed={750}
        autoplay={
          autoplay
            ? { delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }
            : false
        }
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 140,
          modifier: 1.6,
          slideShadows: false,
        }}
        pagination={{ clickable: true, el: '.skiper49-pagination' }}
        navigation={{ nextEl: '.skiper49-next', prevEl: '.skiper49-prev' }}
        breakpoints={{
          640: { slidesPerView: 1.7, spaceBetween: 22 },
          1024: { slidesPerView: 2.4, spaceBetween: 28 },
          1440: { slidesPerView: 2.8, spaceBetween: 32 },
        }}
        className="!pb-12"
        a11y={{ enabled: true }}
      >
        {items.map((item) => (
          <SwiperSlide key={item.id} className="!h-auto">
            <Link
              href={item.href}
              className="group relative block aspect-[4/5] overflow-hidden rounded-[1.6rem] border border-white/70 bg-brand-lavender shadow-[0_30px_70px_-40px_rgba(28,11,96,0.5)]"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 88vw, (max-width: 1024px) 46vw, 30vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,7,43,0.02)_0%,rgba(13,7,43,0.12)_45%,rgba(13,7,43,0.85)_100%)]" />
              <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
                <span className="rounded-full border border-white/25 bg-white/15 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.18em] text-white backdrop-blur-md">
                  {item.subtitle ?? 'Studio piece'}
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <h3 className="font-display text-[clamp(1.6rem,4vw,2.4rem)] leading-[0.95] tracking-[-0.02em] text-white">
                  {item.title}
                </h3>
                {item.meta && (
                  <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white/65">
                    {item.meta}
                  </p>
                )}
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center justify-between">
        <div className="skiper49-pagination !static !flex !w-auto items-center gap-1.5" />
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous design"
            onClick={() => swiperRef.current?.slidePrev()}
            className="skiper49-prev flex h-9 w-9 items-center justify-center rounded-full border border-brand-primary/15 bg-white text-brand-primary transition-colors hover:border-brand-primary hover:bg-brand-primary hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next design"
            onClick={() => swiperRef.current?.slideNext()}
            className="skiper49-next flex h-9 w-9 items-center justify-center rounded-full border border-brand-primary/15 bg-white text-brand-primary transition-colors hover:border-brand-primary hover:bg-brand-primary hover:text-white"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
