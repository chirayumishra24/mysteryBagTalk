import { useEffect, useRef, useCallback } from "react";

/**
 * UnderwaterBackground - Deep sea particles with bubbles, light rays, and jellyfish.
 */
export default function ParticleBackground() {
  const canvasRef = useRef(null);
  const bubblesRef = useRef([]);
  const jellyfishRef = useRef([]);
  const animFrameRef = useRef(null);

  const createBubbles = useCallback((width, height) => {
    const count = Math.min(60, Math.floor((width * height) / 20000));
    return Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: height + Math.random() * 200,
      size: Math.random() * 5 + 1.5,
      speedY: -(Math.random() * 0.8 + 0.3),
      wobbleSpeed: Math.random() * 0.02 + 0.01,
      wobbleAmount: Math.random() * 30 + 10,
      opacity: Math.random() * 0.4 + 0.1,
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  const createJellyfish = useCallback((width, height) => {
    const count = Math.min(5, Math.floor(width / 350));
    return Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.7 + height * 0.1,
      size: Math.random() * 20 + 15,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: (Math.random() - 0.5) * 0.15,
      hue: [180, 200, 280, 310, 340][Math.floor(Math.random() * 5)],
      opacity: Math.random() * 0.15 + 0.05,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    bubblesRef.current = createBubbles(width, height);
    jellyfishRef.current = createJellyfish(width, height);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      bubblesRef.current = createBubbles(width, height);
      jellyfishRef.current = createJellyfish(width, height);
    };
    window.addEventListener("resize", handleResize);

    let frame = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      frame++;

      // Draw light rays from above
      const rayCount = 5;
      for (let i = 0; i < rayCount; i++) {
        const rayX = (width / (rayCount + 1)) * (i + 1);
        const rayOpacity = 0.02 + Math.sin(frame * 0.008 + i) * 0.015;
        const grad = ctx.createLinearGradient(rayX, 0, rayX + 60, height);
        grad.addColorStop(0, `rgba(56, 189, 248, ${rayOpacity * 2})`);
        grad.addColorStop(0.3, `rgba(56, 189, 248, ${rayOpacity})`);
        grad.addColorStop(1, "transparent");
        ctx.save();
        ctx.translate(rayX, 0);
        ctx.rotate(-0.12 + Math.sin(frame * 0.003 + i * 0.5) * 0.04);
        ctx.translate(-rayX, 0);
        ctx.fillStyle = grad;
        ctx.fillRect(rayX - 40, 0, 80, height);
        ctx.restore();
      }

      // Draw jellyfish
      jellyfishRef.current.forEach((j) => {
        j.x += j.speedX;
        j.y += j.speedY + Math.sin(frame * 0.01 + j.pulse) * 0.2;
        j.pulse += j.pulseSpeed;

        if (j.x < -50) j.x = width + 50;
        if (j.x > width + 50) j.x = -50;
        if (j.y < -50) j.y = height + 50;
        if (j.y > height + 50) j.y = -50;

        const pulseScale = 1 + Math.sin(j.pulse) * 0.15;
        const size = j.size * pulseScale;

        // Body glow
        const glow = ctx.createRadialGradient(j.x, j.y, 0, j.x, j.y, size * 3);
        glow.addColorStop(0, `hsla(${j.hue}, 80%, 70%, ${j.opacity * 0.6})`);
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.fillRect(j.x - size * 3, j.y - size * 3, size * 6, size * 6);

        // Body dome
        ctx.beginPath();
        ctx.arc(j.x, j.y, size, Math.PI, 0);
        ctx.fillStyle = `hsla(${j.hue}, 80%, 70%, ${j.opacity})`;
        ctx.fill();

        // Tentacles
        for (let t = 0; t < 4; t++) {
          const tx = j.x + (t - 1.5) * (size * 0.45);
          const tentLen = size * 1.8;
          ctx.beginPath();
          ctx.moveTo(tx, j.y);
          ctx.quadraticCurveTo(
            tx + Math.sin(frame * 0.03 + t) * 6,
            j.y + tentLen * 0.5,
            tx + Math.sin(frame * 0.02 + t * 0.7) * 8,
            j.y + tentLen
          );
          ctx.strokeStyle = `hsla(${j.hue}, 80%, 70%, ${j.opacity * 0.5})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      });

      // Draw bubbles
      bubblesRef.current.forEach((b) => {
        b.y += b.speedY;
        b.phase += b.wobbleSpeed;
        const wobbleX = Math.sin(b.phase) * b.wobbleAmount;

        if (b.y < -20) {
          b.y = height + 20;
          b.x = Math.random() * width;
        }

        const drawX = b.x + wobbleX;

        // Bubble body
        ctx.beginPath();
        ctx.arc(drawX, b.y, b.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 220, 254, ${b.opacity * 0.3})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(147, 220, 254, ${b.opacity * 0.5})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Bubble highlight
        ctx.beginPath();
        ctx.arc(drawX - b.size * 0.3, b.y - b.size * 0.3, b.size * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity * 0.6})`;
        ctx.fill();

        // Bubble glow
        ctx.beginPath();
        ctx.arc(drawX, b.y, b.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(103, 232, 249, ${b.opacity * 0.05})`;
        ctx.fill();
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [createBubbles, createJellyfish]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.85 }}
    />
  );
}
