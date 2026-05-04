/**
 * RevealText — CDN-compatible (React 18 UMD + Babel)
 * Adapted from reveal-text.tsx (framer-motion version)
 *
 * Animations reimplemented with CSS keyframes + React state:
 *   - Spring entrance  → @keyframes springIn (per-letter delay via style)
 *   - Hover image pan  → CSS background-position transition + opacity
 *   - Overlay sweep    → @keyframes overlayPulse (per-letter delay)
 *
 * No framer-motion required. Respects prefers-reduced-motion.
 *
 * Usage: include in a page that loads React 18 UMD + Babel standalone,
 *   then: <script type="text/babel" src="components/ui/reveal-text.jsx">
 */

/* Inject CSS once */
(function injectStyles() {
  if (document.getElementById('reveal-text-styles')) return;
  const s = document.createElement('style');
  s.id = 'reveal-text-styles';
  s.textContent = `
    /* Spring entrance — scale 0 → bounce → 1 */
    @keyframes rt-springIn {
      0%   { transform: scale(0);    opacity: 0; }
      55%  { transform: scale(1.18); opacity: 1; }
      75%  { transform: scale(0.90); }
      90%  { transform: scale(1.05); }
      100% { transform: scale(1);    opacity: 1; }
    }

    /* Overlay colour sweep (opacity pulse) */
    @keyframes rt-overlayPulse {
      0%   { opacity: 0; }
      8%   { opacity: 1; }
      68%  { opacity: 1; }
      100% { opacity: 0; }
    }

    .rt-letter {
      display: inline-block;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      transform: scale(0);
      opacity: 0;
      line-height: 1;
    }

    /* Entrance plays once animation-delay fires */
    .rt-letter.rt-enter {
      animation: rt-springIn 0.72s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }

    /* Base text layer */
    .rt-base {
      position: absolute;
      inset: 0;
      transition: opacity 0.1s;
      pointer-events: none;
      white-space: nowrap;
    }

    /* Image-clipped text layer */
    .rt-img {
      display: block;
      background-size: cover;
      background-repeat: no-repeat;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
      opacity: 0;
      background-position: 0% center;
      transition: opacity 0.12s, background-position 3s ease-in-out;
      white-space: nowrap;
    }

    .rt-letter:hover .rt-img {
      opacity: 1;
      background-position: 10% center;
    }
    .rt-letter:hover .rt-base {
      opacity: 0;
    }

    /* Overlay sweep */
    .rt-overlay {
      position: absolute;
      inset: 0;
      pointer-events: none;
      opacity: 0;
      white-space: nowrap;
    }
    .rt-overlay.rt-sweep {
      animation: rt-overlayPulse var(--ov-dur) ease-in-out forwards;
      animation-delay: var(--ov-delay);
    }

    /* Respect reduced-motion */
    @media (prefers-reduced-motion: reduce) {
      .rt-letter  { animation: none !important; transform: scale(1) !important; opacity: 1 !important; }
      .rt-overlay { animation: none !important; display: none !important; }
      .rt-img, .rt-base { transition: none !important; }
    }
  `;
  document.head.appendChild(s);
})();

/* ── Component ────────────────────────────────────────────────────────────── */
const RevealText = ({
  text            = "STUNNING",
  textColor       = "#ffffff",
  overlayColor    = "#ef4444",
  fontSize        = "10rem",
  fontFamily      = "inherit",
  letterDelay     = 0.08,     // seconds between each letter entrance
  overlayDelay    = 0.05,     // seconds between each overlay pulse
  overlayDuration = 0.4,      // seconds for each overlay pulse
  springDuration  = 600,      // ms — spring settle time (used to delay overlay trigger)
  letterImages    = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?auto=format&fit=crop&w=800&q=80",
  ],
}) => {
  const { useState, useEffect, useRef } = React;

  const letters      = text.split('');
  const [entered,    setEntered]    = useState([]);   // indices of letters that have started entrance
  const [showOverlay,setShowOverlay]= useState(false);

  /* Stagger letter entrance */
  useEffect(() => {
    const timers = letters.map((_, i) =>
      setTimeout(() => setEntered(prev => [...prev, i]), i * letterDelay * 1000)
    );
    return () => timers.forEach(clearTimeout);
  }, [text]);

  /* Trigger overlay sweep after all letters have settled */
  useEffect(() => {
    const lastDelay = (letters.length - 1) * letterDelay * 1000;
    const id = setTimeout(() => setShowOverlay(true), lastDelay + springDuration);
    return () => clearTimeout(id);
  }, [text]);

  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
      <div style={{ display:'flex' }}>
        {letters.map((letter, i) => (
          <span
            key={i}
            className={`rt-letter${entered.includes(i) ? ' rt-enter' : ''}`}
            style={{
              fontSize,
              fontFamily,
              fontWeight: 900,
              letterSpacing: '-0.02em',
              /* Stagger the entrance animation start */
              animationDelay: entered.includes(i) ? '0s' : undefined,
            }}
          >
            {/* Base coloured text */}
            <span className="rt-base" style={{ color: textColor }}>
              {letter}
            </span>

            {/* Image-clipped text (visible on hover) */}
            <span
              className="rt-img"
              style={{
                backgroundImage: `url('${letterImages[i % letterImages.length]}')`,
                fontSize, fontWeight: 900,
              }}
            >
              {letter}
            </span>

            {/* Overlay colour sweep (fires once after entrance) */}
            {showOverlay && (
              <span
                className="rt-overlay rt-sweep"
                style={{
                  color: overlayColor,
                  '--ov-dur':   `${overlayDuration}s`,
                  '--ov-delay': `${i * overlayDelay}s`,
                  fontSize, fontWeight: 900,
                }}
              >
                {letter}
              </span>
            )}

            {/* Invisible spacer to size the container */}
            <span style={{ visibility:'hidden', fontSize, fontWeight:900 }}>{letter}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

/* Export for CDN usage */
if (typeof window !== 'undefined') window.RevealText = RevealText;
