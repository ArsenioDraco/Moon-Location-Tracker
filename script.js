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


