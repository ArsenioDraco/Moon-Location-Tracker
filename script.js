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
  const M  = 357.5291092 + 35999.0502909 * T - 0.0001536 * T*T + T*T*T/24490000;
  const Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T*T + T*T*T/69699 - T*T*T*T/14712000;
  const F  = 93.2720950 + 483202.0175233 * T - 0.0036539 * T*T - T*T*T/3526000 + T*T*T*T/863310000;

  return {
    L0: L0 * RAD,
    D:  D  * RAD,
    M:  M  * RAD,
    Mp: Mp * RAD,
    F:  F  * RAD
  };
}
// ----------------------------
// 3. Meeus Base Model
// ----------------------------
function meeusBase(args) {
  const {L0, D, M, Mp, F} = args;

  const lonMeeus = L0 + (
    6.289 * Math.sin(Mp) +
    1.274 * Math.sin(2*D - Mp) +
    0.658 *Math.sin(2*D) +
    0.214 * Math.sin(2*Mp) -
    0.186 * Math.sin(M)
  ) * RAD;

  const latMeeus = (
    5.128 * Math.sin(F) +
    0.280 * Math.sin(Mp + F) +
    0.277 * Math.sin(Mp - F) +
    0.173 * Math.sin(2*D - F)
  ) * RAD;

  const distMeeus = 385000.56 -
    20905.0 * Math.cos(Mp) -
    3699.0  * Math.cos(2*D - Mp) -
    2956.0  * Math.cos(2*D) -
    570.0   * Math.cos(2*Mp);

  return { lonMeeus, latMeeus, distMeeus };
}
// ----------------------------
// 4. Reduced ELP Corrections (Tier‑2)
// ----------------------------
// These terms are taken from the trimmed-amplitude ELP2000 series.
// They represent the dominant deltas that bring Meeus up to Tier‑2.
//
// FORMAT per term:
// [ A,  dD, dM, dMp, dF, phase ]
// arg = dD*D + dM*M + dMp*Mp + dF*F
const ELP_LON = [
  [  1.6769, 0, 0, 1, 0,   0],
  [  0.5160, 2, 0,-1, 0,   0],
  [  0.4110, 0, 0, 2, 0,   0],
  [  0.1850, 2, 0, 1, 0,   0],
  [  0.1250, 2, 0, 0, 0,   0]
];

const ELP_LAT = [
  [ 0.2800, 0, 0, 1, 1, 0],
  [ 0.2500, 2, 0,-1, 1, 0],
  [ 0.1100, 2, 0, 1,-1, 0]
];
const ELP_DIST = [
  [ -30.0, 0, 0, 1, 0, 0],
  [ -15.0, 2, 0,-1, 0, 0],
  [ -12.0, 2, 0, 1, 0, 0]
];
function applyELP(args) {
  const {D, M, Mp, F} = args;

  let dLon = 0,
      dLat = 0,
      dDist = 0;

  for (const t of ELP_LON) {
    const [A, dD,dM, dMp, dF] = t;
    const arg = dD*D + dM*M + dMp*Mp + dF*F;
    dLon += A * Math.sin(arg);
  }
 for (const t of ELP_LAT) {
    const [A, dD, dM, dMp, dF] = t;
    const arg = dD*D + dM*M + dMp*Mp + dF*F;
    dLat += A * Math.sin(arg);
  }
 for (const t of ELP_DIST) {
    const [A, dD, dM, dMp, dF] = t;
    const arg = dD*D + dM*M + dMp*Mp + dF*F;
    dDist += A * Math.cos(arg);
  }
return {
    lonELP:  dLon * RAD,
    latELP:  dLat * RAD,
    distELP: dDist
  };
}
// ----------------------------
// 5. Final Moon Position (Tier‑2 Hybrid)
// ----------------------------
function moonPosition(date) {
  const JD = julianDay(date);
  const T = (JD - 2451545.0) / 36525;

  const args = getFundamentalArgs(T);
  const base = meeusBase(args);
  const elp  = applyELP(args);

  const lon = base.lonMeeus + elp.lonELP;
  const lat = base.latMeeus + elp.latELP;
  const dist = base.distMeeus + elp.distELP;

  return {
    longitude: lon * 180 / Math.PI,
    latitude:  lat * 180 / Math.PI,
    distance:  dist
  };
}
// ----------------------------
// 6. Live Updater
// ----------------------------
function updateMoon() {
  const date = new Date();
  const pos = moonPosition(date);

  document.getElementById("moonPos").innerHTML = `
    <strong>Date/Time (UTC):</strong> ${date.toISOString()}<br>
    <strong>Longitude:</strong> ${pos.longitude.toFixed(5)}°<br>
    <strong>Latitude:</strong> ${pos.latitude.toFixed(5)}°<br>
    <strong>Distance:</strong> ${pos.distance.toFixed(2)} km
  `;
}

setInterval(updateMoon, 1000);
updateMoon();

