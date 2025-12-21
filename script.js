// Hybrid Meeus + ELP2000 Correction Model (Web‑Optimized)
// STRUCTURE:
// 1. Julian Day calculation
// 2. Fundamental arguments (D, M, M', F)
// 3. Meeus base terms
// 4. ELP2000 correction deltas (reduced set)
// 5. Final longitude, latitude, distance
// 6. Live update function
// -------------------------------------------------------------------------

const RAD = Math.PI / 180;

// ----------------------------
// 1. Julian Day
// ----------------------------
function julianDay(date) {
  let year = date.getUTCFullYear();
  let month = date.getUTCMonth() + 1;
  const day = date.getUTCDate() +
              date.getUTCHours() / 24 +
              date.getUTCMinutes() / 1440 +
              date.getUTCSeconds() / 86400;
 if (month <= 2) {
    month += 12;
    year -= 1;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);

  return (
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day + B - 1524.5
  );
}
// ----------------------------
// 2. Fundamental arguments
// ----------------------------
function getFundamentalArgs(T) {
  const L0 = 218.3164477 + 481267.88123421 * T - 0.0015786 * T*T + T*T*T/538841 - T*T*T*T/65194000;
  const D  = 297.8501921 + 445267.1114034 * T - 0.0018819 * T*T + T*T*T/545868 - T*T*T*T/113065000;
  const M  = 357.5291092 + 35999.0502909 * T - 

