import { useEffect, useRef } from 'react';

const PALETTES = [
  ['hsl(31 100% 63%)', 'hsl(48 100% 68%)'],
  ['hsl(335 100% 68%)', 'hsl(4 100% 66%)'],
  ['hsl(185 100% 70%)', 'hsl(214 100% 68%)'],
];

export default function ParticleBackground({ particleCount = 80, particleColor = 'auto' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return undefined;

    const context = canvas.getContext('2d');
    let animationFrame;
    let width = 0;
    let height = 0;
    let particles = [];
    let mounted = true;

    const getColor = () => {
      if (particleColor !== 'auto') return particleColor;
      const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
      return palette[Math.floor(Math.random() * palette.length)];
    };

    const targetCount = () => (window.innerWidth < 768 ? Math.max(12, Math.floor(particleCount / 2)) : particleCount);

    const resize = () => {
      const bounds = parent.getBoundingClientRect();
      width = Math.max(bounds.width, 1);
      height = Math.max(bounds.height, 1);
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = targetCount();
      if (particles.length !== count) {
        particles = Array.from({ length: count }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.8 + 0.5,
          speedX: (Math.random() - 0.5) * 0.28,
          speedY: (Math.random() - 0.5) * 0.28,
          phase: Math.random() * Math.PI * 2,
          color: getColor(),
        }));
      }
    };

    const draw = (time) => {
      if (!mounted) return;
      context.clearRect(0, 0, width, height);
      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        if (particle.x < -4 || particle.x > width + 4) particle.speedX *= -1;
        if (particle.y < -4 || particle.y > height + 4) particle.speedY *= -1;
        const opacity = 0.16 + ((Math.sin(time * 0.0007 + particle.phase) + 1) / 2) * 0.48;
        context.beginPath();
        context.fillStyle = particle.color;
        context.globalAlpha = opacity;
        context.shadowBlur = 12;
        context.shadowColor = particle.color;
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      });
      context.globalAlpha = 1;
      context.shadowBlur = 0;
      animationFrame = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });
    animationFrame = window.requestAnimationFrame(draw);

    return () => {
      mounted = false;
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
      context.clearRect(0, 0, width, height);
    };
  }, [particleColor, particleCount]);

  return <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />;
}
