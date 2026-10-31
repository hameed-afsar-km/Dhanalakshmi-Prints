const items = [
  'PRECISION 0.05MM LAYER RESOLUTION',
  'CUSTOM 3D GIFTS & BESPOKE SCULPTURES',
  'INDUSTRIAL GRADE TOUGH PLA & PETG',
  'VIBRANT DUAL-COLOR & SILK FINISHES',
  'HIGH-FIDELITY RAPID PROTOTYPING',
  'PERSONALIZED NAMEPLATES & KEYCHAINS',
  'MICRON-ACCURATE RESIN DETAILING',
  'CALIBRATED MULTI-MATERIAL PRINTING',
  'FLAWLESS HAND-FINISHED CRAFTSMANSHIP',
  'ZERO-DEFECT QUALITY INSPECTION',
];

export default function HeroMarquee() {
  return (
    <div className="group relative overflow-hidden border-t border-brand-primary/10 bg-white/80 py-3.5 backdrop-blur-md">
      <div className="marquee-mask flex overflow-hidden">
        <div className="flex w-max shrink-0 [animation:marquee_36s_linear_infinite] group-hover:[animation-play-state:paused]">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
              {items.map((item) => (
                <span key={`${copy}-${item}`} className="flex items-center">
                  <span className="px-5 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-primary/80 sm:px-7">
                    {item}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
