/* =====================================================================
   config.js — ON/OFF switches for effects & performance.
   Your text/content lives in src/data/portfolio.js, not here.
   ===================================================================== */
export const CONFIG = {
  // 3D particle shape behind the page (changes shape & colour per section)
  background3D: true,

  // Fewer particles = smoother on slow laptops/phones
  particles: { desktop: 2200, mobile: 900 },

  // Resolution of the 3D layer (1 = fastest, 2 = sharpest)
  maxPixelRatio: 1.5,

  // Cards tilt slightly toward the mouse (desktop only)
  cardTilt: true,

  // Accent colours change as you scroll into each section
  sectionColors: true,

  // Animated "tank telemetry" demo card in the hero
  telemetryDemo: true,
  
  // Big sliding keyword strips between sections
  keywordBands: true,

  // Sections shown in the phone bottom bar (a search button is added in the middle)
  mobileNav: ["home", "work", "skills", "contact"],
};