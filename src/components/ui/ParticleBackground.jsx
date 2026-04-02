import { useEffect, useRef, useCallback } from "react";

/**
 * ParticleBackground - floating particle canvas for ambient visual depth.
 * Uses vanilla Canvas API for performance.
 */
export default function ParticleBackground() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);

  const createParticles = useCallback((width, height) => {
    const count = Math.min(80, Math.floor((width * height) / 15000));
    const palette = [18, 32, 44, 172, 336];
    return Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.1,
      hue: palette[Math.floor(Math.random() * palette.length)] + (Math.random() * 8 - 4),
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    particlesRef.current = createParticles(width, height);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particlesRef.current = createParticles(width, height);
    };
    window.addEventListener("resize", handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particlesRef.current.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw particle with glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 85%, 70%, ${p.opacity})`;
        ctx.fill();

        // Glow effect
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 85%, 70%, ${p.opacity * 0.15})`;
        ctx.fill();
      });

      // Draw subtle connection lines between nearby particles
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const dx = particlesRef.current[i].x - particlesRef.current[j].x;
          const dy = particlesRef.current[i].y - particlesRef.current[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
            ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
            ctx.strokeStyle = `rgba(251, 146, 60, ${0.05 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [createParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
}
