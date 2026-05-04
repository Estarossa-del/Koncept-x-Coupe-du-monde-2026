/**
 * NavbarHero — CDN-compatible (React 18 UMD + Babel + Tailwind CDN)
 * Adapted from hero-with-video.tsx (shadcn/TypeScript/next-themes version)
 *
 * Usage: include in a page that loads:
 *   - React 18 UMD  (window.React, window.ReactDOM)
 *   - Babel standalone
 *   - Tailwind CDN  (<script src="https://cdn.tailwindcss.com">)
 *   - This file via <script type="text/babel" src="components/ui/hero-with-video.jsx">
 */

/* ── Inline SVG icons (replaces lucide-react) ─────────────────────────────── */
const IconPlay   = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>;
const IconPause  = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>;
const IconMail   = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22,7-10,7L2,7"/></svg>;
const IconArrow  = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
const IconMenu   = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const IconChevron = ({ open }) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{transition:'transform 0.2s',transform:open?'rotate(180deg)':'rotate(0deg)'}}><polyline points="6 9 12 15 18 9"/></svg>;
const IconSun    = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const IconMoon   = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;

/* ── Component ────────────────────────────────────────────────────────────── */
const NavbarHero = ({
  brandName        = "nexus",
  heroTitle        = "Innovation Meets Simplicity",
  heroDescription  = "Discover cutting-edge solutions designed for the modern digital landscape.",
  backgroundImage  = "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=2072&q=80",
  videoUrl         = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  emailPlaceholder = "enter@email.com",
}) => {
  const { useState, useRef, useEffect } = React;

  const [email,            setEmail]            = useState('');
  const [mobileOpen,       setMobileOpen]        = useState(false);
  const [openDropdown,     setOpenDropdown]      = useState(null);
  const [isVideoPlaying,   setIsVideoPlaying]    = useState(false);
  const [isVideoPaused,    setIsVideoPaused]     = useState(false);
  const [isDark,           setIsDark]            = useState(false);
  const videoRef = useRef(null);

  /* Theme toggle — applies .dark to <html> for Tailwind dark: variants */
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const toggleDropdown = name =>
    setOpenDropdown(prev => prev === name ? null : name);

  const handlePlay = () => {
    if (!videoRef.current) return;
    videoRef.current.play();
    setIsVideoPlaying(true);
    setIsVideoPaused(false);
  };
  const handlePause = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    setIsVideoPaused(true);
  };
  const handleResume = () => {
    if (!videoRef.current) return;
    videoRef.current.play();
    setIsVideoPaused(false);
  };
  const handleEnded = () => {
    setIsVideoPlaying(false);
    setIsVideoPaused(false);
  };

  const DropdownMenu = ({ id, label, items }) => (
    <li className="relative">
      <button
        onClick={() => toggleDropdown(id)}
        className="flex items-center gap-1 hover:text-foreground px-3 py-2 text-sm transition-colors duration-200 rounded-lg cursor-pointer"
      >
        {label}
        <IconChevron open={openDropdown === id}/>
      </button>
      {openDropdown === id && (
        <ul className="absolute top-full left-0 mt-2 p-2 bg-card border border-border shadow-lg rounded-xl z-20 w-48">
          {items.map(item => (
            <li key={item}>
              <a href="#" className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors duration-150 cursor-pointer">
                {item}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );

  return (
    <main className="absolute inset-0 bg-background overflow-y-auto">
      <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">

        {/* ── Navbar ── */}
        <div className="py-2 relative z-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <a href="#" className="font-bold text-2xl text-foreground cursor-pointer flex-shrink-0">
              {brandName}
            </a>
            <nav className="hidden lg:flex text-muted-foreground font-medium">
              <ul className="flex items-center space-x-2">
                <li>
                  <a href="#" className="hover:text-foreground px-3 py-2 text-sm transition-colors duration-200 rounded-lg cursor-pointer">About</a>
                </li>
                <DropdownMenu id="desktop-resources" label="Resources" items={['Documentation','Tutorials','Blog']}/>
                <li>
                  <a href="#" className="hover:text-foreground px-3 py-2 text-sm transition-colors duration-200 rounded-lg cursor-pointer">Blog</a>
                </li>
                <DropdownMenu id="desktop-pricing" label="Plans & Pricing" items={['Starter — Free','Pro — $19/mo','Enterprise']}/>
              </ul>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <a href="#" className="text-foreground hover:text-muted-foreground cursor-pointer py-2 px-4 text-sm font-medium transition-colors duration-200 rounded-xl">Login</a>
              <button className="bg-foreground hover:bg-muted-foreground text-background py-2.5 px-5 text-sm rounded-xl font-medium transition-colors duration-200 flex items-center gap-2 cursor-pointer">
                Get Started <IconArrow/>
              </button>
            </div>

            {/* Theme toggle */}
            <button
              onClick={() => setIsDark(d => !d)}
              className="bg-muted hover:bg-border flex-shrink-0 p-2.5 rounded-full transition-colors duration-200 cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDark ? <IconSun/> : <IconMoon/>}
            </button>

            {/* Mobile hamburger */}
            <div className="lg:hidden relative">
              <button
                onClick={() => setMobileOpen(o => !o)}
                className="bg-transparent hover:bg-muted border-none p-2 rounded-xl transition-colors duration-200 cursor-pointer"
                aria-label="Open menu"
              >
                <IconMenu/>
              </button>
              {mobileOpen && (
                <ul className="absolute top-full right-0 mt-2 p-2 shadow-lg bg-card border border-border rounded-xl w-56 z-30">
                  <li><a href="#" className="block px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg cursor-pointer">About</a></li>
                  <li><a href="#" className="block px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg cursor-pointer">Blog</a></li>
                  <li className="border-t border-border mt-2 pt-2 space-y-2">
                    <a href="#" className="block w-full text-center px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg cursor-pointer">Login</a>
                    <button className="w-full bg-foreground text-background hover:bg-muted-foreground px-3 py-2.5 text-sm rounded-lg flex items-center justify-center gap-2 font-medium cursor-pointer transition-colors duration-200">
                      Get Started <IconArrow/>
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* ── Hero text ── */}
        <div className="pt-4 pb-10 sm:pt-6 sm:pb-12 text-center">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-5xl text-foreground font-bold tracking-tight leading-tight">
              {heroTitle}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              {heroDescription}
            </p>
            <div className="mt-8 flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                  <IconMail/>
                </span>
                <input
                  type="email"
                  placeholder={emailPlaceholder}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full max-w-xs bg-muted border border-border text-foreground placeholder:text-muted-foreground font-medium pl-11 pr-4 py-2.5 text-sm sm:py-3 sm:text-base rounded-full focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                />
              </div>
              <button
                onClick={() => console.log('Email submitted:', email)}
                className="bg-foreground hover:bg-muted-foreground text-background px-5 py-2.5 text-sm sm:px-6 sm:py-3 sm:text-base rounded-full font-medium transition-colors duration-200 flex items-center gap-2 cursor-pointer"
              >
                Join Now <IconArrow/>
              </button>
            </div>
          </div>
        </div>

        {/* ── Video / Image hero ── */}
        <header className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl">
          {/* Background image */}
          <img
            src={backgroundImage}
            alt="Hero background"
            className={`w-full h-full absolute inset-0 object-cover transition-opacity duration-500 ${isVideoPlaying ? 'opacity-0' : 'opacity-100'}`}
            loading="lazy"
          />
          {/* Video (click-to-play, muted, no autoplay per UX guidelines) */}
          <video
            ref={videoRef}
            src={videoUrl}
            className={`w-full h-full absolute inset-0 object-cover transition-opacity duration-500 ${isVideoPlaying ? 'opacity-100' : 'opacity-0'}`}
            onEnded={handleEnded}
            playsInline
            muted
            preload="none"
          />
          {/* Play / Pause button */}
          <div className="absolute bottom-5 right-5 z-10">
            {!isVideoPlaying ? (
              <button
                onClick={handlePlay}
                className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all duration-200 shadow-lg cursor-pointer text-white"
                aria-label="Play video"
              >
                <IconPlay/>
              </button>
            ) : (
              <button
                onClick={isVideoPaused ? handleResume : handlePause}
                className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all duration-200 shadow-lg cursor-pointer text-white"
                aria-label={isVideoPaused ? 'Resume video' : 'Pause video'}
              >
                {isVideoPaused ? <IconPlay/> : <IconPause/>}
              </button>
            )}
          </div>
        </header>

      </div>
    </main>
  );
};

/* Export for use as CDN module */
if (typeof window !== 'undefined') window.NavbarHero = NavbarHero;
