"use client";

import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css";
import "swiper/css/effect-cards";

import { cn } from "@/lib/utils";

export interface Skiper49Item {
  src?: string;
  image?: string;
  alt?: string;
  title?: string;
  category?: string;
  href?: string;
}

interface Skiper49Props {
  images?: { src: string; alt: string; title?: string; category?: string; href?: string }[];
  items?: Skiper49Item[];
  className?: string;
}

const defaultAssets = [
  {
    src: "/assets/number-plate-keychain.jpg",
    alt: "Personalized Number-Plate Keychain",
    title: "Nameplate Keychain",
    category: "Automotive Series",
  },
  {
    src: "/assets/cursive-name-keychain.jpg",
    alt: "Custom Cursive Name Keychain",
    title: "Cursive Script Keychain",
    category: "Bespoke Charm",
  },
  {
    src: "/assets/nameplate bevelled.webp",
    alt: "Executive Bevelled Desk Nameplate",
    title: "Desk Nameplate",
    category: "Office & Studio",
  },
  {
    src: "/assets/3d-figure.jpg",
    alt: "Caricature 3D Print Figurine",
    title: "Caricature Print",
    category: "Sculptural Figurine",
  },
  {
    src: "/assets/photolamp.jpg",
    alt: "Custom Lithophane Photo Lamp",
    title: "Lithophane Photo Lamp",
    category: "Illuminated Memory",
  },
  {
    src: "/assets/Luggage-tag.webp",
    alt: "Industrial Travel Luggage Tag",
    title: "Travel Luggage Tag",
    category: "Travel Series",
  },
  {
    src: "/assets/3d vase miniature.jpg",
    alt: "Parametric Spiral Art Miniature Vase",
    title: "Parametric Art Vase",
    category: "Home Decor",
  },
];

const Skiper49 = ({ images: customImages, items, className }: Skiper49Props = {}) => {
  const images = customImages || (items ? items.map((it) => ({
    src: it.src || it.image || '',
    alt: it.alt || it.title || 'Studio 3D printed piece',
    title: it.title || it.alt || 'Studio 3D piece',
    category: it.category || 'Curated Design',
  })) : defaultAssets);

  return (
    <div className={cn("flex h-full w-full items-center justify-center overflow-hidden bg-transparent", className)}>
      <Carousel_003 className="" images={images} showPagination showNavigation loop autoplay />
    </div>
  );
};

export { Skiper49 };

const Carousel_003 = ({
  images,
  className,
  showPagination = false,
  showNavigation = false,
  loop = true,
  autoplay = false,
  spaceBetween = 0,
}: {
  images: { src: string; alt: string; title?: string; category?: string }[];
  className?: string;
  showPagination?: boolean;
  showNavigation?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  spaceBetween?: number;
}) => {
  const css = `
  .Carousal_003 {
    width: 100%;
    height: 360px;
    padding-bottom: 50px !important;
  }
  
  .Carousal_003 .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 300px;
    height: 300px;
    border-radius: 1.4rem;
    overflow: hidden;
    box-shadow: 0 20px 45px -15px rgba(28, 11, 96, 0.35);
    border: 1px solid rgba(255, 255, 255, 0.7);
    background-color: #fff;
  }

  @media (max-width: 480px) {
    .Carousal_003 {
      height: 310px;
      padding-bottom: 40px !important;
    }
    .Carousal_003 .swiper-slide {
      width: 250px;
      height: 250px;
      border-radius: 1.1rem;
    }
  }

  .Carousal_003 .swiper-pagination-bullet {
    background-color: #1c0b60 !important;
    opacity: 0.3;
    transition: all 0.3s ease;
  }

  .Carousal_003 .swiper-pagination-bullet-active {
    background-color: #e71e64 !important;
    opacity: 1;
    width: 22px;
    border-radius: 9999px;
  }

  .Carousal_003 .swiper-button-next,
  .Carousal_003 .swiper-button-prev {
    width: 38px;
    height: 38px;
    border-radius: 9999px;
    background: rgba(28, 11, 96, 0.75);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    transition: all 0.25s ease;
  }

  .Carousal_003 .swiper-button-next:hover,
  .Carousal_003 .swiper-button-prev:hover {
    background: #1c0b60;
    transform: scale(1.08);
  }
`;

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.2,
      }}
      className={cn("relative w-full max-w-full lg:max-w-4xl px-2 sm:px-5 overflow-hidden", className)}
    >
      <style>{css}</style>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <Swiper
          spaceBetween={spaceBetween}
          autoplay={
            autoplay
              ? {
                  delay: 2500,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }
              : false
          }
          effect="coverflow"
          grabCursor={true}
          slidesPerView="auto"
          centeredSlides={true}
          loop={loop}
          coverflowEffect={{
            rotate: 40,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={
            showPagination
              ? {
                  clickable: true,
                }
              : false
          }
          navigation={
            showNavigation
              ? {
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                }
              : false
          }
          className="Carousal_003"
          modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index} className="group relative">
              <img
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                src={image.src}
                alt={image.alt}
              />
              {/* Slight dark gradient from the bottom of the image */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              
              {/* Label with type */}
              <div className="absolute inset-x-0 bottom-0 p-3.5 z-10 text-white text-left pointer-events-none">
                {image.category && (
                  <span className="block text-[9px] font-bold uppercase tracking-[0.16em] text-brand-gold drop-shadow-xs mb-0.5">
                    {image.category}
                  </span>
                )}
                <p className="font-heading text-sm sm:text-base font-extrabold uppercase leading-tight tracking-tight text-white drop-shadow-md">
                  {image.title || image.alt}
                </p>
              </div>
            </SwiperSlide>
          ))}
          {showNavigation && (
            <div>
              <div className="swiper-button-next after:hidden">
                <ChevronRightIcon className="h-5 w-5 text-white" />
              </div>
              <div className="swiper-button-prev after:hidden">
                <ChevronLeftIcon className="h-5 w-5 text-white" />
              </div>
            </div>
          )}
        </Swiper>
      </motion.div>
    </motion.div>
  );
};

export { Carousel_003 };
export default Skiper49;
