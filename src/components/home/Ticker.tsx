const items = [
  'Instant quotes',
  '0.05 mm layer detail',
  'Silk PLA',
  'Made in Chennai',
  'STL / OBJ / GLB / GLTF',
  'Carbon fibre ready',
  'Live material preview',
  'Ships across India',
  'Small-batch friendly',
];

export default function Ticker() {
  return (
    <div className="group relative overflow-hidden border-b border-brand-primary bg-brand-primary py-4 text-brand-gold">
      <div className="marquee-mask flex overflow-hidden">
        <div className="flex w-max shrink-0 [animation:marquee_32s_linear_infinite] group-hover:[animation-play-state:paused]">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
              {items.map((item, index) => (
                <span key={`${copy}-${item}`} className="flex items-center">
                  <span className="px-5 font-display text-[22px] italic tracking-[-0.01em] sm:px-8 sm:text-[25px]">
                    {item}
                  </span>
                  <span className="font-mono text-[9px] tabular-nums text-white/40">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="mx-5 h-2 w-2 rounded-full bg-brand-pink sm:mx-8" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
