const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gravity = 0.02;
const fireworks = [];

class Firework {
  constructor(x, y, targetY, color) {
    this.x = x;
    this.y = y;
    this.targetY = targetY;
    this.color = color;
    this.speedY = 4 + Math.random() * 2;
    this.burst = false;
    this.particles = [];
  }
  update() {
    if(!this.burst) {
      this.y -= this.speedY;
      if(this.y <= this.targetY) {
        this.burst = true;
        this.createParticles();
      }
    } else {
      this.particles.forEach((p,i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += gravity;
        p.alpha -= 0.02;
        if(p.alpha <= 0) this.particles.splice(i, 1);
      });
    }
  }
  draw() {
    if(!this.burst) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, Math.PI*2);
      ctx.fillStyle = this.color;
      ctx.fill();
    } else {
      this.particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI*2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx.fill();
      });
    }
  }
  createParticles() {
    for(let i=0; i<30; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const speed = Math.random() * 3;
      this.particles.push({
        x: this.x,
        y: this.y,
        vx: speed * Math.cos(angle),
        vy: speed * Math.sin(angle),
        alpha: 1,
        color: '255, 165, 0' // orange
      });
    }
  }
}

function animate() {
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  if(fireworks.length < 5) {
    fireworks.push(new Firework(Math.random() * canvas.width, canvas.height, canvas.height * 0.3 + Math.random()*100, 'orange'));
  }
  fireworks.forEach((fw,i) => {
    fw.update();
    fw.draw();
    if(fw.burst && fw.particles.length === 0) fireworks.splice(i, 1);
  });
  requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
