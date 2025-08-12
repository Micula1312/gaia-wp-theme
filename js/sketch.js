let trail = [];

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent(document.body);
  canvas.style('z-index', '10');
  canvas.style('position', 'fixed');
  canvas.style('top', '0');
  canvas.style('left', '0');
  canvas.style('pointer-events', 'none');

  clear(); // makes background transparent
}

function draw() {
  clear(); // transparent background on each frame

  // Add trail segment
  trail.push({
    x1: pmouseX,
    y1: pmouseY,
    x2: mouseX,
    y2: mouseY,
    time: millis(),
    weight: mouseIsPressed ? 6 : 2
  });

  // Keep trail for 5 seconds
  const now = millis();
  trail = trail.filter(p => now - p.time < 5000);

  // Draw trail
  for (let p of trail) {
    const age = now - p.time;
    const alpha = map(age, 0, 5000, 255, 0);
    stroke(100, 100, 100, alpha); // gray line
    strokeWeight(p.weight);
    line(p.x1, p.y1, p.x2, p.y2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
