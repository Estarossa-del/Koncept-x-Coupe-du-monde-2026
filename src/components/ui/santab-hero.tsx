"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';

export interface City {
  id: string;
  name: string;
  /** Horizontal position as % of the map container (0–100) */
  x: number;
  /** Vertical position as % of the map container (0–100) */
  y: number;
  /** Milliseconds into the 12-second timeline when this city lights up */
  delay: number;
  image?: string;
}

export interface SantabHeroProps {
  mapImage?: string;
  trophyImage?: string;
  santabImage?: string;
  cities?: City[];
  showCTA?: boolean;
  showControls?: boolean;
  duration?: number;
  autoPlay?: boolean;
  title?: string;
  subtitle?: string;
  primaryCTA?: string;
  secondaryCTA?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

const DEFAULT_CITIES: City[] = [
  { id: 'toronto', name: 'Toronto',     x: 57, y: 37, delay: 2000 },
  { id: 'newyork', name: 'New York',    x: 62, y: 44, delay: 2700 },
  { id: 'dallas',  name: 'Dallas',      x: 51, y: 56, delay: 3400 },
  { id: 'miami',   name: 'Miami',       x: 60, y: 63, delay: 4000 },
  { id: 'mexico',  name: 'Mexico City', x: 46, y: 66, delay: 4600 },
];

export default function SantabHero({
  mapImage     = '/images/Amérique_du_Nord.png',
  trophyImage  = '/images/CDM_1.png',
  santabImage  = '/images/Santab_Main_Event.png',
  cities       = DEFAULT_CITIES,
  showCTA      = false,
  showControls = false,
  duration     = 12000,
  autoPlay     = true,
  title        = 'SANTAB IA',
  subtitle,
  primaryCTA,
  secondaryCTA,
  onPrimaryClick,
  onSecondaryClick,
}: SantabHeroProps) {
  const canvasRef      = useRef<HTMLCanvasElement>(null);
  const shaderRafRef   = useRef<number>(0);
  const timelineRafRef = useRef<number>(0);
  const startTsRef     = useRef<number>(0);

  const [showMap,     setShowMap]     = useState(false);
  const [litCities,   setLitCities]   = useState<string[]>([]);
  const [showNetwork, setShowNetwork] = useState(false);
  const [showTrophy,  setShowTrophy]  = useState(false);
  const [showRays,    setShowRays]    = useState(false);
  const [showFace,    setShowFace]    = useState(false);
  const [showCTAEl,   setShowCTAEl]   = useState(false);
  const [elapsed,     setElapsed]     = useState(0);

  // ── Cosmic canvas shader (Canvas 2D, no external deps) ──────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const stars = Array.from({ length: 90 }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 1.5e-4,
      vy: (Math.random() - 0.5) * 1.5e-4,
      r:  Math.random() * 1.8 + 0.3,
      ph: Math.random() * Math.PI * 2,
    }));

    const draw = (t: number) => {
      const W = canvas.offsetWidth  || 800;
      const H = canvas.offsetHeight || 600;
      if (canvas.width  !== W) canvas.width  = W;
      if (canvas.height !== H) canvas.height = H;
      const T = t * 0.001;

      ctx.fillStyle = '#05080F';
      ctx.fillRect(0, 0, W, H);

      // Gold orb (primary)
      const ox = W * (0.5 + 0.18 * Math.sin(T * 0.22));
      const oy = H * (0.42 + 0.10 * Math.cos(T * 0.28));
      const g1 = ctx.createRadialGradient(ox, oy, 0, W * 0.5, H * 0.45, W * 0.72);
      g1.addColorStop(0,    `rgba(212,175,55,${0.13 + 0.04 * Math.sin(T * 0.45)})`);
      g1.addColorStop(0.45, 'rgba(180,85,20,0.06)');
      g1.addColorStop(1,    'rgba(5,8,15,0)');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, W, H);

      // Red accent orb (secondary)
      const g2 = ctx.createRadialGradient(
        W * (0.28 + 0.08 * Math.cos(T * 0.18)), H * (0.72 + 0.06 * Math.sin(T * 0.32)), 0,
        W * 0.3, H * 0.72, W * 0.45
      );
      g2.addColorStop(0, `rgba(232,25,44,${0.055 + 0.015 * Math.sin(T * 0.6)})`);
      g2.addColorStop(1, 'rgba(5,8,15,0)');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, W, H);

      // Animated stars
      stars.forEach(s => {
        s.x = (s.x + s.vx + 1) % 1;
        s.y = (s.y + s.vy + 1) % 1;
        const a = 0.35 + 0.35 * Math.sin(T * 1.8 + s.ph);
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,175,55,${a})`;
        ctx.fill();
      });

      shaderRafRef.current = requestAnimationFrame(draw);
    };

    shaderRafRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(shaderRafRef.current); };
  }, []);

  // ── 12-second animation timeline ───────────────────────────────────────────
  const runTimeline = useCallback(() => {
    cancelAnimationFrame(timelineRafRef.current);
    setShowMap(false);
    setLitCities([]);
    setShowNetwork(false);
    setShowTrophy(false);
    setShowRays(false);
    setShowFace(false);
    setShowCTAEl(false);
    setElapsed(0);

    startTsRef.current = performance.now();

    const tick = (now: number) => {
      const el = now - startTsRef.current;
      setElapsed(el);

      if (el > 800)  setShowMap(true);

      setLitCities(cities.filter(c => el > c.delay).map(c => c.id));

      if (el > 4500) setShowNetwork(true);
      if (el > 8500) setShowTrophy(true);
      if (el > 9200) setShowRays(true);
      if (el > 9500) setShowFace(true);
      if (el > 10000 && showCTA) setShowCTAEl(true);

      if (el < duration) {
        timelineRafRef.current = requestAnimationFrame(tick);
      }
    };

    timelineRafRef.current = requestAnimationFrame(tick);
  }, [cities, duration, showCTA]);

  useEffect(() => {
    if (!autoPlay) return;
    const id = setTimeout(runTimeline, 400);
    return () => { clearTimeout(id); cancelAnimationFrame(timelineRafRef.current); };
  }, [autoPlay, runTimeline]);

  const pct = Math.min(100, (elapsed / duration) * 100);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', background: '#05080F' }}>

      {/* ── Cosmic shader canvas ── */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

      {/* ── North America map ── */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
        opacity: showMap ? 1 : 0,
        transition: 'opacity 1.4s ease',
      }}>
        <img
          src={mapImage}
          alt="Amérique du Nord"
          style={{
            width: '80%', maxWidth: 860, height: 'auto',
            filter: 'brightness(0.5) sepia(0.4) hue-rotate(-10deg) saturate(2)',
            mixBlendMode: 'screen',
            userSelect: 'none',
          }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </div>

      {/* ── SVG layer: light beams, city dots, network lines ── */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 4 }}>
        <defs>
          <filter id="sh-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Beams from north-center gateway → each city */}
        {cities.map(city => {
          const on = litCities.includes(city.id);
          return (
            <React.Fragment key={city.id}>
              <line
                x1="50%" y1="8%"
                x2={`${city.x}%`} y2={`${city.y}%`}
                stroke="rgba(212,175,55,0.4)"
                strokeWidth="1.2"
                strokeDasharray={1000}
                strokeDashoffset={on ? 0 : 1000}
                style={{ transition: 'stroke-dashoffset 0.9s ease' }}
              />
              {/* Outer pulse ring */}
              <circle
                cx={`${city.x}%`} cy={`${city.y}%`} r="14"
                fill="none" stroke="rgba(212,175,55,0.55)" strokeWidth="1"
                className={on ? 'sh-city-ring' : ''}
                style={{ opacity: on ? 1 : 0, transition: 'opacity 0.4s' }}
              />
              {/* Core dot */}
              <circle
                cx={`${city.x}%`} cy={`${city.y}%`} r="4"
                fill={on ? '#D4AF37' : 'transparent'}
                filter={on ? 'url(#sh-glow)' : undefined}
                style={{ transition: 'fill 0.4s' }}
              />
            </React.Fragment>
          );
        })}

        {/* Network connection lines */}
        {showNetwork && cities.map((c1, i) =>
          cities.slice(i + 1).map(c2 => (
            <line
              key={`${c1.id}-${c2.id}`}
              x1={`${c1.x}%`} y1={`${c1.y}%`}
              x2={`${c2.x}%`} y2={`${c2.y}%`}
              stroke="rgba(212,175,55,0.15)"
              strokeWidth="0.7"
              strokeDasharray={400}
              className="sh-network-line"
            />
          ))
        )}
      </svg>

      {/* City labels (positioned via % to match SVG) */}
      {cities.map(city => {
        const on = litCities.includes(city.id);
        return (
          <div
            key={`lbl-${city.id}`}
            style={{
              position: 'absolute',
              left: `${city.x}%`,
              top: `calc(${city.y}% + 14px)`,
              transform: 'translateX(-50%)',
              fontSize: 9, fontWeight: 700,
              color: '#D4AF37', letterSpacing: '0.14em',
              textTransform: 'uppercase', whiteSpace: 'nowrap',
              fontFamily: "'Inter', sans-serif",
              textShadow: '0 0 10px rgba(212,175,55,0.7)',
              opacity: on ? 1 : 0,
              transition: 'opacity 0.8s',
              pointerEvents: 'none', zIndex: 5,
            }}
          >
            {city.name}
          </div>
        );
      })}

      {/* ── Trophy explosion ── */}
      {showTrophy && (
        <div
          className="sh-trophy-boom"
          style={{
            position: 'absolute', left: '50%', top: '44%',
            zIndex: 10, textAlign: 'center', pointerEvents: 'none',
          }}
        >
          <img
            src={trophyImage}
            alt="Trophée CDM 2026"
            style={{
              height: 'clamp(110px, 20vh, 220px)', width: 'auto',
              filter: 'drop-shadow(0 0 28px rgba(212,175,55,0.9)) drop-shadow(0 0 55px rgba(212,175,55,0.4))',
            }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          {/* Particle burst */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="sh-particle"
              style={{
                position: 'absolute', left: '50%', top: '50%',
                marginLeft: -3, marginTop: -3,
                width: 6, height: 6, borderRadius: '50%',
                background: i % 3 === 0 ? '#D4AF37' : i % 3 === 1 ? '#F5D060' : '#E8192C',
                animationDelay: `${i * 0.05}s`,
                '--rot': `${i * 30}deg`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      {/* ── Rotating rays (wrapper: positions; inner: spins) ── */}
      {showRays && (
        <div style={{
          position: 'absolute', left: '50%', top: '44%',
          transform: 'translate(-50%, -50%)',
          zIndex: 6, pointerEvents: 'none',
        }}>
          <div className="sh-rays-spin" style={{ width: 480, height: 480, position: 'relative' }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: '50%', height: 1.5,
                  background: `linear-gradient(90deg, transparent 0%, rgba(212,175,55,${i % 4 === 0 ? 0.45 : 0.22}) 100%)`,
                  top: '50%', left: '50%',
                  transformOrigin: '0% 50%',
                  transform: `rotate(${i * 30}deg) translateY(-50%)`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── SANTAB face ── */}
      {showFace && (
        <div
          className="sh-face-in"
          style={{ position: 'absolute', right: '5%', bottom: '8%', zIndex: 12, pointerEvents: 'none' }}
        >
          <img
            src={santabImage}
            alt="SANTAB IA"
            style={{
              height: 'clamp(80px, 14vh, 150px)', width: 'auto',
              filter: 'drop-shadow(0 0 18px rgba(212,175,55,0.55))',
            }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      )}

      {/* ── CTA overlay ── */}
      {showCTA && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 15,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'flex-end',
          paddingBottom: '7vh',
          background: showCTAEl
            ? 'linear-gradient(to top, rgba(5,8,15,0.85) 0%, transparent 55%)'
            : 'transparent',
          transition: 'background 1.2s',
        }}>
          <div style={{
            textAlign: 'center',
            pointerEvents: showCTAEl ? 'auto' : 'none',
            opacity: showCTAEl ? 1 : 0,
            transform: showCTAEl ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.9s ease, transform 0.9s ease',
          }}>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(42px, 7.5vw, 88px)',
              background: 'linear-gradient(135deg, #D4AF37, #F5D060, #D4AF37)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'santabCTAShimmer 3s ease infinite',
              margin: 0, lineHeight: 0.9, letterSpacing: '0.06em',
            }}>
              {title}
            </h2>
            {subtitle && (
              <p style={{
                fontSize: 'clamp(13px, 1.8vw, 18px)',
                color: 'rgba(242,244,255,0.75)',
                fontFamily: "'Inter', sans-serif",
                marginTop: 10, letterSpacing: '0.05em',
              }}>
                {subtitle}
              </p>
            )}
            {(primaryCTA || secondaryCTA) && (
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 22, flexWrap: 'wrap' }}>
                {primaryCTA && (
                  <button
                    onClick={onPrimaryClick}
                    style={{
                      background: 'linear-gradient(135deg, #D4AF37, #F5D060)',
                      color: '#05080F', border: 'none',
                      padding: '12px 32px', borderRadius: 8,
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 700, fontSize: 13,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      cursor: 'pointer', boxShadow: '0 6px 24px rgba(212,175,55,0.45)',
                    }}
                  >
                    {primaryCTA}
                  </button>
                )}
                {secondaryCTA && (
                  <button
                    onClick={onSecondaryClick}
                    style={{
                      background: 'rgba(212,175,55,0.1)', color: '#D4AF37',
                      border: '1px solid rgba(212,175,55,0.4)',
                      padding: '12px 26px', borderRadius: 8,
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600, fontSize: 13,
                      letterSpacing: '0.06em', cursor: 'pointer',
                    }}
                  >
                    {secondaryCTA}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Demo controls ── */}
      {showControls && (
        <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 20, display: 'flex', gap: 8 }}>
          <button
            onClick={runTimeline}
            style={{
              background: 'rgba(212,175,55,0.15)',
              border: '1px solid rgba(212,175,55,0.4)',
              color: '#D4AF37', padding: '7px 14px',
              borderRadius: 6, fontSize: 11,
              fontFamily: "'Inter', sans-serif", cursor: 'pointer',
            }}
          >
            ↺ Replay
          </button>
        </div>
      )}

      {/* ── Progress bar ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0,
        height: 2, width: `${pct}%`,
        background: 'linear-gradient(90deg, #D4AF37, #F5D060)',
        zIndex: 20, transition: 'width 0.1s linear',
        boxShadow: '0 0 8px rgba(212,175,55,0.6)',
      }} />
    </div>
  );
}
