# Moon Location Tracker (Hybrid Lunar Position Calculator)

Hybrid Lunar Position Calculator is a browser-based astronomical tool for computing the Moon’s geocentric longitude, latitude, and distance in real time. It combines a classical Meeus analytical model with a reduced ELP2000 correction set, producing a **Tier-2 hybrid solution** that balances numerical accuracy with performance suitable for live browser updates. Built to be entirely frontend and designed for clarity and transparency, the project emphasizes mathematically grounded calculations, modular structure, and readable output rather than black-box precision libraries.

## Main Features

**Real-Time Lunar Position**  
The script calculates the Moon’s position every second using the current UTC time.  
Longitude, latitude, and Earth-Moon distance are displayed live, updating continuously without page reloads.

**Hybrid Accuracy Model**  
A Meeus base solution provides the foundational lunar motion.  
On top of this, dominant ELP2000 correction terms are applied, significantly improving accuracy while avoiding the computational weight of the full series.

**Astronomically Grounded Calculations**  
All values are derived from classical celestial mechanics:
- Julian Day computation
- Time in Julian centuries
- Fundamental lunar arguments
- Trigonometric series expansions

**Deterministic and Reproducible**  
Given the same UTC timestamp, the output is always identical.  
This makes the script suitable for simulations, visualizations as well as educational use.

**Live Browser Integration**  
Results are rendered directly into the DOM using minimal markup.  
The script is fully self-contained and runs immediately when loaded, which allows the site to be easily accessible on most devices and it does not require any servers whatsoever.

## Technical Highlights

**Julian Day Calculation**  
Accurately converts a JavaScript `Date` object into Julian Day, accounting for:
- UTC time
- Gregorian calendar correction
- Fractional days from hours, minutes, and seconds

**Fundamental Lunar Arguments**  
Computes the core angular parameters:
- Mean longitude
- Mean elongation
- Solar anomaly
- Lunar anomaly
- Argument of latitude

These are calculated using high-order polynomial expressions and converted to radians for internal use.

**Meeus Base Model**  
Implements a reduced Meeus series to compute:
- Base lunar longitude
- Base lunar latitude
- Mean Earth-Moon distance

This forms the backbone of the positional solution.

**Reduced ELP2000 Corrections**  
Applies a trimmed set of dominant ELP2000 terms:
- Longitude corrections via sine series
- Latitude corrections via sine series
- Distance corrections via cosine series

The correction set is intentionally reduced to preserve performance while capturing the largest remaining perturbations.

**Tier-2 Hybrid Output**  
Final values are produced by combining:
- Meeus base results
- ELP correction deltas

The result is a higher-fidelity lunar position than Meeus alone, without the cost of full numerical ephemerides.

**Live Update Loop**  
A timed update runs once per second, recalculating the Moon’s position and injecting formatted output into the page.

## File Structure

| File          | Description                                                     |
|---------------|-----------------------------------------------------------------|
| `index.html`  | Minimal HTML container with an element for displaying lunar data |
| `script.js`   | Core logic: Julian Day, Meeus model, ELP corrections, live updater |
| `style.css`   | Minimal CSS with a somwhat moon-related theme |

## Intended Use

This project is suitable for:
- Educational demonstrations of lunar mechanics
- Astronomical dashboards
- Personal experiments with ephemeris modeling

It is not intended to replace high-precision observatory ephemerides, but it provides a transparent and mathematically honest middle ground between simplicity and accuracy.

## Personal Note

I made this site out of a growing interest in astronomy and celestial bodies as a whole. Over time, I found myself occasionally observing the movement of the Moon through its various cycles from the window of my room, and the more I observed, the more fascinated I became with its actual live position in the sky. Originally, this site was intended for observatory use and was planned to utilize the full ELP2000 theory to achieve very high precision. However, because incorporating the complete ELP2000 series would require hundreds of kilobytes and significantly increase complexity, I decided to pursue a different approach: achieving a high level of accuracy while maintaining a very small file size and strong real-time performance. To accomplish this, I implemented the Meeus analytical model as a base and then layered dominant ELP2000 correction deltas on top of it. This hybrid approach allows the calculation to capture the most significant lunar perturbations, resulting in noticeably higher accuracy than the Meeus model alone, without the overhead of a full ephemeris implementation. The HTML and CSS are intentionally minimal, allowing the focus to remain on the mathematical model and the live calculation itself. I am very pleased with how the project turned out, and I believe this layered correction approach can be extended beyond the Moon to other celestial bodies—such as planetary moons and planets themselves—by adapting the fundamental arguments and correction terms accordingly.
