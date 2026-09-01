// VJ Textured Background — p5.js generative canvas behind page content
// Concept: data-noise flow field with drift particles, azufre accent micro-pulse
p5.disableFriendlyErrors = true;

const vjSketch = (p) => {
  const CONFIG = { seed: 8675309, density: 20, speed: 0.4, pulseSpeed: 0.2 };
  let particles = [], t = 0;

  p.setup = function() {
    let cnv = p.createCanvas(p.windowWidth, p.windowHeight);
    cnv.parent('vj-container');
    cnv.style('position', 'absolute');
    cnv.style('top', '0');
    cnv.style('left', '0');
    cnv.style('width', '100vw');
    cnv.style('height', '100vh');
    cnv.style('z-index', '-1');
    p.pixelDensity(1);
    p.colorMode(p.HSB, 360, 100, 100, 100);
    p.randomSeed(CONFIG.seed);
    p.noiseSeed(CONFIG.seed);
    for (let i = 0; i < CONFIG.density; i++) {
      particles.push({
        x: p.random(p.width), y: p.random(p.height),
        vx: p.random(-0.15, 0.15), vy: p.random(-0.1, 0.1),
        size: p.random(0.8, 1.5), hueOffset: p.random(360),
      });
    }
  };

  p.draw = function() {
    // Deep bg with semi-transparent trail — motion blur muy sutil
    p.fill(6, 8, 4, 0.04);
    p.noStroke();
    p.rect(0, 0, p.width, p.height);

    t += 0.016;
    const ft = t * CONFIG.speed;
    const pulse = (p.sin(t * CONFIG.pulseSpeed) + 1) / 2;

    for (let part of particles) {
      const nx = p.noise(part.x * 0.006, part.y * 0.006, ft * 0.3) - 0.5;
      const ny = p.noise(part.y * 0.006, part.x * 0.006, ft * 0.3 + 10) - 0.5;
      part.vx += nx * 0.2;
      part.vy += ny * 0.2;
      part.vx *= 0.94;
      part.vy *= 0.94;
      part.x += part.vx;
      part.y += part.vy;

      // Wrap
      if (part.x < 0) part.x = p.width;
      if (part.x > p.width) part.x = 0;
      if (part.y < 0) part.y = p.height;
      if (part.y > p.height) part.y = 0;

      // Gris puro, casi invisible, sutil pulso azufre
      const hue = (48 + part.hueOffset * 0.008 + pulse * 6) % 360;
      const alpha = 8 + 8 * pulse;
      p.fill(hue, 12, 92, alpha);
      p.noStroke();
      p.ellipse(part.x, part.y, part.size);
    }

    // Subtle VJ grid — gray ultra soft lines
    p.stroke(48, 8, 75, 0.005);
    p.strokeWeight(0.15);
    const grid = 80;
    const gw = p.width / grid;
    const gh = p.height / grid;
    for (let i = 0; i <= grid; i++) {
      p.line(i * gw, 0, i * gw, p.height);
      p.line(0, i * gh, p.width, i * gh);
    }
  };

  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

// Only instantiate if p5 is loaded
if (typeof p5 !== 'undefined') {
  new p5(vjSketch);
}
